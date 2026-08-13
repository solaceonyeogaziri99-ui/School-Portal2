/* ==========================================================================
   Student Complaint & Profile Management Portal — script.js
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {

    // ---- LOADER ----
    const loader = document.getElementById('loader');
    window.addEventListener('load', function () {
        setTimeout(function () { loader.classList.add('loaded'); }, 350);
    });
    setTimeout(function () { if (loader) loader.classList.add('loaded'); }, 1200);

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
            // fileInput.value = "";
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

function processComplaint() {

    const formData = new FormData();

    formData.append('complaintTitle', document.getElementById('complaintTitle').value);
    formData.append('complaintCategory', document.getElementById('complaintCategory').value);
    formData.append('complaintDescription', document.getElementById('complaintDescription').value);

    const photoInput = document.getElementById("evidenceInput");

    for (let i = 0; i < photoInput.files.length; i++) {
        formData.append("evidencePicture[]", photoInput.files[i]);
    }

    // console.log(photoInput.files.length);

    fetch("backend/submit_complaint.php", {
        method: "POST",
        body: formData
    })
        .then(response => response.text())
        .then(data => {

            const alertBox = document.getElementById("complaintSuccessAlert");
    
            if (data.startsWith("error:")) {
    
                alertBox.classList.remove("alert-success");
                alertBox.classList.add("alert-danger");
    
                alertBox.innerHTML = `
                    <i class="bi bi-exclamation-circle-fill fs-5"></i>
                    <div>
                        <strong>Error!</strong> ${data.replace("error:", "")}
                    </div>
                `;
    
            } else {
    
                alertBox.classList.remove("alert-danger");
                alertBox.classList.add("alert-success");
    
                alertBox.innerHTML = `
                    <i class="bi bi-check-circle-fill fs-5"></i>
                    <div>
                        <strong>Complaint submitted!</strong>
                        Your reference number will appear in Complaint History shortly.
                    </div>
                `;
            }
    
            alertBox.classList.add("show-alert");
        });
    
    } // <-- processComplaint ends here
    
    let submitBtn = document.getElementById('submitComplaintBtn');
    
    submitBtn.addEventListener('click', function () {
        processComplaint();
    });