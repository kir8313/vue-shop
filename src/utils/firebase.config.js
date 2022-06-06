import {getAuth, signOut} from "firebase/auth";
import {initializeApp} from "firebase/app";

export const firebaseConfig = {
  apiKey: "AIzaSyDmDIh88kXtmG7mXHFU-OTmawPbQdby-wE",
  authDomain: "vue-shop-8313.firebaseapp.com",
  projectId: "vue-shop-8313",
  storageBucket: "vue-shop-8313.appspot.com",
  messagingSenderId: "687399178113",
  appId: "1:687399178113:web:f41e626e31f6cff1132280"
}

export const authFirebase = getAuth(initializeApp(firebaseConfig));

let checkUser;

export default checkUser;

export const logout =  signOut(authFirebase)
