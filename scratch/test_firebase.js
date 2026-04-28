import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCS-Q4EVek83cil-jJ1H-lDtm9S6UwkaHQ",
  authDomain: "wenas-noches-portfolio.firebaseapp.com",
  projectId: "wenas-noches-portfolio",
  storageBucket: "wenas-noches-portfolio.appspot.com",
  messagingSenderId: "830176011562",
  appId: "1:830176011562:web:c971af1f7bebf8bdd32a53"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testFirestore() {
  try {
    const docRef = doc(db, "portfolio", "main");
    const docSnap = await getDoc(docRef);
    console.log("Firestore read successful! exists:", docSnap.exists());
  } catch (error) {
    console.error("Firestore failed:");
    console.error(error);
  }
}

testFirestore();
