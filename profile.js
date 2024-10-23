import {
  ref as databaseRef,
  get,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
import { auth } from "./firebase.js"; // Ensure you import your auth instance
import { db } from "./firebase.js";

document.addEventListener("DOMContentLoaded", () => {
  const bookingDetails = document.getElementById("booking-details-container");
  const reservationDetails = document.getElementById("reservation-history");

  // Reset the inner HTML
  bookingDetails.innerHTML = "";
  reservationDetails.innerHTML = "";

  // Listen for authentication state

  auth.onAuthStateChanged((user) => {
    if (user) {
      const uid = user.uid;
      console.log("Current UID in profile.js:", uid);

      const bookingDetailsData = databaseRef(
        db,
        `users/${uid}/booking_details`
      );

      get(bookingDetailsData)
        .then((snapshot) => {
          if (snapshot.exists()) {
            let html = "";
            snapshot.forEach((childSnapshot) => {
              const bookingDetail = childSnapshot.val();

              const phoneNum = bookingDetail.tel;
              const email = bookingDetail.userEmail;
              const name = bookingDetail.userName;

              html += `<div class="row">
                            <div class="col-md-4">
                             <p>
                                <strong>Full Name:</strong> <span id="user-name">${name}</span>
                             </p>
                            </div>
                            <div class="col-md-4">
                             <p>
                                <strong>Email:</strong> <span id="user-email">${email}</span>
                             </p>
                            </div>
                            <div class="col-md-4">
                             <p>
                                <strong>Phone Number:</strong> <span id="user-phone">${phoneNum}</span>
                             </p>
                            </div>
                        </div>
                        `;
            });

            bookingDetails.innerHTML = html;
          } else {
            bookingDetails.innerHTML = `<p class="text-center">No booking details found</p>`;
            console.log("No booking details found");
          }
        })
        .catch((error) => {
          console.error("Error fetching booking details:", error);
        });

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
