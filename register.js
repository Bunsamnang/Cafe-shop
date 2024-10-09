// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";
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
const auth = getAuth();
const storage = getStorage();

//submit btn

const submitLogin = document.getElementById("submitLogin");
const submitSignup = document.getElementById("submitSignup");

submitSignup.addEventListener("click", (e) => {
  e.preventDefault();

  //inputs
  const signupUsername = document.getElementById("signupUsername").value;
  const signupUseremail = document.getElementById("signupUseremail").value;
  const signupPassword = document.getElementById("signupPassword").value;
  const profilePic = document.getElementById("profilePic").files[0];

  createUserWithEmailAndPassword(auth, signupUseremail, signupPassword)
    .then((userCredential) => {
      // Signed up

      const user = userCredential.user;

      // Create a promise chain for updating the profile
      if (profilePic) {
        const storageRef = ref(storage, `profilePictures/${user.uid}.jpg`);

        // Upload profile picture and update profile
        return uploadBytes(storageRef, profilePic).then(() => {
          getDownloadURL(storageRef).then((url) => {
            return updateProfile(user, {
              displayName: signupUsername, // set the display name
              photoURL: url,
            });
          });
        });
      } else {
        // if no pfp uploaded

        return updateProfile(user, {
          displayName: signupUsername, // set the display name
        });
      }
    })
    // after successfully sign up

    .then(() => {
      // Redirect to the main page after successfully signing up
      alert("Account created successfully!");
      window.location.href = "index.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(`Error: ${errorMessage}`);
    });
});

const rememberMeCheckBox = document.getElementById("rememberMe");

submitLogin.addEventListener("click", (e) => {
  e.preventDefault();

  //inputs
  const loginUseremail = document.getElementById("loginUseremail").value;
  const loginPassword = document.getElementById("loginPassword").value;

  const persistenceType = rememberMeCheckBox.checked
    ? browserLocalPersistence // Stay logged in after closing the browser
    : browserSessionPersistence; // End session when browser is closed

  setPersistence(auth, persistenceType)
    .then(() => {
      return signInWithEmailAndPassword(auth, loginUseremail, loginPassword);
    })
    .then((userCredential) => {
      const user = userCredential.user;
      alert(`Welcome back, ${user.displayName}!`);
      window.location.href = "index.html";
    })
    .catch((error) => {
      alert("Error: invalid email or password");
    });
});

// Log out functionality

const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", () => {
  auth
    .signOut()
    .then(() => {
      alert("You have logged out.");
      window.location.href = "index.html";
    })
    .catch((error) => {
      alert(`Error loggin out: ${error.message}`);
    });
});

// Reset password

const reset = document.getElementById("reset");
reset.addEventListener("click", (e) => {
  e.preventDefault();

  const email = document.getElementById("loginUseremail").value;
  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("Email sent!");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(`Error ${errorMessage}`);
    });
});

// Track if this is the first time the page is loaded
let firstLoad = true;

// Check authentication status when the page loads
document.addEventListener("DOMContentLoaded", () => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      // Hide login and singup btns
      document.getElementById("loginBtn").style.display = "none";
      document.getElementById("signupBtn").style.display = "none";

      // Show profile container and logout button
      const profileContainer = document.getElementById("profileContainer");
      profileContainer.classList.remove("d-none");
      document.getElementById("logoutBtn").classList.remove("d-none");

      // If user has a photoURL, display it; otherwise, show the default image
      const profileImage = document.getElementById("profileImage");

      console.log(user.photoURL);

      if (user.photoURL) {
        profileImage.src = user.photoURL;
      } else {
        profileImage.src = "images/user.svg";
      }

      // Reset firstLoad to false since the user is logged in
      firstLoad = false;
    } else {
      // No user is signed in

      document.getElementById("loginBtn").style.display = "inline-block";
      document.getElementById("signupBtn").style.display = "inline-block";

      // Hide profile image and logout button
      document.getElementById("logoutBtn").classList.add("d-none");
      document.getElementById("profileContainer").classList.add("d-none");

      // Only show the alert on the first load, not on logout
      if (firstLoad) {
        alert("Sign in or Sign up to book a reservation or order drinks.");
        firstLoad = false; // Prevent further alerts on logouts or reloads
      }
    }
  });
});
