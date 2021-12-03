import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { FIREBASECONFIG } from "./firebaseConfig";

if (!firebase.apps.length) {
  firebase.initializeApp(FIREBASECONFIG);
}

export const db = firebase.database();
export const auth = firebase.auth();


// class Firebase {
//   constructor() {
//     this.auth = auth;
//     this.db = db;
//   }
// }

export default firebase;
