// ============================================
// STUDENT LOGIN — SCRIPT
// (Frontend only — simulated authentication)
// ============================================

document.addEventListener('DOMContentLoaded', function () {

  // ---- LOADER ----
  const loader = document.getElementById('loader');
  window.addEventListener('load', function () {
    setTimeout(function () { loader.classList.add('loaded'); }, 350);
  });
  setTimeout(function () { if (loader) loader.classList.add('loaded'); }, 1200);

  // ---- SHOW / HIDE PASSWORD ----
  document.querySelectorAll('.toggle-password').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const icon = btn.querySelector('i');
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('bi-eye', 'bi-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.replace('bi-eye-slash', 'bi-eye');
      }
    });
  });

  // ---- FORM VALIDATION ----
  const form = document.getElementById('loginForm');
  const submitBtn = document.getElementById('submitBtn');
  const errorAlert = document.getElementById('errorAlert');
  const successAlert = document.getElementById('successAlert');

  const identifierInput = document.getElementById('identifier');
  const passwordInput = document.getElementById('password');

  function validateIdentifier() {
    const value = identifierInput.value.trim();
    const isValid = value.length >= 3;
    toggleFieldState(identifierInput, isValid);
    return isValid;
  }

  function validatePassword() {
    const value = passwordInput.value;
    const isValid = value.length >= 6;
    toggleFieldState(passwordInput, isValid);
    return isValid;
  }

  function toggleFieldState(input, isValid) {
    const wrapper = input.closest('.mb-3, .mb-2');
    input.classList.remove('is-valid', 'is-invalid');
    wrapper.classList.remove('invalid');
    if (isValid) {
      input.classList.add('is-valid');
    } else {
      input.classList.add('is-invalid');
      wrapper.classList.add('invalid');
    }
  }

  identifierInput.addEventListener('blur', validateIdentifier);
  passwordInput.addEventListener('blur', validatePassword);
  identifierInput.addEventListener('input', function () {
    if (identifierInput.classList.contains('is-invalid') || identifierInput.classList.contains('is-valid')) validateIdentifier();
  });
  passwordInput.addEventListener('input', function () {
    if (passwordInput.classList.contains('is-invalid') || passwordInput.classList.contains('is-valid')) validatePassword();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    e.stopPropagation();

    errorAlert.classList.add('d-none');
    errorAlert.classList.remove('d-flex');
    successAlert.classList.add('d-none');
    successAlert.classList.remove('d-flex');

    const validIdentifier = validateIdentifier();
    const validPassword = validatePassword();

    if (!validIdentifier || !validPassword) {
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    processLogin();//this is it
  });

  // ---- SOCIAL LOGIN BUTTONS (UI only) ----
  document.querySelectorAll('.social-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      btn.classList.add('disabled');
      const original = btn.innerHTML;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
      setTimeout(function () {
        btn.innerHTML = original;
        btn.classList.remove('disabled');
      }, 1200);
    });
  });

});


// sending data to backend

let submitBtn = document.getElementById("submitBtn");

function processLogin() {

  const formData = new FormData();

  formData.append('matric', document.getElementById('identifier').value);
  formData.append('password', document.getElementById('password').value);

  fetch("backend/login.php", {
    method: "POST",
    body: formData
  })
    .then(response => response.text())
    .then(data => {

      if (data.trim() === "admin") {
        window.location.href = "admin.php";
    
      } else if (data.trim() === "user") {
        window.location.href = "dashboard.php";
    
      } else {
    
        document.getElementById("errorAlert").innerText = data;
    
        document.getElementById("errorAlert").classList.remove("d-none");
    
        document.getElementById("errorAlert").classList.add("d-flex");
    
      }
    
    });
}