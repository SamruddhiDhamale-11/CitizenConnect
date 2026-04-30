/* ============================================================
   CITIZEN CONNECT — Dashboard Logic
   ============================================================ */
"use strict";

// ---- Demo data ----
const COMPLAINTS = [
  { id: "CMP-001", title: "Broken streetlight on Main Road", category: "Electricity / Streetlights", desc: "The streetlight near house no. 45, Main Road has been non-functional for over 2 weeks causing safety issues at night.", location: "Main Road, near house no. 45", date: "28 Apr 2026", status: "pending", priority: "high" },
  { id: "CMP-002", title: "Garbage not collected for 3 days", category: "Garbage & Sanitation", desc: "Municipal garbage truck has not visited our lane for 3 consecutive days. Waste is piling up causing hygiene issues.", location: "Lane 4, Sector B", date: "22 Apr 2026", status: "resolved", priority: "medium" },
  { id: "CMP-003", title: "Pothole on Nehru Street", category: "Roads & Potholes", desc: "Large pothole near the school gate on Nehru Street. Two-wheelers have already had accidents due to this.", location: "Nehru Street, near school gate", date: "15 Apr 2026", status: "inprogress", priority: "high" },
];

const SUGGESTIONS = [
  { id: "SUG-001", title: "Install CCTV cameras near Ward Park", category: "Public Safety & Security", desc: "The ward park has no surveillance. Installing CCTV cameras will deter anti-social activities and improve safety for families.", benefit: "Improved safety for children and families visiting the park.", date: "25 Apr 2026", status: "review", scope: "Ward" },
  { id: "SUG-002", title: "Set up a community recycling bin", category: "Environment & Greenery", desc: "Place colour-coded recycling bins at 3 key locations in the ward to encourage waste segregation at source.", benefit: "Reduces landfill waste and promotes environmental awareness.", date: "10 Apr 2026", status: "accepted", scope: "Ward" },
];

// ---- Init ----
document.addEventListener("DOMContentLoaded", function () {
  setDate();
  renderComplaints(COMPLAINTS);
  renderSuggestions(SUGGESTIONS);
  setupCharCounters();
});

function setDate() {
  const el = document.getElementById("pageDate");
  if (el) {
    const d = new Date();
    el.textContent = d.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  }
}

// ---- Panel switching ----
function showPanel(name, clickedEl) {
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
  const panel = document.getElementById("panel-" + name);
  if (panel) panel.classList.add("active");
  if (clickedEl) clickedEl.classList.add("active");
  closeSidebar();
  window.scrollTo({ top: 0, behavior: "smooth" });
  return false;
}

function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const hamburger = document.getElementById("hamburger");
  if (sidebar.classList.contains("open")) {
    closeSidebar();
  } else {
    sidebar.classList.add("open");
    overlay.classList.add("visible");
    hamburger.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

function closeSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const hamburger = document.getElementById("hamburger");
  sidebar.classList.remove("open");
  overlay.classList.remove("visible");
  if (hamburger) hamburger.classList.remove("open");
  document.body.style.overflow = "";
}

// ---- Logout ----
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    window.location.href = "index.html";
  }
}

// ---- Char counters ----
function setupCharCounters() {
  const pairs = [
    ["complaintTitle", "complaintTitleCount"],
    ["complaintDesc", "complaintDescCount"],
    ["suggestionTitle", "suggestionTitleCount"],
    ["suggestionDesc", "suggestionDescCount"],
    ["suggestionBenefit", "suggestionBenefitCount"],
  ];
  pairs.forEach(function (pair) {
    const el = document.getElementById(pair[0]);
    const counter = document.getElementById(pair[1]);
    if (el && counter) {
      el.addEventListener("input", function () { counter.textContent = el.value.length; });
    }
  });
}

// ---- File name display ----
function showFileName(inputId, displayId) {
  const input = document.getElementById(inputId);
  const display = document.getElementById(displayId);
  if (input && input.files && input.files[0]) {
    display.textContent = " " + input.files[0].name;
    display.classList.remove("hidden");
  }
}

// ---- Submit Complaint ----
function submitComplaint(e) {
  e.preventDefault();
  const errEl = document.getElementById("complaintError");
  errEl.classList.add("hidden");

  const cat      = document.getElementById("complaintCategory").value;
  const priority = document.getElementById("complaintPriority").value;
  const title    = document.getElementById("complaintTitle").value.trim();
  const desc     = document.getElementById("complaintDesc").value.trim();
  const location = document.getElementById("complaintLocation").value.trim();

  if (!cat || !priority || !title || !desc || !location) {
    errEl.textContent = "Please fill all required fields before submitting.";
    errEl.classList.remove("hidden");
    return;
  }

  // Add to demo data
  const newId = "CMP-00" + (COMPLAINTS.length + 1);
  COMPLAINTS.unshift({ id: newId, title: title, category: cat, desc: desc, location: location, date: formatDate(new Date()), status: "pending", priority: priority });
  renderComplaints(COMPLAINTS);

  // Update stat
  document.getElementById("statComplaints").textContent = COMPLAINTS.length;

  // Reset form
  document.getElementById("complaintForm").reset();
  document.getElementById("complaintTitleCount").textContent = "0";
  document.getElementById("complaintDescCount").textContent = "0";
  document.getElementById("complaintFileName").classList.add("hidden");

  showToast("", "Complaint submitted successfully! ID: " + newId);
  showPanel("mycomplaints", document.querySelector("[onclick*=mycomplaints]"));
}

