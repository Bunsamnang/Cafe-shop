import {
  ref as databaseRef,
  set,
  get,
  push,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
import { db } from "./firebase.js"; // Use the new firebaseInit file
import { auth } from "./firebase.js"; // Ensure you import the Firebase auth module

let uid = null; // Variable to hold the user ID

// Monitor authentication state
auth.onAuthStateChanged((user) => {
  if (user) {
    uid = user.uid; // Set the UID when user is authenticated
    console.log(`User is logged in: ${uid}`);
    // You can call any initialization functions here if needed
  } else {
    uid = null; // User is signed out
    console.log("No user is logged in.");
  }
});

function initializeRooms() {
  const roomsRef = databaseRef(db, "rooms");

  get(roomsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const roomsData = {
          room1: {
            name: "Room 1",
            availabilities: generateAvailability(30), // 30 days of availability
          },
          room2: {
            name: "Room 2",
            availabilities: generateAvailability(30),
          },
          room3: {
            name: "Room 3",
            availabilities: generateAvailability(30),
          },
          room4: {
            name: "Room 4",
            availabilities: generateAvailability(30),
          },
        };

        set(roomsRef, roomsData)
          .then(() => {
            console.log("Rooms data initialized successfully.");
          })
          .catch((error) => {
            console.error("Error initializing rooms data:", error);
          });
      } else {
        console.log("Rooms data already exists. Skipping initialization.");
      }
    })
    .catch((error) => {
      console.error("Error checking rooms data: ", error);
    });
}

function generateAvailability(days) {
  const availabilities = {};
  const today = new Date();

  console.log(today);

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateString = date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
    availabilities[dateString] = {
      "09:00": true,
      "11:00": true,
      "13:00": true,
      "16:00": true,
      "18:00": true,
    }; // All times available by default
  }

  return availabilities;
}

// Set up event listener for date selection
const selectedDate = document.getElementById("selectedDate");
selectedDate.addEventListener("change", () => {
  renderRooms();
});

// Function to render rooms
function renderRooms() {
  const selectedDate = document.getElementById("selectedDate").value;
  const roomsContainer = document.getElementById("rooms");
  roomsContainer.innerHTML = ""; // Clear previous room data

  if (!selectedDate) {
    return; // Don't render rooms until a date is selected
  }

  const roomsRef = databaseRef(db, "rooms");

  get(roomsRef)
    .then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const room = childSnapshot.val();
        const roomId = childSnapshot.key;

        const roomName = room.name;

        const roomDiv = document.createElement("div");
        roomDiv.className = "col-md-3 mb-4";

        // Access the availability for the selected date
        const roomAvailabilities = room.availabilities[selectedDate];

        // Ensure roomAvailabilities is defined and filter available times
        const availableTimesList = roomAvailabilities
          ? Object.keys(roomAvailabilities).filter(
              (time) => roomAvailabilities[time] === true
            )
          : []; // Fallback to an empty array if no availabilities

        console.log(availableTimesList);

        roomDiv.innerHTML = `
                <div class="card">
                  <div class="card-body">
                    <h5>${room.name}</h5>
                    <select class="form-select" id="time-${roomId}">
                      <option value="">Select Time</option>
                      ${availableTimesList
                        .map(
                          (time) => `<option value="${time}">${time}</option>`
                        )
                        .join("")}
                    </select>
                    <button class="btn btn-primary mt-2" onclick="reserveRoom('${roomId}', '${roomName}')">Reserve</button>
                  </div>
                </div>`;
        roomsContainer.appendChild(roomDiv);
      });
    })
    .catch((error) => {
      console.error("Error fetching rooms:", error);
    });
}

// Function to reserve a room
function reserveRoom(roomId, roomName) {
  const selectedDate = document.getElementById("selectedDate").value;
  const selectedTime = document.getElementById(`time-${roomId}`).value;

  if (!selectedDate || !selectedTime || selectedTime === "") {
    alert("Please select a date and time to reserve this room.");
    return; // Exit if date or time is not selected
  }

  if (!uid) {
    alert("You need to be logged in to reserve a room.");
    return; // Exit if user is not logged in
  }

  // Store the reservation as pending
  const pendingReservation = {
    roomId,
    roomName,
    date: selectedDate,
    time: selectedTime,
  };

  localStorage.setItem(
    "pendingReservation",
    JSON.stringify(pendingReservation)
  );
  alert("Room reserved temporarily! Please complete your booking details.");

  const bookingDetails = document.getElementById("booking-details");
  bookingDetails.classList.remove("d-none");
}

const bookingForm = document.getElementById("form");

// Form submission and finalizing reservation
if (bookingForm) {
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const phoneNum = document.getElementById("phone").value;

    if (!uid) {
      alert("You need to be logged in to book a room.");
      return; // Exit if user is not logged in
    }

    // Retrieve the pending reservation from localStorage
    const pendingReservation = JSON.parse(
      localStorage.getItem("pendingReservation")
    );

    if (!pendingReservation) {
      alert("No pending reservation found.");
      return;
    }

    const { roomId, roomName, date, time } = pendingReservation;

    // Reference to the user's reservations
    const userReservationRef = databaseRef(db, `users/${uid}/reservations`);
    const newReservationRef = push(userReservationRef); // Use push to create a unique key

    // Correctly reference the room's availability for the selected date
    const roomRef = databaseRef(db, `rooms/${roomId}/availabilities/${date}`);

    get(roomRef).then((snapshot) => {
      const availabilities = snapshot.val() || {};

      // Check if the selected time is available
      if (availabilities[time] === true) {
        // Mark the room as unavailable for the selected time
        availabilities[time] = false; // Mark as reserved
        set(roomRef, availabilities) // Update availability for the selected date
          .then(() => {
            // Store the reservation details in the user's reservations
            set(newReservationRef, {
              roomName,
              date,
              time,
              userName: fullName,
              userEmail: email,
              tel: phoneNum,
            })
              .then(() => {
                alert(`${roomName} reserved for ${time} on ${date}`);
                bookingForm.reset(); // Clear form after submission

                localStorage.removeItem("pendingReservation"); // Clear pending reservation
                renderRooms(); // Re-render the available times
              })
              .catch((error) => {
                console.error("Error recording reservation:", error);
              });
          })
          .catch((error) => {
            console.error("Error reserving room:", error);
          });
      }
    });
  });
}

// Make the function accessible globally
window.reserveRoom = reserveRoom;

// Call this function once for initial setup
initializeRooms();
