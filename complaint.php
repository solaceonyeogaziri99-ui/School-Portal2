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
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Submit Complaint | Student Complaint & Profile Management Portal</title>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet" />

  <!-- Bootstrap 5 -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <!-- Bootstrap Icons -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />

  <!-- Portal styles -->
   <link rel="stylesheet" href="css/style.css"/>
  <link rel="stylesheet" href="css/Complaint.css" />
  <link rel="stylesheet" href="css/responsive.css" />
</head>
<body>

  !-- LOADER
<div id="loader">
  <div class="loader-inner">
    <span class="loader-bracket">&lt;</span>
    <span class="loader-dot"></span>
    <span class="loader-bracket">/&gt;</span>
  </div>
</div>

  <div class="app-shell">

    <!-- Sidebar overlay for mobile -->
    <div class="sidebar-overlay" id="sidebarOverlay"></div>

    <!-- Sidebar -->
    <aside class="sidebar" id="appSidebar">
      <div class="sidebar-brand">
        <div class="brand-mark">SC</div>
        <div class="brand-text">
          Student Portal
          <small>Complaint & Profile System</small>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section-label">Main</div>
        <a href="dashboard.php" class="nav-link"><i class="bi bi-grid-1x2"></i> Dashboard</a>
        <a href="edit-profile.php" class="nav-link"><i class="bi bi-person-circle"></i> Edit Profile</a>

        <div class="nav-section-label">Complaints</div>
        <a href="complaint.php" class="nav-link active"><i class="bi bi-pencil-square"></i> Submit Complaint</a>
        <a href="complaint-history.html" class="nav-link"><i class="bi bi-clock-history"></i> Complaint History</a>

        <div class="nav-section-label">Support</div>
        <a href="notifications.html" class="nav-link"><i class="bi bi-bell"></i> Notifications</a>
        <a href="faq.html" class="nav-link"><i class="bi bi-question-circle"></i> FAQ</a>
        <a href="contact.html" class="nav-link"><i class="bi bi-envelope"></i> Contact</a>
      </nav>

      <div class="sidebar-foot">
        &copy; 2026 Student Complaint & Profile Management Portal
      </div>
    </aside>

    <!-- Main area -->
    <div class="main-area">

      <!-- Topbar -->
      <header class="topbar">
        <button class="menu-toggle-btn" id="menuToggleBtn" aria-label="Toggle menu">
          <i class="bi bi-list"></i>
        </button>

        <div class="page-title">
          Submit Complaint
          <small>Report an issue and track its resolution</small>
        </div>

        <div class="topbar-actions">
          <button class="icon-btn" aria-label="Notifications">
            <i class="bi bi-bell"></i>
            <span class="badge-dot"></span>
          </button>

          <div class="dropdown">
            <button class="user-chip dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <!-- <img src="https://i.pravatar.cc/64?img=47" alt="Student avatar" /> -->
              <img src="backend/uploads/<?php echo $user["picture"]; ?>" alt="" width="100%" height="100%" object-fit="cover">
              <span>
                <span class="chip-name d-block"><?php echo $user["full_name"]; ?></span>
                <span class="chip-role">Student</span>
              </span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow-sm">
              <li><a class="dropdown-item" href="edit-profile.php"><i class="bi bi-person me-2"></i>My Profile</a></li>
              <li><a class="dropdown-item" href="settings.html"><i class="bi bi-gear me-2"></i>Settings</a></li>
              <li><hr class="dropdown-divider" /></li>
              <li><a class="dropdown-item text-danger" href="backend/logout.php"><i class="bi bi-box-arrow-right me-2"></i>Log Out</a></li>
            </ul>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="content-area">

        <!-- Breadcrumb -->
        <nav aria-label="breadcrumb" class="mb-3">
          <ol class="breadcrumb mb-0" style="font-size: 0.85rem;">
            <li class="breadcrumb-item"><a href="dashboard.php" class="text-decoration-none">Dashboard</a></li>
            <li class="breadcrumb-item active" aria-current="page">Submit Complaint</li>
          </ol>
        </nav>

        <div class="row g-4">
          <!-- Form column -->
          <div class="col-lg-8">
            <div class="card reveal-on-scroll">
              <div class="card-header-clean">
                <h5>New Complaint</h5>
                <p>Fill in the details below. Fields marked <span class="text-danger">*</span> are required.</p>
              </div>

              <div class="card-body px-4 pb-4 pt-2">

                <!-- Success alert -->
                <div class="alert alert-success align-items-center gap-2 mb-4" id="complaintSuccessAlert" role="alert">
                  <i class="bi bi-check-circle-fill fs-5"></i>
                  <div>
                    <strong>Complaint submitted!</strong> Your reference number will appear in Complaint History shortly.
                  </div>
                </div>

                <form id="complaintForm" novalidate>

                  <!-- Complaint Title -->
                  <div class="mb-3">
                    <label for="complaintTitle" class="form-label">Complaint Title <span class="text-danger">*</span></label>
                    <input
                      type="text"
                      class="form-control"
                      id="complaintTitle"
                      placeholder="e.g. Missing marks for CS301 midterm"
                      maxlength="100"
                      required
                    />
                    <div class="invalid-feedback">Please give your complaint a short, clear title.</div>
                  </div>

                  <div class="row g-3">
                    <!-- Category -->
                    <div class="col-md-6">
                      <label for="complaintCategory" class="form-label">Complaint Category <span class="text-danger">*</span></label>
                      <select class="form-select" id="complaintCategory" required>
                        <option value="" selected disabled>Select a category</option>
                        <option>Lecturer Issues</option>
                        <option>Missing Results</option>
                        <option>Classroom Problems</option>
                        <option>Portal Issues</option>
                        <option>Financial Issues</option>
                        <option>Hostel Issues</option>
                        <option>Other</option>
                      </select>
                      <div class="invalid-feedback">Please choose a category.</div>
                    </div>

                    <!-- Department -->
                    <!-- <div class="col-md-6">
                      <label for="complaintDepartment" class="form-label">Department <span class="text-danger">*</span></label>
                      <select class="form-select" id="complaintDepartment" required>
                        <option value="" selected disabled>Select department</option>
                        <option>Computer Science</option>
                        <option>Electrical Engineering</option>
                        <option>Business Administration</option>
                        <option>Mathematics</option>
                        <option>Accounting</option>
                        <option>Student Affairs</option>
                        <option>Hostel Management</option>
                        <option>IT Services</option>
                      </select>
                      <div class="invalid-feedback">Please select the relevant department.</div>
                    </div>
                  </div> -->

                  
                  <!-- ❌❌❌priority level commented for the mean time -->

                  <!-- Priority -->
                  <!-- <div class="mt-3 mb-3">
                    <label class="form-label d-block">Priority Level <span class="text-danger">*</span></label>
                    <div class="priority-group">
                      <div class="priority-pill">
                        <input type="radio" name="priority" id="priorityLow" value="Low" required />
                        <label for="priorityLow"><i class="bi bi-arrow-down-circle"></i> Low</label>
                      </div>
                      <div class="priority-pill">
                        <input type="radio" name="priority" id="priorityMedium" value="Medium" />
                        <label for="priorityMedium"><i class="bi bi-dash-circle"></i> Medium</label>
                      </div>
                      <div class="priority-pill">
                        <input type="radio" name="priority" id="priorityHigh" value="High" />
                        <label for="priorityHigh"><i class="bi bi-exclamation-circle"></i> High</label>
                      </div>
                      <div class="priority-pill">
                        <input type="radio" name="priority" id="priorityUrgent" value="Urgent" />
                        <label for="priorityUrgent"><i class="bi bi-fire"></i> Urgent</label>
                      </div>
                    </div>
                  </div> -->

                  <!-- Description -->
                  <div class="mb-3">
                    <label for="complaintDescription" class="form-label">Complaint Description <span class="text-danger">*</span></label>
                    <textarea
                      class="form-control"
                      id="complaintDescription"
                      rows="5"
                      maxlength="800"
                      placeholder="Describe the issue in detail: what happened, when, and who was involved..."
                      required
                    ></textarea>
                    <div class="invalid-feedback">Please describe your complaint (at least a few words).</div>
                    <div class="char-counter" id="descCharCounter">0 / 800</div>
                  </div>

                  <!-- Evidence upload -->
                  <div class="mb-4">
                    <label class="form-label d-block">Upload Evidence <span class="text-muted fw-normal">(optional)</span></label>
                    <div class="dropzone" id="evidenceDropzone">
                      <div class="dz-icon"><i class="bi bi-cloud-arrow-up"></i></div>
                      <div class="dz-title">Drag & drop files here, or click to browse</div>
                      <div class="dz-sub">PDF, DOC, PNG, JPG — up to 10MB each</div>
                    </div>
                    <input type="file" id="evidenceInput" class="d-none" multiple accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
                    <div class="file-list" id="evidenceFileList"></div>
                  </div>

                  <div class="d-flex flex-wrap gap-2 pt-2 border-top">
                    <button type="submit" class="btn btn-primary mt-3" id="submitComplaintBtn">
                      <i class="bi bi-send me-1"></i> Submit Complaint
                    </button>
                    <button type="reset" class="btn btn-outline-secondary mt-3">
                      <i class="bi bi-arrow-counterclockwise me-1"></i> Reset Form
                    </button>
                  </div>

                </form>
              </div>
            </div>
          </div>

          <!-- Side column: guidance -->
          <div class="col-lg-4">
            <div class="card reveal-on-scroll mb-4">
              <div class="card-body p-4">
                <h6 class="fw-semibold mb-3"><i class="bi bi-lightbulb text-warning me-1"></i> Tips for a faster resolution</h6>
                <ul class="list-unstyled mb-0" style="font-size: 0.87rem;">
                  <li class="d-flex gap-2 mb-3">
                    <i class="bi bi-check2-circle text-primary mt-1"></i>
                    <span>Be specific — include dates, course codes, or reference numbers.</span>
                  </li>
                  <li class="d-flex gap-2 mb-3">
                    <i class="bi bi-check2-circle text-primary mt-1"></i>
                    <span>Attach evidence such as screenshots, receipts, or emails.</span>
                  </li>
                  <li class="d-flex gap-2 mb-3">
                    <i class="bi bi-check2-circle text-primary mt-1"></i>
                    <span>Choose the correct department so it reaches the right office.</span>
                  </li>
                  <li class="d-flex gap-2">
                    <i class="bi bi-check2-circle text-primary mt-1"></i>
                    <span>Track progress anytime from Complaint History.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div class="card reveal-on-scroll">
              <div class="card-body p-4">
                <h6 class="fw-semibold mb-3"><i class="bi bi-graph-up-arrow text-info me-1"></i> Average response time</h6>
                <div class="d-flex align-items-center justify-content-between mb-2">
                  <span class="text-muted" style="font-size: 0.85rem;">Low priority</span>
                  <span class="badge rounded-pill bg-success-subtle text-success-emphasis">5-7 days</span>
                </div>
                <div class="d-flex align-items-center justify-content-between mb-2">
                  <span class="text-muted" style="font-size: 0.85rem;">Medium priority</span>
                  <span class="badge rounded-pill bg-warning-subtle text-warning-emphasis">3-4 days</span>
                </div>
                <div class="d-flex align-items-center justify-content-between mb-2">
                  <span class="text-muted" style="font-size: 0.85rem;">High priority</span>
                  <span class="badge rounded-pill bg-danger-subtle text-danger-emphasis">1-2 days</span>
                </div>
                <div class="d-flex align-items-center justify-content-between">
                  <span class="text-muted" style="font-size: 0.85rem;">Urgent</span>
                  <span class="badge rounded-pill bg-purple text-white" style="background:#6f42c1;">Same day</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="footer-note text-center">
        &copy; 2026 Student Complaint & Profile Management Portal. All rights reserved.
      </footer>
    </div>
  </div>

  <!-- Bootstrap JS -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <!-- Portal script -->
  <script src="js/Complaint.js"></script>
</body>
</html>