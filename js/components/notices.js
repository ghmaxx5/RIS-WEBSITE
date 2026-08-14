// RIS School — Notices Component (Class 8A & 8B Scoped)
import { store } from '../store.js';

export function renderNotices() {
  const user = store.getCurrentUser();
  const isTeacherOrAdmin = user.role === 'teacher' || user.role === 'admin';
  const notices = store.getNotices();

  return `
    <div class="space-y-6">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white font-heading">
            Notice Board & Announcements
          </h1>
          <p class="text-slate-500 dark:text-slate-400 text-sm">
            Official announcements for Class 8-A, Class 8-B, and faculty.
          </p>
        </div>

        ${isTeacherOrAdmin ? `
          <button onclick="window.openNoticeModal()" class="btn btn-primary shadow-lg">
            <i class="ph-bold ph-megaphone text-lg"></i> Post Announcement
          </button>
        ` : ''}
      </div>

      <!-- Filters & Tabs -->
      <div class="glass-card p-4 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2 overflow-x-auto">
          <button onclick="window.filterNotices('all')" class="btn btn-primary text-xs py-1.5" id="tab-notice-all">
            All Notices (${notices.length})
          </button>
          <button onclick="window.filterNotices('urgent')" class="btn btn-outline text-xs py-1.5 text-red-600 dark:text-red-400 border-red-200" id="tab-notice-urgent">
            🚨 Urgent Only
          </button>
        </div>
      </div>

      <!-- Notices Feed List -->
      <div id="notices-feed-container" class="space-y-4">
        ${notices.length === 0 ? `
          <div class="glass-card p-8 text-center text-slate-400">No active announcements posted.</div>
        ` : notices.map(n => renderNoticeCard(n, user)).join('')}
      </div>

    </div>

    <!-- CREATE NOTICE MODAL -->
    <div id="create-notice-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
      <div class="glass-card bg-white dark:bg-slate-900 w-full max-w-lg p-6 rounded-2xl shadow-2xl space-y-4">
        <div class="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
            <i class="ph-bold ph-megaphone text-amber-500"></i> Broadcast Announcement
          </h3>
          <button onclick="window.closeNoticeModal()" class="text-slate-400 text-xl font-bold">&times;</button>
        </div>

        <form id="create-notice-form" onsubmit="window.handleCreateNotice(event)" class="space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Announcement Title</label>
            <input type="text" name="title" placeholder="e.g. Class 8-A Morning Test Rescheduled" class="form-input" required>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Target Audience</label>
              <select name="targetAudience" class="form-select font-bold" required>
                <option value="Whole School">Whole School</option>
                <option value="8A">Class 8-A</option>
                <option value="8B">Class 8-B</option>
                <option value="Staff Only">Staff Only</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Priority Level</label>
              <select name="priority" class="form-select" required>
                <option value="normal">Normal</option>
                <option value="important">Important</option>
                <option value="urgent">🚨 URGENT (High Alert)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Notice Content</label>
            <textarea name="content" rows="4" placeholder="Write full details of the notice here..." class="form-textarea" required></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button type="button" onclick="window.closeNoticeModal()" class="btn btn-outline">Cancel</button>
            <button type="submit" class="btn btn-primary"><i class="ph-bold ph-paper-plane-tilt"></i> Broadcast Notice</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderNoticeCard(n, user) {
  const isUrgent = n.priority === 'urgent';
  const canDelete = store.canDeleteNotice(n.id);

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
}
