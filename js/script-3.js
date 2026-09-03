/* ==========================================================================
   Student Complaint & Profile Management Portal — script.js
   Vanilla JavaScript (ES6). Every feature below is self-contained and
   guards against missing elements, so this single file can be shared
   across every page of the portal without throwing errors.
   ==========================================================================

   TABLE OF CONTENTS
   1.  Helpers
   2.  Loader screen
   3.  Mobile sidebar toggle
   4.  Sidebar collapse (desktop, icon-only)
   5.  Dark mode toggle
   6.  Responsive navbar (public marketing pages)
   7.  Active nav / sidebar link highlighting
   8.  Scroll-triggered reveal animations
   9.  Animated counters
   10. FAQ accordion interaction
   11. Password show / hide toggle
   12. Character counter
   13. File upload preview (drag & drop)
   14. Generic form validation
   15. Notification dropdown
   16. Smooth scrolling
   17. Complaint analytics chart
   18. Submit Complaint page logic
   19. Manage Students page logic
   20. Manage Complaints page logic
   21. Init
   ========================================================================== */

/* ---------------------------------------------------------------------- *
 * 1. Helpers
 * ---------------------------------------------------------------------- */
const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

/**
 * Reads a saved value from localStorage, falling back gracefully if
 * storage is unavailable (e.g. private browsing restrictions).
 */
const readStorage = (key, fallback = null) => {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch {
    return fallback;
  }
};

const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable — fail silently, feature still works this session */
  }
};

/* ---------------------------------------------------------------------- *
 * 2. Loader screen
 * Hides #loader once the page (including images) has fully loaded.
 * ---------------------------------------------------------------------- */
const initLoader = () => {
  const loader = qs("#loader");
  if (!loader) return;

  const hideLoader = () => setTimeout(() => loader.classList.add("loaded"), 300);

  if (document.readyState === "complete") {
    hideLoader();
  } else {
    window.addEventListener("load", hideLoader);
  }
};

/* ---------------------------------------------------------------------- *
 * 3. Mobile sidebar toggle
 * Opens/closes the off-canvas sidebar on small screens.
 * ---------------------------------------------------------------------- */
const initMobileSidebar = () => {
  const sidebar = qs("#appSidebar");
  const overlay = qs("#sidebarOverlay");
  const toggleBtn = qs("#menuToggleBtn");
  if (!sidebar || !toggleBtn) return;

  const openSidebar = () => {
    sidebar.classList.add("show");
    overlay?.classList.add("show");
  };

  const closeSidebar = () => {
    sidebar.classList.remove("show");
    overlay?.classList.remove("show");
  };

  toggleBtn.addEventListener("click", openSidebar);
  overlay?.addEventListener("click", closeSidebar);

  // Auto-close after tapping a nav link on mobile
  qsa(".sidebar-nav .nav-link", sidebar).forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 992) closeSidebar();
    });
  });
};

/* ---------------------------------------------------------------------- *
 * 4. Sidebar collapse (desktop, icon-only)
 * ---------------------------------------------------------------------- */
const initSidebarCollapse = () => {
  const sidebar = qs("#appSidebar");
  const collapseBtn = qs("#sidebarCollapseBtn");
  if (!sidebar || !collapseBtn) return;

  if (readStorage("sidebarCollapsed") === "true") {
    sidebar.classList.add("collapsed");
  }

  collapseBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    writeStorage("sidebarCollapsed", sidebar.classList.contains("collapsed"));
  });
};

/* ---------------------------------------------------------------------- *
 * 5. Dark mode toggle
 * Persists the chosen theme and updates the toggle icon.
 * ---------------------------------------------------------------------- */
const initDarkMode = () => {
  const htmlEl = document.documentElement;
  const toggleBtn = qs("#themeToggleBtn");

  const applyTheme = (theme) => {
    htmlEl.setAttribute("data-theme", theme);
    const icon = toggleBtn?.querySelector("i");
    if (icon) icon.className = theme === "dark" ? "bi bi-sun" : "bi bi-moon-stars";
  };

  applyTheme(readStorage("portalTheme", "light"));

  toggleBtn?.addEventListener("click", () => {
    const nextTheme = htmlEl.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    writeStorage("portalTheme", nextTheme);
  });
};