// ---- Submit Suggestion ----
function submitSuggestion(e) {
  e.preventDefault();
  const errEl = document.getElementById("suggestionError");
  errEl.classList.add("hidden");

  const cat     = document.getElementById("suggestionCategory").value;
  const scope   = document.getElementById("suggestionScope").value;
  const title   = document.getElementById("suggestionTitle").value.trim();
  const desc    = document.getElementById("suggestionDesc").value.trim();
  const benefit = document.getElementById("suggestionBenefit").value.trim();

  if (!cat || !scope || !title || !desc || !benefit) {
    errEl.textContent = "Please fill all required fields before submitting.";
    errEl.classList.remove("hidden");
    return;
  }

  const newId = "SUG-00" + (SUGGESTIONS.length + 1);
  SUGGESTIONS.unshift({ id: newId, title: title, category: cat, desc: desc, benefit: benefit, date: formatDate(new Date()), status: "review", scope: scope });
  renderSuggestions(SUGGESTIONS);

  document.getElementById("suggestionForm").reset();
  document.getElementById("suggestionTitleCount").textContent = "0";
  document.getElementById("suggestionDescCount").textContent = "0";
  document.getElementById("suggestionBenefitCount").textContent = "0";
  document.getElementById("suggestionFileName").classList.add("hidden");

  showToast("", "Suggestion submitted successfully! ID: " + newId);
  showPanel("mysuggestions", document.querySelector("[onclick*=mysuggestions]"));
}

// ---- Reset form ----
function resetForm(formId, errId) {
  document.getElementById(formId).reset();
  document.getElementById(errId).classList.add("hidden");
  ["complaintTitleCount","complaintDescCount","suggestionTitleCount","suggestionDescCount","suggestionBenefitCount"].forEach(function(id) {
    const el = document.getElementById(id);
    if (el) el.textContent = "0";
  });
  ["complaintFileName","suggestionFileName"].forEach(function(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });
}

// ---- Render complaints ----
function renderComplaints(data) {
  const list = document.getElementById("complaintsList");
  if (!list) return;
  if (!data.length) {
    list.innerHTML = '<div class="item-empty"><div class="item-empty-icon"></div><div>No complaints found.</div></div>';
    return;
  }
  list.innerHTML = data.map(function (c) {
    return '<div class="item-card" data-status="' + c.status + '" data-title="' + c.title.toLowerCase() + '">' +
      '<div class="item-card-top">' +
        '<div><div class="item-card-title">' + escHtml(c.title) + '</div>' +
        '<div class="item-card-cat">' + escHtml(c.category) + ' &nbsp;&nbsp; ' + escHtml(c.id) + '</div></div>' +
        '<span class="status-pill ' + c.status + '">' + statusLabel(c.status) + '</span>' +
      '</div>' +
      '<div class="item-card-desc">' + escHtml(c.desc) + '</div>' +
      '<div class="item-card-footer">' +
        '<span class="item-card-date"> ' + c.date + '</span>' +
        '<span class="item-card-date"> ' + escHtml(c.location) + '</span>' +
        '<span class="priority-pill ' + c.priority + '">' + c.priority.toUpperCase() + '</span>' +
      '</div>' +
    '</div>';
  }).join("");
}

// ---- Render suggestions ----
function renderSuggestions(data) {
  const list = document.getElementById("suggestionsList");
  if (!list) return;
  if (!data.length) {
    list.innerHTML = '<div class="item-empty"><div class="item-empty-icon"></div><div>No suggestions found.</div></div>';
    return;
  }
  list.innerHTML = data.map(function (s) {
    return '<div class="item-card" data-status="' + s.status + '" data-title="' + s.title.toLowerCase() + '">' +
      '<div class="item-card-top">' +
        '<div><div class="item-card-title">' + escHtml(s.title) + '</div>' +
        '<div class="item-card-cat">' + escHtml(s.category) + ' &nbsp;&nbsp; ' + escHtml(s.id) + '</div></div>' +
        '<span class="status-pill ' + s.status + '">' + statusLabel(s.status) + '</span>' +
      '</div>' +
      '<div class="item-card-desc">' + escHtml(s.desc) + '</div>' +
      '<div class="item-card-footer">' +
        '<span class="item-card-date"> ' + s.date + '</span>' +
        '<span class="item-card-date"> Scope: ' + escHtml(s.scope) + '</span>' +
      '</div>' +
    '</div>';
  }).join("");
}

// ---- Filter ----
function filterItems(type, status) {
  const listId = type === "complaint" ? "complaintsList" : "suggestionsList";
  const cards = document.querySelectorAll("#" + listId + " .item-card");
  cards.forEach(function (card) {
    const match = status === "all" || card.dataset.status === status;
    card.style.display = match ? "" : "none";
  });
}

// ---- Search ----
function searchItems(type, query) {
  const listId = type === "complaint" ? "complaintsList" : "suggestionsList";
  const cards = document.querySelectorAll("#" + listId + " .item-card");
  const q = query.toLowerCase();
  cards.forEach(function (card) {
    const match = !q || (card.dataset.title || "").includes(q);
    card.style.display = match ? "" : "none";
  });
}

// ---- Helpers ----
function statusLabel(s) {
  const map = { pending: "Pending", inprogress: "In Progress", resolved: "Resolved", review: "Under Review", accepted: "Accepted", implemented: "Implemented", rejected: "Not Accepted" };
  return map[s] || s;
}

function escHtml(str) {
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function formatDate(d) {
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function showToast(icon, msg) {
  const toast = document.getElementById("toast");
  document.getElementById("toastIcon").textContent = icon;
  document.getElementById("toastMsg").textContent = msg;
  toast.classList.remove("hidden");
  setTimeout(function () { toast.classList.add("hidden"); }, 4000);
}
