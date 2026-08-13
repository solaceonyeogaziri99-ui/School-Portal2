<?php
session_start();


include "backend/database.php";

// check if user is logged in

if (!isset($_SESSION["user_id"])) {

  header("Location: login.html");

  exit();

}

$user_id = $_SESSION["user_id"];

$query = "SELECT * FROM registered_students WHERE id = ?";
$stmt = $conn->prepare($query);

if(!$stmt){
    echo $conn->error;
    exit();
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
<title>Dashboard | Software &amp; Web Development Student Portal</title>

<link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.3/font/bootstrap-icons.min.css">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

<link rel="stylesheet" href="./css/style.css">
<link rel="stylesheet" href="./css/dashboard.css">
<link rel="stylesheet" href="./css/responsive.css">
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

<!-- SIDEBAR OVERLAY (mobile) -->
<div class="sidebar-overlay" id="sidebarOverlay"></div>

<div class="app-shell">

  <!-- SIDEBAR -->
  <aside class="app-sidebar" id="appSidebar">
    <div class="sidebar-brand">
      <a href="dashboard.html" class="navbar-brand">
        <span class="brand-mark">&lt;SWD<span class="brand-accent">/</span>&gt;</span>
        <span class="brand-text">Student Portal</span>
      </a>
      <button class="sidebar-close d-lg-none" id="sidebarClose"><i class="bi bi-x-lg"></i></button>
    </div>

    <div class="sidebar-user">
      <div class="sidebar-avatar">
         <!-- profile picture -->
         <img src="backend/uploads/<?php echo $user["picture"]; ?>" alt="" width="100%" height="100%" object-fit="cover">
      </div>
      <div>
        <strong><?php echo $user["full_name"]; ?></strong>
        <span><?php echo $user["matric_number"]; ?></span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <a href="./dashboard.php" class="sidebar-link active">
        <i class="bi bi-grid-1x2-fill"></i> <span>Dashboard</span>
      </a>
      <a href="edit-profile.php" class="sidebar-link">
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

  <!-- MAIN CONTENT -->
  <div class="app-main">

    <!-- TOP NAVBAR -->
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
            <a href="#" class="notif-item">
              <i class="bi bi-person-check text-primary"></i>
              <div><strong>Profile updated successfully</strong><span>1 day ago</span></div>
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

      <!-- WELCOME BANNER -->
      <div class="welcome-banner reveal">
        <div>
          <span class="form-eyebrow">Welcome back</span>
          <h2>Hello, <?php echo $user["full_name"]; ?> 👋</h2>
          <p>You have <strong>2 complaints</strong> currently in progress. Here's what's happening today.</p>
        </div>
        <a href="submit-complaint.html" class="btn btn-light btn-lg">
          <i class="bi bi-plus-lg me-1"></i> New Complaint
        </a>
      </div>

      <div class="row g-4 mt-1">

        <!-- PROFILE CARD -->
        <div class="col-lg-4 reveal">
          <div class="dash-card profile-card h-100">
            <div class="profile-card-top">
              <div class="profile-avatar-lg">
                <!-- profile picture -->
                 <img src="backend/uploads/<?php echo $user["picture"]; ?>" alt="" width="100%" height="100%" object-fit="cover">
              </div>
              <h5 class="mt-3 mb-0"><?php echo $user["full_name"]; ?></h5>
              <span class="text-muted small">Computer Science</span>
              <span class="badge text-bg-success mt-2">Active Student</span>
            </div>
            <ul class="profile-meta-list">
              <li><i class="bi bi-upc-scan"></i><?php echo $user["matric_number"]; ?></li>
              <li><i class="bi bi-envelope"></i> <?php echo $user["email"]; ?></li>
              <li><i class="bi bi-telephone"></i><?php echo $user["phone"]; ?></li>
              <li><i class="bi bi-bank"></i><?php echo $user["department"]; ?></li>
            </ul>
            <a href="edit-profile.html" class="btn btn-outline-primary w-100 mt-2">
              <i class="bi bi-pencil-square me-1"></i> Edit Profile
            </a>
          </div>
        </div>

        <!-- STATS + CHART -->
        <div class="col-lg-8">
          <div class="row g-4">
            <div class="col-sm-6 col-xl-3 reveal">
              <div class="dash-card stat-card">
                <div class="stat-icon stat-icon-primary"><i class="bi bi-folder2-open"></i></div>
                <h3>14</h3>
                <p>Total Complaints</p>
              </div>
            </div>
            <div class="col-sm-6 col-xl-3 reveal">
              <div class="dash-card stat-card">
                <div class="stat-icon stat-icon-warning"><i class="bi bi-hourglass-split"></i></div>
                <h3>3</h3>
                <p>Pending</p>
              </div>
            </div>
            <div class="col-sm-6 col-xl-3 reveal">
              <div class="dash-card stat-card">
                <div class="stat-icon stat-icon-info"><i class="bi bi-arrow-repeat"></i></div>
                <h3>2</h3>
                <p>In Review</p>
              </div>
            </div>
            <div class="col-sm-6 col-xl-3 reveal">
              <div class="dash-card stat-card">
                <div class="stat-icon stat-icon-success"><i class="bi bi-check2-circle"></i></div>
                <h3>9</h3>
                <p>Resolved</p>
              </div>
            </div>

            <!-- CHART PLACEHOLDER -->
            <div class="col-12 reveal">
              <div class="dash-card chart-card">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h5 class="mb-0">Complaint Status Overview</h5>
                  <select class="form-select form-select-sm w-auto">
                    <option>Last 6 months</option>
                    <option>This year</option>
                  </select>
                </div>
                <div class="chart-placeholder">
                  <div class="chart-bars">
                    <div class="chart-bar" style="--h:40%"><span></span></div>
                    <div class="chart-bar" style="--h:65%"><span></span></div>
                    <div class="chart-bar" style="--h:30%"><span></span></div>
                    <div class="chart-bar" style="--h:80%"><span></span></div>
                    <div class="chart-bar" style="--h:55%"><span></span></div>
                    <div class="chart-bar" style="--h:90%"><span></span></div>
                  </div>
                  <div class="chart-x-labels">
                    <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                  </div>
                </div>
                <div class="chart-legend">
                  <span><i class="legend-dot dot-primary"></i> Submitted</span>
                  <span><i class="legend-dot dot-success"></i> Resolved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4 mt-1">

        <!-- RECENT COMPLAINTS TABLE -->
        <div class="col-lg-8 reveal">
          <div class="dash-card">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="mb-0">Recent Complaints</h5>
              <a href="complaint-history.html" class="small fw-semibold link-primary">View all</a>
            </div>
            <div class="table-responsive">
              <table class="table dash-table align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Subject</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="fw-semibold">#2291</td>
                    <td>Lab PC won't boot</td>
                    <td>IT Services</td>
                    <td>Jun 28, 2026</td>
                    <td><span class="badge-pill badge-resolved">Resolved</span></td>
                    <td><a href="complaint-history.html" class="action-link"><i class="bi bi-eye"></i></a></td>
                  </tr>
                  <tr>
                    <td class="fw-semibold">#2287</td>
                    <td>Incorrect grade on transcript</td>
                    <td>Academics</td>
                    <td>Jun 25, 2026</td>
                    <td><span class="badge-pill badge-progress">In Review</span></td>
                    <td><a href="complaint-history.html" class="action-link"><i class="bi bi-eye"></i></a></td>
                  </tr>
                  <tr>
                    <td class="fw-semibold">#2279</td>
                    <td>Hostel water supply issue</td>
                    <td>Facilities</td>
                    <td>Jun 20, 2026</td>
                    <td><span class="badge-pill badge-open">Open</span></td>
                    <td><a href="complaint-history.html" class="action-link"><i class="bi bi-eye"></i></a></td>
                  </tr>
                  <tr>
                    <td class="fw-semibold">#2261</td>
                    <td>Library fine dispute</td>
                    <td>Library</td>
                    <td>Jun 12, 2026</td>
                    <td><span class="badge-pill badge-resolved">Resolved</span></td>
                    <td><a href="complaint-history.html" class="action-link"><i class="bi bi-eye"></i></a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- QUICK ACTIONS -->
          <div class="dash-card mt-4">
            <h5 class="mb-3">Quick Actions</h5>
            <div class="quick-actions-grid">
              <a href="submit-complaint.html" class="quick-action">
                <i class="bi bi-send-plus"></i> Submit Complaint
              </a>
              <a href="edit-profile.html" class="quick-action">
                <i class="bi bi-person-vcard"></i> Update Profile
              </a>
              <a href="complaint-history.html" class="quick-action">
                <i class="bi bi-clock-history"></i> View History
              </a>
              <a href="settings.html" class="quick-action">
                <i class="bi bi-gear"></i> Settings
              </a>
            </div>
          </div>
        </div>

        <!-- NOTIFICATIONS + TIMELINE -->
        <div class="col-lg-4 reveal">
          <div class="dash-card mb-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="mb-0">Notifications</h5>
              <a href="notifications.html" class="small fw-semibold link-primary">View all</a>
            </div>
            <div class="panel-notif-list">
              <div class="panel-notif-item">
                <i class="bi bi-check2-circle text-success"></i>
                <div><strong>Complaint #2291 resolved</strong><span>2 hours ago</span></div>
              </div>
              <div class="panel-notif-item">
                <i class="bi bi-arrow-repeat text-warning"></i>
                <div><strong>Complaint #2287 in review</strong><span>5 hours ago</span></div>
              </div>
              <div class="panel-notif-item">
                <i class="bi bi-person-check text-primary"></i>
                <div><strong>Profile updated successfully</strong><span>1 day ago</span></div>
              </div>
              <div class="panel-notif-item">
                <i class="bi bi-megaphone text-info"></i>
                <div><strong>Scheduled maintenance Jul 2</strong><span>2 days ago</span></div>
              </div>
            </div>
          </div>

          <div class="dash-card">
            <h5 class="mb-3">Activity Timeline</h5>
            <div class="timeline">
              <div class="timeline-item">
                <span class="timeline-dot dot-success"></span>
                <div>
                  <strong>Complaint #2291 marked resolved</strong>
                  <span>Today, 10:42 AM</span>
                </div>
              </div>
              <div class="timeline-item">
                <span class="timeline-dot dot-warning"></span>
                <div>
                  <strong>Complaint #2287 moved to review</strong>
                  <span>Today, 6:15 AM</span>
                </div>
              </div>
              <div class="timeline-item">
                <span class="timeline-dot dot-primary"></span>
                <div>
                  <strong>New complaint #2279 submitted</strong>
                  <span>Jun 20, 2026</span>
                </div>
              </div>
              <div class="timeline-item">
                <span class="timeline-dot dot-muted"></span>
                <div>
                  <strong>Profile details updated</strong>
                  <span>Jun 18, 2026</span>
                </div>
              </div>
            </div>
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
<script src="/js/script-3.js"></script>
</body>
</html>
