import os
import json
import firebase_admin
import time
from pydantic import BaseModel
import main as main
from main import read_txt_as_block, grade_answers
from typing import Optional
from firebase_admin import auth, credentials, firestore, storage
import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi import FastAPI, HTTPException, Header, Request, UploadFile, File, Depends, status, Query
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from google.cloud import vision
import shutil
from fastapi import FastAPI, HTTPException, Header, Request, UploadFile, File
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

firebase_credentials = os.getenv("FIREBASE_CREDENTIALS")

if not firebase_credentials:
    raise ValueError("FIREBASE_CREDENTIALS environment variable is missing!")

cred = credentials.Certificate(json.loads(firebase_credentials))
firebase_admin.initialize_app(cred, {
    "storageBucket": "civitas-dd1d6.firebasestorage.app" 
})




def verify_firebase_token(request: Request):
    auth_header = request.headers.get("Authorization")
    print("Authorization Header:", auth_header)  # Debugging

    if not auth_header:
        raise HTTPException(status_code=401, detail="Missing Authorization header")

    try:
        # Extract the token from the Authorization header
        id_token = auth_header.split("Bearer ")[1]

        # Verify the token with a small allowance for clock skew
        decoded_token = auth.verify_id_token(id_token, clock_skew_seconds=5)
        print("Decoded Token:", decoded_token)  # Debugging

        return decoded_token

    except ValueError:
        # Handle malformed Authorization header
        raise HTTPException(status_code=401, detail="Malformed Authorization header")

    except firebase_admin.auth.ExpiredIdTokenError:
        # Handle expired tokens
        raise HTTPException(status_code=401, detail="Expired token")

    except firebase_admin.auth.InvalidIdTokenError:
        # Handle invalid tokens
        raise HTTPException(status_code=401, detail="Invalid token")

    except firebase_admin.auth.RevokedIdTokenError:
        # Handle revoked tokens
        raise HTTPException(status_code=401, detail="Revoked token")

    except firebase_admin.auth.CertificateFetchError:
        # Handle issues fetching public key certificates
        raise HTTPException(status_code=500, detail="Failed to fetch public key certificates")

    except Exception as e:
        # Catch any other exceptions
        print("Token Verification Error:", e)  # Debugging
        raise HTTPException(status_code=401, detail=f"Token verification error: {str(e)}")

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

class NGOFilter (BaseModel):
    ngoName: Optional[str] = None
    regionsOfOperation: Optional[str] = None
    typeOfNGO: Optional[str] = None

class StudentFilter (BaseModel):
    name: Optional[str] = None
    school: Optional[str] = None
    grade: Optional[str] = None

class VolunteerFilter (BaseModel):
    fullName : Optional[str] = None
    age : Optional[str] = None
    city : Optional[str] = None
    gender : Optional[str] = None
    occupation : Optional[str] = None
    subject : Optional[str] = None
    languages : Optional[str] = None

@app.post ("/get-schools")
async def getschools(request : Request, decoded_token: dict = Depends(verify_firebase_token)):
    ngoData = await request.json()
    if "ngoId" not in ngoData or not isinstance(ngoData["ngoId"], str):
        return {"error": "Invalid ngoId. It must be a string."}
    volId = decoded_token["uid"]
    vol_doc = db.collection("Volunteer").document(volId).get().to_dict()
    applications = vol_doc.get("Applications", {})
    school_ids = list(applications.keys())
    ngo_doc = db.collection("NGO").document(ngoData["ngoId"]).get().to_dict()
    result = []
    req = [db.collection("Schools").document(id) for id in ngo_doc.get("schools") if not id in school_ids]
    req_ref = db.get_all(req)
    res = [user.to_dict() for user in req_ref]
    for i in range (0, len (res)):
        result.append({
            'id': req[i].id,
            'name': res[i].get('Name', 'Unnamed School'),
            'location': res[i].get('Location', 'Unknown'),
            'students': res[i].get('students', 0)
        })
    return {"result" : result}

    


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

