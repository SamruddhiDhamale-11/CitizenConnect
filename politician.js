"use strict";

document.addEventListener("DOMContentLoaded", function () {
  setDate();
  initCharts();
});

function setDate() {
  var el = document.getElementById("pageDate");
  if (el) {
    var d = new Date();
    el.textContent = d.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  }
}

function showPanel(name, clickedEl) {
  document.querySelectorAll(".panel").forEach(function(p) { p.classList.remove("active"); });
  document.querySelectorAll(".nav-item").forEach(function(n) { n.classList.remove("active"); });
  var panel = document.getElementById("panel-" + name);
  if (panel) panel.classList.add("active");
  if (clickedEl) clickedEl.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
  return false;
}

function logout() {
  if (confirm("Are you sure you want to logout?")) {
    window.location.href = "index.html";
  }
}

var RED = "#C21807";
var RED_LIGHT = "rgba(194,24,7,0.12)";
var BLUE = "#2563EB";
var GREEN = "#16a34a";
var ORANGE = "#D97706";
var PURPLE = "#7C3AED";
var GREY = "#9CA3AF";

function initCharts() {
  // ---- Category Doughnut (Overview) ----
  var ctxCat = document.getElementById("chartCategory");
  if (ctxCat) {
    new Chart(ctxCat, {
      type: "doughnut",
      data: {
        labels: ["Water Supply", "Roads", "Streetlights", "Garbage", "Drainage", "Others"],
        datasets: [{
          data: [34, 28, 22, 19, 14, 10],
          backgroundColor: [BLUE, RED, ORANGE, GREEN, PURPLE, GREY],
          borderWidth: 2, borderColor: "#fff"
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: true,
        plugins: {
          legend: { position: "bottom", labels: { font: { size: 11, family: "Inter" }, padding: 12 } },
          tooltip: { callbacks: { label: function(c) { return " " + c.label + ": " + c.raw + " complaints"; } } }
        },
        cutout: "60%"
      }
    });
  }

  // ---- Status Doughnut (Overview) ----
  var ctxStatus = document.getElementById("chartStatus");
  if (ctxStatus) {
    new Chart(ctxStatus, {
      type: "doughnut",
      data: {
        labels: ["Resolved", "In Progress", "Pending"],
        datasets: [{
          data: [89, 21, 17],
          backgroundColor: [GREEN, BLUE, RED],
          borderWidth: 2, borderColor: "#fff"
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: true,
        plugins: {
          legend: { position: "bottom", labels: { font: { size: 11, family: "Inter" }, padding: 12 } },
          tooltip: { callbacks: { label: function(c) { return " " + c.label + ": " + c.raw; } } }
        },
        cutout: "60%"
      }
    });
  }

  // ---- Trend Line (Complaints panel) ----
  var ctxTrend = document.getElementById("chartTrend");
  if (ctxTrend) {
    new Chart(ctxTrend, {
      type: "line",
      data: {
        labels: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
        datasets: [
          {
            label: "Complaints Received",
            data: [18, 22, 31, 27, 24, 29],
            borderColor: RED, backgroundColor: RED_LIGHT,
            borderWidth: 2.5, pointRadius: 5, pointBackgroundColor: RED,
            fill: true, tension: 0.4
          },
          {
            label: "Resolved",
            data: [14, 18, 22, 20, 19, 24],
            borderColor: GREEN, backgroundColor: "rgba(22,163,74,0.08)",
            borderWidth: 2.5, pointRadius: 5, pointBackgroundColor: GREEN,
            fill: true, tension: 0.4
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: true,
        plugins: { legend: { position: "top", labels: { font: { size: 11, family: "Inter" }, padding: 16 } } },
        scales: {
          y: { beginAtZero: true, grid: { color: "#F0F0F0" }, ticks: { font: { size: 11 } } },
          x: { grid: { display: false }, ticks: { font: { size: 11 } } }
        }
      }
    });
  }

  // ---- Suggestions Bar (Suggestions panel) ----
  var ctxSug = document.getElementById("chartSuggestions");
  if (ctxSug) {
    new Chart(ctxSug, {
      type: "bar",
      data: {
        labels: ["Under Review", "Accepted", "Implemented", "Not Accepted"],
        datasets: [{
          label: "Suggestions",
          data: [18, 12, 8, 5],
          backgroundColor: [BLUE, GREEN, "#059669", RED],
          borderRadius: 6, borderSkipped: false
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: "#F0F0F0" }, ticks: { font: { size: 11 } } },
          x: { grid: { display: false }, ticks: { font: { size: 11 } } }
        }
      }
    });
  }

  // ---- Gender Pie (Demographics) ----
  var ctxGender = document.getElementById("chartGender");
  if (ctxGender) {
    new Chart(ctxGender, {
      type: "pie",
      data: {
        labels: ["Female", "Male", "Other"],
        datasets: [{
          data: [9200, 9100, 150],
          backgroundColor: [RED, BLUE, GREY],
          borderWidth: 2, borderColor: "#fff"
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: true,
        plugins: {
          legend: { position: "bottom", labels: { font: { size: 11, family: "Inter" }, padding: 12 } },
          tooltip: { callbacks: { label: function(c) { return " " + c.label + ": " + c.raw.toLocaleString(); } } }
        }
      }
    });
  }

  // ---- Age Bar (Demographics) ----
  var ctxAge = document.getElementById("chartAge");
  if (ctxAge) {
    new Chart(ctxAge, {
      type: "bar",
      data: {
        labels: ["0-17", "18-30", "31-45", "46-60", "60+"],
        datasets: [{
          label: "Population",
          data: [3200, 4100, 5500, 3400, 2250],
          backgroundColor: [GREY, PURPLE, RED, ORANGE, BLUE],
          borderRadius: 6, borderSkipped: false
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: "#F0F0F0" }, ticks: { font: { size: 11 } } },
          x: { grid: { display: false }, ticks: { font: { size: 11 } } }
        }
      }
    });
  }

  // ---- Performance Line (Performance panel) ----
  var ctxPerf = document.getElementById("chartPerformance");
  if (ctxPerf) {
    new Chart(ctxPerf, {
      type: "bar",
      data: {
        labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
        datasets: [
          {
            label: "Complaints Received",
            data: [14, 16, 19, 21, 18, 20, 18, 22, 31, 27, 24, 29],
            backgroundColor: RED_LIGHT, borderColor: RED,
            borderWidth: 1.5, borderRadius: 4
          },
          {
            label: "Resolved",
            data: [11, 13, 15, 17, 15, 17, 14, 18, 22, 20, 19, 24],
            backgroundColor: "rgba(22,163,74,0.15)", borderColor: GREEN,
            borderWidth: 1.5, borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: true,
        plugins: { legend: { position: "top", labels: { font: { size: 11, family: "Inter" }, padding: 16 } } },
        scales: {
          y: { beginAtZero: true, grid: { color: "#F0F0F0" }, ticks: { font: { size: 11 } } },
          x: { grid: { display: false }, ticks: { font: { size: 11 } } }
        }
      }
    });
  }
}
