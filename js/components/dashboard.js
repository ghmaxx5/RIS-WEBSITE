// RIS School — Dashboard Component (Role-Tailored, Class 8A & 8B Only)
import { store } from '../store.js';

export function renderDashboard() {
  const user = store.getCurrentUser();

  if (user.role === 'admin') {
    return renderAdminDashboard(user);
  } else if (user.role === 'teacher') {
    return renderTeacherDashboard(user);
  } else {
    return renderStudentDashboard(user);
  }
}

// 1. ADMIN DASHBOARD
function renderAdminDashboard(user) {
  const allUsers = store.getUsers();
  const teachers = allUsers.filter(u => u.role === 'teacher');
  const students = allUsers.filter(u => u.role === 'student');
  const leaveRequests = store.getLeaveRequests();
  const pendingLeaves = leaveRequests.filter(l => l.status === 'pending');
  const notices = store.getNotices();
  const urgentNotice = notices.find(n => n.priority === 'urgent');

  return `
    <div class="space-y-6">
      
      <!-- Welcome Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-heading">
            RIS Administration Control Center
          </h1>
          <p class="text-slate-500 dark:text-slate-400 text-sm">
            Managing <span class="font-bold text-blue-600 dark:text-blue-400">Class 8-A & Class 8-B</span>. Logged in as Administrator.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button onclick="window.openRegistrationModal()" class="btn btn-primary">
            <i class="ph-bold ph-user-plus text-lg"></i> Register New User
          </button>
          <button onclick="window.router.navigate('notices')" class="btn btn-outline">
            <i class="ph-bold ph-megaphone text-lg"></i> Post Notice
          </button>
        </div>
      </div>

      <!-- Teacher Security Passcode Info Banner -->
      <div class="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-slate-900 text-white flex items-center justify-between shadow-lg">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-xl">
            <i class="ph-bold ph-shield-check"></i>
          </div>
          <div>
            <div class="text-xs font-bold uppercase tracking-wider text-blue-300">Teacher Security Passcode</div>
            <div class="font-extrabold text-sm">Share code <span class="bg-blue-600 px-2 py-0.5 rounded font-mono text-white">RIS2026</span> with verified faculty members to register as a Teacher.</div>
          </div>
        </div>
      </div>

      <!-- Urgent Alert Banner -->
      ${urgentNotice ? `
        <div class="urgent-banner flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-xl animate-pulse">
              🚨
            </div>
            <div>
              <div class="font-bold text-sm uppercase tracking-wider opacity-90">Urgent Alert</div>
              <div class="font-bold text-base">${urgentNotice.title}</div>
            </div>
          </div>
          <button onclick="window.router.navigate('notices')" class="px-3 py-1 bg-white text-red-700 font-bold rounded-lg text-xs hover:bg-slate-100 transition">
            View
          </button>
        </div>
      ` : ''}

      <!-- Metric Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div class="glass-card p-5">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Registered Students</span>
            <div class="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <i class="ph-bold ph-student text-xl"></i>
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-3xl font-black text-slate-900 dark:text-white font-heading">${students.length}</span>
            <span class="text-xs font-semibold text-emerald-600">Active</span>
          </div>
          <p class="text-xs text-slate-500 mt-1">Class 8-A & Class 8-B</p>
        </div>

        <div class="glass-card p-5">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Registered Teachers</span>
            <div class="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
              <i class="ph-bold ph-chalkboard-teacher text-xl"></i>
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-3xl font-black text-slate-900 dark:text-white font-heading">${teachers.length}</span>
            <span class="text-xs font-semibold text-blue-600">Faculty Members</span>
          </div>
          <p class="text-xs text-slate-500 mt-1">Passcode Verified</p>
        </div>

        <div class="glass-card p-5">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Leave Applications</span>
            <div class="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <i class="ph-bold ph-clock text-xl"></i>
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-3xl font-black text-slate-900 dark:text-white font-heading">${pendingLeaves.length}</span>
            <span class="text-xs font-semibold text-amber-600">Pending Review</span>
          </div>
          <p class="text-xs text-slate-500 mt-1">Requires Principal approval</p>
        </div>

      </div>

      <!-- User Directory Table -->
      <div class="glass-card p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white font-heading">Class 8-A & 8-B User Directory</h3>
          <button onclick="window.openRegistrationModal()" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
            + Add Account →
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase">
              <tr>
                <th class="p-3">User Name</th>
                <th class="p-3">Role</th>
                <th class="p-3">Email</th>
                <th class="p-3">Assigned Class</th>
                <th class="p-3">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
              ${allUsers.map(u => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="p-3 font-bold flex items-center gap-2">
                    <img src="${u.avatar}" class="w-7 h-7 rounded-full object-cover">
                    ${u.name}
                  </td>
                  <td class="p-3">
                    <span class="badge ${u.role === 'admin' ? 'badge-danger' : (u.role === 'teacher' ? 'badge-info' : 'badge-success')} uppercase">
                      ${u.role}
                    </span>
                  </td>
                  <td class="p-3 text-slate-500">${u.email}</td>
                  <td class="p-3 text-slate-600 dark:text-slate-400 font-bold">${u.classId ? 'Class ' + u.classId : (u.homeroomClass ? 'Homeroom ' + u.homeroomClass : 'All')}</td>
                  <td class="p-3">
                    ${u.id !== 'admin-1' ? `
                      <button onclick="window.handleDeleteUser('${u.id}')" class="text-red-600 font-bold hover:underline">Remove</button>
                    ` : '<span class="text-slate-400">Default Admin</span>'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

// 2. TEACHER DASHBOARD
function renderTeacherDashboard(user) {
  const staffRoster = store.getStaffRoster();
  const currentStaffObj = staffRoster.find(t => t.id === user.id);

  return `
    <div class="space-y-6">
      
      <div class="glass-card p-6 bg-gradient-to-r from-blue-900 to-indigo-900 text-white border-none shadow-xl">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <img src="${user.avatar}" class="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-lg">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-blue-200">Teacher Account</span>
              <h1 class="text-2xl sm:text-3xl font-bold font-heading">Welcome, ${user.name}!</h1>
              <p class="text-xs text-blue-100 mt-0.5">
                ${user.homeroomClass ? `Homeroom Advisor for <strong>Class ${user.homeroomClass}</strong>` : 'Subject Teacher'}
              </p>
            </div>
          </div>
          
          <div class="flex flex-wrap items-center gap-3">
            <button onclick="window.toggleStaffCheckIn('${user.id}')" class="btn ${currentStaffObj?.checkedIn ? 'btn-success' : 'btn-primary'} shadow-lg">
              <i class="ph-bold ${currentStaffObj?.checkedIn ? 'ph-check-circle' : 'ph-clock'} text-lg"></i>
              ${currentStaffObj?.checkedIn ? `Checked In (${currentStaffObj.checkInTime})` : 'Morning Check In'}
            </button>
            <button onclick="window.openLeaveModal()" class="btn bg-white/10 hover:bg-white/20 text-white border border-white/20">
              <i class="ph-bold ph-calendar-plus text-lg"></i> Apply Leave
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div class="glass-card p-6 flex flex-col justify-between">
          <div>
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold mb-3">
              <i class="ph-bold ph-sun text-xl"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white font-heading">Morning Roll Call</h3>
            <p class="text-xs text-slate-500 mt-1">
              Take morning attendance for Class 8-A or Class 8-B. Toggle Present (P) or Absent (A).
            </p>
          </div>
          <button onclick="window.router.navigate('student-attendance')" class="btn btn-primary w-full mt-4">
            <i class="ph-bold ph-check-square"></i> Open Attendance Register
          </button>
        </div>

        <div class="glass-card p-6 flex flex-col justify-between">
          <div>
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold mb-3">
              <i class="ph-bold ph-megaphone text-xl"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white font-heading">Class Announcements</h3>
            <p class="text-xs text-slate-500 mt-1">
              Broadcast announcements for Class 8-A or 8-B. You can delete your own notices anytime.
            </p>
          </div>
          <button onclick="window.openNoticeModal()" class="btn btn-outline w-full mt-4">
            <i class="ph-bold ph-paper-plane-tilt"></i> Post Announcement
          </button>
        </div>

      </div>

    </div>
  `;
}

// 3. STUDENT DASHBOARD
function renderStudentDashboard(user) {
  const stats = store.getStudentStats(user.id);
  const notices = store.getNotices();

  return `
    <div class="space-y-6">
      
      <div class="glass-card p-6 bg-gradient-to-r from-emerald-900 to-teal-900 text-white border-none shadow-xl">
        <div class="flex items-center gap-4">
          <img src="${user.avatar}" class="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-lg">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-200">Student Account</span>
            <h1 class="text-2xl sm:text-3xl font-bold font-heading">Hi, ${user.name}!</h1>
            <p class="text-xs text-emerald-100">
              Class <strong>${user.classId || '8A'}</strong> • Roll No: <strong>${user.rollNo || 'N/A'}</strong>
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div class="glass-card p-6 flex flex-col items-center justify-center text-center">
          <h3 class="text-base font-bold text-slate-900 dark:text-white font-heading mb-4">Morning Attendance Rate</h3>
          
          <div class="relative w-36 h-36 flex items-center justify-center my-2">
            <svg class="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" stroke="currentColor" stroke-width="10" class="text-slate-200 dark:text-slate-800" fill="transparent" />
              <circle cx="50" cy="50" r="42" stroke="currentColor" stroke-width="10" 
                      class="${stats.percentage >= 90 ? 'text-emerald-500' : 'text-amber-500'} progress-ring-circle" 
                      stroke-dasharray="264" 
                      stroke-dashoffset="${264 - (264 * stats.percentage) / 100}" 
                      stroke-linecap="round" fill="transparent" />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-2xl font-black text-slate-900 dark:text-white font-heading">${stats.percentage}%</span>
              <span class="text-[10px] text-slate-500 font-bold uppercase">Presence Rate</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 w-full mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
            <div class="text-center">
              <div class="font-black text-emerald-600 text-base">${stats.present}</div>
              <div class="text-[10px] text-slate-400 font-bold uppercase">Days Present</div>
            </div>
            <div class="text-center">
              <div class="font-black text-red-600 text-base">${stats.absent}</div>
              <div class="text-[10px] text-slate-400 font-bold uppercase">Days Absent</div>
            </div>
          </div>
        </div>

        <div class="glass-card p-6 lg:col-span-2 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white font-heading">Recent Announcements</h3>
            <button onclick="window.router.navigate('notices')" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
              View All →
            </button>
          </div>

          <div class="space-y-3">
            ${notices.length === 0 ? `
              <div class="py-6 text-center text-slate-400 text-xs">No notices posted for your class yet.</div>
            ` : notices.slice(0, 4).map(n => `
              <div class="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div class="font-bold text-sm text-slate-900 dark:text-white">${n.title}</div>
                <p class="text-xs text-slate-600 dark:text-slate-300 mt-1">${n.content}</p>
                <div class="text-[10px] text-slate-400 mt-2">Posted by ${n.authorName}</div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>

    </div>
  `;
}
