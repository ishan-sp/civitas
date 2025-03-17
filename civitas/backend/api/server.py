import os
import json
import firebase_admin
from firebase_admin import auth, credentials
from fastapi import FastAPI, HTTPException, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

firebase_credentials = os.getenv("FIREBASE_CREDENTIALS")

if not firebase_credentials:
    raise ValueError("FIREBASE_CREDENTIALS environment variable is missing!")

cred = credentials.Certificate(json.loads(firebase_credentials))
firebase_admin.initialize_app(cred)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

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
            auth.create_user(
                email=user_data["email"],
                password=user_data["password"]
            )
        except Exception as e:
            raise HTTPException (status_code=400 , detail= str(e))

def main():
    import uvicorn
    uvicorn.run (app, host="localhost", port=3000)

if __name__ == "__main__":
    main()