/* ---------------------------------------------------------------------- *
 * 6. Responsive navbar (public marketing pages: Home, About, Contact...)
 * Closes the mobile Bootstrap navbar collapse after a link is tapped,
 * and adds a "scrolled" class for a shadow once the page scrolls down.
 * ---------------------------------------------------------------------- */
const initResponsiveNavbar = () => {
  const navbar = qs(".site-navbar");
  if (!navbar) return;

  const collapseEl = qs(".navbar-collapse", navbar);

  qsa(".nav-link", collapseEl || navbar).forEach((link) => {
    link.addEventListener("click", () => {
      if (!collapseEl || !collapseEl.classList.contains("show")) return;
      // Defer to Bootstrap's Collapse API if it's loaded
      if (window.bootstrap?.Collapse) {
        window.bootstrap.Collapse.getOrCreateInstance(collapseEl).hide();
      } else {
        collapseEl.classList.remove("show");
      }
    });
  });

  const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
};

/* ---------------------------------------------------------------------- *
 * 7. Active nav / sidebar link highlighting
 * Compares each link's href against the current page filename so the
 * correct item is marked active automatically, no manual class needed.
 * ---------------------------------------------------------------------- */
const initActiveNavLinks = () => {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  qsa(".sidebar-nav .nav-link, .site-navbar .nav-link").forEach((link) => {
    const linkPage = link.getAttribute("href")?.split("/").pop();
    if (!linkPage) return;
    if (linkPage === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
};

/* ---------------------------------------------------------------------- *
 * 8. Scroll-triggered reveal animations
 * Add class="reveal-on-scroll" to any element to fade/slide it in once
 * it enters the viewport.
 * ---------------------------------------------------------------------- */
const initScrollAnimations = () => {
  const targets = qsa(".reveal-on-scroll");
  if (!targets.length) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
};

/* ---------------------------------------------------------------------- *
 * 9. Animated counters
 * Add class="counter" data-target="1250" (optional data-duration in ms,
 * data-prefix, data-suffix) to any element to count up when visible.
 * ---------------------------------------------------------------------- */
const initAnimatedCounters = () => {
  const counters = qsa(".counter[data-target]");
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = Number(el.dataset.target) || 0;
    const duration = Number(el.dataset.duration) || 1400;
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = Math.round(target * eased);
      el.textContent = prefix + value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach(animateCounter);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((el) => observer.observe(el));
};

/* ---------------------------------------------------------------------- *
 * 10. FAQ accordion interaction
 * Works with a simple markup convention:
 * <div class="faq-item">
 *   <button class="faq-question">Question <i class="bi bi-chevron-down"></i></button>
 *   <div class="faq-answer">Answer text</div>
 * </div>
 * Only one answer stays open at a time within the same .faq-list.
 * ---------------------------------------------------------------------- */
const initFaqAccordion = () => {
  const faqLists = qsa(".faq-list");
  if (!faqLists.length) return;

  faqLists.forEach((list) => {
    qsa(".faq-question", list).forEach((question) => {
      question.addEventListener("click", () => {
        const item = question.closest(".faq-item");
        const answer = qs(".faq-answer", item);
        const isOpen = item.classList.contains("open");

        // Close every other item in this list
        qsa(".faq-item", list).forEach((otherItem) => {
          otherItem.classList.remove("open");
          const otherAnswer = qs(".faq-answer", otherItem);
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        });

        if (!isOpen) {
          item.classList.add("open");
          if (answer) answer.style.maxHeight = answer.scrollHeight + "px";
        }
      });
    });
  });
};

/* ---------------------------------------------------------------------- *
 * 11. Password show / hide toggle
 * <div class="password-field">
 *   <input type="password" id="loginPassword" />
 *   <button type="button" data-password-toggle="loginPassword"><i class="bi bi-eye"></i></button>
 * </div>
 * ---------------------------------------------------------------------- */
const initPasswordToggle = () => {
  qsa("[data-password-toggle]").forEach((btn) => {
    const input = document.getElementById(btn.dataset.passwordToggle);
    if (!input) return;

    btn.addEventListener("click", () => {
      const showing = input.type === "text";
      input.type = showing ? "password" : "text";

      const icon = qs("i", btn);
      if (icon) icon.className = showing ? "bi bi-eye" : "bi bi-eye-slash";

      btn.setAttribute("aria-label", showing ? "Show password" : "Hide password");
    });
  });
};

/* ---------------------------------------------------------------------- *
 * 12. Character counter
 * Generic version: add data-char-counter="counterElementId" and
 * maxlength="N" to any input/textarea.
 * <textarea maxlength="800" data-char-counter="descCount"></textarea>
 * <div id="descCount"></div>
 * ---------------------------------------------------------------------- */
const initCharacterCounter = () => {
  qsa("[data-char-counter]").forEach((field) => {
    const counter = document.getElementById(field.dataset.charCounter);
    const max = Number(field.getAttribute("maxlength")) || 0;
    if (!counter || !max) return;

    const update = () => {
      const len = field.value.length;
      counter.textContent = `${len} / ${max}`;
      counter.classList.toggle("text-warning-strong", len >= max);
    };

    field.addEventListener("input", update);
    update();
  });

  // Backwards-compatible hook for the Submit Complaint page's description field
  const description = qs("#complaintDescription");
  const legacyCounter = qs("#descCharCounter");
  if (description && legacyCounter && !description.dataset.charCounter) {
    const max = Number(description.getAttribute("maxlength")) || 800;
    const update = () => {
      const len = description.value.length;
      legacyCounter.textContent = `${len} / ${max}`;
      legacyCounter.classList.toggle("text-warning-strong", len >= max);
    };
    description.addEventListener("input", update);
    update();
  }
};

/* ---------------------------------------------------------------------- *
 * 13. File upload preview (drag & drop)
 * Generic version: wrap a dropzone with data-dropzone, point it at a
 * hidden file input via data-input and a list container via data-list.
 * <div class="dropzone" data-dropzone data-input="fileInput" data-list="fileList">...</div>
 * <input type="file" id="fileInput" class="d-none" multiple />
 * <div id="fileList"></div>
 * ---------------------------------------------------------------------- */
const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const iconForFile = (name) => {
  const ext = name.split(".").pop().toLowerCase();
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "bi-file-earmark-image";
  if (ext === "pdf") return "bi-file-earmark-pdf";
  if (["doc", "docx"].includes(ext)) return "bi-file-earmark-word";
  return "bi-file-earmark";
};

const initFileUploadPreview = () => {
  qsa("[data-dropzone]").forEach((dropzone) => {
    const fileInput = document.getElementById(dropzone.dataset.input);
    const fileList = document.getElementById(dropzone.dataset.list);
    if (!fileInput || !fileList) return;

    let files = [];

    const render = () => {
      fileList.innerHTML = "";
      files.forEach((file, index) => {
        const chip = document.createElement("div");
        chip.className = "file-chip";
        chip.innerHTML = `
          <div class="file-ico"><i class="bi ${iconForFile(file.name)}"></i></div>
          <div class="file-meta">
            <div class="file-name">${file.name}</div>
            <div class="file-size">${formatFileSize(file.size)}</div>
          </div>
          <button type="button" class="file-remove" data-index="${index}" aria-label="Remove file">
            <i class="bi bi-x-lg"></i>
          </button>`;
        fileList.appendChild(chip);
      });

      qsa(".file-remove", fileList).forEach((removeBtn) => {
        removeBtn.addEventListener("click", () => {
          files.splice(Number(removeBtn.dataset.index), 1);
          render();
        });
      });
    };

    const addFiles = (newFiles) => {
      Array.from(newFiles).forEach((file) => {
        const duplicate = files.some((f) => f.name === file.name && f.size === file.size);
        if (!duplicate) files.push(file);
      });
      render();
    };

    dropzone.addEventListener("click", () => fileInput.click());

    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.classList.add("dragover");
    });

    dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));

    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.classList.remove("dragover");
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener("change", () => {
      if (fileInput.files.length) addFiles(fileInput.files);
      fileInput.value = "";
    });
  });
};

