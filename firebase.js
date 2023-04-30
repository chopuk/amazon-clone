import { initializeApp } from 'firebase/app';
import { getFirestore  } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyA0JPFqb95YOPSXaRWMdTbbtxka0C2yohg",
  authDomain: "react-native--clone.firebaseapp.com",
  projectId: "react-native--clone",
  storageBucket: "react-native--clone.appspot.com",
  messagingSenderId: "501892136700",
  appId: "1:501892136700:web:58827d7089fd50000e6179"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)
export { db, auth }