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
  GoogleAuthProvider,
  signInWithPopup,
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
const auth = getAuth(app);
auth.languageCode = "en";
const storage = getStorage(); // storage for pfp

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

  // const passwordValidationMsg = validatePassword(signupPassword);
  // if (passwordValidationMsg) {
  //   alert(passwordValidationMsg);
  //   return; // Stop the signup process if validation fails
  // }

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
      const errorCode = error.code;

      let errorMessage;

      switch (errorCode) {
        case "auth/wrong-password":
          errorMessage = "Incorrect password. Please try again.";
          break;
        case "auth/user-not-found":
          errorMessage = "No user found with this email.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email format. Please enter a valid email.";
          break;
        default:
          errorMessage = "An error occurred. Please try again.";
      }

      alert(`Error: ${errorMessage}`);
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

// Google auth
const googleProvider = new GoogleAuthProvider(); // for google sign up

const googleLogin = document.getElementById("googleLogin");
googleLogin.addEventListener("click", () => {
  signInWithPopup(auth, googleProvider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
      alert("Connected google account!");
      window.location.href = "index.html";
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
    });
});

// Track if this is the first time the page is loaded
let firstLoad = true;

// Reservation page
const reserveNav = document.getElementById("reserve-nav");

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

      // activate reserve option
      reserveNav.classList.remove("disabled");
      reserveNav.removeAttribute("aria-disabled");

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

// // Password validation function
// function validatePassword(password) {
//   const minLength = 8;
//   const hasUpperCase = /[A-Z]/.test(password);
//   const hasLowerCase = /[a-z]/.test(password);
//   const hasNumber = /\d/.test(password);
//   const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

//   if (password.length < minLength) {
//     return "Password must be at least 8 characters long.";
//   }
//   if (!hasUpperCase) {
//     return "Password must contain at least one uppercase letter.";
//   }
//   if (!hasLowerCase) {
//     return "Password must contain at least one lowercase letter.";
//   }
//   if (!hasNumber) {
//     return "Password must contain at least one number.";
//   }
//   if (!hasSpecialChar) {
//     return "Password must contain at least one special character.";
//   }

//   return ""; // Return an empty string if validation passes
// }
