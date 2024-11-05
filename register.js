import {
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
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

import { auth, storage } from "./firebase.js"; // Use the new firebaseInit file

//submit btn

const submitLogin = document.getElementById("submitLogin");
const submitSignup = document.getElementById("submitSignup");

if (submitSignup) {
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
        window.location.href = window.location.href;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(`Error: ${errorMessage}`);
      });
  });
}

const rememberMeCheckBox = document.getElementById("rememberMe");

if (submitLogin) {
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
        window.location.href = window.location.href;
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
}
// Log out functionality

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    auth
      .signOut()
      .then(() => {
        alert("You have logged out.");
        window.location.href = window.location.href;
      })
      .catch((error) => {
        alert(`Error loggin out: ${error.message}`);
      });
  });
}

// Reset password
const reset = document.getElementById("reset");
if (reset) {
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
}

// Google auth
const googleProvider = new GoogleAuthProvider(); // for google sign up

const googleLogin = document.getElementById("googleLogin");
if (googleLogin) {
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
        alert(`Connected google account! Welcome ${user.displayName}`);
        window.location.href = window.location.href;
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  });
}

// Check authentication status when the page loads
document.addEventListener("DOMContentLoaded", () => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log(user);

      // Hide login and signup buttons
      const loginBtn = document.getElementById("loginBtn");
      if (loginBtn) loginBtn.style.display = "none";

      const signupBtn = document.getElementById("signupBtn");
      if (signupBtn) signupBtn.style.display = "none";

      // Show profile container and logout button
      const profileContainer = document.getElementById("profileContainer");
      if (profileContainer) profileContainer.classList.remove("d-none");

      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) logoutBtn.classList.remove("d-none");

      // If user has a photoURL, display it; otherwise, show the default image
      const profileImage = document.getElementById("profileImage");
      console.log(user.photoURL);

      if (profileImage) {
        profileImage.src = user.photoURL ? user.photoURL : "images/user.svg";
      }

      // Activate reserve option
      const reserveNav = document.getElementById("reserve-nav");
      if (reserveNav) {
        reserveNav.classList.remove("disabled");
        reserveNav.removeAttribute("aria-disabled");
      }
    } else {
      // No user is signed in

      const loginBtn = document.getElementById("loginBtn");
      if (loginBtn) loginBtn.style.display = "inline-block";

      const signupBtn = document.getElementById("signupBtn");
      if (signupBtn) signupBtn.style.display = "inline-block";

      // Hide profile image and logout button
      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) logoutBtn.classList.add("d-none");

      const profileContainer = document.getElementById("profileContainer");
      if (profileContainer) profileContainer.classList.add("d-none");
    }
  });
});
