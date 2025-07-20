from fastapi import FastAPI, UploadFile, File
from typing import List
from fastapi.responses import JSONResponse
from pdf2image import convert_from_bytes
from google.cloud import vision
from PIL import Image
from dotenv import load_dotenv
import io
import os
import re
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
import uvicorn
load_dotenv()

app = FastAPI()
client = vision.ImageAnnotatorClient()

class LargeRequestMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request.state.body = await request.body()
        response = await call_next(request)
        return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])
app.add_middleware(LargeRequestMiddleware)

# Gemini setup
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
gemini_model = genai.GenerativeModel("models/gemini-2.0-flash")

# Global context for answer key
answer_key_context = ""

# OCR functions
def extract_text_from_image(image: Image.Image) -> str:
    buffer = io.BytesIO()
    image.save(buffer, format="JPEG")
    vision_image = vision.Image(content=buffer.getvalue())
    response = client.document_text_detection(image=vision_image)
    if response.error.message:
        raise Exception(f"Vision API error: {response.error.message}")
    return response.full_text_annotation.text

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    images = convert_from_bytes(
        pdf_bytes,
        poppler_path=r"D:\\Bhavin\\Release-24.08.0-0\\poppler-24.08.0\\Library\\bin"
    )
    return "\n".join([extract_text_from_image(img).strip() for img in images])


# Upload answer key text as global context
@app.post("/upload-answer-key")
async def upload_answer_key(file: UploadFile = File(...)):
    global answer_key_context
    file_bytes = await file.read()
    if file.filename.lower().endswith(".pdf"):
        text = extract_text_from_pdf(file_bytes)
    else:
        image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
        text = extract_text_from_image(image)

    answer_key_context = text.strip()
    return JSONResponse(content={"status": "Answer key context stored"})


# Evaluate a student's answers against the context
def evaluate_answer_with_gemini(question_num: str, answer: str) -> dict:
    if not answer_key_context:
        return {"question": question_num, "feedback": "No answer key uploaded", "marks": 0}

    prompt = f"""
You are a lenient examiner but doesn't just throw away marks. Use the following answer key to evaluate a student's answer.

Answer Key:
{answer_key_context}

Student's answer to Q{question_num}:
{answer}

Respond in this format:
Feedback: <text>
Marks Awarded: <number>
"""

    try:
        response = gemini_model.generate_content(prompt)
        result = response.text

        match = re.search(r"Feedback:\s*(.*?)\nMarks\s*Awarded:\s*(\d+)", result, re.DOTALL | re.IGNORECASE)
        if not match:
            marks_match = re.search(r"(?i)marks\s*[:\-]?\s*(\d+)", result)
            feedback = result.strip()
            marks = marks_match.group(1) if marks_match else "0"
        else:
            feedback, marks = match.groups()

        return {
            "question": int(question_num),
            "feedback": feedback.strip(),
            "marks": int(marks)
        }

    except Exception as e:
        return {"question": int(question_num), "feedback": str(e), "marks": 0}


# Upload student answer script and evaluate
@app.post("/evaluate-student")
async def evaluate_student_script(files: List[UploadFile] = File(...)):
    try:
        combined_text = ""
        for file in files:
            file_bytes = await file.read()
            if file.filename.lower().endswith(".pdf"):
                text = extract_text_from_pdf(file_bytes)
            else:
                image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
                text = extract_text_from_image(image)
            combined_text += text + "\n"

        answer_blocks = re.findall(r"(\d{1,2})\.\s*(.*?)(?=\n\d{1,2}\.|$)", combined_text, re.DOTALL)
        results = []
        total_marks = 0

        for qnum, ans in answer_blocks:
            evaluation = evaluate_answer_with_gemini(qnum, ans.strip())
            total_marks += evaluation["marks"]
            results.append(evaluation)

        return JSONResponse(content={"total_score": total_marks, "detailed_feedback": results})

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    
def main():
    port = int(os.environ.get("PORT", 8000))  # Render provides $PORT
    uvicorn.run(app, host="0.0.0.0", port=port)

if __name__ == "__main__":
    main()
