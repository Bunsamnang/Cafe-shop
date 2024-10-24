import {
  ref as databaseRef,
  get,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
import { auth } from "./firebase.js"; // Ensure you import your auth instance
import { db } from "./firebase.js";

document.addEventListener("DOMContentLoaded", () => {
  const reservationDetails = document.getElementById("reservation-history");

  // Reset the inner HTML

  reservationDetails.innerHTML = "";

  // Listen for authentication state

  auth.onAuthStateChanged((user) => {
    if (user) {
      const uid = user.uid;
      console.log("Current UID in profile.js:", uid);

      const reservationDetailsData = databaseRef(
        db,
        `users/${uid}/reservations`
      );

      get(reservationDetailsData)
        .then((snapshot) => {
          if (snapshot.exists()) {
            let html = "";

            snapshot.forEach((childSnapshot) => {
              const reservationDetail = childSnapshot.val();

              const date = reservationDetail.date;
              const roomName = reservationDetail.roomName;
              const time = reservationDetail.time;

              html += `<tr>
                        <td>${roomName}</td>
                        <td>${date}</td>
                        <td>${time}</td>
                      </tr>`;
            });

            reservationDetails.innerHTML = html;
          }
        })
        .catch((error) => {
          console.error("Error fetching booking details:", error);
        });
    } else {
      // User is signed out
      bookingDetails.innerHTML = `<p class="text-center">Please sign in to view your booking details.</p>`;
      console.log("No user is signed in");
    }
  });
});
