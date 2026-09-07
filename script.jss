/* ================================
   EVENT MANAGEMENT SYSTEM
================================ */

let currentUser = localStorage.getItem("eventUser") || "";

const events = [
    {
        id: 1,
        name: "TechFest 2026",
        category: "Technical",
        date: "2026-09-15",
        time: "10:00 AM - 4:00 PM",
        venue: "Main Auditorium",
        coordinator: "Dr. Arun Kumar",
        guest: "Mr. Rajesh Kumar",
        seats: 120,
        icon: "💻",
        description:
            "A technology festival featuring coding competitions, AI demonstrations, technical talks and innovation challenges."
    },

    {
        id: 2,
        name: "AI & Machine Learning Workshop",
        category: "Workshop",
        date: "2026-09-18",
        time: "9:30 AM - 1:00 PM",
        venue: "Seminar Hall",
        coordinator: "Dr. Priya Sharma",
        guest: "Ms. Ananya Rao",
        seats: 80,
        icon: "🤖",
        description:
            "Hands-on workshop covering Artificial Intelligence, Machine Learning and real-world applications."
    },

    {
        id: 3,
        name: "Cultural Fest",
        category: "Cultural",
        date: "2026-09-22",
        time: "5:00 PM - 9:00 PM",
        venue: "Open Air Theatre",
        coordinator: "Prof. Kavitha",
        guest: "Mr. Vijay Anand",
        seats: 250,
        icon: "🎭",
        description:
            "An exciting cultural celebration with music, dance, drama and student performances."
    },

    {
        id: 4,
        name: "Inter College Sports Meet",
        category: "Sports",
        date: "2026-09-25",
        time: "8:00 AM - 5:00 PM",
        venue: "College Ground",
        coordinator: "Mr. Suresh",
        guest: "Mr. Karthik",
        seats: 300,
        icon: "🏆",
        description:
            "Inter-college sports competitions including football, cricket, volleyball and athletics."
    },

    {
        id: 5,
        name: "Hackathon 2026",
        category: "Technical",
        date: "2026-09-28",
        time: "9:00 AM - 6:00 PM",
        venue: "Innovation Lab",
        coordinator: "Dr. Arun Kumar",
        guest: "Mr. Rahul Menon",
        seats: 100,
        icon: "🚀",
        description:
            "Build innovative solutions for real-world problems in this exciting 24-hour hackathon."
    },

    {
        id: 6,
        name: "Career Development Seminar",
        category: "Workshop",
        date: "2026-10-02",
        time: "10:00 AM - 1:00 PM",
        venue: "Conference Hall",
        coordinator: "Dr. Meena",
        guest: "Ms. Divya Krishnan",
        seats: 150,
        icon: "🎓",
        description:
            "Industry experts share career guidance, interview tips and professional development strategies."
    }
];


/* ================================
   LOGIN
================================ */

function login() {

    const name = document.getElementById("loginName").value.trim();
    const role = document.getElementById("loginRole").value;

    if (!name) {
        alert("Please enter your name.");
        return;
    }

    currentUser = name;

    localStorage.setItem("eventUser", name);
    localStorage.setItem("eventRole", role);

    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");

    updateUser();

    displayEvents();
    displayDashboardEvents();
    displayRegistrations();
}


/* ================================
   USER
================================ */

function updateUser() {

    document.getElementById("userName").textContent = currentUser;
    document.getElementById("welcomeName").textContent = currentUser;

    document.getElementById("userAvatar").textContent =
        currentUser.charAt(0).toUpperCase();

}


/* ================================
   LOGOUT
================================ */

function logout() {

    localStorage.removeItem("eventUser");
    localStorage.removeItem("eventRole");

    location.reload();
}


/* ================================
   PAGE NAVIGATION
================================ */

function showPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.add("hidden");
    });

    document.getElementById(pageId).classList.remove("hidden");

    const titles = {
        dashboard: "Dashboard",
        events: "Events",
        registrations: "My Registrations",
        calendar: "Calendar",
        attendance: "Attendance",
        notifications: "Notifications",
        coordinator: "Event Coordinator",
        chiefGuest: "Chief Guest",
        manage: "Create Event"
    };

    document.getElementById("pageTitle").textContent =
        titles[pageId] || "EventX";

    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    if (pageId === "events") {
        displayEvents();
    }

    if (pageId === "registrations") {
        displayRegistrations();
    }

    if (pageId === "calendar") {
        renderCalendar();
    }

}