/* ---------------------------------------------------------------------- *
 * 14. Generic form validation
 * Applies Bootstrap's validation styling to any <form novalidate
 * class="needs-validation"> on submit, without a page reload.
 * ---------------------------------------------------------------------- */
const initFormValidation = () => {
  qsa("form.needs-validation").forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        qs(":invalid", form)?.focus();
      }
      form.classList.add("was-validated");
    });
  });
};

/* ---------------------------------------------------------------------- *
 * 15. Notification dropdown
 * Toggles a panel open/closed and closes it when clicking outside.
 * <button data-notification-toggle="notifPanel"><i class="bi bi-bell"></i></button>
 * <div id="notifPanel" class="notification-panel">...</div>
 * ---------------------------------------------------------------------- */
const initNotificationDropdown = () => {
  qsa("[data-notification-toggle]").forEach((toggleBtn) => {
    const panel = document.getElementById(toggleBtn.dataset.notificationToggle);
    if (!panel) return;

    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = panel.classList.contains("show");
      qsa(".notification-panel.show").forEach((p) => p.classList.remove("show"));
      panel.classList.toggle("show", !isOpen);
    });

    panel.addEventListener("click", (e) => e.stopPropagation());
  });

  document.addEventListener("click", () => {
    qsa(".notification-panel.show").forEach((p) => p.classList.remove("show"));
  });

  // Mark all as read
  qsa("[data-mark-all-read]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = btn.closest(".notification-panel");
      qsa(".notif-item.unread", panel).forEach((item) => item.classList.remove("unread"));
      qsa(".badge-dot", document).forEach((dot) => (dot.style.display = "none"));
    });
  });
};

