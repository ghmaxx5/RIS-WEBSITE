// RIS School — Homework Management Component (Clean Instructions & Completion Toggle)
import { store } from '../store.js';

export function renderHomework() {
  const user = store.getCurrentUser();
  const isTeacherOrAdmin = user.role === 'teacher' || user.role === 'admin';
  const classes = store.getClasses();
  const subjects = store.getSubjects();

  const activeClass = isTeacherOrAdmin ? 'all' : user.classId;
  const homeworkList = store.getHomework({ classId: activeClass });

  return `
    <div class="space-y-6">
      
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white font-heading">
            Homework & Daily Tasks
          </h1>
          <p class="text-slate-500 dark:text-slate-400 text-sm">
            ${isTeacherOrAdmin ? 'Post homework assignments and instructions for your classes.' : 'View daily homework posted by your subject teachers.'}
          </p>
        </div>

        ${isTeacherOrAdmin ? `
          <button onclick="window.openHomeworkModal()" class="btn btn-primary shadow-lg">
            <i class="ph-bold ph-plus-circle text-lg"></i> Post Homework
          </button>
        ` : ''}
      </div>

      <!-- Search & Filters Bar -->
      <div class="glass-card p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div class="relative w-full md:w-80">
          <i class="ph-bold ph-magnifying-glass absolute left-3 top-3 text-slate-400 text-lg"></i>
          <input type="text" id="hw-search-input" placeholder="Search homework title or topic..." 
                 class="form-input pl-10" onkeyup="window.filterHomework()">
        </div>

        <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select id="hw-filter-subject" class="form-select text-xs py-2" onchange="window.filterHomework()">
            <option value="all">All Subjects</option>
            ${subjects.map(s => `<option value="${s}">${s}</option>`).join('')}
          </select>

          ${isTeacherOrAdmin ? `
            <select id="hw-filter-class" class="form-select text-xs py-2" onchange="window.filterHomework()">
              <option value="all">All Classes</option>
              ${classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
            </select>
          ` : ''}
        </div>
      </div>

      <!-- Homework Feed List -->
      <div id="homework-feed-container" class="space-y-4">
        ${homeworkList.length === 0 ? `
          <div class="glass-card p-8 text-center text-slate-400 space-y-2">
            <i class="ph-bold ph-book-open text-4xl text-blue-500"></i>
            <p class="font-bold text-sm text-slate-700 dark:text-slate-200">No active homework assigned yet.</p>
            <p class="text-xs text-slate-500">${isTeacherOrAdmin ? 'Click "Post Homework" above to create an assignment.' : 'Check back later for updates.'}</p>
          </div>
        ` : homeworkList.map(h => renderHomeworkCard(h, user)).join('')}
      </div>

    </div>

    <!-- CREATE HOMEWORK MODAL (No file uploads required) -->
    <div id="create-hw-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
      <div class="glass-card bg-white dark:bg-slate-900 w-full max-w-xl p-6 rounded-2xl shadow-2xl space-y-4">
        <div class="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
            <i class="ph-bold ph-file-plus text-blue-600"></i> Post Homework Assignment
          </h3>
          <button onclick="window.closeHomeworkModal()" class="text-slate-400 text-xl font-bold">&times;</button>
        </div>

        <form id="create-hw-form" onsubmit="window.handleCreateHomework(event)" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Subject</label>
              <select name="subject" class="form-select" required>
                ${subjects.map(s => `<option value="${s}">${s}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Target Class</label>
              <select name="classId" class="form-select" required>
                ${classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Homework Topic / Title</label>
            <input type="text" name="title" placeholder="e.g. Chapter 4 Practice Questions 1-15" class="form-input" required>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Due Date</label>
            <input type="date" name="dueDate" class="form-input" required>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Homework Instructions</label>
            <textarea name="description" rows="4" placeholder="Provide textbook page numbers, problems, or notebook tasks..." class="form-textarea" required></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button type="button" onclick="window.closeHomeworkModal()" class="btn btn-outline">Cancel</button>
            <button type="submit" class="btn btn-primary"><i class="ph-bold ph-check-circle"></i> Publish Post</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderHomeworkCard(h, user) {
  const isTeacherOrAdmin = user.role === 'teacher' || user.role === 'admin';
  const isCompletedByStudent = (h.completedBy || []).includes(user.id);
  const completedCount = (h.completedBy || []).length;
  const isAuthorOrAdmin = user.role === 'admin' || h.teacherId === user.id;

  return `
    <div class="glass-card p-6 space-y-4">
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <div class="flex items-center gap-2">
            <span class="badge badge-info font-bold">${h.subject}</span>
            <span class="text-xs font-bold text-slate-500">Class ${h.classId}</span>
            <span class="text-slate-400">•</span>
            <span class="text-xs text-slate-500">Teacher: ${h.teacherName}</span>
          </div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white font-heading mt-1">${h.title}</h3>
        </div>

        <div class="flex items-center gap-2">
          ${isAuthorOrAdmin ? `
            <button onclick="window.deleteHomeworkPost('${h.id}')" class="btn btn-outline text-xs py-1 text-red-600 border-red-200 hover:bg-red-50">
              <i class="ph-bold ph-trash"></i> Delete
            </button>
          ` : ''}
        </div>
      </div>

      <p class="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">${h.description}</p>

      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
        <div class="flex items-center gap-4">
          <span><i class="ph-bold ph-calendar"></i> Posted: ${new Date(h.createdAt).toLocaleDateString()}</span>
          <span><i class="ph-bold ph-clock text-amber-500 font-bold"></i> Due: ${new Date(h.dueDate).toLocaleDateString()}</span>
        </div>

        <div>
          ${isTeacherOrAdmin ? `
            <span class="badge badge-success font-bold px-3 py-1">
              <i class="ph-bold ph-check"></i> ${completedCount} Students Completed
            </span>
          ` : `
            <button onclick="window.toggleHomeworkCompletion('${h.id}')" class="btn ${isCompletedByStudent ? 'btn-success' : 'btn-primary'} text-xs py-1.5">
              <i class="ph-bold ${isCompletedByStudent ? 'ph-check-circle' : 'ph-circle'} text-base"></i>
              ${isCompletedByStudent ? 'Marked Completed' : 'Mark as Completed'}
            </button>
          `}
        </div>
      </div>

    </div>
  `;
}
