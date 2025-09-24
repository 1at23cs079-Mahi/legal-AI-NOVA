
// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "studio-9781971644-ed37d",
  "appId": "1:678645036242:web:ae8161f012b3c5f203a90b",
  "apiKey": "AIzaSyAzqt2rTzSo2pIBcRYq1cZ49gIaowSjbPI",
  "authDomain": "studio-9781971644-ed37d.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "678645036242",
  "storageBucket": "studio-9781971644-ed37d.appspot.com"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth = getAuth(app);
export const db = getFirestore(app);
