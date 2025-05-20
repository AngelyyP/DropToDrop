// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_uAo-lV6fnHedZa8ukkBPLxztTZgVXGA",
  authDomain: "droptodrop-36001.firebaseapp.com",
  projectId: "droptodrop-36001",
  storageBucket: "droptodrop-36001.firebasestorage.app",
  messagingSenderId: "910118671887",
  appId: "1:910118671887:web:bffdac23a15318f1c5b57a"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();

export { db };