/* ================================
   DISPLAY EVENTS
================================ */

function displayEvents() {

    const grid = document.getElementById("eventGrid");

    if (!grid) return;

    const search =
        document.getElementById("search").value.toLowerCase();

    const category =
        document.getElementById("category").value;

    const filtered = events.filter(event => {

        const matchesSearch =
            event.name.toLowerCase().includes(search) ||
            event.category.toLowerCase().includes(search);

        const matchesCategory =
            category === "All" ||
            event.category === category;

        return matchesSearch && matchesCategory;
    });

    grid.innerHTML = filtered.map(event => `

        <div class="event-card">

            <div class="event-poster">
                ${event.icon}
            </div>

            <div class="event-info">

                <span class="event-category">
                    ${event.category.toUpperCase()}
                </span>

                <h2>${event.name}</h2>

                <p>📅 ${formatDate(event.date)}</p>

                <p>⏰ ${event.time}</p>

                <p>📍 ${event.venue}</p>

                <p>💺 ${event.seats} seats available</p>

                <button onclick="viewEvent(${event.id})">
                    View Details
                </button>

            </div>

        </div>

    `).join("");

}


/* ================================
   DASHBOARD EVENTS
================================ */

function displayDashboardEvents() {

    const grid = document.getElementById("dashboardEvents");

    if (!grid) return;

    grid.innerHTML = events.slice(0, 3).map(event => `

        <div class="event-card">

            <div class="event-poster">
                ${event.icon}
            </div>

            <div class="event-info">

                <span class="event-category">
                    ${event.category}
                </span>

                <h2>${event.name}</h2>

                <p>📅 ${formatDate(event.date)}</p>
                <p>📍 ${event.venue}</p>

                <button onclick="viewEvent(${event.id})">
                    View Event
                </button>

            </div>

        </div>

    `).join("");

}


/* ================================
   EVENT DETAILS
================================ */

function viewEvent(id) {

    const event = events.find(e => e.id === id);

    const registrations =
        JSON.parse(localStorage.getItem("registrations")) || [];

    const registered =
        registrations.some(r => r.eventId === id);

    document.getElementById("modalContent").innerHTML = `

        <div class="event-poster">
            ${event.icon}
        </div>

        <span class="badge">${event.category}</span>

        <h1 style="margin:15px 0;">
            ${event.name}
        </h1>

        <p>📅 <b>Date:</b> ${formatDate(event.date)}</p>

        <p>⏰ <b>Time:</b> ${event.time}</p>

        <p>📍 <b>Venue:</b> ${event.venue}</p>

        <p>💺 <b>Available Seats:</b> ${event.seats}</p>

        <hr style="margin:20px 0;border-color:#193a27">

        <h3>About Event</h3>

        <p style="color:#91a295;line-height:1.7;margin:10px 0 20px;">
            ${event.description}
        </p>

        <h3>👨‍💼 Event Coordinator</h3>

        <p>
            ${event.coordinator}
        </p>

        <h3 style="margin-top:20px;">
            ⭐ Chief Guest
        </h3>

        <p>
            ${event.guest}
        </p>

        <button
            style="width:100%;margin-top:20px;"
            onclick="registerEvent(${event.id})"
            ${registered ? "disabled" : ""}
        >
            ${registered ? "✓ Already Registered" : "Register Now"}
        </button>

    `;

    document.getElementById("eventModal")
        .classList.remove("hidden");
}


/* ================================
   CLOSE MODAL
================================ */

function closeModal() {

    document.getElementById("eventModal")
        .classList.add("hidden");

}


/* ================================
   REGISTER EVENT
================================ */

function registerEvent(id) {

    let registrations =
        JSON.parse(localStorage.getItem("registrations")) || [];

    if (registrations.some(r => r.eventId === id)) {
        alert("You are already registered.");
        return;
    }

    const event = events.find(e => e.id === id);

    const registration = {
        eventId: id,
        eventName: event.name,
        date: event.date,
        registrationId:
            "EVX" + Date.now().toString().slice(-6)
    };

    registrations.push(registration);

    localStorage.setItem(
        "registrations",
        JSON.stringify(registrations)
    );

    alert("Registration successful! 🎉");

    closeModal();

    updateRegistrationCount();

    displayRegistrations();
}