@app.get("/api/ngos")
async def ngo_filter(
    name: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    verified: Optional[bool] = Query(None),
    regionOfOperation: Optional[str] = Query(None)
):
    filter_dict = {
        "name": name,
        "type": type,
        "verified": verified,
        "regionOfOperation": regionOfOperation
    }

    firebase_query = db.collection("NGO")
    req_filters = [key for key, val in filter_dict.items() if val is not None]

    for key in req_filters:
        if key == "regionOfOperation":
            firebase_query = firebase_query.where(key, "array-contains", filter_dict[key])
        else:
            firebase_query = firebase_query.where(key, "==", filter_dict[key])

    result = firebase_query.stream()
    docs = [{"id": doc.id, **doc.to_dict()} for doc in result]  # Add document ID to the response

    return {"result": docs}

@app.post ("api/student")
async def student_filter (data: StudentFilter):
    filterDict = data.dict()
    firebasequery = db.collection("Student")
    reqFilters = [param for param in filterDict.keys() if filterDict[param] != None]
    for filter in reqFilters:
        firebasequery = firebasequery.where (filter, "==", filterDict[filter])
            
    result = firebasequery.stream()
    docs = [doc.to_dict() for doc in result]

    return {"result" : docs}

@app.post ("api/volunteer")
async def volunteer_filter (data: VolunteerFilter):
    filterDict = data.dict()
    firebasequery = db.collection("Volunteer")
    reqFilters = [param for param in filterDict.keys() if filterDict[param] != None]
    for filter in reqFilters:
        firebasequery = firebasequery.where (filter, "==", filterDict[filter])
            
    result = firebasequery.stream()
    docs = [doc.to_dict() for doc in result]

    return {"result" : docs}

@app.get ("/login")
async def login(decoded_token: dict = Depends(verify_firebase_token)):
    uid = decoded_token["uid"]
    collection = ["Student", "Volunteer", "NGO"]
    doc_refs = [db.collection(item).document(uid) for item in collection]
    cur_user = db.get_all(doc_refs)
    result = [user.to_dict() for user in cur_user if user.exists]
    return result[0]
    
@app.post ("/logout")
async def logout (decoded_token: dict = Depends(verify_firebase_token)):
    try:
        uid = decoded_token["uid"]
        auth.revoke_refresh_tokens(uid)
        return {"message": "Logout successful"}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    
@app.get ("/user-profile")
async def getProfile(decoded_token: dict = Depends(verify_firebase_token)):
    print (decoded_token)
    uid = decoded_token["uid"]
    collections = ["Student", "Volunteer", "NGO"]
    for collection in collections :
        user_doc = db.collection(collection).document(uid).get()
        if user_doc.exists:
            print (user_doc.to_dict())
            return user_doc.to_dict()
    raise HTTPException(status_code=404, detail="User not found")

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

@app.post("/join-ngo")
async def joinNgo(request: Request, decoded_token: dict = Depends(verify_firebase_token)):
    ngo_data = await request.json()
    
    if "ngoId" not in ngo_data or not isinstance(ngo_data["ngoId"], str):
        return {"error": "Invalid ngoId. It must be a string."}

    volunteer_id = decoded_token["uid"]
    ngo_id = ngo_data["ngoId"]

    ngo_collection = db.collection("NGO").document(ngo_id)
    volunteer_collection = db.collection("Volunteer").document(volunteer_id)
    # Add NGO to volunteer's list
    try:
        volunteer_collection.update({
            "Pending": firestore.ArrayUnion([ngo_id])
        })
    except Exception:
        volunteer_collection.set({
            "Pending": [ngo_id]
        })
    try:
        ngo_collection.update({
            "Pending": firestore.ArrayUnion([volunteer_id])
        })
    except Exception:
        ngo_collection.set({
            "Pending": [volunteer_id]
        })

    return {"message": "Membership request submitted successfully. Please check the MyNGOs tab for updates"}

