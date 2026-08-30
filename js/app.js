// RIS School — Main Controller & Client Router (v5.1 Production Hardened)
import { store } from './store.js';
import { db } from './db.js';
import { nativeBridge } from './nativeBridge.js';
import { renderNavbar, setupNavbarEvents } from './components/navbar.js';
import { renderDashboard } from './components/dashboard.js';
import { renderNotices } from './components/notices.js';
import { renderStudentAttendance } from './components/studentAttendance.js';
import { renderStaffAttendance } from './components/staffAttendance.js';
import { renderReports, initReportsChart } from './components/reports.js';
import { renderLogin } from './components/login.js';

class App {
  constructor() {
    this.currentPage = 'login';
    this.attendanceState = {};
    this.currentDateStr = new Date().toISOString().split('T')[0];
    window.store = store;
    window.db = db;
    window.nativeBridge = nativeBridge;
    this.init();
  }

  async init() {
    this.setupRouter();
    this.setupGlobalHandlers();
    this.setupMidnightRolloverCheck();
    
    // Initialize Native Mobile Bridge (hardware back button, status bar, notifications)
    await nativeBridge.init(this);

    // Initial cloud sync (notices once, and attendance/leaves/users)
    if (db.isConnected) {
      await store.syncNoticesOnce(db);
      await store.syncWithCloud(db);
    }

    // Background poll: leave requests + attendance + users (NOT notices)
    setInterval(async () => {
      if (db.isConnected) {
        await store.syncWithCloud(db);
      }
    }, 10000);

    this.render();

    store.subscribe(() => {
      const activeEl = document.activeElement;
      const isTyping = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT');
      if (!isTyping) {
        this.render();
      }
    });
  }

  setupMidnightRolloverCheck() {
    setInterval(() => {
      const todayStr = new Date().toISOString().split('T')[0];
      if (todayStr !== this.currentDateStr) {
        this.currentDateStr = todayStr;
        const dateInput = document.getElementById('att-date-input');
        if (dateInput) {
          dateInput.value = todayStr;
          this.loadAttendanceSheet();
          this.showToast(`🌙 Midnight Rollover: Attendance register reset for new day (${todayStr})`, "info");
        }
        nativeBridge.sendNativeNotification({
          title: "RIS School — Daily Register Rollover",
          body: `Morning attendance registers have been reset for today (${todayStr}).`
        });
      }
    }, 30000);

    window.addEventListener('focus', async () => {
      const todayStr = new Date().toISOString().split('T')[0];
      if (todayStr !== this.currentDateStr) {
        this.currentDateStr = todayStr;
        const dateInput = document.getElementById('att-date-input');
        if (dateInput) {
          dateInput.value = todayStr;
          this.loadAttendanceSheet();
        }
      }

      // On tab focus: sync other data; only sync notices if nothing is pending deletion
      if (db.isConnected) {
        if (store.pendingDeletedNotices.size === 0) {
          await store.syncNoticesOnce(db);
        }
        await store.syncWithCloud(db);
      }
    });
  }

