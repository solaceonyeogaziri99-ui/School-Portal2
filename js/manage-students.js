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
     MANAGE STUDENTS PAGE LOGIC
     ============================================================ */
  const studentsTable = document.getElementById("studentsTable");
  if (studentsTable) {

    const tbody = studentsTable.querySelector("tbody");
    const searchInput = document.getElementById("studentSearchInput");
    const filterForm = document.getElementById("studentFilterForm");
    const filterCount = document.getElementById("studentFilterCount");
    const resultCount = document.getElementById("studentResultCount");
    const paginationEl = document.getElementById("studentsPagination");

    function activeFilters() {
      if (!filterForm) return { dept: [], status: [] };
      const dept = Array.from(filterForm.querySelectorAll('input[name="deptFilter"]:checked')).map((i) => i.value);
      const status = Array.from(filterForm.querySelectorAll('input[name="statusFilter"]:checked')).map((i) => i.value);
      return { dept, status };
    }

    function applyFilters() {
      const term = (searchInput ? searchInput.value.trim().toLowerCase() : "");
      const { dept, status } = activeFilters();
      let visibleCount = 0;

      tbody.querySelectorAll("tr").forEach((row) => {
        const matchesTerm = !term || row.textContent.toLowerCase().includes(term);
        const rowDept = row.getAttribute("data-department");
        const rowStatus = row.getAttribute("data-status");
        const matchesDept = dept.length === 0 || dept.includes(rowDept);
        const matchesStatus = status.length === 0 || status.includes(rowStatus);
        const show = matchesTerm && matchesDept && matchesStatus;
        row.style.display = show ? "" : "none";
        if (show) visibleCount++;
      });

      if (resultCount) {
        resultCount.textContent = "Showing " + visibleCount + " of " + tbody.querySelectorAll("tr").length + " students";
      }
      if (filterCount) {
        const total = dept.length + status.length;
        filterCount.textContent = total;
        filterCount.style.display = total > 0 ? "inline-flex" : "none";
      }
    }

    if (searchInput) searchInput.addEventListener("input", applyFilters);
    if (filterForm) filterForm.addEventListener("change", applyFilters);

    const clearFiltersBtn = document.getElementById("clearStudentFilters");
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener("click", function () {
        filterForm.querySelectorAll("input[type='checkbox']").forEach((i) => (i.checked = false));
        applyFilters();
      });
    }

    applyFilters();

    /* ---- Pagination (demo — purely visual page switching) ---- */
    if (paginationEl) {
      paginationEl.querySelectorAll(".page-link[data-page]").forEach((link) => {
        link.addEventListener("click", function (e) {
          e.preventDefault();
          if (this.closest(".page-item").classList.contains("disabled")) return;
          paginationEl.querySelectorAll(".page-item").forEach((li) => li.classList.remove("active"));
          this.closest(".page-item").classList.add("active");
        });
      });
    }

    /* ---- Add Student modal ---- */
    const addStudentForm = document.getElementById("addStudentForm");
    if (addStudentForm) {
      addStudentForm.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!addStudentForm.checkValidity()) {
          addStudentForm.classList.add("was-validated");
          return;
        }

        const name = document.getElementById("addStudentName").value;
        const matric = document.getElementById("addStudentMatric").value;
        const dept = document.getElementById("addStudentDept").value;
        const email = document.getElementById("addStudentEmail").value;
        const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
        const newId = "STU-" + String(1000 + tbody.querySelectorAll("tr").length + 1);

        const row = document.createElement("tr");
        row.setAttribute("data-department", dept);
        row.setAttribute("data-status", "Active");
        row.innerHTML =
          '<td class="ps-4">' + newId + '</td>' +
          '<td><div class="student-cell"><div class="avatar-initials">' + initials + '</div>' +
          '<div><div class="student-name">' + name + '</div></div></div></td>' +
          '<td>' + matric + '</td>' +
          '<td>' + dept + '</td>' +
          '<td>' + email + '</td>' +
          '<td><span class="status-badge status-active">Active</span></td>' +
          '<td class="pe-4">' +
            '<div class="row-actions">' +
              '<button type="button" class="btn-icon btn-edit" title="Edit"><i class="bi bi-pencil"></i></button>' +
              '<button type="button" class="btn-icon btn-delete" title="Delete"><i class="bi bi-trash"></i></button>' +
            '</div>' +
          '</td>';

        tbody.prepend(row);
        applyFilters();

        addStudentForm.reset();
        addStudentForm.classList.remove("was-validated");
        bootstrap.Modal.getInstance(document.getElementById("addStudentModal")).hide();
      });
    }

    /* ---- Edit Student modal (populate from clicked row) ---- */
    const editStudentForm = document.getElementById("editStudentForm");
    const editModalEl = document.getElementById("editStudentModal");
    let rowBeingEdited = null;

    /* ---- Delete confirmation modal ---- */
    const deleteModalEl = document.getElementById("deleteStudentModal");
    const deleteNameEl = document.getElementById("deleteStudentName");
    const confirmDeleteBtn = document.getElementById("confirmDeleteStudentBtn");
    let rowBeingDeleted = null;

    tbody.addEventListener("click", function (e) {
      const editBtn = e.target.closest(".btn-edit");
      const deleteBtn = e.target.closest(".btn-delete");

      if (editBtn && editModalEl) {
        rowBeingEdited = editBtn.closest("tr");
        const cells = rowBeingEdited.querySelectorAll("td");
        document.getElementById("editStudentId").value = cells[0].textContent.trim();
        document.getElementById("editStudentName").value = rowBeingEdited.querySelector(".student-name").textContent.trim();
        document.getElementById("editStudentMatric").value = cells[2].textContent.trim();
        document.getElementById("editStudentDept").value = rowBeingEdited.getAttribute("data-department");
        document.getElementById("editStudentEmail").value = cells[4].textContent.trim();
        document.getElementById("editStudentStatus").value = rowBeingEdited.getAttribute("data-status");
        new bootstrap.Modal(editModalEl).show();
      }

      if (deleteBtn && deleteModalEl) {
        rowBeingDeleted = deleteBtn.closest("tr");
        if (deleteNameEl) deleteNameEl.textContent = rowBeingDeleted.querySelector(".student-name").textContent.trim();
        new bootstrap.Modal(deleteModalEl).show();
      }
    });

    if (editStudentForm) {
      editStudentForm.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!editStudentForm.checkValidity() || !rowBeingEdited) {
          editStudentForm.classList.add("was-validated");
          return;
        }

        const name = document.getElementById("editStudentName").value;
        const matric = document.getElementById("editStudentMatric").value;
        const dept = document.getElementById("editStudentDept").value;
        const email = document.getElementById("editStudentEmail").value;
        const status = document.getElementById("editStudentStatus").value;
        const cells = rowBeingEdited.querySelectorAll("td");

        rowBeingEdited.querySelector(".student-name").textContent = name;
        cells[2].textContent = matric;
        cells[3].textContent = dept;
        cells[4].textContent = email;
        rowBeingEdited.setAttribute("data-department", dept);
        rowBeingEdited.setAttribute("data-status", status);

        const statusClass = status === "Active" ? "status-active" : status === "Suspended" ? "status-suspended" : "status-inactive";
        cells[5].innerHTML = '<span class="status-badge ' + statusClass + '">' + status + '</span>';

        editStudentForm.classList.remove("was-validated");
        bootstrap.Modal.getInstance(editModalEl).hide();
        applyFilters();
      });
    }

    if (confirmDeleteBtn) {
      confirmDeleteBtn.addEventListener("click", function () {
        if (rowBeingDeleted) {
          rowBeingDeleted.remove();
          rowBeingDeleted = null;
          applyFilters();
        }
        bootstrap.Modal.getInstance(deleteModalEl).hide();
      });
    }
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