@app.post("/join-school")
async def joinSchool(request: Request, decoded_token: dict = Depends(verify_firebase_token)):
    school_data = await request.json()
    
    if "schoolId" not in school_data or not isinstance(school_data["schoolId"], str):
        return {"error": "Invalid schoolId. It must be a string."}

    volunteer_id = decoded_token["uid"]
    school_id = school_data["schoolId"]

    school_ref = db.collection("Schools").document(school_id)
    volunteer_ref = db.collection("Volunteer").document(volunteer_id)

    school_doc = school_ref.get()
    volunteer_doc = volunteer_ref.get()

    school = school_doc.to_dict()
    volunteer = volunteer_doc.to_dict()

    if not school or not volunteer:
        return {"error": "Invalid schoolId or volunteer not found"}

    existing_applications = volunteer.get("Applications", {})
    if school_id in existing_applications:
        return {"message": "You have already applied to this school."}

    if isinstance(school.get("PendingVol"), list):
        school_ref.update({
            "PendingVol": firestore.ArrayUnion([volunteer_id])
        })
    else:
        school_ref.set({
            "PendingVol": [volunteer_id]
        }, merge=True)

    volunteer_ref.set({
        f"Applications.{school_id}": {
            "schoolName": school.get("Name"),
            "appliedOn": firestore.SERVER_TIMESTAMP,
            "status": "Pending"
        }
    }, merge=True)

    return {"message": "Membership request submitted successfully. Please check the MyNGOs tab for updates"}


@app.post ("/get-school-applications")
async def getSchoolApplications (decoded_token: dict = Depends(verify_firebase_token)):
    vol_doc = db.collection("Volunteer").document(decoded_token["uid"]).get().to_dict()
    result = []
    applicationSet = [key for key in vol_doc.keys() if key.startswith("Applications")]
    for application in applicationSet:
        doc = vol_doc.get(application)
        result.append ({
            "schoolId" : application[13:],
            "schoolName" : doc["schoolName"],
            "appliedOn" : doc["appliedOn"],
            "status" : doc["status"]
        })
    return {"result" : result}


@app.post("/api/volunteer")
async def volunteer_filter(data: VolunteerFilter):
    filterDict = data.dict()
    
    # If we're querying by ID
    if filterDict.get("id"):
        doc_ref = db.collection("Volunteer").document(filterDict["id"])
        doc = doc_ref.get()
        if doc.exists:
            return {"result": [doc.to_dict()]}
        else:
            return {"result": []}

    # Otherwise, fallback to filters
    firebasequery = db.collection("Volunteer")
    reqFilters = [param for param in filterDict.keys() if filterDict[param] is not None]

    for filter in reqFilters:
        firebasequery = firebasequery.where(filter, "==", filterDict[filter])

    result = firebasequery.stream()
    docs = [doc.to_dict() for doc in result]
    return {"result": docs}


@app.get("/ngo/my-volunteers")
async def getMyVolunteers(decoded_token: dict = Depends(verify_firebase_token)):
    ngoId = decoded_token["uid"]
    ngo_doc = db.collection("NGO").document(ngoId).get()

    if ngo_doc.exists:
        ngo_data = ngo_doc.to_dict()
        volunteer_ids = ngo_data.get("myVolunteers", [])
        if not volunteer_ids:
            return {"result": "No current volunteers"}

        volunteer_refs = [db.collection("Volunteer").document(vol_id) for vol_id in volunteer_ids]
        volunteers = db.get_all(volunteer_refs)

        current_volunteers = [vol.to_dict() for vol in volunteers if vol.exists]
        return {"result": current_volunteers}
    else:
        return {"result": "No current volunteers"}


@app.post("/ngo/approveVolunteer")
async def approveVolunteer(request: Request, decoded_token: dict = Depends(verify_firebase_token)):
    volData = await request.json()
    if "volId" not in volData or not isinstance(volData["volId"], str):
        return {"error": "Invalid volId. It must be a string."}

    approvedVolId = volData["volId"]
    ngoId = decoded_token["uid"]

    approvedVol_ref = db.collection("Volunteer").document(approvedVolId)
    ngo_ref = db.collection("NGO").document(ngoId)
    approvedVol_doc = approvedVol_ref.get().to_dict()
    if isinstance(approvedVol_doc.get("ngoMemberShip"), list) and isinstance(approvedVol_doc.get("Pending"), list) :
        approvedVol_ref.update({
            "ngoMemberShip": firestore.ArrayUnion([ngoId]),
            "Pending": firestore.ArrayRemove([ngoId])
        })
    else:
        approvedVol_ref.set({
            "ngoMemberShip": [ngoId],
            "Pending": []
        }, merge = True)
    ngo_doc = ngo_ref.get().to_dict()
    if isinstance(ngo_doc.get("myVolunteers"), list) and isinstance(ngo_doc.get("Pending"), list) :
        ngo_ref.update({
            "myVolunteers": firestore.ArrayUnion([approvedVolId]),
            "Pending": firestore.ArrayRemove([approvedVolId])
        })
    else:
        ngo_ref.set({
            "myVolunteers": [approvedVolId],
            "Pending": []
        }, merge = True)

    return {"message": "Approved Volunteer Successfully"}


