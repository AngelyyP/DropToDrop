// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBgoWaCd6APngiq3Jv-d4abmByqZyFxJ8",
  authDomain: "db-multimedia.firebaseapp.com",
  projectId: "db-multimedia",
  storageBucket: "db-multimedia.firebasestorage.app",
  messagingSenderId: "703694156223",
  appId: "1:703694156223:web:cd702f775e4417841db10a"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();

export { db };