import {getAuth, signOut} from "firebase/auth";
import {initializeApp} from "firebase/app";

export const firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_APPLICATION_ID
}

export const authFirebase = getAuth(initializeApp(firebaseConfig));

export const logout =  signOut(authFirebase)
