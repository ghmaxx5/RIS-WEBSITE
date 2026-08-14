// RIS School — Production Login & Security Portal Component
import { store } from '../store.js';

export function renderLogin() {
  const users = store.getUsers();
  const teachers = users.filter(u => u.role === 'teacher');
  const students = users.filter(u => u.role === 'student');

  return `
    <div class="max-w-4xl mx-auto py-8 space-y-8">
      
      <!-- School Portal Hero Header -->
      <div class="text-center space-y-3">
        <div class="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 mx-auto flex items-center justify-center text-white font-extrabold text-3xl shadow-xl shadow-blue-500/30 border border-white/20">
          <i class="ph-bold ph-graduation-cap"></i>
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
          Rose International School
        </h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
          Official Academic Portal for Class 8-A & Class 8-B. Please select your profile or register to sign in.
        </p>
      </div>

      <!-- Role Selection Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- 1. STUDENT ENTRY -->
        <div class="glass-card p-6 flex flex-col justify-between space-y-4 border-2 border-emerald-500/20 hover:border-emerald-500/50">
          <div class="space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-2xl font-bold">
              <i class="ph-bold ph-student"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold text-slate-900 dark:text-white font-heading">Student Login</h3>
              <p class="text-xs text-slate-500 mt-1">
                View Class 8-A or 8-B morning presence rates and announcements.
              </p>
            </div>

            ${students.length > 0 ? `
              <div>
                <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Select Student Profile</label>
                <select id="login-student-select" class="form-select text-xs font-bold">
                  ${students.map(s => `<option value="${s.id}">${s.name} (Class ${s.classId})</option>`).join('')}
                </select>
              </div>
            ` : `
              <div class="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500">
                No student accounts registered yet. Click below to join!
              </div>
            `}
          </div>

          <div class="space-y-2 pt-2">
            ${students.length > 0 ? `
              <button onclick="window.handleStudentLogin()" class="btn btn-success w-full text-xs py-2.5">
                <i class="ph-bold ph-sign-in"></i> Sign In as Student
              </button>
            ` : ''}
            <button onclick="window.openRegistrationModal()" class="btn btn-outline w-full text-xs py-2">
              <i class="ph-bold ph-user-plus"></i> + Join as Student
            </button>
          </div>
        </div>

        <!-- 2. TEACHER ENTRY (Passcode Protected) -->
        <div class="glass-card p-6 flex flex-col justify-between space-y-4 border-2 border-blue-500/20 hover:border-blue-500/50">
          <div class="space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center text-2xl font-bold">
              <i class="ph-bold ph-chalkboard-teacher"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold text-slate-900 dark:text-white font-heading">Teacher Portal 🔒</h3>
              <p class="text-xs text-slate-500 mt-1">
                Faculty roll call, notices broadcast, and staff check-in.
              </p>
            </div>

            ${teachers.length > 0 ? `
              <div>
                <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Select Teacher Profile</label>
                <select id="login-teacher-select" class="form-select text-xs font-bold">
                  ${teachers.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
                </select>
              </div>
            ` : `
              <div class="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500">
                No teacher accounts registered yet.
              </div>
            `}
          </div>

          <div class="space-y-2 pt-2">
            ${teachers.length > 0 ? `
              <button onclick="window.handleTeacherLogin()" class="btn btn-primary w-full text-xs py-2.5">
                <i class="ph-bold ph-sign-in"></i> Teacher Sign In
              </button>
            ` : ''}
            <button onclick="window.openRegistrationModal()" class="btn btn-outline w-full text-xs py-2">
              <i class="ph-bold ph-lock"></i> + Register as Teacher
            </button>
          </div>
        </div>

        <!-- 3. ADMIN / PRINCIPAL ENTRY (PIN Protected) -->
        <div class="glass-card p-6 flex flex-col justify-between space-y-4 border-2 border-rose-500/20 hover:border-rose-500/50">
          <div class="space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center text-2xl font-bold">
              <i class="ph-bold ph-shield-check"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold text-slate-900 dark:text-white font-heading">Admin / Principal</h3>
              <p class="text-xs text-slate-500 mt-1">
                Full school management. Security PIN required.
              </p>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Admin Security PIN</label>
              <input type="password" id="login-admin-pin" placeholder="Enter PIN (8888)" class="form-input text-xs font-mono">
            </div>
          </div>

          <div class="pt-2">
            <button onclick="window.handleAdminLogin()" class="btn bg-rose-600 hover:bg-rose-700 text-white w-full text-xs py-2.5 font-bold shadow-lg shadow-rose-600/30">
              <i class="ph-bold ph-key"></i> Authenticate Admin
            </button>
          </div>
        </div>

      </div>

    </div>
  `;
}
