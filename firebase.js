// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import { getStorage } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

import { getDatabase } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2gCcRBQx7q2MYo861UplsNv5BHCA_SXQ",
  authDomain: "cafe-bef30.firebaseapp.com",
  projectId: "cafe-bef30",
  storageBucket: "cafe-bef30.appspot.com",
  messagingSenderId: "548136211455",
  appId: "1:548136211455:web:79347d6eb5204aeb1b0dca",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = "en";
const storage = getStorage(app); // storage for pfp
const db = getDatabase(app);

export { auth, storage, db };
