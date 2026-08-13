/* ==========================================================================
   Student Complaint & Profile Management Portal — script.js
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  /* ---------------- Page loader ---------------- */
  const loader = document.getElementById("pageLoader");
  if (loader) {
    window.addEventListener("load", function () {
      setTimeout(function () {
        loader.classList.add("loaded");
      }, 300);
    });
  }

  /* ---------------- Sidebar toggle (mobile) ---------------- */
  const sidebar = document.getElementById("appSidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const menuToggle = document.getElementById("menuToggleBtn");

  function openSidebar() {
    sidebar.classList.add("show");
    overlay.classList.add("show");
  }
  function closeSidebar() {
    sidebar.classList.remove("show");
    overlay.classList.remove("show");
  }
  if (menuToggle) menuToggle.addEventListener("click", openSidebar);
  if (overlay) overlay.addEventListener("click", closeSidebar);

  /* ---------------- Sidebar collapse (desktop, icon-only) ---------------- */
  const collapseBtn = document.getElementById("sidebarCollapseBtn");
  if (collapseBtn && sidebar) {
    const stored = localStorage.getItem("sidebarCollapsed");
    if (stored === "true") sidebar.classList.add("collapsed");

    collapseBtn.addEventListener("click", function () {
      sidebar.classList.toggle("collapsed");
      localStorage.setItem("sidebarCollapsed", sidebar.classList.contains("collapsed"));
    });
  }

  /* ---------------- Dark mode toggle ---------------- */
  const themeToggle = document.getElementById("themeToggleBtn");
  const htmlEl = document.documentElement;

  function applyTheme(theme) {
    htmlEl.setAttribute("data-theme", theme);
    if (themeToggle) {
      const icon = themeToggle.querySelector("i");
      if (icon) icon.className = theme === "dark" ? "bi bi-sun" : "bi bi-moon-stars";
    }
  }

  const savedTheme = localStorage.getItem("portalTheme") || "light";
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const next = htmlEl.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem("portalTheme", next);
    });
  }

  /* ---------------- Admin search bar (client-side demo filter) ---------------- */
  const adminSearch = document.getElementById("adminSearchInput");
  const searchableTable = document.getElementById("recentComplaintsTable");
  if (adminSearch && searchableTable) {
    adminSearch.addEventListener("input", function () {
      const term = this.value.trim().toLowerCase();
      searchableTable.querySelectorAll("tbody tr").forEach((row) => {
        row.style.display = row.textContent.toLowerCase().includes(term) ? "" : "none";
      });
    });
  }

  /* ---------------- Complaint analytics chart ---------------- */
  const analyticsCanvas = document.getElementById("complaintAnalyticsChart");
  if (analyticsCanvas && window.Chart) {
    const isDark = htmlEl.getAttribute("data-theme") === "dark";
    const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
    const textColor = isDark ? "#9aa2ad" : "#6c757d";

    new Chart(analyticsCanvas, {
      type: "bar",
      data: {
        labels: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        datasets: [
          {
            label: "Submitted",
            data: [42, 55, 48, 63, 58, 71],
            backgroundColor: "#0d6efd",
            borderRadius: 6,
            maxBarThickness: 22,
          },
          {
            label: "Resolved",
            data: [30, 44, 40, 52, 50, 60],
            backgroundColor: "#0dcaf0",
            borderRadius: 6,
            maxBarThickness: 22,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: textColor, font: { size: 11 } },
          },
          y: {
            grid: { color: gridColor },
            ticks: { color: textColor, font: { size: 11 } },
            beginAtZero: true,
          },
        },
      },
    });
  }

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll(".reveal-on-scroll");
  if (revealEls.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  /* ============================================================
     SUBMIT COMPLAINT PAGE LOGIC
     ============================================================ */
  const complaintForm = document.getElementById("complaintForm");
  if (!complaintForm) return;

  /* ---- Character counter for description ---- */
  const description = document.getElementById("complaintDescription");
  const charCounter = document.getElementById("descCharCounter");
  const MAX_CHARS = 800;

  function updateCharCounter() {
    const len = description.value.length;
    charCounter.textContent = len + " / " + MAX_CHARS;
    charCounter.classList.toggle("text-warning-strong", len > MAX_CHARS);
  }

  if (description && charCounter) {
    description.addEventListener("input", updateCharCounter);
    updateCharCounter();
  }

  /* ---- Drag & drop evidence upload ---- */
  const dropzone = document.getElementById("evidenceDropzone");
  const fileInput = document.getElementById("evidenceInput");
  const fileList = document.getElementById("evidenceFileList");
  let attachedFiles = [];

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function iconForFile(name) {
    const ext = name.split(".").pop().toLowerCase();
    if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "bi-file-earmark-image";
    if (ext === "pdf") return "bi-file-earmark-pdf";
    if (["doc", "docx"].includes(ext)) return "bi-file-earmark-word";
    return "bi-file-earmark";
  }

  function renderFileList() {
    fileList.innerHTML = "";
    attachedFiles.forEach((file, index) => {
      const chip = document.createElement("div");
      chip.className = "file-chip";
      chip.innerHTML =
        '<div class="file-ico"><i class="bi ' + iconForFile(file.name) + '"></i></div>' +
        '<div class="file-meta">' +
          '<div class="file-name">' + file.name + '</div>' +
          '<div class="file-size">' + formatSize(file.size) + '</div>' +
        '</div>' +
        '<button type="button" class="file-remove" data-index="' + index + '" aria-label="Remove file">' +
          '<i class="bi bi-x-lg"></i>' +
        '</button>';
      fileList.appendChild(chip);
    });

    fileList.querySelectorAll(".file-remove").forEach((btn) => {
      btn.addEventListener("click", function () {
        const idx = parseInt(this.getAttribute("data-index"), 10);
        attachedFiles.splice(idx, 1);
        renderFileList();
      });
    });
  }

  function addFiles(fileArray) {
    Array.from(fileArray).forEach((file) => {
      const alreadyAdded = attachedFiles.some(
        (f) => f.name === file.name && f.size === file.size
      );
      if (!alreadyAdded) attachedFiles.push(file);
    });
    renderFileList();
  }

  if (dropzone && fileInput) {
    dropzone.addEventListener("click", () => fileInput.click());

    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.classList.add("dragover");
    });

    dropzone.addEventListener("dragleave", () => {
      dropzone.classList.remove("dragover");
    });

    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.classList.remove("dragover");
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener("change", () => {
      if (fileInput.files.length) addFiles(fileInput.files);
      fileInput.value = "";
    });
  }

  /* ---- Form validation + submit ---- */
  const successAlert = document.getElementById("complaintSuccessAlert");

  complaintForm.addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();

    const isValid = complaintForm.checkValidity();
    complaintForm.classList.add("was-validated");

    if (!isValid) {
      const firstInvalid = complaintForm.querySelector(":invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Simulate submission (frontend only — no backend)
    const submitBtn = document.getElementById("submitComplaintBtn");
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting...';

    setTimeout(function () {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      successAlert.classList.add("show-alert");
      successAlert.scrollIntoView({ behavior: "smooth", block: "center" });

      complaintForm.reset();
      complaintForm.classList.remove("was-validated");
      attachedFiles = [];
      renderFileList();
      updateCharCounter();

      setTimeout(function () {
        successAlert.classList.remove("show-alert");
      }, 6000);
    }, 1200);
  });
});
