// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBrZn017aTEFFtm2keDTX4LhkGHcMXXpGU",
  authDomain: "rate-housing.firebaseapp.com",
  projectId: "rate-housing",
  storageBucket: "rate-housing.appspot.com",
  messagingSenderId: "264756196009",
  appId: "1:264756196009:web:ab84954e91408b1a0b2fb8",
  measurementId: "G-LDKT8QNNKN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {auth};
export default app;
