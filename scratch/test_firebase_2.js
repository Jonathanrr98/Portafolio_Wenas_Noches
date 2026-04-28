import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadString } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCS-Q4EVek83cil-jJ1H-lDtm9S6UwkaHQ",
  authDomain: "wenas-noches-portfolio.firebaseapp.com",
  projectId: "wenas-noches-portfolio",
  storageBucket: "wenas-noches-portfolio.firebasestorage.app",
  messagingSenderId: "830176011562",
  appId: "1:830176011562:web:c971af1f7bebf8bdd32a53"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

async function testUpload() {
  try {
    const storageRef = ref(storage, 'test.txt');
    await uploadString(storageRef, 'hello world');
    console.log("Upload successful!");
  } catch (error) {
    console.error("Upload failed:");
    console.error(error);
  }
}

testUpload();
