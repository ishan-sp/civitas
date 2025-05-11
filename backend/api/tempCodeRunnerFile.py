@app.post("/extract-text")
async def extract_text_from_images(files: List[UploadFile] = File(...)):
    answer_key = files[0]
    answer_key_file = f"temp_{uuid.uuid4()}.txt"
    with open(answer_key_file, "wb") as buffer:
        shutil.copyfileobj(answer_key.file, buffer)
    remaining_files = files[1:]
    combined_text = ""

    for file in remaining_files:
        temp_filename = f"temp_{uuid.uuid4()}.jpg"

        try:
            # Save the uploaded file temporarily
            with open(temp_filename, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            # Read and send image to Google Vision
            with open(temp_filename, "rb") as image_file:
                content = image_file.read()

            image = vision.Image(content=content)
            response = client.text_detection(image=image)
            texts = response.text_annotations

            if texts:
                combined_text += texts[0].description + "\n"
        finally:
            # Clean up temp file
            if os.path.exists(temp_filename):
                os.remove(temp_filename)
    student_answer_file = f"temp_{uuid.uuid4()}.txt"
    with open(student_answer_file, "w") as f:
        f.write(combined_text.strip())
    teacher_txt = read_txt_as_block(answer_key_file)
    student_txt = read_txt_as_block(student_answer_file)
    results = grade_answers(teacher_txt, student_txt)
    if os.path.exists(answer_key_file):
        os.remove(answer_key_file)
    if os.path.exists(student_answer_file):
        os.remove(student_answer_file)
    return results
