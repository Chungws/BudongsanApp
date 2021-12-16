import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
import { FIREBASECONFIG } from "./firebaseConfig";

if (!firebase.apps.length) {
  firebase.initializeApp(FIREBASECONFIG);
}

export const db = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();

export default firebase;