/* ---------------------------------------------------------------------- *
 * 16. Smooth scrolling
 * Any link with href="#section-id" scrolls smoothly instead of jumping.
 * ---------------------------------------------------------------------- */
const initSmoothScroll = () => {
  qsa('a[href^="#"]:not([href="#"])').forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = document.getElementById(link.getAttribute("href").slice(1));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
};

/* ---------------------------------------------------------------------- *
 * 17. Complaint analytics chart (Admin Dashboard)
 * ---------------------------------------------------------------------- */
const initAnalyticsChart = () => {
  const canvas = qs("#complaintAnalyticsChart");
  if (!canvas || !window.Chart) return;

  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
  const textColor = isDark ? "#9aa2ad" : "#6c757d";

  new Chart(canvas, {
    type: "bar",
    data: {
      labels: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [
        { label: "Submitted", data: [42, 55, 48, 63, 58, 71], backgroundColor: "#0d6efd", borderRadius: 6, maxBarThickness: 22 },
        { label: "Resolved", data: [30, 44, 40, 52, 50, 60], backgroundColor: "#0dcaf0", borderRadius: 6, maxBarThickness: 22 },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: textColor, font: { size: 11 } } },
        y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 } }, beginAtZero: true },
      },
    },
  });
};

/* ---------------------------------------------------------------------- *
 * 18. Submit Complaint page logic
 * ---------------------------------------------------------------------- */
const initComplaintForm = () => {
  const form = qs("#complaintForm");
  if (!form) return;

  const successAlert = qs("#complaintSuccessAlert");
  const submitBtn = qs("#submitComplaintBtn");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      qs(":invalid", form)?.focus();
      return;
    }

    const originalLabel = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalLabel;

      successAlert?.classList.add("show-alert");
      successAlert?.scrollIntoView({ behavior: "smooth", block: "center" });

      form.reset();
      form.classList.remove("was-validated");
      qs("#evidenceFileList") && (qs("#evidenceFileList").innerHTML = "");
      qs("#descCharCounter") && (qs("#descCharCounter").textContent = "0 / 800");

      setTimeout(() => successAlert?.classList.remove("show-alert"), 6000);
    }, 1200);
  });
};

/* ---------------------------------------------------------------------- *
 * 19. Manage Students page logic
 * ---------------------------------------------------------------------- */
