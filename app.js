/**
 * HealthTrack - Shared Application Logic & Data Management
 * Handles localStorage initialization, sample data seeding, appointment booking,
 * double-booking validation, and UI component rendering.
 */

// Storage Keys
const STORAGE_KEYS = {
  APPOINTMENTS: 'healthtrack_appointments',
  PATIENTS: 'healthtrack_patients',
  DEPARTMENTS: 'healthtrack_departments',
  DOCTORS: 'healthtrack_doctors'
};

// Default Seed Data
const SEED_DEPARTMENTS = [
  { id: 'gen', name: 'General Medicine', fee: 500 },
  { id: 'card', name: 'Cardiology', fee: 1000 },
  { id: 'ortho', name: 'Orthopedics', fee: 800 },
  { id: 'peds', name: 'Pediatrics', fee: 600 }
];

const SEED_DOCTORS = [
  { id: 'doc1', name: 'Dr. Mehta', department: 'General Medicine' },
  { id: 'doc2', name: 'Dr. Rao', department: 'Cardiology' },
  { id: 'doc3', name: 'Dr. Iyer', department: 'Orthopedics' },
  { id: 'doc4', name: 'Dr. Nair', department: 'Pediatrics' }
];

const SEED_PATIENTS = [
  'Ravi Kumar',
  'Anita Sharma',
  'Suresh Patil',
  'Neha Joshi',
  'Amit Verma'
];

const SEED_APPOINTMENTS = [
  {
    id: 'APT-1001',
    patientName: 'Ravi Kumar',
    department: 'General Medicine',
    doctor: 'Dr. Mehta',
    date: '2026-09-28',
    timeSlot: '09:00 AM',
    status: 'Completed',
    fee: 500,
    paymentStatus: 'Paid',
    remarks: 'Routine annual checkup'
  },
  {
    id: 'APT-1002',
    patientName: 'Anita Sharma',
    department: 'Cardiology',
    doctor: 'Dr. Rao',
    date: '2026-09-29',
    timeSlot: '10:00 AM',
    status: 'Completed',
    fee: 1000,
    paymentStatus: 'Paid',
    remarks: 'ECG consultation & report review'
  },
  {
    id: 'APT-1003',
    patientName: 'Suresh Patil',
    department: 'Orthopedics',
    doctor: 'Dr. Iyer',
    date: '2026-09-30',
    timeSlot: '11:00 AM',
    status: 'Confirmed',
    fee: 800,
    paymentStatus: 'Pending',
    remarks: 'Knee joint pain consultation'
  },
  {
    id: 'APT-1004',
    patientName: 'Neha Joshi',
    department: 'Pediatrics',
    doctor: 'Dr. Nair',
    date: '2026-09-30',
    timeSlot: '02:00 PM',
    status: 'Confirmed',
    fee: 600,
    paymentStatus: 'Pending',
    remarks: 'Child routine immunization'
  },
  {
    id: 'APT-1005',
    patientName: 'Amit Verma',
    department: 'General Medicine',
    doctor: 'Dr. Mehta',
    date: '2026-10-01',
    timeSlot: '10:00 AM',
    status: 'Confirmed',
    fee: 500,
    paymentStatus: 'Pending',
    remarks: 'Seasonal fever checkup'
  },
  {
    id: 'APT-1006',
    patientName: 'Ravi Kumar',
    department: 'Cardiology',
    doctor: 'Dr. Rao',
    date: '2026-10-01',
    timeSlot: '11:00 AM',
    status: 'Confirmed',
    fee: 1000,
    paymentStatus: 'Paid',
    remarks: 'Blood pressure evaluation'
  },
  {
    id: 'APT-1007',
    patientName: 'Anita Sharma',
    department: 'Orthopedics',
    doctor: 'Dr. Iyer',
    date: '2026-09-27',
    timeSlot: '03:00 PM',
    status: 'Cancelled',
    fee: 800,
    paymentStatus: 'Pending',
    remarks: 'Cancelled by patient due to emergency'
  },
  {
    id: 'APT-1008',
    patientName: 'Suresh Patil',
    department: 'General Medicine',
    doctor: 'Dr. Mehta',
    date: '2026-10-02',
    timeSlot: '09:00 AM',
    status: 'Confirmed',
    fee: 500,
    paymentStatus: 'Pending',
    remarks: 'Follow-up blood sugar check'
  }
];

/**
 * Initialize localStorage with sample data on first run or forced reset.
 */
function initStorage(forceReset = false) {
  if (typeof localStorage === 'undefined') return;
  
  if (forceReset || !localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
    localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(SEED_DEPARTMENTS));
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(SEED_DOCTORS));
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(SEED_PATIENTS));
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(SEED_APPOINTMENTS));
    console.log('HealthTrack: Storage initialized with sample data.');
  }
}

