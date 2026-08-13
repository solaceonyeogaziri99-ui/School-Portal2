<?php
session_start();
// check if user is logged in

if (!isset($_SESSION["user_id"])) {

  header("Location: login.html");

  exit();

}

require 'backend/database.php';

$user_id = $_SESSION["user_id"];

$stmt = $conn->prepare("SELECT full_name, matric_number, phone, picture, department, gender, dob, email, password FROM registered_students WHERE id= ?");
if (!$stmt){
  die("Prepare failed: " . $conn->error);
}

$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();
$user = $result->fetch_assoc();

?>


<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Edit Profile | Software &amp; Web Development Student Portal</title>

<link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.3/font/bootstrap-icons.min.css">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/dashboard.css">
<link rel="stylesheet" href="css/edit-profile.css">
<link rel="stylesheet" href="css/responsive.css">
</head>
<body class="dash-body">

<!-- LOADER -->
<div id="loader">
  <div class="loader-inner">
    <span class="loader-bracket">&lt;</span>
    <span class="loader-dot"></span>
    <span class="loader-bracket">/&gt;</span>
  </div>
</div>

<div class="sidebar-overlay" id="sidebarOverlay"></div>

<div class="app-shell">

  <!-- SIDEBAR -->
  <aside class="app-sidebar" id="appSidebar">
    <div class="sidebar-brand">
      <a href="./dashboard.php" class="navbar-brand">
        <span class="brand-mark">&lt;SWD<span class="brand-accent">/</span>&gt;</span>
        <span class="brand-text">Student Portal</span>
      </a>
      <button class="sidebar-close d-lg-none" id="sidebarClose"><i class="bi bi-x-lg"></i></button>
    </div>

    <div class="sidebar-user">
      <div class="sidebar-avatar">
      <img src="backend/uploads/<?php echo $user["picture"]; ?>" alt="" width="100%" height="100%" object-fit="cover">
      </div>
      <div>
        <strong><?php echo $user["full_name"]; ?></strong>
        <span><?php echo $user["matric_number"]; ?></span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <a href="dashboard.php" class="sidebar-link">
        <i class="bi bi-grid-1x2-fill"></i> <span>Dashboard</span>
      </a>
      <a href="edit-profile.php" class="sidebar-link active">
        <i class="bi bi-person-vcard"></i> <span>Edit Profile</span>
      </a>
      <a href="complaint.php" class="sidebar-link">
        <i class="bi bi-send-plus"></i> <span>Submit Complaint</span>
      </a>
      <a href="complaint-history.html" class="sidebar-link">
        <i class="bi bi-clock-history"></i> <span>Complaint History</span>
      </a>
      <a href="notifications.html" class="sidebar-link">
        <i class="bi bi-bell"></i> <span>Notifications</span>
        <span class="badge rounded-pill text-bg-primary ms-auto">3</span>
      </a>
      <a href="settings.html" class="sidebar-link">
        <i class="bi bi-gear"></i> <span>Settings</span>
      </a>
    </nav>

    <div class="sidebar-footer">
      <a href="backend/logout.php" class="sidebar-link logout-link">
        <i class="bi bi-box-arrow-right"></i> <span>Logout</span>
      </a>
    </div>
  </aside>

  <!-- MAIN -->
  <div class="app-main">

    <!-- TOPBAR -->
    <header class="app-topbar">
      <button class="sidebar-toggle" id="sidebarToggle" aria-label="Toggle sidebar">
        <i class="bi bi-list"></i>
      </button>

      <div class="topbar-search d-none d-md-flex">
        <i class="bi bi-search"></i>
        <input type="text" placeholder="Search complaints, students...">
      </div>

      <div class="topbar-actions">
        <button class="icon-btn" id="darkModeToggle" aria-label="Toggle dark mode">
          <i class="bi bi-moon-stars"></i>
        </button>

        <div class="dropdown">
          <button class="icon-btn position-relative" data-bs-toggle="dropdown" aria-label="Notifications">
            <i class="bi bi-bell"></i>
            <span class="notif-dot"></span>
          </button>
          <div class="dropdown-menu dropdown-menu-end notif-dropdown">
            <div class="notif-dropdown-header">
              <strong>Notifications</strong>
              <span class="badge text-bg-primary">3 new</span>
            </div>
            <a href="#" class="notif-item">
              <i class="bi bi-check2-circle text-success"></i>
              <div><strong>Complaint #2291 resolved</strong><span>2 hours ago</span></div>
            </a>
            <a href="#" class="notif-item">
              <i class="bi bi-arrow-repeat text-warning"></i>
              <div><strong>Complaint #2287 in review</strong><span>5 hours ago</span></div>
            </a>
            <a href="notifications.html" class="notif-dropdown-footer">View all notifications</a>
          </div>
        </div>

        <div class="dropdown">
          <button class="profile-btn" data-bs-toggle="dropdown">
            <span class="sidebar-avatar sidebar-avatar-sm">
            <img src="backend/uploads/<?php echo $user["picture"]; ?>" alt="" width="100%" height="100%" object-fit="cover">
            </span>
            <span class="d-none d-md-inline"><?php echo $user["full_name"]; ?></span>
            <i class="bi bi-chevron-down small"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" href="edit-profile.html"><i class="bi bi-person me-2"></i>My Profile</a></li>
            <li><a class="dropdown-item" href="settings.html"><i class="bi bi-gear me-2"></i>Settings</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item text-danger" href="backend/logout.php"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
          </ul>
        </div>
      </div>
    </header>

    <!-- PAGE CONTENT -->
    <main class="app-content">

      <div class="page-heading reveal">
        <span class="form-eyebrow">Account</span>
        <h2>Edit Profile</h2>
        <p class="text-muted mb-0">Keep your student information accurate and up to date.</p>
      </div>

      <!-- SUCCESS ALERT -->
      <div class="alert alert-success d-none align-items-center gap-2 mt-3" id="successAlert" role="alert">
        <i class="bi bi-check-circle-fill"></i>
        <span>Your profile has been updated successfully.</span>
      </div>

      <div class="row g-4 mt-1">

        <!-- PROFILE PREVIEW CARD -->
        <div class="col-lg-4 reveal">
          <div class="dash-card text-center photo-card">
            <div class="photo-upload-wrap">
              <div class="photo-preview" id="photoPreview">
                <span>
                <img src="backend/uploads/<?php echo $user["picture"]; ?>" alt="" width="100%" height="100%" object-fit="cover">
                </span>
              </div>
              <label for="photoInput" class="photo-edit-btn" aria-label="Change photo">
                <i class="bi bi-camera-fill"></i>
              </label>
              <input type="file" id="photoInput" accept="image/*" hidden>
            </div>
            <h5 class="mt-3 mb-0"><?php echo $user["full_name"]; ?></h5>
            <span class="text-muted small"><?php echo $user["department"]; ?></span>
            <span class="badge text-bg-success mt-2">Active Student</span>

            <div class="photo-actions mt-3">
              <button type="button" class="btn btn-sm btn-outline-primary" id="uploadBtn">
                <i class="bi bi-upload me-1"></i> Upload new photo
              </button>
              <button type="button" class="btn btn-sm btn-outline-danger" id="removePhotoBtn">
                <i class="bi bi-trash me-1"></i> Remove
              </button>
            </div>
            <small class="text-muted d-block mt-2">JPG or PNG. Max size 2MB.</small>
          </div>

          <div class="dash-card mt-4">
            <h6 class="mb-3"><i class="bi bi-shield-check me-2 text-primary"></i>Account Status</h6>
            <ul class="status-list">
              <li><span>Email verified</span><i class="bi bi-check-circle-fill text-success"></i></li>
              <li><span>Phone verified</span><i class="bi bi-check-circle-fill text-success"></i></li>
              <li><span>ID document</span><i class="bi bi-exclamation-circle-fill text-warning"></i></li>
            </ul>
          </div>
        </div>

        <!-- FORM -->
        <div class="col-lg-8">

          <!-- PERSONAL INFO -->
          <div class="dash-card reveal">
            <h5 class="mb-1">Personal Information</h5>
            <p class="text-muted small mb-4">This information may be visible to department administrators.</p>

            <form id="profileForm" class="row g-3" novalidate>

              <div class="col-md-6">
                <label class="form-label">Full Name</label>
                <div class="input-icon-group">
                  <i class="bi bi-person"></i>
                  <input type="text" class="form-control" id="fullName" value="<?php echo $user["full_name"]; ?>" required>
                </div>
                <div class="invalid-feedback-custom">Please enter your full name.</div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Matric Number</label>
                <div class="input-icon-group">
                  <i class="bi bi-upc-scan"></i>
                  <input type="text" class="form-control" id="matricNumber" value="<?php echo $user["matric_number"]; ?>" disabled>
                </div>
                <small class="text-muted">Matric number cannot be changed.</small>
              </div>

              <div class="col-md-6">
                <label class="form-label">Department</label>
                <div class="input-icon-group">
                  <i class="bi bi-diagram-3"></i>
                  <select class="form-select" id="department" required>
                    <option>Computer Science</option>
                    <option>Software Engineering</option>
                    <option>Web Development</option>
                    <option>Information Technology</option>
                    <option>Cybersecurity</option>
                  </select>
                </div>
                <div class="invalid-feedback-custom">Please select your department.</div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Phone Number</label>
                <div class="input-icon-group">
                  <i class="bi bi-telephone"></i>
                  <input type="tel" class="form-control" id="phoneNumber" value="<?php echo $user["phone"]; ?>" required>
                </div>
                <div class="invalid-feedback-custom">Enter a valid phone number.</div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Email Address</label>
                <div class="input-icon-group">
                  <i class="bi bi-envelope"></i>
                  <input type="email" class="form-control" id="email" value="<?php echo $user["email"]; ?>" required>
                </div>
                <div class="invalid-feedback-custom">Enter a valid email address.</div>
              </div>

              <!-- <div class="col-md-6">
                <label class="form-label">Address</label>
                <div class="input-icon-group">
                  <i class="bi bi-geo-alt"></i>
                  <input type="text" class="form-control" id="address" value="14 Maple Street, Hostel Block C" required>
                </div>
                <div class="invalid-feedback-custom">Please enter your address.</div>
              </div> -->

            </form>
          </div>

          <!-- CHANGE PASSWORD -->
          <div class="dash-card mt-4 reveal">
            <h5 class="mb-1">Change Password</h5>
            <p class="text-muted small mb-4">Leave blank if you don't want to change your password.</p>

            <form id="passwordForm" class="row g-3" novalidate>
              <div class="col-md-4">
                <label class="form-label">Current Password</label>
                <div class="input-icon-group">
                  <i class="bi bi-lock"></i>
                  <input type="password" class="form-control" id="currentPassword" placeholder="••••••••">
                  <button type="button" class="toggle-password" data-target="currentPassword" aria-label="Show password">
                    <i class="bi bi-eye"></i>
                  </button>
                </div>
              </div>
              <div class="col-md-4">
                <label class="form-label">New Password</label>
                <div class="input-icon-group">
                  <i class="bi bi-lock-fill"></i>
                  <input type="password" class="form-control" id="newPassword" placeholder="••••••••">
                  <button type="button" class="toggle-password" data-target="newPassword" aria-label="Show password">
                    <i class="bi bi-eye"></i>
                  </button>
                </div>
                <div class="invalid-feedback-custom">Must be at least 8 characters.</div>
              </div>
              <div class="col-md-4">
                <label class="form-label">Confirm New Password</label>
                <div class="input-icon-group">
                  <i class="bi bi-lock-fill"></i>
                  <input type="password" class="form-control" id="confirmNewPassword" placeholder="••••••••">
                  <button type="button" class="toggle-password" data-target="confirmNewPassword" aria-label="Show password">
                    <i class="bi bi-eye"></i>
                  </button>
                </div>
                <div class="invalid-feedback-custom">Current password is incorrect.</div>
              </div>
            </form>
          </div>

          <!-- ACTIONS -->
          <div class="form-actions reveal">
            <button type="button" class="btn btn-outline-secondary px-4" id="cancelBtn">
              Cancel
            </button>
            <button type="button" class="btn btn-primary px-4 save-btn" id="saveBtn">
              <span class="btn-text"><i class="bi bi-check2 me-1"></i> Save Changes</span>
              <span class="btn-loader d-none">
                <span class="spinner-border spinner-border-sm" role="status"></span> Saving...
              </span>
            </button>
          </div>

        </div>
      </div>

      <footer class="app-footer">
        <small>&copy; <span id="year"></span> Software &amp; Web Development Student Portal</small>
      </footer>

    </main>
  </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/js/bootstrap.bundle.min.js"></script>
<script src="js/dashboard.js"></script>
<script src="js/edit-profile.js"></script>
</body>
</html>
