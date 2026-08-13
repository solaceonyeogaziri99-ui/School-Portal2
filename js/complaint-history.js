// ============================================
// COMPLAINT HISTORY — SCRIPT
// Frontend only — all data is in-page
// ============================================

document.addEventListener('DOMContentLoaded', function () {

  // ---- FOOTER YEAR ----
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  // ============================================
  // DATA — simulated complaint records
  // ============================================
  var allComplaints = [
    {
      id: '#2301', title: 'Broken projector in Lecture Hall B', category: 'IT Services',
      dept: 'IT Services', date: '2026-07-10', priority: 'High',
      status: 'pending',
      description: 'The projector in Lecture Hall B (Room 204) has been non-functional since Monday. This is disrupting scheduled lectures for CSC301. The lamp appears to be out.',
      attachments: ['photo_projector.jpg'],
      timeline: [
        { icon: 'bi-send-check', color: 'primary', text: 'Complaint submitted', time: 'Jul 10, 2026 — 09:15 AM' }
      ]
    },
    {
      id: '#2299', title: 'Financial aid not reflected on portal', category: 'Finance',
      dept: 'Student Finance', date: '2026-07-08', priority: 'High',
      status: 'pending',
      description: 'My financial aid award for 2025/2026 academic year has been approved by the financial aid office but is not yet showing on my student portal account, making it impossible to register for next semester.',
      attachments: [],
      timeline: [
        { icon: 'bi-send-check', color: 'primary', text: 'Complaint submitted', time: 'Jul 8, 2026 — 02:30 PM' }
      ]
    },
    {
      id: '#2295', title: 'Network outage in Computer Lab 3', category: 'IT Services',
      dept: 'IT Services', date: '2026-07-05', priority: 'Medium',
      status: 'pending',
      description: 'All workstations in Computer Lab 3 (Block A, Ground Floor) have had no internet access since last Thursday. This is blocking practical sessions for WEB201 and CSC411.',
      attachments: ['screenshot_network_error.png'],
      timeline: [
        { icon: 'bi-send-check', color: 'primary', text: 'Complaint submitted', time: 'Jul 5, 2026 — 11:00 AM' }
      ]
    },
    {
      id: '#2291', title: 'Lab PC won\'t boot in Room C214', category: 'IT Services',
      dept: 'IT Services', date: '2026-06-28', priority: 'High',
      status: 'resolved',
      description: 'Workstation 07 in Room C214 fails to POST. The monitor shows no signal and the machine beeps three times on startup. Affects my scheduled lab sessions.',
      attachments: ['beep_recording.mp4', 'workstation_photo.jpg'],
      timeline: [
        { icon: 'bi-send-check', color: 'primary',  text: 'Complaint submitted',           time: 'Jun 28, 2026 — 08:40 AM' },
        { icon: 'bi-person-lines-fill', color: 'info',    text: 'Assigned to IT technician (M. Okonkwo)', time: 'Jun 28, 2026 — 10:05 AM' },
        { icon: 'bi-arrow-repeat', color: 'warning', text: 'Technician on-site — diagnosis started', time: 'Jun 29, 2026 — 09:20 AM' },
        { icon: 'bi-check2-circle', color: 'success', text: 'Resolved — RAM replaced, machine operational', time: 'Jun 29, 2026 — 12:45 PM' }
      ]
    },
    {
      id: '#2287', title: 'Incorrect grade on CSC301 transcript', category: 'Academics',
      dept: 'Academic Affairs', date: '2026-06-25', priority: 'Urgent',
      status: 'in-review',
      description: 'My CSC301 grade shows a C+ on the transcript but I scored 78/100 which should be a B+. I have attached my marked exam paper and the grade sheet for reference.',
      attachments: ['marked_exam_csc301.pdf', 'grade_sheet.pdf'],
      timeline: [
        { icon: 'bi-send-check', color: 'primary',  text: 'Complaint submitted',           time: 'Jun 25, 2026 — 03:15 PM' },
        { icon: 'bi-person-lines-fill', color: 'info',    text: 'Assigned to Exams Office',      time: 'Jun 26, 2026 — 09:00 AM' },
        { icon: 'bi-arrow-repeat', color: 'warning', text: 'Marks script requested from examiner', time: 'Jun 27, 2026 — 11:30 AM' }
      ]
    },
    {
      id: '#2283', title: 'Hostel hot water system failure', category: 'Housing',
      dept: 'Student Housing', date: '2026-06-22', priority: 'High',
      status: 'in-review',
      description: 'Block C hostel has had no hot water for 6 days. This affects approximately 80 residents. We have already reported this to the warden but no action has been taken.',
      attachments: [],
      timeline: [
        { icon: 'bi-send-check', color: 'primary',  text: 'Complaint submitted',       time: 'Jun 22, 2026 — 07:10 AM' },
        { icon: 'bi-person-lines-fill', color: 'info',    text: 'Assigned to Facilities team', time: 'Jun 22, 2026 — 09:00 AM' },
        { icon: 'bi-arrow-repeat', color: 'warning', text: 'Plumber scheduled for assessment', time: 'Jun 23, 2026 — 02:00 PM' }
      ]
    },
    {
      id: '#2279', title: 'Hostel water supply cut — Block C', category: 'Housing',
      dept: 'Student Housing', date: '2026-06-20', priority: 'Urgent',
      status: 'pending',
      description: 'Complete water supply failure in Block C Hostel since 18:00 yesterday. All taps are dry. This is a hygiene emergency for 80+ residents.',
      attachments: [],
      timeline: [
        { icon: 'bi-send-check', color: 'primary', text: 'Complaint submitted', time: 'Jun 20, 2026 — 06:55 AM' }
      ]
    },
    {
      id: '#2271', title: 'Student portal login error 500', category: 'IT Services',
      dept: 'IT Services', date: '2026-06-15', priority: 'High',
      status: 'resolved',
      description: 'Getting Internal Server Error 500 every time I try to access my course registration page. This has been ongoing for 3 days and registration closes Friday.',
      attachments: ['error_screenshot.png'],
      timeline: [
        { icon: 'bi-send-check', color: 'primary',  text: 'Complaint submitted',         time: 'Jun 15, 2026 — 10:00 AM' },
        { icon: 'bi-person-lines-fill', color: 'info',    text: 'Ticket escalated to dev team', time: 'Jun 15, 2026 — 10:45 AM' },
        { icon: 'bi-check2-circle', color: 'success', text: 'Resolved — server cache cleared', time: 'Jun 15, 2026 — 01:30 PM' }
      ]
    },
    {
      id: '#2261', title: 'Library fine dispute — overcharge', category: 'Library',
      dept: 'Library', date: '2026-06-12', priority: 'Low',
      status: 'resolved',
      description: 'I was charged ₦2,400 for a late return, but I returned the book on June 3rd. The library system shows June 7th. I have a photo of the return receipt.',
      attachments: ['return_receipt.jpg'],
      timeline: [
        { icon: 'bi-send-check', color: 'primary',  text: 'Complaint submitted',                time: 'Jun 12, 2026 — 02:00 PM' },
        { icon: 'bi-arrow-repeat', color: 'warning', text: 'Return date verified against CCTV', time: 'Jun 13, 2026 — 09:15 AM' },
        { icon: 'bi-check2-circle', color: 'success', text: 'Resolved — fine reversed',         time: 'Jun 13, 2026 — 11:00 AM' }
      ]
    },
    {
      id: '#2245', title: 'Lecturer consistently starts late', category: 'Academics',
      dept: 'Academic Affairs', date: '2026-06-01', priority: 'Medium',
      status: 'resolved',
      description: 'Dr. Emeka consistently begins CSC210 lectures 25–35 minutes late, meaning we are only getting ~30 minutes of lecture time per 1-hour session.',
      attachments: [],
      timeline: [
        { icon: 'bi-send-check', color: 'primary',  text: 'Complaint submitted',             time: 'Jun 1, 2026 — 04:00 PM' },
        { icon: 'bi-person-lines-fill', color: 'info',    text: 'Referred to HOD',               time: 'Jun 2, 2026 — 09:00 AM' },
        { icon: 'bi-check2-circle', color: 'success', text: 'Resolved — formal caution issued', time: 'Jun 5, 2026 — 03:30 PM' }
      ]
    },
    {
      id: '#2231', title: 'Air conditioning failure — Lab 2', category: 'Facilities',
      dept: 'Facilities', date: '2026-05-28', priority: 'Medium',
      status: 'resolved',
      description: 'The AC units in Computer Lab 2 stopped working. The room temperature is reaching 35°C+ which is making extended lab sessions unsafe and damaging equipment.',
      attachments: ['temperature_reading.jpg'],
      timeline: [
        { icon: 'bi-send-check', color: 'primary',  text: 'Complaint submitted',           time: 'May 28, 2026 — 08:30 AM' },
        { icon: 'bi-person-lines-fill', color: 'info',    text: 'Facilities team dispatched',  time: 'May 28, 2026 — 10:15 AM' },
        { icon: 'bi-check2-circle', color: 'success', text: 'Resolved — refrigerant topped up', time: 'May 30, 2026 — 02:00 PM' }
      ]
    },
    {
      id: '#2218', title: 'Missing WEB301 coursework marks', category: 'Academics',
      dept: 'Examinations', date: '2026-05-20', priority: 'High',
      status: 'resolved',
      description: 'My WEB301 coursework marks (30%) have not been uploaded to the student portal. Exam results cannot be finalised without this component.',
      attachments: ['submission_confirmation.pdf'],
      timeline: [
        { icon: 'bi-send-check', color: 'primary',  text: 'Complaint submitted',          time: 'May 20, 2026 — 11:00 AM' },
        { icon: 'bi-arrow-repeat', color: 'warning', text: 'Marks located with lecturer', time: 'May 21, 2026 — 09:00 AM' },
        { icon: 'bi-check2-circle', color: 'success', text: 'Resolved — marks uploaded', time: 'May 22, 2026 — 01:45 PM' }
      ]
    },
    {
      id: '#2197', title: 'Bursary payment not received', category: 'Finance',
      dept: 'Student Finance', date: '2026-05-10', priority: 'Urgent',
      status: 'rejected',
      description: 'I have not received my bursary payment for the second semester despite meeting all eligibility criteria. My bank details on file are correct.',
      attachments: ['bank_statement.pdf', 'eligibility_letter.pdf'],
      timeline: [
        { icon: 'bi-send-check', color: 'primary',  text: 'Complaint submitted',                   time: 'May 10, 2026 — 09:45 AM' },
        { icon: 'bi-arrow-repeat', color: 'warning', text: 'Finance office audit initiated',        time: 'May 11, 2026 — 02:00 PM' },
        { icon: 'bi-x-circle', color: 'danger',  text: 'Rejected — payment confirmed as sent to provided account', time: 'May 14, 2026 — 10:00 AM' }
      ]
    },
    {
      id: '#2184', title: 'Password reset email not arriving', category: 'IT Services',
      dept: 'IT Services', date: '2026-05-03', priority: 'Low',
      status: 'resolved',
      description: 'Password reset emails for the student portal are not arriving in my inbox or spam folder. I\'ve tried three times over two days.',
      attachments: [],
      timeline: [
        { icon: 'bi-send-check', color: 'primary',  text: 'Complaint submitted',          time: 'May 3, 2026 — 03:20 PM' },
        { icon: 'bi-arrow-repeat', color: 'warning', text: 'Email relay logs reviewed',   time: 'May 4, 2026 — 09:30 AM' },
        { icon: 'bi-check2-circle', color: 'success', text: 'Resolved — SMTP config fixed', time: 'May 4, 2026 — 11:00 AM' }
      ]
    }
  ];

  // working copy that filters/sorts act on
  var filteredComplaints = allComplaints.slice();
  var currentPage = 1;
  var rowsPerPage = 8;
  var sortAsc = false;
  var deleteTargetId = null;

  // ============================================
  // HELPERS
  // ============================================
  function statusLabel(s){
    var map = { 'pending':'Pending', 'in-review':'In Review', 'resolved':'Resolved', 'rejected':'Rejected' };
    return map[s] || s;
  }
  function priorityIcon(p){
    var map = { 'Low':'<i class="bi bi-circle text-success me-1"></i>', 'Medium':'<i class="bi bi-circle-fill text-warning me-1"></i>', 'High':'<i class="bi bi-exclamation-circle text-danger me-1" ></i>', 'Urgent':'<i class="bi bi-exclamation-triangle-fill text-danger me-1"></i>' };
    return (map[p] || '') + p;
  }
  function formatDate(d){
    var dt = new Date(d);
    return dt.toLocaleDateString('en-GB',{ day:'numeric', month:'short', year:'numeric' });
  }
  function fmtSize(){ return ''; }
  function escHtml(str){
    return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // ============================================
  // RENDER TABLE
  // ============================================
  function renderTable(){
    var tbody = document.getElementById('complaintTbody');
    var emptyState = document.getElementById('emptyState');
    var tableWrap = document.getElementById('tableWrap');
    var tableFooter = document.getElementById('tableFooter');

    if (filteredComplaints.length === 0){
      emptyState.classList.remove('d-none');
      tableWrap.classList.add('d-none');
      tableFooter.classList.add('d-none');
      return;
    }
    emptyState.classList.add('d-none');
    tableWrap.classList.remove('d-none');
    tableFooter.classList.remove('d-none');

    var start = (currentPage - 1) * rowsPerPage;
    var pageRows = filteredComplaints.slice(start, start + rowsPerPage);

    var html = '';
    pageRows.forEach(function(c){
      html += '<tr data-id="' + escHtml(c.id) + '">' +
        '<td><span class="complaint-id">' + escHtml(c.id) + '</span></td>' +
        '<td><div class="complaint-title">' + escHtml(c.title) + '<small>' + escHtml(c.dept) + '</small></div></td>' +
        '<td class="d-none d-md-table-cell text-muted" style="font-size:.82rem">' + escHtml(c.category) + '</td>' +
        '<td class="d-none d-lg-table-cell text-muted" style="font-size:.82rem">' + escHtml(c.dept) + '</td>' +
        '<td class="d-none d-sm-table-cell" style="font-family:var(--font-mono);font-size:.78rem;color:var(--text-muted)">' + formatDate(c.date) + '</td>' +
        '<td><span class="status-badge status-' + escHtml(c.status) + '">' + statusLabel(c.status) + '</span></td>' +
        '<td>' +
          '<div class="action-group">' +
            '<button class="act-btn act-view"  title="View"   onclick="openViewModal(\''  + escHtml(c.id) + '\')"><i class="bi bi-eye"></i></button>' +
            '<button class="act-btn act-edit"  title="Edit"   onclick="openEditToast(\''  + escHtml(c.id) + '\')"><i class="bi bi-pencil"></i></button>' +
            '<button class="act-btn act-delete" title="Delete" onclick="openDeleteModal(\'' + escHtml(c.id) + '\')"><i class="bi bi-trash3"></i></button>' +
          '</div>' +
        '</td>' +
      '</tr>';
    });
    tbody.innerHTML = html;
    renderPagination();
    updateRowInfo(start, Math.min(start + rowsPerPage, filteredComplaints.length));
  }

  // ============================================
  // PAGINATION
  // ============================================
  function renderPagination(){
    var total = Math.ceil(filteredComplaints.length / rowsPerPage);
    var ul = document.getElementById('pagination');
    var html = '';

    html += '<li class="page-item' + (currentPage===1?' disabled':'') + '">' +
      '<a class="page-link" href="#" onclick="goPage(event,' + (currentPage-1) + ')"><i class="bi bi-chevron-left"></i></a></li>';

    for (var i = 1; i <= total; i++){
      html += '<li class="page-item' + (i===currentPage?' active':'') + '">' +
        '<a class="page-link" href="#" onclick="goPage(event,' + i + ')">' + i + '</a></li>';
    }

    html += '<li class="page-item' + (currentPage===total||total===0?' disabled':'') + '">' +
      '<a class="page-link" href="#" onclick="goPage(event,' + (currentPage+1) + ')"><i class="bi bi-chevron-right"></i></a></li>';

    ul.innerHTML = html;
  }

  function updateRowInfo(from, to){
    var el = document.getElementById('rowInfo');
    if (el) el.textContent = 'Showing ' + (from+1) + '–' + to + ' of ' + filteredComplaints.length;
  }

  window.goPage = function(e, page){
    e.preventDefault();
    var total = Math.ceil(filteredComplaints.length / rowsPerPage);
    if (page < 1 || page > total) return;
    currentPage = page;
    renderTable();
  };

  // ============================================
  // SEARCH + FILTER + SORT
  // ============================================
  var searchInput = document.getElementById('tableSearch');
  var statusFilter = document.getElementById('statusFilter');
  var categoryFilter = document.getElementById('categoryFilter');
  var searchClear = document.getElementById('searchClear');

  function applyFilters(){
    var q = searchInput.value.trim().toLowerCase();
    var status = statusFilter.value;
    var category = categoryFilter.value;

    filteredComplaints = allComplaints.filter(function(c){
      var matchQ = !q || c.id.toLowerCase().includes(q) ||
                        c.title.toLowerCase().includes(q) ||
                        c.category.toLowerCase().includes(q) ||
                        c.dept.toLowerCase().includes(q);
      var matchStatus = !status || c.status === status;
      var matchCat = !category || c.category === category;
      return matchQ && matchStatus && matchCat;
    });

    applySortByDate();
    currentPage = 1;
    renderTable();
    searchClear.classList.toggle('d-none', !q);
  }

  function applySortByDate(){
    filteredComplaints.sort(function(a,b){
      var da = new Date(a.date);
      var db = new Date(b.date);
      return sortAsc ? da - db : db - da;
    });
  }

  searchInput.addEventListener('input', applyFilters);
  statusFilter.addEventListener('change', applyFilters);
  categoryFilter.addEventListener('change', applyFilters);

  searchClear.addEventListener('click', function(){
    searchInput.value = '';
    applyFilters();
  });

  document.getElementById('clearFiltersBtn').addEventListener('click', function(){
    searchInput.value = '';
    statusFilter.value = '';
    categoryFilter.value = '';
    applyFilters();
  });

  var sortDateBtn = document.getElementById('sortDateBtn');
  var sortArrow = document.getElementById('sortArrow');
  sortDateBtn.addEventListener('click', function(){
    sortAsc = !sortAsc;
    sortArrow.classList.toggle('asc', sortAsc);
    applySortByDate();
    currentPage = 1;
    renderTable();
  });

  // ============================================
  // UPDATE STAT STRIP
  // ============================================
  function updateStats(){
    var counts = { pending:0, 'in-review':0, resolved:0, rejected:0 };
    allComplaints.forEach(function(c){ if (counts[c.status]!==undefined) counts[c.status]++; });
    document.getElementById('totalCount').textContent = allComplaints.length;
    document.getElementById('pendingCount').textContent = counts['pending'];
    document.getElementById('reviewCount').textContent = counts['in-review'];
    document.getElementById('resolvedCount').textContent = counts['resolved'];
    document.getElementById('rejectedCount').textContent = counts['rejected'];
  }

  // ============================================
  // VIEW MODAL
  // ============================================
  window.openViewModal = function(id){
    var c = allComplaints.find(function(x){ return x.id === id; });
    if (!c) return;

    document.getElementById('viewModalLabel').textContent = c.title;
    document.getElementById('modalTicketId').textContent = c.id;
    document.getElementById('modalCategory').textContent = c.category;
    document.getElementById('modalDept').textContent = c.dept;
    document.getElementById('modalDate').textContent = formatDate(c.date);
    document.getElementById('modalDescription').textContent = c.description;
    document.getElementById('modalPriority').innerHTML = priorityIcon(c.priority);

    // status badge
    var badgeEl = document.getElementById('modalStatusBadge');
    badgeEl.innerHTML = '<span class="status-badge status-' + c.status + '">' + statusLabel(c.status) + '</span>';

    // progress bar steps
    var stepsMap = {
      'pending':  1,
      'in-review': 3,
      'resolved': 4,
      'rejected': 4
    };
    var reached = stepsMap[c.status] || 1;
    for (var s = 1; s <= 4; s++){
      var stepEl = document.getElementById('msb' + s);
      if (s <= reached){ stepEl.classList.add('done'); } else { stepEl.classList.remove('done'); }
      if (s < 4){
        var lineEl = document.getElementById('msbLine' + s);
        if (s < reached){ lineEl.classList.add('done'); } else { lineEl.classList.remove('done'); }
      }
    }

    // attachments
    var attachWrap = document.getElementById('modalAttachmentsWrap');
    var attachDiv = document.getElementById('modalAttachments');
    if (c.attachments && c.attachments.length){
      attachWrap.style.display = '';
      var aHtml = '';
      c.attachments.forEach(function(f){
        var icon = f.endsWith('.pdf') ? 'bi-file-earmark-pdf' : 'bi-file-earmark-image';
        aHtml += '<span class="attachment-chip"><i class="bi ' + icon + '"></i>' + escHtml(f) + '</span>';
      });
      attachDiv.innerHTML = aHtml;
    } else {
      attachWrap.style.display = 'none';
    }

    // timeline
    var tlContainer = document.getElementById('modalTimelineItems');
    var tlHtml = '<div class="timeline">';
    var colorMap = { 'primary':'var(--primary)', 'info':'#0dcaf0', 'warning':'#ffc107', 'success':'#198754', 'danger':'#dc3545' };
    c.timeline.forEach(function(item){
      var col = colorMap[item.color] || 'var(--primary)';
      tlHtml += '<div class="timeline-item">' +
        '<span style="position:absolute;left:-1.4rem;top:3px;width:12px;height:12px;border-radius:50%;background:' + col + ';border:3px solid #fff;box-shadow:0 0 0 2px ' + col + ';display:block"></span>' +
        '<div><strong>' + escHtml(item.text) + '</strong><br><span style="font-size:.74rem;color:var(--text-muted)">' + escHtml(item.time) + '</span></div>' +
      '</div>';
    });
    tlHtml += '</div>';
    tlContainer.innerHTML = tlHtml;

    new bootstrap.Modal(document.getElementById('viewModal')).show();
  };

  // ============================================
  // DELETE MODAL
  // ============================================
  window.openDeleteModal = function(id){
    deleteTargetId = id;
    document.getElementById('deleteTicketId').textContent = id;
    new bootstrap.Modal(document.getElementById('deleteModal')).show();
  };

  document.getElementById('confirmDeleteBtn').addEventListener('click', function(){
    if (!deleteTargetId) return;
    allComplaints = allComplaints.filter(function(c){ return c.id !== deleteTargetId; });
    filteredComplaints = filteredComplaints.filter(function(c){ return c.id !== deleteTargetId; });
    deleteTargetId = null;
    bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
    var total = Math.ceil(filteredComplaints.length / rowsPerPage);
    if (currentPage > total && total > 0) currentPage = total;
    updateStats();
    renderTable();
  });

  // ============================================
  // EDIT TOAST (UI only — no edit page wired yet)
  // ============================================
  window.openEditToast = function(id){
    var existing = document.getElementById('editToast');
    if (existing) existing.remove();
    var div = document.createElement('div');
    div.id = 'editToast';
    div.style.cssText = 'position:fixed;bottom:1.4rem;right:1.4rem;z-index:9999;';
    div.innerHTML = '<div class="toast show align-items-center text-bg-primary border-0" role="alert">' +
      '<div class="d-flex"><div class="toast-body fw-semibold">' +
        '<i class="bi bi-pencil-square me-2"></i>Edit for complaint ' + escHtml(id) + ' coming soon.' +
      '</div><button type="button" class="btn-close btn-close-white me-2 m-auto" onclick="this.closest(\'#editToast\').remove()"></button></div></div>';
    document.body.appendChild(div);
    setTimeout(function(){ if (div.parentNode) div.remove(); }, 2800);
  };

  // ============================================
  // INIT
  // ============================================
  updateStats();
  applySortByDate();
  renderTable();

});
