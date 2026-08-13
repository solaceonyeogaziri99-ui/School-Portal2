// ============================================
// STUDENT DASHBOARD — SCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function () {

  // ---- LOADER ----
  const loader = document.getElementById('loader');
  window.addEventListener('load', function () {
    setTimeout(function () { loader.classList.add('loaded'); }, 350);
  });
  setTimeout(function () { if (loader) loader.classList.add('loaded'); }, 1200);

  // ---- FOOTER YEAR ----
  const yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  // ---- USER DATA POPULATION ----
  // Try multiple common localStorage keys that a login/registration flow might use.
  const _userKeys = ['currentUser', 'user', 'registeredUser', 'loggedInUser'];
  let registeredUser = null;
  for (const k of _userKeys) {
    const raw = localStorage.getItem(k);
    if (raw) {
      try { registeredUser = JSON.parse(raw); } catch (e) { registeredUser = { name: raw }; }
      break;
    }
  }

  function _getInitials(name) {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).filter(Boolean).slice(0,2).join('').toUpperCase();
  }

  function populateUser(u) {
    if (!u) return;
    const name = u.name || u.fullName || u.username || 'User';
    const reg = u.regNo || u.studentId || u.id || '';
    const dept = u.department || u.dept || u.course || '';
    const email = u.email || '';
    const phone = u.phone || u.tel || '';
    const faculty = u.faculty || u.school || '';
    const initials = _getInitials(name);

    const sidebarAvatar = document.querySelector('.sidebar-avatar');
    if (sidebarAvatar) sidebarAvatar.textContent = initials;

    const sidebarUserStrong = document.querySelector('.sidebar-user strong');
    if (sidebarUserStrong) sidebarUserStrong.textContent = name;

    const sidebarUserSpan = document.querySelector('.sidebar-user span');
    if (sidebarUserSpan) sidebarUserSpan.textContent = reg;

    const profileAvatarLg = document.querySelector('.profile-avatar-lg');
    if (profileAvatarLg) profileAvatarLg.textContent = initials;

    const profileName = document.querySelector('.profile-card h5');
    if (profileName) profileName.textContent = name;

    const profileDept = document.querySelector('.profile-card .text-muted');
    if (profileDept) profileDept.textContent = dept;

    const metaItems = document.querySelectorAll('.profile-meta-list li');
    if (metaItems && metaItems.length >= 4) {
      if (reg) metaItems[0].textContent = reg;
      if (email) metaItems[1].textContent = email;
      if (phone) metaItems[2].textContent = phone;
      if (faculty) metaItems[3].textContent = faculty;
    }

    const topbarName = document.querySelector('.profile-btn .d-none.d-md-inline');
    if (topbarName) topbarName.textContent = name;

    const welcomeH2 = document.querySelector('.welcome-banner h2');
    if (welcomeH2) welcomeH2.textContent = `Hello, ${name.split(' ')[0]} 👋`;
  }

  populateUser(registeredUser);

  // ---- SIDEBAR TOGGLE (mobile) ----
  const sidebar = document.getElementById('appSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const toggleBtn = document.getElementById('sidebarToggle');
  const closeBtn = document.getElementById('sidebarClose');

  function openSidebar() {
    sidebar.classList.add('show');
    overlay.classList.add('show');
  }
  function closeSidebar() {
    sidebar.classList.remove('show');
    overlay.classList.remove('show');
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      if (window.innerWidth <= 991) {
        sidebar.classList.contains('show') ? closeSidebar() : openSidebar();
      } else {
        document.querySelector('.app-shell').classList.toggle('sidebar-collapsed');
      }
    });
  }
  if (closeBtn) { closeBtn.addEventListener('click', closeSidebar); }
  if (overlay) { overlay.addEventListener('click', closeSidebar); }

  // close sidebar when a link is tapped on mobile
  document.querySelectorAll('.sidebar-link').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 991) { closeSidebar(); }
    });
  });

  // ---- DARK MODE TOGGLE ----
  const darkToggle = document.getElementById('darkModeToggle');
  const darkIcon = darkToggle ? darkToggle.querySelector('i') : null;

  function applyDarkMode(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    if (darkIcon) {
      darkIcon.classList.toggle('bi-moon-stars', !isDark);
      darkIcon.classList.toggle('bi-sun', isDark);
    }
  }

  // Note: no localStorage available in this environment — defaults to light each load.
  applyDarkMode(false);

  if (darkToggle) {
    darkToggle.addEventListener('click', function () {
      const isDark = !document.body.classList.contains('dark-mode');
      applyDarkMode(isDark);
    });
  }

  // ---- SCROLL REVEAL ----
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(function (el) { revealObserver.observe(el); });

});
