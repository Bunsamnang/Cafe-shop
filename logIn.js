// Get the modal elements
const loginModal = document.getElementById("loginModal");
const signupModal = document.getElementById("signupModal");

// Get the buttons that open the modals
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");

// Get the <span> elements that close the modals
const closeLogin = document.getElementById("closeLogin");
const closeSignup = document.getElementById("closeSignup");

// Open the login modal when login button is clicked
loginBtn.onclick = function () {
  loginModal.style.display = "flex";
};

// Open the signup modal when signup button is clicked
signupBtn.onclick = function () {
  signupModal.style.display = "flex";
};

// Close the login modal when the close button is clicked
closeLogin.onclick = function () {
  loginModal.style.display = "none";
};

// Close the signup modal when the close button is clicked
closeSignup.onclick = function () {
  signupModal.style.display = "none";
};

// Close modals when clicking outside of the modal content
window.onclick = function (event) {
  if (event.target == loginModal) {
    loginModal.style.display = "none";
  }
  if (event.target == signupModal) {
    signupModal.style.display = "none";
  }
};
