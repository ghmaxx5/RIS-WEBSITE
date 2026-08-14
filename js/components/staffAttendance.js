// RIS School — Staff Attendance & Leave Management Component
import { store } from '../store.js';

export function renderStaffAttendance() {
  const user = store.getCurrentUser();
  const isAdmin = user.role === 'admin';
  const staffRoster = store.getStaffRoster();
  const leaveRequests = store.getLeaveRequests(isAdmin ? null : user.id);

  return `
    <div class="space-y-6">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white font-heading">
            Staff Attendance & Leave Workflow
          </h1>
          <p class="text-slate-500 dark:text-slate-400 text-sm">
            ${isAdmin ? 'Track real-time teacher presence and process leave applications.' : 'Check in for duty and submit absence leave requests.'}
          </p>
        </div>

        <div class="flex items-center gap-3">
          ${!isAdmin ? `
            <button onclick="window.openLeaveModal()" class="btn btn-primary shadow-lg">
              <i class="ph-bold ph-calendar-plus text-lg"></i> Submit Leave Request
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Main Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Daily Staff Roster Card -->
        <div class="glass-card p-6 lg:col-span-2 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white font-heading">Staff Daily Register</h3>
              <p class="text-xs text-slate-500">Live faculty attendance status for today</p>
            </div>
            <span class="badge badge-info">${staffRoster.filter(t => t.checkedIn).length} / ${staffRoster.length} Checked In</span>
          </div>

          <div class="divide-y divide-slate-200 dark:divide-slate-800">
            ${staffRoster.map(t => `
              <div class="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <img src="${t.avatar}" class="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700">
                  <div>
                    <div class="font-bold text-sm text-slate-900 dark:text-white">${t.name}</div>
                    <div class="text-xs text-slate-500">${t.title}</div>
                    <div class="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">${t.email}</div>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  ${t.status === 'Present' ? `
                    <span class="badge badge-success px-3 py-1 text-xs"><i class="ph-bold ph-check"></i> Checked In (${t.checkInTime})</span>
                  ` : (t.status === 'On Leave' ? `
                    <span class="badge badge-warning px-3 py-1 text-xs"><i class="ph-bold ph-calendar"></i> On Leave (${t.activeLeave?.leaveType})</span>
                  ` : `
                    <span class="badge badge-danger px-3 py-1 text-xs"><i class="ph-bold ph-x"></i> Not Checked In</span>
                  `)}

                  ${isAdmin ? `
                    <button onclick="window.toggleStaffCheckIn('${t.id}')" class="btn btn-outline text-xs py-1">
                      Toggle
                    </button>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Leave Requests List Card -->
        <div class="glass-card p-6 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white font-heading">Leave Applications</h3>
            <span class="badge badge-warning">${leaveRequests.filter(l => l.status === 'pending').length} Pending</span>
          </div>

          ${leaveRequests.length === 0 ? `
            <div class="py-8 text-center text-slate-400 text-sm">No leave applications recorded.</div>
          ` : `
            <div class="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              ${leaveRequests.map(l => `
                <div class="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div class="flex justify-between items-start">
                    <div>
                      <div class="font-bold text-sm text-slate-900 dark:text-white">${l.teacherName}</div>
                      <div class="text-xs text-slate-500 font-semibold">${l.leaveType}</div>
                    </div>
                    <span class="badge ${l.status === 'approved' ? 'badge-success' : (l.status === 'rejected' ? 'badge-danger' : 'badge-warning')} capitalize">
                      ${l.status}
                    </span>
                  </div>

                  <div class="text-xs text-slate-600 dark:text-slate-300">
                    <i class="ph-bold ph-calendar"></i> ${l.startDate} to ${l.endDate}
                  </div>
                  
                  <p class="text-xs text-slate-500 dark:text-slate-400 italic bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                    "${l.reason}"
                  </p>

                  ${l.reviewerNote ? `
                    <div class="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                      <strong>Admin Note:</strong> ${l.reviewerNote}
                    </div>
                  ` : ''}

                  ${isAdmin && l.status === 'pending' ? `
                    <div class="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <button onclick="window.approveLeave('${l.id}')" class="btn btn-success text-xs py-1 flex-1">Approve</button>
                      <button onclick="window.rejectLeave('${l.id}')" class="btn btn-outline text-xs py-1 text-red-600 border-red-200 flex-1">Reject</button>
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          `}
        </div>

      </div>

    </div>

    <!-- LEAVE REQUEST MODAL -->
    <div id="leave-request-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
      <div class="glass-card bg-white dark:bg-slate-900 w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-4">
        <div class="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
            <i class="ph-bold ph-calendar-plus text-blue-600"></i> Submit Leave Application
          </h3>
          <button onclick="window.closeLeaveModal()" class="text-slate-400 text-xl font-bold">&times;</button>
        </div>

        <form id="leave-request-form" onsubmit="window.handleCreateLeave(event)" class="space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Leave Type</label>
            <select name="leaveType" class="form-select" required>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Emergency Leave">Emergency Leave</option>
              <option value="Workshop / Training">Workshop / Training</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Start Date</label>
              <input type="date" name="startDate" class="form-input" required>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase text-slate-500 mb-1">End Date</label>
              <input type="date" name="endDate" class="form-input" required>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Reason / Explanation</label>
            <textarea name="reason" rows="3" placeholder="Provide reason for absence..." class="form-textarea" required></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button type="button" onclick="window.closeLeaveModal()" class="btn btn-outline">Cancel</button>
            <button type="submit" class="btn btn-primary"><i class="ph-bold ph-paper-plane-tilt"></i> Send Application</button>
          </div>
        </form>
      </div>
    </div>
  `;
}
