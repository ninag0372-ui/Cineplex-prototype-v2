// Cineplex Prototype Main Logic

document.addEventListener("DOMContentLoaded", () => {
  // Inject Auth Modals into document body
  injectAuthModals();

  // Load content JSON
  fetch("data/movies.json")
    .then(response => response.json())
    .then(data => {
      initApp(data);
    })
    .catch(error => console.error("Error loading JSON data:", error));
});

function initApp(data) {
  // Initialize Page 1 - Movie Selection Grid if present
  if (document.getElementById("movie-grid-container")) {
    renderMovieGrid(data.movies);
  }

  // Initialize Page 2 - Location Selector if present
  if (document.getElementById("location-container")) {
    renderLocationSelector(data.theatres);
  }

  // Initialize Page 3 - Booking & Seats if present
  if (document.getElementById("booking-container")) {
    renderBookingPage(data);
  }

  // Initialize Payment Page if present
  if (document.getElementById("payment-container")) {
    initPaymentPage(data);
  }
}

/* ==========================================
   AUTH MODALS SYSTEM (Log In & Account Creation)
   ========================================== */

function injectAuthModals() {
  if (document.getElementById("login-modal-overlay")) return;

  const modalHTML = `
    <!-- Log In Modal matching Sketch "If log in" -->
    <div id="login-modal-overlay" class="modal-overlay" onclick="closeAuthModal(event, 'login-modal-overlay')">
      <div class="modal-card" onclick="event.stopPropagation()">
        <button class="modal-close-btn" onclick="hideModal('login-modal-overlay')">&times;</button>
        <div class="modal-header">Log in</div>
        <form onsubmit="handleModalLogin(event)">
          <div class="form-group">
            <label for="modal-email">Email</label>
            <input type="email" id="modal-email" class="text-input" placeholder="Enter email" required>
          </div>
          <div class="form-group">
            <label for="modal-password">Password</label>
            <input type="password" id="modal-password" class="text-input" placeholder="Enter password" required>
          </div>
          <div class="checkbox-group">
            <input type="checkbox" id="keep-logged-in">
            <label for="keep-logged-in">Keep me logged in</label>
          </div>
          <div class="modal-action-row">
            <button type="button" class="btn btn-outline" onclick="switchToSignup()">create account</button>
            <button type="submit" class="btn btn-primary">Log in</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Account Creation Modal matching Sketch "account Creation" -->
    <div id="signup-modal-overlay" class="modal-overlay" onclick="closeAuthModal(event, 'signup-modal-overlay')">
      <div class="modal-card" onclick="event.stopPropagation()">
        <button class="modal-close-btn" onclick="hideModal('signup-modal-overlay')">&times;</button>
        <div class="modal-header">account Creation</div>
        <form onsubmit="handleModalSignup(event)">
          <div class="form-group">
            <label for="signup-fname">First name *</label>
            <input type="text" id="signup-fname" class="text-input" placeholder="First name" required>
          </div>
          <div class="form-group">
            <label for="signup-lname">Last name *</label>
            <input type="text" id="signup-lname" class="text-input" placeholder="Last name" required>
          </div>
          <div class="form-group">
            <label for="signup-birthday">Birthday</label>
            <div style="display: flex; gap: 0.5rem;">
              <input type="text" placeholder="YYYY" class="text-input" style="flex:2;">
              <input type="text" placeholder="MM" class="text-input" style="flex:1;">
              <input type="text" placeholder="DD" class="text-input" style="flex:1;">
            </div>
          </div>
          <div class="form-group">
            <label for="signup-address">Address</label>
            <input type="text" id="signup-address" class="text-input" placeholder="Street address">
          </div>
          <p class="required-note">* = required.</p>
          <div class="checkbox-group">
            <input type="checkbox" id="notify-offers">
            <label for="notify-offers">I want to be notified of new offers and releases.</label>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%; margin-top:1rem;">Create Account</button>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

function showLoginModal() {
  hideModal("signup-modal-overlay");
  const modal = document.getElementById("login-modal-overlay");
  if (modal) modal.classList.add("active");
}

function showSignupModal() {
  hideModal("login-modal-overlay");
  const modal = document.getElementById("signup-modal-overlay");
  if (modal) modal.classList.add("active");
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("active");
}

function closeAuthModal(event, modalId) {
  if (event.target.classList.contains("modal-overlay")) {
    hideModal(modalId);
  }
}

function switchToSignup() {
  hideModal("login-modal-overlay");
  showSignupModal();
}

function handleModalLogin(e) {
  e.preventDefault();
  const email = document.getElementById("modal-email").value;
  alert(`Logged in successfully as ${email}`);
  hideModal("login-modal-overlay");
}

function handleModalSignup(e) {
  e.preventDefault();
  const fname = document.getElementById("signup-fname").value;
  alert(`Account created successfully for ${fname}!`);
  hideModal("signup-modal-overlay");
}

/* ==========================================
   PAGE 1: MOVIE SELECTION
   ========================================== */

function renderMovieGrid(movies) {
  const container = document.getElementById("movie-grid-container");
  if (!container) return;

  container.innerHTML = movies.map(movie => `
    <div class="movie-card">
      <div class="poster-placeholder">
        [ ${movie.title} Poster Placeholder ]
      </div>
      <div class="movie-info">
        <h3 class="movie-title">${movie.title}</h3>
        <p class="movie-meta">${movie.rating} | ${movie.duration}</p>
        <p style="font-size: 0.85rem; color: #4a5568; margin-bottom: 0.5rem;">${movie.summary}</p>
        <div class="tag-list">
          ${movie.tags.map(t => `<span class="tag">${t}</span>`).join("")}
        </div>
      </div>
      <a href="booking.html?movieId=${movie.id}" class="btn btn-primary" style="width:100%; text-align:center;">Select Showtimes</a>
    </div>
  `).join("");
}

/* ==========================================
   PAGE 2: LOCATION SELECTOR
   ========================================== */

function renderLocationSelector(theatres) {
  const selectElem = document.getElementById("theatre-select");
  const listElem = document.getElementById("theatre-list");
  if (!selectElem || !listElem) return;

  selectElem.innerHTML = `<option value="">-- Choose a Cineplex Location --</option>` +
    theatres.map(t => `<option value="${t.id}">${t.name} (${t.address})</option>`).join("");

  listElem.innerHTML = theatres.map(t => `
    <div class="location-item" onclick="selectLocation('${t.id}')">
      <div>
        <strong>${t.name}</strong>
        <p style="font-size: 0.85rem; color: #718096;">${t.address}</p>
      </div>
      <span class="btn btn-outline">Select</span>
    </div>
  `).join("");

  selectElem.addEventListener("change", (e) => {
    if (e.target.value) {
      selectLocation(e.target.value);
    }
  });
}

function selectLocation(theatreId) {
  localStorage.setItem("selectedTheatre", theatreId);
  window.location.href = "movie-selection.html";
}

/* ==========================================
   PAGE 3: BOOKING & SEAT SELECTION
   ========================================== */

function renderBookingPage(data) {
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("movieId") || "m1";
  const movie = data.movies.find(m => m.id === movieId) || data.movies[0];

  localStorage.setItem("selectedMovieTitle", movie.title);

  const movieDetailsElem = document.getElementById("booking-movie-details");
  if (movieDetailsElem) {
    movieDetailsElem.innerHTML = `
      <div class="small-poster-placeholder">
        [ ${movie.title} Poster ]
      </div>
      <div class="movie-text-details">
        <h2>${movie.title}</h2>
        <p><strong>Rating:</strong> ${movie.rating} | <strong>Duration:</strong> ${movie.duration}</p>
        <p><strong>Genre:</strong> ${movie.genre}</p>
        <p style="margin-top:0.5rem;">${movie.summary}</p>
        <div class="tag-list">
          ${movie.tags.map(t => `<span class="tag">${t}</span>`).join("")}
        </div>
        <a class="trailer-link" onclick="alert('Trailer popup placeholder for ${movie.title}')">▶ Watch trailer</a>
      </div>
    `;
  }

  const dateSelect = document.getElementById("date-select");
  const timeSelect = document.getElementById("time-select");

  if (dateSelect) {
    dateSelect.innerHTML = movie.dates.map(d => `<option value="${d}">${d}</option>`).join("");
  }
  if (timeSelect) {
    timeSelect.innerHTML = movie.showtimes.map(t => `<option value="${t}">${t}</option>`).join("");
  }

  renderSeatGrid();
}

function renderSeatGrid() {
  const seatGrid = document.getElementById("seat-grid");
  if (!seatGrid) return;

  const rows = ['A', 'B'];
  const seatsPerRow = 6;
  let html = '';

  rows.forEach(row => {
    for (let i = 1; i <= seatsPerRow; i++) {
      const seatId = `${row}${i}`;
      const isOccupied = (row === 'A' && (i === 2 || i === 5));
      html += `
        <div class="seat ${isOccupied ? 'occupied' : ''}" 
             data-seat="${seatId}" 
             onclick="toggleSeat(this, '${isOccupied}')">
          ${seatId}
        </div>
      `;
    }
  });

  seatGrid.innerHTML = html;
}

function toggleSeat(elem, isOccupied) {
  if (isOccupied === 'true') return;
  elem.classList.toggle("selected");
  updateSelectedSeatCount();
}

function updateSelectedSeatCount() {
  const selectedSeats = document.querySelectorAll(".seat.selected");
  const quantitySelect = document.getElementById("quantity-select");
  if (quantitySelect && selectedSeats.length > 0) {
    quantitySelect.value = selectedSeats.length;
  }
}

function handleCheckout(type) {
  let selectedSeats = Array.from(document.querySelectorAll(".seat.selected")).map(s => s.dataset.seat);
  
  if (selectedSeats.length === 0) {
    selectedSeats = ["A1"];
  }

  const pricePerTicket = 14.50;
  const totalAmount = (selectedSeats.length * pricePerTicket).toFixed(2);

  localStorage.setItem("bookingSeats", selectedSeats.join(", "));
  localStorage.setItem("bookingTotal", `$${totalAmount}`);
  localStorage.setItem("checkoutType", type);

  window.location.href = "payment.html";
}

/* ==========================================
   PAGE 4: PAYMENT PAGE LOGIC
   ========================================== */

function initPaymentPage(data) {
  const seats = localStorage.getItem("bookingSeats") || "A1";
  const total = localStorage.getItem("bookingTotal") || "$14.50";
  const movieTitle = localStorage.getItem("selectedMovieTitle") || "Dune: Part Two";

  const totalElem = document.getElementById("total-amount-display");
  const seatsElem = document.getElementById("seats-summary-display");

  if (totalElem) totalElem.textContent = total;
  if (seatsElem) seatsElem.textContent = `Seats: ${seats}`;

  const confirmMovie = document.getElementById("confirm-movie");
  const confirmSeats = document.getElementById("confirm-seats");
  const confirmAmount = document.getElementById("confirm-amount");

  if (confirmMovie) confirmMovie.textContent = movieTitle;
  if (confirmSeats) confirmSeats.textContent = seats;
  if (confirmAmount) confirmAmount.textContent = total;
}

function processPayment(event, method = "Card") {
  if (event) event.preventDefault();

  const paymentBox = document.querySelector(".payment-box");
  const confirmationScreen = document.getElementById("confirmation-screen");
  const codeElem = document.getElementById("confirmation-code");

  if (codeElem) {
    codeElem.textContent = `CPX-${Math.floor(10000 + Math.random() * 90000)}`;
  }

  if (paymentBox && confirmationScreen) {
    paymentBox.style.display = "none";
    confirmationScreen.style.display = "block";
  }
}