/* ================================
   REGISTRATION LIST
================================ */

function displayRegistrations() {

    const container =
        document.getElementById("registrationList");

    if (!container) return;

    const registrations =
        JSON.parse(localStorage.getItem("registrations")) || [];

    if (registrations.length === 0) {

        container.innerHTML = `
            <div class="registration">
                <div>
                    <h2>No registrations yet</h2>
                    <p>Explore events and register for one.</p>
                </div>
            </div>
        `;

        return;
    }

    container.innerHTML = registrations.map(reg => `

        <div class="registration">

            <div>
                <h2>${reg.eventName}</h2>

                <p>
                    📅 ${formatDate(reg.date)}
                </p>

                <p>
                    Registration ID:
                    <b>${reg.registrationId}</b>
                </p>

                <span class="status present">
                    Registered
                </span>
            </div>

            <button onclick="showQR(
                '${reg.eventName}',
                '${reg.registrationId}'
            )">
                🎟 QR Ticket
            </button>

        </div>

    `).join("");

}


/* ================================
   REGISTRATION COUNT
================================ */

function updateRegistrationCount() {

    const registrations =
        JSON.parse(localStorage.getItem("registrations")) || [];

    document.getElementById("registeredCount").textContent =
        registrations.length;

    document.getElementById("attReg").textContent =
        registrations.length;
}


/* ================================
   QR TICKET
================================ */

function showQR(name, id) {

    document.getElementById("qrEventName")
        .textContent = name;

    document.getElementById("registrationId")
        .textContent = id;

    document.getElementById("qrModal")
        .classList.remove("hidden");
}


function closeQR() {

    document.getElementById("qrModal")
        .classList.add("hidden");

}


/* ================================
   CALENDAR
================================ */

let calendarDate = new Date(2026, 8, 1);

function renderCalendar() {

    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    document.getElementById("monthYear").textContent =
        calendarDate.toLocaleString("default", {
            month: "long",
            year: "numeric"
        });

    const firstDay =
        new Date(year, month, 1).getDay();

    const daysInMonth =
        new Date(year, month + 1, 0).getDate();

    const container =
        document.getElementById("calendarDays");

    container.innerHTML = "";

    for (let i = 0; i < firstDay; i++) {
        container.innerHTML += `<div></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {

        const dateString =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        const hasEvent =
            events.some(e => e.date === dateString);

        container.innerHTML += `
            <div class="${hasEvent ? "event-day" : ""}">
                <b>${day}</b>
                ${hasEvent ? "<br>📅 Event" : ""}
            </div>
        `;
    }
}


function changeMonth(change) {

    calendarDate.setMonth(
        calendarDate.getMonth() + change
    );

    renderCalendar();
}


/* ================================
   DATE FORMAT
================================ */

function formatDate(dateString) {

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


/* ================================
   CREATE EVENT
================================ */

function createEvent() {

    const name =
        document.getElementById("eventName").value;

    const category =
        document.getElementById("eventCategory").value;

    const date =
        document.getElementById("eventDate").value;

    const venue =
        document.getElementById("eventVenue").value;

    const coordinator =
        document.getElementById("eventCoordinator").value;

    const guest =
        document.getElementById("eventGuest").value;

    if (!name || !date || !venue) {
        alert("Please fill all required fields.");
        return;
    }

    events.push({
        id: Date.now(),
        name,
        category,
        date,
        time: "10:00 AM - 4:00 PM",
        venue,
        coordinator,
        guest,
        seats: 100,
        icon: "🎉",
        description: "New college event."
    });

    alert("Event created successfully!");

    document.getElementById("eventName").value = "";
    document.getElementById("eventDate").value = "";
    document.getElementById("eventVenue").value = "";
    document.getElementById("eventCoordinator").value = "";
    document.getElementById("eventGuest").value = "";

    displayEvents();
    displayDashboardEvents();
}


/* ================================
   START APPLICATION
================================ */

window.onload = function () {

    if (currentUser) {

        document.getElementById("loginPage")
            .classList.add("hidden");

        document.getElementById("app")
            .classList.remove("hidden");

        updateUser();

        displayEvents();
        displayDashboardEvents();
        displayRegistrations();
        updateRegistrationCount();

    }

};