const initStudentsPage = () => {
  const table = qs("#studentsTable");
  if (!table) return;

  const tbody = qs("tbody", table);
  const searchInput = qs("#studentSearchInput");
  const filterForm = qs("#studentFilterForm");
  const filterCount = qs("#studentFilterCount");
  const resultCount = qs("#studentResultCount");
  const pagination = qs("#studentsPagination");

  const getActiveFilters = () => ({
    dept: qsa('input[name="deptFilter"]:checked', filterForm).map((i) => i.value),
    status: qsa('input[name="statusFilter"]:checked', filterForm).map((i) => i.value),
  });

  const applyFilters = () => {
    const term = searchInput?.value.trim().toLowerCase() || "";
    const { dept, status } = getActiveFilters();
    let visible = 0;

    qsa("tr", tbody).forEach((row) => {
      const matchesTerm = !term || row.textContent.toLowerCase().includes(term);
      const matchesDept = !dept.length || dept.includes(row.dataset.department);
      const matchesStatus = !status.length || status.includes(row.dataset.status);
      const show = matchesTerm && matchesDept && matchesStatus;
      row.style.display = show ? "" : "none";
      if (show) visible += 1;
    });

    if (resultCount) resultCount.textContent = `Showing ${visible} of ${qsa("tr", tbody).length} students`;
    if (filterCount) {
      const total = dept.length + status.length;
      filterCount.textContent = total;
      filterCount.style.display = total > 0 ? "inline-flex" : "none";
    }
  };

  searchInput?.addEventListener("input", applyFilters);
  filterForm?.addEventListener("change", applyFilters);
  qs("#clearStudentFilters")?.addEventListener("click", () => {
    qsa("input[type='checkbox']", filterForm).forEach((i) => (i.checked = false));
    applyFilters();
  });
  applyFilters();

  qsa(".page-link[data-page]", pagination).forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const item = link.closest(".page-item");
      if (item.classList.contains("disabled")) return;
      qsa(".page-item", pagination).forEach((li) => li.classList.remove("active"));
      item.classList.add("active");
    });
  });

  const statusBadgeClass = (status) =>
    ({ Active: "status-active", Suspended: "status-suspended" }[status] || "status-inactive");

  // Add student
  const addForm = qs("#addStudentForm");
  addForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!addForm.checkValidity()) {
      addForm.classList.add("was-validated");
      return;
    }

    const name = qs("#addStudentName").value;
    const matric = qs("#addStudentMatric").value;
    const dept = qs("#addStudentDept").value;
    const email = qs("#addStudentEmail").value;
    const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
    const newId = `STU-${1000 + qsa("tr", tbody).length + 1}`;

    const row = document.createElement("tr");
    row.dataset.department = dept;
    row.dataset.status = "Active";
    row.innerHTML = `
      <td class="ps-4">${newId}</td>
      <td><div class="student-cell"><div class="avatar-initials">${initials}</div>
        <div><div class="student-name">${name}</div></div></div></td>
      <td>${matric}</td>
      <td>${dept}</td>
      <td>${email}</td>
      <td><span class="status-badge status-active">Active</span></td>
      <td class="pe-4">
        <div class="row-actions">
          <button type="button" class="btn-icon btn-edit" title="Edit"><i class="bi bi-pencil"></i></button>
          <button type="button" class="btn-icon btn-delete" title="Delete"><i class="bi bi-trash"></i></button>
        </div>
      </td>`;

    tbody.prepend(row);
    applyFilters();
    addForm.reset();
    addForm.classList.remove("was-validated");
    bootstrap.Modal.getInstance(qs("#addStudentModal"))?.hide();
  });

  // Edit / delete (event delegation)
  const editModalEl = qs("#editStudentModal");
  const editForm = qs("#editStudentForm");
  const deleteModalEl = qs("#deleteStudentModal");
  const deleteNameEl = qs("#deleteStudentName");
  let rowBeingEdited = null;
  let rowBeingDeleted = null;

  tbody.addEventListener("click", (e) => {
    const editBtn = e.target.closest(".btn-edit");
    const deleteBtn = e.target.closest(".btn-delete");

    if (editBtn && editModalEl) {
      rowBeingEdited = editBtn.closest("tr");
      const cells = qsa("td", rowBeingEdited);
      qs("#editStudentId").value = cells[0].textContent.trim();
      qs("#editStudentName").value = qs(".student-name", rowBeingEdited).textContent.trim();
      qs("#editStudentMatric").value = cells[2].textContent.trim();
      qs("#editStudentDept").value = rowBeingEdited.dataset.department;
      qs("#editStudentEmail").value = cells[4].textContent.trim();
      qs("#editStudentStatus").value = rowBeingEdited.dataset.status;
      new bootstrap.Modal(editModalEl).show();
    }

    if (deleteBtn && deleteModalEl) {
      rowBeingDeleted = deleteBtn.closest("tr");
      if (deleteNameEl) deleteNameEl.textContent = qs(".student-name", rowBeingDeleted).textContent.trim();
      new bootstrap.Modal(deleteModalEl).show();
    }
  });

  editForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!editForm.checkValidity() || !rowBeingEdited) {
      editForm.classList.add("was-validated");
      return;
    }

    const cells = qsa("td", rowBeingEdited);
    const status = qs("#editStudentStatus").value;

    qs(".student-name", rowBeingEdited).textContent = qs("#editStudentName").value;
    cells[2].textContent = qs("#editStudentMatric").value;
    cells[3].textContent = qs("#editStudentDept").value;
    cells[4].textContent = qs("#editStudentEmail").value;
    rowBeingEdited.dataset.department = qs("#editStudentDept").value;
    rowBeingEdited.dataset.status = status;
    cells[5].innerHTML = `<span class="status-badge ${statusBadgeClass(status)}">${status}</span>`;

    editForm.classList.remove("was-validated");
    bootstrap.Modal.getInstance(editModalEl)?.hide();
    applyFilters();
  });

  qs("#confirmDeleteStudentBtn")?.addEventListener("click", () => {
    rowBeingDeleted?.remove();
    rowBeingDeleted = null;
    applyFilters();
    bootstrap.Modal.getInstance(deleteModalEl)?.hide();
  });
};