@app.post ("/ngo/rejectVolunteer")
async def rejectVolunteer(request: Request, decoded_token: dict = Depends(verify_firebase_token)):
    volData = await request.json()
    if "volId" not in volData or not isinstance(volData["volId"], str):
        return {"error": "Invalid volId. It must be a string."}
    approvedVolId = volData["volId"]
    ngoId = decoded_token["uid"]
    approvedVol_ref = db.collection("Volunteer").document(approvedVolId)
    ngo_ref = db.collection("NGO").document(ngoId)
    try:
        approvedVol_ref.update({
            "Pending" : firestore.ArrayRemove ([ngoId])
        })
    except Exception:
        approvedVol_ref.set({
            "Pending" : []
        })
    try:
        ngo_ref.update({
            "Pending" : firestore.ArrayRemove ([approvedVolId])
        })
    except Exception:
        ngo_ref.set({
            "Pending" : []
        })
    return {"message":"Rejected Volunteer Successfully"}

@app.get("/ngo/getPending")
async def ngoGetPending(decoded_token: dict = Depends(verify_firebase_token)):
    ngoId = decoded_token["uid"]
    ngo_doc = db.collection("NGO").document(ngoId).get()

    if ngo_doc.exists:
        reqData = ngo_doc.to_dict()
        VolIds = reqData.get("Pending", [])
        if not VolIds:
            return {"result": []}

        volunteer_refs = [db.collection("Volunteer").document(vol_id) for vol_id in VolIds]
        volunteers = db.get_all(volunteer_refs)

        # Extract only basic details
        pending_basic = []
        for vol in volunteers:
            if vol.exists:
                v = vol.to_dict()
                pending_basic.append({
                    "id": vol.id,
                    "email": v.get("email"),
                    "fullName": v.get("fullName"),
                    "city" : v.get("city"),
                })

        return {"result": pending_basic}
    else:
        return {"result": []}

    
@app.post ("/vol/cancelRequest")
async def cancelRequest (request : Request, decoded_token: dict = Depends(verify_firebase_token)):
    ngoData = await request.json()
    if "ngoId" not in ngoData or not isinstance(ngoData["ngoId"], str):
        return {"error": "Invalid ngoId. It must be a string."}
    cancelledNgoId = ngoData["ngoId"]
    volId = decoded_token["uid"]
    cancelledNgo_ref = db.collection("NGO").document(cancelledNgoId)
    vol_ref = db.collection("Volunteer").document(volId)
    try:
        cancelledNgo_ref.update({
            "Pending" : firestore.ArrayRemove ([volId])
        })
    except Exception:
        cancelledNgo_ref.set({
            "Pending" : []
        }, merge = True)
    try:
        vol_ref.update({
            "Pending" : firestore.ArrayRemove ([cancelledNgoId])
        })
    except Exception:
        vol_ref.set({
            "Pending" : []
        }, merge = True)
    return {"message":"Cancelled Request Successfully"}

    
    


@app.get ("/my-ngos")
async def getMyNgos (decoded_token : dict = Depends (verify_firebase_token)):
    volunteer_id = decoded_token["uid"]
    volunteer_ngos = db.collection ("Volunteer").document(volunteer_id).get()
    volunteer_data = (volunteer_ngos.to_dict()).get("ngoMemberShip", [])
    myNgo_refs = [db.collection ("NGO").document(id) for id in volunteer_data]
    myNgos = db.get_all(myNgo_refs)
    result = [ngo.to_dict() for ngo in myNgos]
    for i in range (0, len(result)):
        result[i]['id'] = volunteer_data[i]
    return {"result" : result}

def main():
    import uvicorn
    uvicorn.run (app, host="localhost", port=3000)

if __name__ == "__main__":
    main()