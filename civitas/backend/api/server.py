import os
import json
import firebase_admin
from firebase_admin import auth, credentials, firestore, storage
import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi import FastAPI, HTTPException, Header, Request, UploadFile, File
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

load_dotenv()

firebase_credentials = os.getenv("FIREBASE_CREDENTIALS")

if not firebase_credentials:
    raise ValueError("FIREBASE_CREDENTIALS environment variable is missing!")

cred = credentials.Certificate(json.loads(firebase_credentials))
firebase_admin.initialize_app(cred, {
    "storageBucket": "civitas-dd1d6.firebasestorage.app" 
})

app = FastAPI()

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

db = firestore.client()
bucket = storage.bucket()

@app.get ("/api/schools")
def schools():
    schools = [
    { "schoolName" : "Govt Primary School Haralur", "location": "Harlur Road Ambalipura Village Bengaluru 560102", "schoolId": "2389732" },
    { "schoolName" : "Govt High School Koramangala", "location": "Koramangala 6th Block, Bengaluru 560095", "schoolId": "2389733" },
    { "schoolName" : "Govt Primary School Whitefield", "location": "Whitefield Main Road, Bengaluru 560066", "schoolId": "2389734" },
    { "schoolName" : "Govt Senior Secondary School Jaipur", "location": "MI Road, Jaipur, Rajasthan 302001", "schoolId": "2389735" },
    { "schoolName" : "Govt High School Ranchi", "location": "Main Road, Ranchi, Jharkhand 834001", "schoolId": "2389736" },
    { "schoolName" : "Govt Primary School Andheri", "location": "Andheri West, Mumbai, Maharashtra 400058", "schoolId": "2389737" },
  ]
    return JSONResponse(content=schools)


@app.post ("/signup")
async def signup_user (request : Request):
    user_data = await request.json()
    print (user_data)
    try :
        existing_user = auth.get_user_by_email(user_data["email"])
        if existing_user:
            raise HTTPException(status_code=400, detail="User with this email already exists.")
        if len (user_data["password"]) < 6 :
            raise HTTPException(status_code=400, detail="Password must be atleast 6 characters long")
    except auth.UserNotFoundError:
        try :
            new_user = auth.create_user(
                email=user_data["email"],
                password=user_data["password"]
            )
        except Exception as e:
            raise HTTPException (status_code=400 , detail= str(e))
    if (user_data["type"] == "Student"):
        cursor_connect = db.collection("Student").document(new_user.uid)
        if cursor_connect.get().exists:
            raise HTTPException(status_code=400, detail="User already exists")
        profile = {}
        for key in user_data.keys():
            if key != 'password':
                profile [key] = user_data [key]
        cursor_connect.set(profile)
    elif (user_data["type"] == "Volunteer"):
        cursor_connect = db.collection("Volunteer").document(new_user.uid)
        if cursor_connect.get().exists:
            raise HTTPException(status_code=400, detail="User already exists")
        profile = {}
        for key in user_data.keys():
            if key != 'password':
                profile [key] = user_data [key]
        cursor_connect.set(profile)
    elif (user_data["type"] == "NGO"):
        cursor_connect = db.collection("NGO").document(new_user.uid)
        if cursor_connect.get().exists:
            raise HTTPException(status_code=400, detail="User already exists")
        profile = {}
        for key in user_data.keys():
            if key != 'password':
                profile [key] = user_data [key]
        cursor_connect.set(profile)

@app.post("/upload-files")
async def upload_files(files: List[UploadFile] = File(...)):
    file_urls = []

    for file in files:
        file_extension = file.filename.split(".")[-1]
        file_name = f"uploads/{uuid.uuid4()}.{file_extension}" 
        blob = bucket.blob(file_name)
        blob.upload_from_string(await file.read(), content_type=file.content_type)
        blob.make_public()
        file_urls.append(blob.public_url)

    return {"file_urls": file_urls}





def main():
    import uvicorn
    uvicorn.run (app, host="localhost", port=3000)

if __name__ == "__main__":
    main()