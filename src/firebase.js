// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAFzPNqty0jrHX8kC-1USJupQQevsajn08",
  authDomain: "civitas-dd1d6.firebaseapp.com",
  databaseURL: "https://civitas-dd1d6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "civitas-dd1d6",
  storageBucket: "civitas-dd1d6.firebasestorage.app",
  messagingSenderId: "154246271906",
  appId: "1:154246271906:web:6e5a7282dc5340f75bd8fb",
  measurementId: "G-RR60HV77BQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };