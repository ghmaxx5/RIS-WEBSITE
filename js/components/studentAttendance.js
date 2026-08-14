// RIS School — Daily Morning Student Attendance Component (Strict Student Read-Only Lock)
import { store } from '../store.js';

export function renderStudentAttendance() {
  const user = store.getCurrentUser();
  // Strictly enforce that students cannot mark attendance under any circumstances!
  const isTeacherOrAdmin = user && user.role !== 'student' && (store.isAdminSessionActive() || user.role === 'teacher' || user.role === 'admin');
  const classes = store.getClasses();
  
  const defaultClassId = (user && (user.homeroomClass || user.classId)) || '8A';
  const todayStr = new Date().toISOString().split('T')[0];

  return `
    <div class="space-y-6 pb-20 md:pb-0">
      
      <!-- Section Header Banner -->
      <div class="glass-card p-4 sm:p-6 bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-900 text-white border-none shadow-xl">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3 sm:gap-4">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400 text-xl sm:text-2xl border border-white/20">
              <i class="ph-bold ph-sun"></i>
            </div>
            <div>
              <span class="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-200">Daily Academic Register</span>
              <h1 class="text-xl sm:text-3xl font-bold font-heading">Morning Attendance</h1>
              <p class="text-xs text-blue-100 mt-0.5">
                ${isTeacherOrAdmin ? 'Mark Present (P) or Absent (A) for Class 8-A and Class 8-B.' : 'Official Class 8-A and 8-B Morning Register (Read Only).'}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button onclick="window.toggleAuditLogDrawer()" class="btn bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs py-2">
              <i class="ph-bold ph-clock-counter-clockwise text-lg"></i> Audit Log
            </button>
          </div>
        </div>
      </div>

      <!-- Class & Date Selection Bar -->
      <div class="glass-card p-4 sm:p-5 space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          
          <div>
            <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Select Class Section</label>
            <select id="att-class-select" class="form-select font-bold text-sm" onchange="window.loadAttendanceSheet()">
              ${classes.map(c => `<option value="${c.id}" ${c.id === defaultClassId ? 'selected' : ''}>${c.name}</option>`).join('')}
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Date</label>
            <input type="date" id="att-date-input" value="${todayStr}" class="form-input font-bold text-sm" onchange="window.loadAttendanceSheet()">
          </div>

        </div>

        <!-- Fast Bulk Action Bar (Hidden for Students) -->
        ${isTeacherOrAdmin ? `
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <div class="flex items-center gap-2">
              <button onclick="window.markAllPresent()" class="btn btn-success text-xs py-2 px-4 shadow-lg font-bold w-full sm:w-auto">
                <i class="ph-bold ph-check-circle text-base"></i> Mark All Present
              </button>
            </div>

            <div id="att-summary-counters" class="flex items-center justify-around sm:justify-end gap-3 text-xs font-bold">
              <span class="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-200" id="count-present">0 Present</span>
              <span class="text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-3 py-1.5 rounded-full border border-rose-200" id="count-absent">0 Absent</span>
            </div>
          </div>
        ` : `
          <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs font-bold" id="att-summary-counters">
            <span class="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-200" id="count-present">0 Present</span>
            <span class="text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-3 py-1.5 rounded-full border border-rose-200" id="count-absent">0 Absent</span>
          </div>
        `}
      </div>

      <!-- Student Attendance Roster Grid -->
      <div class="glass-card p-4 sm:p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-heading">
            Class Roster & Roll Call
          </h3>
          <span class="text-[11px] text-slate-500 hidden sm:inline">
            ${isTeacherOrAdmin ? "Tap P or A to toggle attendance status." : "Read-Only View for Students"}
          </span>
        </div>

        <div id="attendance-roster-container" class="space-y-3">
          <!-- Dynamic Roster Rows -->
        </div>

        ${isTeacherOrAdmin ? `
          <div class="hidden sm:flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button onclick="window.saveAttendanceRegister()" class="btn btn-primary shadow-xl px-8 py-3 text-base font-extrabold">
              <i class="ph-bold ph-floppy-disk text-xl"></i> Save Morning Register
            </button>
          </div>
        ` : ''}
      </div>

      <!-- MOBILE STICKY BOTTOM SAVE BAR FOR TEACHERS ONLY -->
      ${isTeacherOrAdmin ? `
        <div class="mobile-sticky-bar sm:hidden">
          <button onclick="window.saveAttendanceRegister()" class="btn btn-primary w-full py-3.5 text-base font-extrabold shadow-2xl">
            <i class="ph-bold ph-floppy-disk text-xl"></i> Save Morning Register
          </button>
        </div>
      ` : ''}

      <!-- AUDIT LOG DRAWER -->
      <div id="audit-log-drawer" class="hidden glass-card p-4 sm:p-6 space-y-4 border-2 border-slate-700">
        <div class="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
            <i class="ph-bold ph-clock-counter-clockwise text-blue-500"></i> Attendance Audit Trail
          </h3>
          <button onclick="window.toggleAuditLogDrawer()" class="text-slate-400 text-xl font-bold">&times;</button>
        </div>

        <div class="space-y-3 max-h-80 overflow-y-auto pr-1">
          ${store.getAuditLogs().map(a => `
            <div class="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs border border-slate-200 dark:border-slate-700">
              <div class="flex items-center justify-between text-slate-500 mb-1">
                <span class="font-bold text-slate-900 dark:text-white">${a.actorName} (${a.actorRole})</span>
                <span>${new Date(a.timestamp).toLocaleString()}</span>
              </div>
              <p class="text-slate-700 dark:text-slate-300">${a.details}</p>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}