  setupRouter() {
    window.router = {
      navigate: (page) => {
        const user = store.getCurrentUser();
        if (!user && page !== 'login') {
          this.currentPage = 'login';
          window.location.hash = 'login';
        } else {
          this.currentPage = page;
          window.location.hash = page;
        }
        this.render();
      }
    };

    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      const user = store.getCurrentUser();
      if (!user && hash !== 'login') {
        this.currentPage = 'login';
      } else if (hash) {
        this.currentPage = hash;
      }
      this.render();
    });

    const user = store.getCurrentUser();
    if (!user) {
      this.currentPage = 'login';
    } else if (window.location.hash) {
      this.currentPage = window.location.hash.replace('#', '');
    }
  }

  render() {
    const navbarContainer = document.getElementById('navbar-container');
    const mainContainer = document.getElementById('main-content-container');
    const user = store.getCurrentUser();

    if (navbarContainer) {
      navbarContainer.innerHTML = renderNavbar();
      setupNavbarEvents();
    }

    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    const activeNav = document.getElementById(`nav-${this.currentPage}`);
    if (activeNav) activeNav.classList.add('active');

    if (mainContainer) {
      if (!user || this.currentPage === 'login') {
        mainContainer.innerHTML = renderLogin();
        return;
      }

      switch (this.currentPage) {
        case 'notices':
          mainContainer.innerHTML = renderNotices();
          break;
        case 'student-attendance':
          mainContainer.innerHTML = renderStudentAttendance();
          this.loadAttendanceSheet();
          break;
        case 'staff-attendance':
          mainContainer.innerHTML = renderStaffAttendance();
          break;
        case 'reports':
          mainContainer.innerHTML = renderReports();
          setTimeout(() => initReportsChart(), 50);
          break;
        case 'dashboard':
        default:
          mainContainer.innerHTML = renderDashboard();
          break;
      }
    }
  }

  setupGlobalHandlers() {

    // --- PRINCIPAL SUPERVISION SWITCHER ---
    window.handleReturnToAdmin = () => {
      store.returnToAdmin();
      window.router.navigate('dashboard');
      this.showToast("Returned to Principal Control Center!", "success");
    };

    // --- LOGIN & AUTHENTICATION HANDLERS ---
    window.handleStudentLogin = () => {
      const select = document.getElementById('login-student-select');
      if (select && select.value) {
        store.setCurrentUser(select.value);
        window.router.navigate('dashboard');
        this.showToast("Signed in as Student!", "success");
      }
    };

    window.handleTeacherLogin = () => {
      const select = document.getElementById('login-teacher-select');
      if (select && select.value) {
        store.setCurrentUser(select.value);
        window.router.navigate('dashboard');
        this.showToast("Signed in as Teacher!", "success");
      }
    };

    window.handleAdminLogin = () => {
      const pinInput = document.getElementById('login-admin-pin');
      const pin = pinInput ? pinInput.value : '';
      const res = store.setCurrentUser('admin-1', pin);

      if (res.success) {
        window.router.navigate('dashboard');
        this.showToast("Admin Authenticated Successfully!", "success");
      } else {
        alert(res.error);
        this.showToast(res.error, "danger");
      }
    };

    window.handleLogout = () => {
      store.logout();
      window.router.navigate('login');
      this.showToast("Signed out safely.", "info");
    };

    // --- CLOUD DB CONFIG MODAL HANDLERS ---
    window.openDbModal = () => {
      document.getElementById('db-config-modal')?.classList.remove('hidden');
    };
    window.closeDbModal = () => {
      document.getElementById('db-config-modal')?.classList.add('hidden');
    };
    window.handleSaveDbCredentials = async (e) => {
      e.preventDefault();
      const form = e.target;
      const url = form.url.value;
      const key = form.key.value;

      const connected = db.saveConfig(url, key);
      window.closeDbModal();

      if (connected || db.isConnected) {
        this.showToast("Connected to Cloud Database! Syncing...", "success");
        await store.syncWithCloud(db);
      } else if (url || key) {
        this.showToast("Could not connect to Supabase. Check URL and Key.", "danger");
      } else {
        this.showToast("Switched to Local In-Browser Database mode.", "info");
      }
      this.render();
    };

    // --- SECURED USER REGISTRATION HANDLERS ---
    window.openRegistrationModal = () => {
      document.getElementById('registration-modal')?.classList.remove('hidden');
    };
    window.closeRegistrationModal = () => {
      document.getElementById('registration-modal')?.classList.add('hidden');
    };
    window.toggleRegRoleFields = (role) => {
      const teacherFields = document.getElementById('reg-teacher-fields');
      const studentFields = document.getElementById('reg-student-fields');
      if (role === 'teacher') {
        teacherFields?.classList.remove('hidden');
        studentFields?.classList.add('hidden');
      } else {
        teacherFields?.classList.add('hidden');
        studentFields?.classList.remove('hidden');
      }
    };
    window.handleUserRegistration = async (e) => {
      e.preventDefault();
      const form = e.target;
      const role = form.role.value;
      const name = form.name.value;
      const email = form.email.value;

      const result = store.registerUser({
        role,
        name,
        email,
        teacherPasscode: form.teacherPasscode?.value,
        classTeacherClass: form.classTeacherClass?.value,
        subjects: form.subjects?.value ? [form.subjects.value] : ["General"],
        classId: form.classId?.value,
        rollNo: form.rollNo?.value
      });

      if (!result.success) {
        alert(result.error);
        this.showToast(result.error, "danger");
        return;
      }

      if (db.isConnected) await db.saveUser(result.user);

      window.closeRegistrationModal();
      this.showToast(`Welcome ${result.user.name}! Registered as ${result.user.role.toUpperCase()}.`, "success");
      window.router.navigate('dashboard');
    };

    window.handleDeleteUser = async (userId) => {
      const currentUser = store.getCurrentUser();
      if (!currentUser || currentUser.role !== 'admin') {
        this.showToast("Permission denied: Only Admin can remove user accounts.", "danger");
        return;
      }

      if (confirm("Are you sure you want to remove this user from the school portal?")) {
        store.deleteUser(userId);
        if (db.isConnected) await db.deleteUser(userId);
        this.showToast("User removed.", "warning");
        this.render();
      }
    };

    // --- NOTICE HANDLERS ---
    window.openNoticeModal = () => {
      const currentUser = store.getCurrentUser();
      if (!currentUser || currentUser.role === 'student') {
        this.showToast("Permission denied: Students cannot post announcements.", "danger");
        return;
      }
      const modal = document.getElementById('create-notice-modal');
      if (modal) {
        modal.classList.remove('hidden');
      } else {
        window.router.navigate('notices');
        setTimeout(() => {
          document.getElementById('create-notice-modal')?.classList.remove('hidden');
        }, 50);
      }
    };
    window.closeNoticeModal = () => {
      document.getElementById('create-notice-modal')?.classList.add('hidden');
    };
    window.handleCreateNotice = async (e) => {
      e.preventDefault();
      const form = e.target;
      const newNotice = store.addNotice({
        title: form.title.value,
        targetAudience: form.targetAudience.value,
        priority: form.priority.value,
        content: form.content.value
      });

      if (!newNotice) {
        this.showToast("Permission denied: Students cannot post announcements.", "danger");
        return;
      }

      if (db.isConnected) {
        await db.saveNotice(newNotice);
      }

      nativeBridge.triggerHaptic('medium');
      if (newNotice.priority === 'urgent' || newNotice.priority === 'important') {
        nativeBridge.sendNativeNotification({
          title: `🚨 RIS Notice: ${newNotice.title}`,
          body: newNotice.content
        });
      }

      window.closeNoticeModal();
      this.showToast("Announcement published & synced to cloud!", "success");
      this.render();
    };

    window.handleDeleteNotice = async (noticeId) => {
      const currentUser = store.getCurrentUser();
      if (!currentUser || currentUser.role === 'student') {
        this.showToast("Permission denied: Students cannot delete notices.", "danger");
        return;
      }

      if (confirm("Are you sure you want to delete this notice?")) {
        // 1. Remove from local state immediately and persist to localStorage
        //    so background cloud sync can NEVER re-add this notice
        store.deleteNotice(noticeId);
        this.render();
        this.showToast("Notice deleted.", "warning");

        // 2. Delete from Supabase cloud in background
        if (db.isConnected) {
          await db.deleteNotice(noticeId);
          // 3. Only after Supabase confirms deletion, remove from the blocked set
          store.pendingDeletedNotices.delete(noticeId);
          const remaining = [...store.pendingDeletedNotices];
          localStorage.setItem('ris_deleted_notice_ids', JSON.stringify(remaining));
        }
      }
    };

    window.filterNotices = (priority) => {
      const user = store.getCurrentUser();
      const list = store.getNotices({ priority: priority === 'all' ? null : priority });
      const container = document.getElementById('notices-feed-container');
      if (container) {
        if (list.length === 0) {
          container.innerHTML = `<div class="glass-card p-8 text-center text-slate-400">No announcements match this filter.</div>`;
        } else {
          container.innerHTML = list.map(n => {
            const isUrgent = n.priority === 'urgent';
            const canDelete = user && user.role !== 'student' && store.canDeleteNotice(n.id);
            return `
              <div class="glass-card p-6 space-y-3 ${isUrgent ? 'border-2 border-red-500/50 bg-red-950/10' : ''}">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div class="flex items-center gap-3">
                    ${isUrgent ? `
                      <span class="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold animate-pulse text-sm">🚨</span>
                    ` : `
                      <div class="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-sm">
                        <i class="ph-bold ph-bell"></i>
                      </div>
                    `}
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="badge ${n.priority === 'urgent' ? 'badge-danger' : (n.priority === 'important' ? 'badge-warning' : 'badge-info')} uppercase">
                          ${n.priority}
                        </span>
                        <span class="text-xs font-semibold text-slate-500">Audience: ${n.targetAudience}</span>
                      </div>
                      <h3 class="text-lg font-bold text-slate-900 dark:text-white font-heading mt-0.5">${n.title}</h3>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    ${canDelete ? `
                      <button onclick="window.handleDeleteNotice('${n.id}')" class="btn btn-outline text-xs py-1 text-red-600 border-red-200 hover:bg-red-50">
                        <i class="ph-bold ph-trash"></i> Delete Notice
                      </button>
                    ` : ''}
                  </div>
                </div>

                <p class="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed">${n.content}</p>

                <div class="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400">
                  <span>Posted by <strong>${n.authorName}</strong> (${n.authorRole})</span>
                  <span>${new Date(n.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            `;
          }).join('');
        }
      }
    };

    window.markNoticeRead = (noticeId) => {
      store.markNoticeRead(noticeId);
      this.render();
    };

    window.handleMarkAllNoticesRead = () => {
      store.markAllNoticesRead();
      this.showToast("All announcements marked as read!", "success");
      this.render();
    };

    // --- MORNING ATTENDANCE HANDLERS ---
    window.loadAttendanceSheet = () => {
      this.loadAttendanceSheet();
    };

    window.markAllPresent = async () => {
      const currentUser = store.getCurrentUser();
      if (!currentUser || currentUser.role === 'student') {
        this.showToast("Permission Denied: Students cannot mark attendance.", "danger");
        return;
      }

      nativeBridge.triggerHaptic('medium');
      Object.keys(this.attendanceState).forEach(studentId => {
        this.attendanceState[studentId].status = 'present';
      });
      this.renderRosterRows();

      const classSelect = document.getElementById('att-class-select');
      const dateInput = document.getElementById('att-date-input');
      if (classSelect && dateInput) {
        const classId = classSelect.value;
        const dateStr = dateInput.value;
        store.saveStudentAttendance(classId, dateStr, this.attendanceState, true);
        if (db.isConnected) {
          await db.saveAttendance(classId, dateStr, "Daily Morning Register", currentUser.name, this.attendanceState);
        }
      }
      this.showToast("All students marked Present!", "info");
    };

    window.setStudentStatus = async (studentId, status) => {
      const currentUser = store.getCurrentUser();
      if (!currentUser || currentUser.role === 'student') {
        this.showToast("Permission Denied: Students cannot edit attendance.", "danger");
        return;
      }

      nativeBridge.triggerHaptic('light');
      if (this.attendanceState[studentId]) {
        if (this.attendanceState[studentId].status === status) {
          this.attendanceState[studentId].status = null;
        } else {
          this.attendanceState[studentId].status = status;
        }
        this.renderRosterRows();

        const classSelect = document.getElementById('att-class-select');
        const dateInput = document.getElementById('att-date-input');
        if (classSelect && dateInput) {
          const classId = classSelect.value;
          const dateStr = dateInput.value;
          store.saveStudentAttendance(classId, dateStr, this.attendanceState, true);
          if (db.isConnected) {
            await db.saveAttendance(classId, dateStr, "Daily Morning Register", currentUser.name, this.attendanceState);
          }
        }
      }
    };

    window.saveAttendanceRegister = async () => {
      const currentUser = store.getCurrentUser();
      if (!currentUser || currentUser.role === 'student') {
        this.showToast("Permission Denied: Students cannot save attendance registers.", "danger");
        return;
      }

      const classSelect = document.getElementById('att-class-select');
      const dateInput = document.getElementById('att-date-input');

      if (!classSelect || !dateInput) return;

      const classId = classSelect.value;
      const dateStr = dateInput.value;

      const studentIds = Object.keys(this.attendanceState);
      const unmarkedCount = studentIds.filter(id => !this.attendanceState[id].status).length;

      if (unmarkedCount > 0) {
        if (!confirm(`Warning: ${unmarkedCount} student(s) are still unmarked (Pending). Do you want to save attendance register anyway?`)) {
          return;
        }
      }

      const saved = store.saveStudentAttendance(classId, dateStr, this.attendanceState);
      if (!saved) {
        this.showToast("Permission denied: Only Teachers & Admins can save attendance.", "danger");
        return;
      }

      if (db.isConnected) {
        await db.saveAttendance(classId, dateStr, "Daily Morning Register", currentUser.name, this.attendanceState);
      }
      this.showToast(`Morning attendance for Class ${classId} saved & synced to cloud!`, "success");
    };

    window.toggleAuditLogDrawer = () => {
      document.getElementById('audit-log-drawer')?.classList.toggle('hidden');
    };

    // --- STAFF & LEAVE HANDLERS ---
    window.toggleStaffCheckIn = (teacherId) => {
      const currentUser = store.getCurrentUser();
      if (!currentUser || currentUser.role === 'student') {
        this.showToast("Permission Denied: Students cannot alter staff check-ins.", "danger");
        return;
      }

      const checkedIn = store.staffCheckIn(teacherId);
      this.showToast(checkedIn ? "Faculty checked in!" : "Faculty checked out!", "info");
    };

    window.openLeaveModal = () => {
      const currentUser = store.getCurrentUser();
      if (!currentUser || currentUser.role === 'student') {
        this.showToast("Permission Denied: Only Teachers can submit leave applications.", "danger");
        return;
      }
      const modal = document.getElementById('leave-request-modal');
      if (modal) {
        modal.classList.remove('hidden');
      } else {
        window.router.navigate('staff-attendance');
        setTimeout(() => {
          document.getElementById('leave-request-modal')?.classList.remove('hidden');
        }, 50);
      }
    };
    window.closeLeaveModal = () => {
      document.getElementById('leave-request-modal')?.classList.add('hidden');
    };
    window.handleCreateLeave = async (e) => {
      e.preventDefault();
      const currentUser = store.getCurrentUser();
      if (!currentUser || currentUser.role === 'student') {
        this.showToast("Permission Denied: Students cannot submit leave applications.", "danger");
        return;
      }

      const form = e.target;
      const newLeave = store.submitLeaveRequest({
        leaveType: form.leaveType.value,
        startDate: form.startDate.value,
        endDate: form.endDate.value,
        reason: form.reason.value
      });

      if (!newLeave) {
        this.showToast("Permission denied: Only Teachers can submit leave applications.", "danger");
        return;
      }

      if (db.isConnected) {
        await db.saveLeaveRequest(newLeave);
      }

      window.closeLeaveModal();
      this.showToast("Leave application submitted & synced to cloud!", "success");
      this.render();
    };

    window.approveLeave = async (leaveId) => {
      const currentUser = store.getCurrentUser();
      if (!currentUser || currentUser.role !== 'admin') {
        this.showToast("Permission Denied: Only School Principal / Administrator can approve leave applications.", "danger");
        return;
      }

      const updatedLeave = store.reviewLeaveRequest(leaveId, 'approved', 'Approved by Principal.');
      if (updatedLeave) {
        if (db.isConnected) await db.saveLeaveRequest(updatedLeave);
        this.showToast("Leave request approved!", "success");
        this.render();
      } else {
        this.showToast("Permission denied: Admin approval required.", "danger");
      }
    };

    window.rejectLeave = async (leaveId) => {
      const currentUser = store.getCurrentUser();
      if (!currentUser || currentUser.role !== 'admin') {
        this.showToast("Permission Denied: Only School Principal / Administrator can reject leave applications.", "danger");
        return;
      }

      const updatedLeave = store.reviewLeaveRequest(leaveId, 'rejected', 'Rejected by Principal.');
      if (updatedLeave) {
        if (db.isConnected) await db.saveLeaveRequest(updatedLeave);
        this.showToast("Leave request rejected.", "warning");
        this.render();
      } else {
        this.showToast("Permission denied: Admin approval required.", "danger");
      }
    };

    window.filterReportsTable = () => {
      const input = document.getElementById('report-search');
      const filter = input ? input.value.toLowerCase() : '';
      const table = document.getElementById('reports-table');
      if (!table) return;
      const tr = table.getElementsByTagName('tr');

      for (let i = 1; i < tr.length; i++) {
        const text = tr[i].textContent || tr[i].innerText;
        tr[i].style.display = text.toLowerCase().indexOf(filter) > -1 ? "" : "none";
      }
    };
  }

  loadAttendanceSheet() {
    const classSelect = document.getElementById('att-class-select');
    const dateInput = document.getElementById('att-date-input');
    if (!classSelect || !dateInput) return;

    const classId = classSelect.value;
    const dateStr = dateInput.value;
    const existing = store.getStudentAttendance(classId, dateStr);

    const students = store.getUsers('student').filter(s => s.classId === classId);
    this.attendanceState = {};

    students.forEach(s => {
      const status = existing && existing.records[s.id] ? existing.records[s.id].status : null;
      this.attendanceState[s.id] = { status, studentName: s.name, rollNo: s.rollNo, avatar: s.avatar };
    });

    this.renderRosterRows();
  }

  renderRosterRows() {
    const container = document.getElementById('attendance-roster-container');
    if (!container) return;

    const currentUser = store.getCurrentUser();
    const isTeacherOrAdmin = currentUser && currentUser.role !== 'student' && (store.isAdminSessionActive() || currentUser.role === 'teacher' || currentUser.role === 'admin');

    const studentIds = Object.keys(this.attendanceState);
    const presentCount = studentIds.filter(id => this.attendanceState[id].status === 'present').length;
    const absentCount = studentIds.filter(id => this.attendanceState[id].status === 'absent').length;

    const counterPresent = document.getElementById('count-present');
    const counterAbsent = document.getElementById('count-absent');
    if (counterPresent) counterPresent.innerText = `${presentCount} Present`;
    if (counterAbsent) counterAbsent.innerText = `${absentCount} Absent`;

    if (studentIds.length === 0) {
      container.innerHTML = `
        <div class="p-8 text-center text-slate-400 space-y-2">
          <i class="ph-bold ph-user-plus text-3xl text-emerald-500"></i>
          <p class="font-bold text-sm text-slate-700 dark:text-slate-200">No students registered in this class section yet.</p>
          <p class="text-xs text-slate-500">Click <strong>"+ Join App"</strong> in the top header to register a student for Class 8-A or 8-B!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="divide-y divide-slate-200 dark:divide-slate-800">
        ${studentIds.map(id => {
          const s = this.attendanceState[id];
          return `
            <div class="py-3.5 flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <img src="${s.avatar}" class="w-11 h-11 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm">
                <div>
                  <div class="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    ${s.studentName}
                    ${!s.status ? `<span class="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded font-bold">Unmarked</span>` : ''}
                  </div>
                  <div class="text-xs text-slate-500 font-semibold">Roll No: ${s.rollNo || 'N/A'}</div>
                </div>
              </div>

              ${isTeacherOrAdmin ? `
                <div class="flex items-center gap-2">
                  <button type="button" onclick="window.setStudentStatus('${id}', 'present')" 
                          class="att-toggle-btn ${s.status === 'present' ? 'active-P' : ''}">
                    <i class="ph-bold ph-check"></i> Present
                  </button>
                  <button type="button" onclick="window.setStudentStatus('${id}', 'absent')" 
                          class="att-toggle-btn ${s.status === 'absent' ? 'active-A' : ''}">
                    <i class="ph-bold ph-x"></i> Absent
                  </button>
                </div>
              ` : `
                <span class="badge ${s.status === 'present' ? 'badge-success' : (s.status === 'absent' ? 'badge-danger' : 'badge-info')} px-4 py-1.5 text-xs font-extrabold uppercase">
                  ${s.status || 'Pending'}
                </span>
              `}
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-5 right-5 z-50 px-5 py-3.5 rounded-2xl text-white font-bold text-sm shadow-2xl flex items-center gap-3 transition-all duration-300 transform translate-y-full ${
      type === 'success' ? 'bg-emerald-600' : (type === 'warning' ? 'bg-amber-600' : (type === 'danger' ? 'bg-rose-600' : 'bg-blue-600'))
    }`;
    toast.innerHTML = `<i class="ph-bold ${type === 'success' ? 'ph-check-circle' : 'ph-info'} text-xl"></i> ${message}`;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.remove('translate-y-full'), 50);
    setTimeout(() => {
      toast.classList.add('translate-y-full');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
