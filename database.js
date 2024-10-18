import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

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
const db = getDatabase(app);

function initializeRooms() {
  const roomsRef = ref(db, "rooms");

  get(roomsRef)
    .then((snapshot) => {
      if (!snapshot.exists()) {
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

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateString = date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
    availabilities[dateString] = {
      "09:00": true,
      "12:00": true,
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

  // Correctly reference the 'rooms' path
  const roomsRef = ref(db, "rooms");

  get(roomsRef)
    .then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const room = childSnapshot.val();
        const roomId = childSnapshot.key;
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
                    <button class="btn btn-primary mt-2" onclick="reserveRoom('${roomId}')">Reserve</button>
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
function reserveRoom(roomId) {
  const selectedDate = document.getElementById("selectedDate").value;
  const selectedTime = document.getElementById(`time-${roomId}`).value;

  if (!selectedDate || !selectedTime) {
    alert("Please select a date and time to reserve this room.");
    return; // Exit if date or time is not selected
  }

  // Correctly reference the room's availability for the selected date
  const roomRef = ref(db, `rooms/${roomId}/availabilities/${selectedDate}`);

  get(roomRef).then((snapshot) => {
    const availabilities = snapshot.val() || {};

    // Check if the selected time is available
    if (availabilities[selectedTime] === true) {
      // Mark the room as unavailable for the selected time
      availabilities[selectedTime] = false; // Mark as reserved
      set(roomRef, availabilities) // Update availability for the selected date
        .then(() => {
          alert(
            `Room ${roomId} reserved for ${selectedTime} on ${selectedDate}`
          );
          renderRooms(); // Re-render the available times
          const bookingDetails = document.getElementById("booking-details");
          bookingDetails.classList.remove("d-none");
        })
        .catch((error) => {
          console.error("Error reserving room:", error);
        });
    } else {
      alert("This time is no longer available.");
    }
  });
}

// Make the function accessible globally
window.reserveRoom = reserveRoom;

// Call this function once for initial setup
initializeRooms();