// Data Getter Helpers
function getDepartments() {
  if (typeof localStorage === 'undefined') return SEED_DEPARTMENTS;
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.DEPARTMENTS)) || SEED_DEPARTMENTS;
}

function getDoctors() {
  if (typeof localStorage === 'undefined') return SEED_DOCTORS;
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.DOCTORS)) || SEED_DOCTORS;
}

function getPatients() {
  if (typeof localStorage === 'undefined') return SEED_PATIENTS;
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.PATIENTS)) || SEED_PATIENTS;
}

function getAppointments() {
  if (typeof localStorage === 'undefined') return SEED_APPOINTMENTS;
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) || SEED_APPOINTMENTS;
}

// Data Setter Helpers
function saveAppointments(appointments) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }
}

function savePatients(patients) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  }
}

/**
 * Add a new patient if they do not already exist in the system.
 */
function ensurePatientExists(patientName) {
  const cleanName = patientName.trim();
  if (!cleanName) return;
  const patients = getPatients();
  const exists = patients.some(p => p.toLowerCase() === cleanName.toLowerCase());
  if (!exists) {
    patients.push(cleanName);
    savePatients(patients);
  }
}

/**
 * Get consultation fee for a given department name.
 */
function getFeeForDepartment(deptName) {
  const depts = getDepartments();
  const found = depts.find(d => d.name.toLowerCase() === deptName.toLowerCase());
  return found ? found.fee : 500;
}

/**
 * CORE LOGIC: Double-Booking Prevention Check
 * Checks if the specified doctor already has an active 'Confirmed' appointment
 * on the exact same date and time slot.
 *
 * @param {string} doctorName - Name of the doctor (e.g., "Dr. Mehta")
 * @param {string} dateStr - Date string formatted as "YYYY-MM-DD"
 * @param {string} timeSlot - Time slot string (e.g., "10:00 AM")
 * @param {string|null} excludeAptId - Optional ID of an appointment to exclude (for editing)
 * @returns {boolean} - Returns true if doctor IS double-booked, false if available.
 */
function isDoubleBooked(doctorName, dateStr, timeSlot, excludeAptId = null) {
  const appointments = getAppointments();
  
  // Search for any existing confirmed appointment matching doctor, date, and time
  return appointments.some(apt => {
    if (excludeAptId && apt.id === excludeAptId) return false;
    
    return (
      apt.doctor.toLowerCase() === doctorName.toLowerCase() &&
      apt.date === dateStr &&
      apt.timeSlot.toLowerCase() === timeSlot.toLowerCase() &&
      apt.status === 'Confirmed' // Only active 'Confirmed' bookings block the slot
    );
  });
}

/**
 * Resets all demo data to initial seed values and refreshes the page.
 */
function resetDemoData() {
  if (confirm('Are you sure you want to reset all HealthTrack data to original sample records?')) {
    initStorage(true);
    window.location.reload();
  }
}

/**
 * Render shared Navbar dynamically into header element.
 */
function renderHeader(activePage) {
  const headerElem = document.getElementById('app-header');
  if (!headerElem) return;

  headerElem.innerHTML = `
    <nav class="navbar">
      <div class="nav-container">
        <a href="index.html" class="brand-logo">
          <div class="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              <path d="M12 7v6"/>
              <path d="M9 10h6"/>
            </svg>
          </div>
          <span class="logo-text">Health<span class="logo-accent">Track</span></span>
        </a>

        <ul class="nav-links">
          <li>
            <a href="index.html" class="nav-link ${activePage === 'book' ? 'active' : ''}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
                <path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4"/>
              </svg>
              <span>Book Appointment</span>
            </a>
          </li>
          <li>
            <a href="appointments.html" class="nav-link ${activePage === 'appointments' ? 'active' : ''}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
              </svg>
              <span>Appointments</span>
            </a>
          </li>
          <li>
            <a href="dashboard.html" class="nav-link ${activePage === 'dashboard' ? 'active' : ''}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="9" rx="1"/>
                <rect x="14" y="3" width="7" height="5" rx="1"/>
                <rect x="14" y="12" width="7" height="9" rx="1"/>
                <rect x="3" y="16" width="7" height="5" rx="1"/>
              </svg>
              <span>Dashboard</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  `;
}

/**
 * Render shared Footer dynamically.
 */
function renderFooter() {
  const footerElem = document.getElementById('app-footer');
  if (!footerElem) return;

  footerElem.innerHTML = `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-info">
          <p class="footer-title">HealthTrack Hospital Management Demo System</p>
          <p class="footer-subtitle">Vanilla HTML/CSS/JS Reference Project &bull; Browser LocalStorage Edition</p>
        </div>
        <div class="footer-actions">
          <button type="button" class="btn btn-secondary btn-sm" onclick="resetDemoData()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
            Reset Demo Data
          </button>
        </div>
      </div>
    </footer>
  `;
}

// Auto-run storage initialization on script load in browser
if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  initStorage();
}

