// ============================================
// EDIT PROFILE — SCRIPT
// (Frontend only — simulated save, no backend)
// ============================================
document.addEventListener('DOMContentLoaded', function () {

  // ---- FOOTER YEAR ----
  const yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  // ---- PHOTO UPLOAD / PREVIEW ----
  const photoInput = document.getElementById('photoInput');
  const photoPreview = document.getElementById('photoPreview');
  const uploadBtn = document.getElementById('uploadBtn');
  const removePhotoBtn = document.getElementById('removePhotoBtn');
  const defaultInitials = photoPreview.innerHTML;

  if (uploadBtn) {
    uploadBtn.addEventListener('click', function () { photoInput.click(); });
  }
  photoPreview.querySelector('.photo-edit-btn') && photoPreview.parentElement
    .querySelector('.photo-edit-btn').addEventListener('click', function (e) {
      // label[for] already triggers the input; nothing extra needed
    });

  if (photoInput) {
    photoInput.addEventListener('change', function () {
      const file = photoInput.files && photoInput.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert('Image must be smaller than 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        photoPreview.innerHTML = '<img src="' + e.target.result + '" alt="Profile photo">';
      };
      reader.readAsDataURL(file);
    });
  }

  if (removePhotoBtn) {
    removePhotoBtn.addEventListener('click', function () {
      photoPreview.innerHTML = defaultInitials;
      photoInput.value = '';
    });
  }

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

  // ---- VALIDATION ----
  const profileFields = [
    { id: 'fullName', validate: v => v.trim().length >= 3 },
    { id: 'department', validate: v => v !== '' },
    { id: 'phoneNumber', validate: v => /^[\d+\s()-]{7,}$/.test(v.trim()) },
    { id: 'email', validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) }
  ];

  function validateField(field) {
    const input = document.getElementById(field.id);
    const wrapper = input.closest('.col-md-6, .col-md-4');
    const isValid = field.validate(input.value);
    input.classList.remove('is-valid', 'is-invalid');
    wrapper.classList.remove('invalid');
    if (isValid) {
      input.classList.add('is-valid');
    } else {
      input.classList.add('is-invalid');
      wrapper.classList.add('invalid');
    }
    return isValid;
  }

  profileFields.forEach(function (field) {
    const input = document.getElementById(field.id);
    input.addEventListener('blur', function () { validateField(field); });
    input.addEventListener('input', function () {
      if (input.classList.contains('is-invalid') || input.classList.contains('is-valid')) validateField(field);
    });
  });

  // password section is optional — only validate if user starts typing
  const newPasswordInput = document.getElementById('newPassword');
  const confirmNewPasswordInput = document.getElementById('confirmNewPassword');

  function validatePasswordSection() {
    let valid = true;
    const touched = newPasswordInput.value !== '' || confirmNewPasswordInput.value !== '';
    if (!touched) {
      [newPasswordInput, confirmNewPasswordInput].forEach(function (el) {
        el.classList.remove('is-valid', 'is-invalid');
        el.closest('.col-md-4').classList.remove('invalid');
      });
      return true;
    }
    const newValid = newPasswordInput.value.length >= 8;
    const confirmValid = confirmNewPasswordInput.value === newPasswordInput.value && confirmNewPasswordInput.value.length >= 8;

    toggleState(newPasswordInput, newValid);
    toggleState(confirmNewPasswordInput, confirmValid);

    if (!newValid || !confirmValid) valid = false;
    return valid;
  }

  function toggleState(input, isValid) {
    const wrapper = input.closest('.col-md-4');
    input.classList.remove('is-valid', 'is-invalid');
    wrapper.classList.remove('invalid');
    if (isValid) {
      input.classList.add('is-valid');
    } else {
      input.classList.add('is-invalid');
      wrapper.classList.add('invalid');
    }
  }

  [newPasswordInput, confirmNewPasswordInput].forEach(function (input) {
    input.addEventListener('blur', validatePasswordSection);
    input.addEventListener('input', function () {
      if (input.classList.contains('is-invalid') || input.classList.contains('is-valid')) validatePasswordSection();
    });
  });

  // ---- SAVE BUTTON ----
  const saveBtn = document.getElementById('saveBtn');
  const successAlert = document.getElementById('successAlert');

  saveBtn.addEventListener('click', function () {
    let allValid = true;
    profileFields.forEach(function (field) {
      if (!validateField(field)) allValid = false;
    });
    if (!validatePasswordSection()) allValid = false;

    if (!allValid) {
      const firstInvalid = document.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    updateProfile(); // send data to PHP
  });

  // ---- CANCEL BUTTON ----
  const cancelBtn = document.getElementById('cancelBtn');
  const profileForm = document.getElementById('profileForm');
  const passwordForm = document.getElementById('passwordForm');

  cancelBtn.addEventListener('click', function () {
    profileForm.reset();
    passwordForm.reset();
    document.querySelectorAll('.is-valid, .is-invalid').forEach(function (el) {
      el.classList.remove('is-valid', 'is-invalid');
    });
    successAlert.classList.add('d-none');
    successAlert.classList.remove('d-flex');
  });

});


function updateProfile() {

  const saveBtn = document.getElementById("saveBtn");
  const btnText = saveBtn.querySelector(".btn-text");
  const btnLoader = saveBtn.querySelector(".btn-loader");
  const successAlert = document.getElementById("successAlert");

  // show loader
  btnText.classList.add("d-none");
  btnLoader.classList.remove("d-none");
  saveBtn.disabled = true;

  const formData = new FormData();

  formData.append("fullName", document.getElementById("fullName").value);
  formData.append("department", document.getElementById("department").value);
  formData.append("phone", document.getElementById("phoneNumber").value);
  formData.append("email", document.getElementById("email").value);
  formData.append("currentPassword", document.getElementById("currentPassword").value);
  formData.append("newPassword", document.getElementById("newPassword").value);
  formData.append("confirmNewPassword", document.getElementById("confirmNewPassword").value);

  const photoInput = document.getElementById("photoInput");

  if (photoInput.files[0]) {
      formData.append("profilePicture", photoInput.files[0]);
  }


  console.log(document.getElementById("currentPassword").value);
console.log(document.getElementById("newPassword").value);
console.log(document.getElementById("confirmNewPassword").value);

  fetch("backend/update_profile.php", {
      method: "POST",
      body: formData
  })
  .then(response => response.text())
  .then(data => {

      console.log(data);

      if (data.trim() === "success") {

          // wait 1.6 seconds before showing success
          setTimeout(() => {

              btnLoader.classList.add("d-none");
              btnText.classList.remove("d-none");
              saveBtn.disabled = false;

              successAlert.classList.remove("d-none");
              successAlert.classList.add("d-flex");

              setTimeout(() => {
                  successAlert.classList.add("d-none");
                  successAlert.classList.remove("d-flex");
              }, 3500);

          }, 1600);

      } else {

        btnLoader.classList.add("d-none");
        btnText.classList.remove("d-none");
        saveBtn.disabled = false;
    
        if (data.trim() === "Current password is incorrect") {
    
            document.getElementById("currentPassword")
                    .classList.add("is-invalid");
    
        } else if (data.trim() === "New passwords do not match") {
    
            document.getElementById("newPassword")
                    .classList.add("is-invalid");
    
            document.getElementById("confirmNewPassword")
                    .classList.add("is-invalid");
    
        } else {
    
            alert(data);
    
        }
    }

  })
  .catch(error => {

      btnLoader.classList.add("d-none");
      btnText.classList.remove("d-none");
      saveBtn.disabled = false;

      console.error(error);
  });
}