/* ---------------------------------------------------------------------- *
 * 20. Manage Complaints page logic
 * ---------------------------------------------------------------------- */
const initComplaintsPage = () => {
  const table = qs("#complaintsTable");
  if (!table) return;

  const tbody = qs("tbody", table);
  const searchInput = qs("#complaintSearchInput");
  const filterForm = qs("#complaintFilterForm");
  const filterCount = qs("#complaintFilterCount");
  const resultCount = qs("#complaintResultCount");

  const statusMeta = {
    Pending: { badgeClass: "status-pending", dot: "#997404" },
    "In Review": { badgeClass: "status-in-progress", dot: "#0d6efd" },
    Resolved: { badgeClass: "status-resolved", dot: "#146c43" },
    Rejected: { badgeClass: "status-rejected", dot: "#b02a37" },
  };

  const setRowStatus = (row, status) => {
    row.dataset.status = status;
    const badge = qs(".status-dropdown-toggle .status-badge", row);
    if (badge) {
      badge.className = `status-badge ${statusMeta[status]?.badgeClass || "status-pending"}`;
      badge.textContent = status;
    }
  };

  const getActiveFilters = () => ({
    cat: qsa('input[name="catFilter"]:checked', filterForm).map((i) => i.value),
    status: qsa('input[name="cStatusFilter"]:checked', filterForm).map((i) => i.value),
  });

  const applyFilters = () => {
    const term = searchInput?.value.trim().toLowerCase() || "";
    const { cat, status } = getActiveFilters();
    let visible = 0;

    qsa("tr", tbody).forEach((row) => {
      const matchesTerm = !term || row.textContent.toLowerCase().includes(term);
      const matchesCat = !cat.length || cat.includes(row.dataset.category);
      const matchesStatus = !status.length || status.includes(row.dataset.status);
      const show = matchesTerm && matchesCat && matchesStatus;
      row.style.display = show ? "" : "none";
      if (show) visible += 1;
    });

    if (resultCount) resultCount.textContent = `Showing ${visible} of ${qsa("tr", tbody).length} complaints`;
    if (filterCount) {
      const total = cat.length + status.length;
      filterCount.textContent = total;
      filterCount.style.display = total > 0 ? "inline-flex" : "none";
    }
  };

  searchInput?.addEventListener("input", applyFilters);
  filterForm?.addEventListener("change", applyFilters);
  qs("#clearComplaintFilters")?.addEventListener("click", () => {
    qsa("input[type='checkbox']", filterForm).forEach((i) => (i.checked = false));
    applyFilters();
  });
  applyFilters();

  // Inline status dropdown + resolve button (event delegation)
  tbody.addEventListener("click", (e) => {
    const statusOption = e.target.closest(".status-option");
    const resolveBtn = e.target.closest(".btn-resolve");

    if (statusOption) {
      setRowStatus(statusOption.closest("tr"), statusOption.dataset.statusValue);
      applyFilters();
    }
    if (resolveBtn) {
      setRowStatus(resolveBtn.closest("tr"), "Resolved");
      applyFilters();
    }
  });

  // Details modal
  const detailsModalEl = qs("#complaintDetailsModal");
  let activeRow = null;

  if (detailsModalEl) {
    tbody.addEventListener("click", (e) => {
      const viewBtn = e.target.closest(".btn-view");
      if (!viewBtn) return;

      const row = viewBtn.closest("tr");
      activeRow = row;
      const cells = qsa("td", row);

      qs("#detailComplaintId").textContent = cells[0].textContent.trim();
      qs("#detailTitle").textContent = row.dataset.title;
      qs("#detailCategory").textContent = row.dataset.category;
      qs("#detailPriority").textContent = row.dataset.priority;
      qs("#detailDate").textContent = cells[4].textContent.trim();
      qs("#detailDepartment").textContent = row.dataset.dept;
      qs("#detailDescription").textContent = row.dataset.description;
      qs("#detailStudentName").textContent = row.dataset.student;
      qs("#detailStudentEmail").textContent = row.dataset.email;
      qs("#detailStudentAvatar").src = row.dataset.avatar;
      qs("#detailStatusSelect").value = row.dataset.status;

      const evidenceList = qs("#detailEvidenceList");
      const evidence = (row.dataset.evidence || "").split(",").filter(Boolean);
      evidenceList.innerHTML = evidence.length
        ? evidence.map((name) => `<div class="evidence-chip"><i class="bi bi-paperclip"></i><span>${name}</span></div>`).join("")
        : '<div class="text-muted" style="font-size:0.85rem;">No evidence attached.</div>';

      new bootstrap.Modal(detailsModalEl).show();
    });

    qs("#saveDetailStatusBtn")?.addEventListener("click", () => {
      if (activeRow) {
        setRowStatus(activeRow, qs("#detailStatusSelect").value);
        applyFilters();
      }
      bootstrap.Modal.getInstance(detailsModalEl)?.hide();
    });
  }

  // Delete confirmation
  const deleteModalEl = qs("#deleteComplaintModal");
  const deleteTitleEl = qs("#deleteComplaintTitle");
  let rowBeingDeleted = null;

  if (deleteModalEl) {
    tbody.addEventListener("click", (e) => {
      const deleteBtn = e.target.closest(".btn-delete");
      if (!deleteBtn) return;
      rowBeingDeleted = deleteBtn.closest("tr");
      if (deleteTitleEl) deleteTitleEl.textContent = rowBeingDeleted.dataset.title;
      new bootstrap.Modal(deleteModalEl).show();
    });

    qs("#confirmDeleteComplaintBtn")?.addEventListener("click", () => {
      rowBeingDeleted?.remove();
      rowBeingDeleted = null;
      applyFilters();
      bootstrap.Modal.getInstance(deleteModalEl)?.hide();
    });
  }
};

/* ---------------------------------------------------------------------- *
 * 21. Init — run every feature once the DOM is ready
 * ---------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initMobileSidebar();
  initSidebarCollapse();
  initDarkMode();
  initResponsiveNavbar();
  initActiveNavLinks();
  initScrollAnimations();
  initAnimatedCounters();
  initFaqAccordion();
  initPasswordToggle();
  initCharacterCounter();
  initFileUploadPreview();
  initFormValidation();
  initNotificationDropdown();
  initSmoothScroll();
  initAnalyticsChart();
  initComplaintForm();
  initStudentsPage();
  initComplaintsPage();
});
