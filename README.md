# HealthTrack - Hospital Management System Demo

**HealthTrack** is a clean, minimal, lightweight reference demo web application for a Hospital Management System. It is built strictly with **Plain HTML5, CSS3, and Vanilla JavaScript** with zero dependencies, no build steps, and no backend database. All application state is stored locally in the browser using `localStorage` and automatically pre-seeded with sample medical records.

---

## 🌟 Features Overview

### 1. 📅 Page 1: Book Appointment (`index.html`)
- **Flexible Patient Selection**: Select from existing registered patients or enter a new patient's name on the fly.
- **Department & Doctor Cascade**: Selecting a department dynamically filters the list of available specialist doctors (General Medicine, Cardiology, Orthopedics, Pediatrics).
- **Auto Consultation Fee Calculation**: Consultation fees are dynamically computed based on the chosen department:
  - *General Medicine*: ₹500
  - *Orthopedics*: ₹800
  - *Cardiology*: ₹1,000
  - *Pediatrics*: ₹600
- **Validation Rules**:
  - **Past Date Prevention**: Bookings for dates prior to today's date are strictly blocked.
  - **Double-Booking Check**: Prevents booking the same doctor for the exact same date and time slot if an active `Confirmed` appointment already exists.
- **Instant Bill Generation**: Automatically creates a consultation bill record set to `Pending` payment status upon booking.

### 2. 📋 Page 2: Appointments Directory (`appointments.html`)
- **Centralized Master Table**: Displays Date, Time, Patient Name, Doctor, Department, Status, Bill Amount, and Payment Status.
- **Status Badges**: Color-coded indicators for quick identification:
  - `Confirmed` (Blue), `Completed` (Green), `Cancelled` (Red)
  - `Paid` (Green), `Pending` (Amber)
- **Live Search & Filters**:
  - Search by Patient Name or Booking ID.
  - Filter by Booking Status (`Confirmed`, `Completed`, `Cancelled`).
  - Filter by Payment Status (`Paid`, `Pending`).
- **Row Action Controls**:
  - **✓ Complete**: Marks a confirmed appointment as completed.
  - **✕ Cancel**: Marks an appointment as cancelled (releasing the time slot).
  - **💳 Pay Fee**: Marks pending consultation bills as paid.

### 3. 📊 Page 3: Executive Analytics Dashboard (`dashboard.html`)
- **Summary Metrics**:
  - Total Appointments Count
  - Total Registered Patients
  - Pending Bills (Count & Total Outstanding Amount)
  - Total Revenue Collected (Sum of all paid bills)
- **Interactive Visualizations (Chart.js)**:
  - **Donut Chart**: Department-wise patient visit distribution.
  - **Bar Chart**: Total appointments workload per doctor.
- **Recent Activity Stream**: Displays the 5 most recent appointment bookings with instant status indicators.

### 4. 🔄 Demo Data Management
- Includes a **"Reset Demo Data"** button in the global footer on every page to reset `localStorage` to initial seed values at any time.

---

## ⚙️ How the Core Logic Works

### 🔒 Double-Booking Prevention Logic
The core rule of the booking engine is located in `app.js` inside the `isDoubleBooked` function:

```javascript
/**
 * Checks if the specified doctor already has an active 'Confirmed' appointment
 * on the exact same date and time slot.
 */
function isDoubleBooked(doctorName, dateStr, timeSlot, excludeAptId = null) {
  const appointments = getAppointments();
  
  return appointments.some(apt => {
    if (excludeAptId && apt.id === excludeAptId) return false;
    
    return (
      apt.doctor.toLowerCase() === doctorName.toLowerCase() &&
      apt.date === dateStr &&
      apt.timeSlot.toLowerCase() === timeSlot.toLowerCase() &&
      apt.status === 'Confirmed' // Only active 'Confirmed' bookings block slot
    );
  });
}
```
If `isDoubleBooked` returns `true`, the form submission halts immediately and displays a prominent red warning banner detailing the conflicting booking.

### 💾 LocalStorage Data Schema & Seeding
On first load, `initStorage()` checks if `healthtrack_appointments` exists in `localStorage`. If missing (or when reset), it seeds the storage with sample data:

- `healthtrack_departments`: Array of department objects with default fee structures.
- `healthtrack_doctors`: List of specialist doctors assigned to departments.
- `healthtrack_patients`: Array of registered patient names.
- `healthtrack_appointments`: Pre-populated array of 8 initial appointments with various statuses (`Confirmed`, `Completed`, `Cancelled`) and payment states (`Paid`, `Pending`).

---

## 📁 File Structure

```
HealthTrack/
├── index.html          # Book Appointment form page
├── appointments.html   # Appointments directory table with actions & filters
├── dashboard.html      # Analytics dashboard with metric cards & Chart.js charts
├── style.css           # Clean medical theme styling (responsive, cards, badges)
├── app.js              # Shared storage helpers, seed data, double-booking validation logic
└── README.md           # Documentation & user guide
```

---

## 🚀 How to Run the Application

### Option A: Open directly in Browser (No Server Needed)
1. Double-click [**`index.html`**](file:///c:/Users/Amey%20deshpande/OneDrive/Documents/HealthTrack/index.html) or open it directly in Chrome, Firefox, Edge, or Safari.
2. Navigate between pages using the top navbar links (**Book Appointment**, **Appointments**, **Dashboard**).

### Option B: Run via a Local Development Server
If you prefer running via a local web server (e.g. Python or Node):

**Python 3:**
```bash
python -m http.server 8080
```
Then open `http://localhost:8080/index.html` in your browser.

**Node / npx:**
```bash
npx http-server -p 8080
```

---

## 🧪 Step-by-Step Demo Verification Flow

1. **Book an Appointment**:
   - Go to `index.html`.
   - Select patient **Anita Sharma**, department **General Medicine**, doctor **Dr. Mehta**.
   - Pick date `2026-10-05` and time `10:00 AM`.
   - Click **Confirm & Book Appointment** -> Observe the green success banner with fee details.
2. **Verify Double-Booking Block**:
   - Without changing doctor (*Dr. Mehta*), date (*2026-10-05*), or time (*10:00 AM*), select a different patient (*Ravi Kumar*).
   - Click **Confirm & Book Appointment** -> Observe the red **Double-Booking Conflict Alert**.
3. **Manage Statuses & Payments**:
   - Navigate to `appointments.html`.
   - Click **✓ Complete** or **✕ Cancel** on an active appointment.
   - Click **💳 Pay Fee** to mark a pending bill as Paid.
4. **Check Analytics**:
   - Open `dashboard.html` to confirm revenue counters and Chart.js charts update live.
