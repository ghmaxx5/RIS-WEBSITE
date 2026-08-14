// RIS School — Navbar Component (With Mobile Navigation Drawer)
import { store } from '../store.js';
import { db } from '../db.js';

export function renderNavbar() {
  const user = store.getCurrentUser();
  const allUsers = store.getUsers();
  const notices = store.getNotices();
  
  const unreadNotices = user ? notices.filter(n => !n.readBy.includes(user.id)) : [];
  const unreadCount = unreadNotices.length;
  const isAdminActive = store.isAdminSessionActive();

  return `
    <header class="top-header">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          
          <!-- Brand Logo & Title -->
          <div class="flex items-center gap-3 cursor-pointer" onclick="window.router.navigate('${user ? 'dashboard' : 'login'}')">
            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
              <i class="ph-bold ph-graduation-cap text-2xl"></i>
            </div>
            <div>
              <div class="font-extrabold text-base sm:text-lg tracking-tight leading-none text-white font-heading">RIS SCHOOL</div>
              <div class="text-[11px] sm:text-xs text-blue-200 font-medium">Rose International School</div>
            </div>
          </div>

          <!-- Desktop & Mobile Right Actions -->
          <div class="flex items-center gap-2">
            
            <!-- Cloud DB Connection Indicator (Hidden on tiny screens) -->
            <button onclick="window.openDbModal()" class="hidden md:flex btn ${db.isConnected ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-800 text-slate-300 border-slate-700'} text-[11px] px-2.5 py-1 rounded-full border items-center gap-1 font-semibold">
              <span class="w-2 h-2 rounded-full ${db.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}"></span>
              <span>${db.isConnected ? 'Cloud DB' : 'DB Config'}</span>
            </button>

            <!-- Join App Button -->
            <button onclick="window.openRegistrationModal()" class="btn bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white text-xs px-3 py-1.5 rounded-full shadow-md font-bold flex items-center gap-1">
              <i class="ph-bold ph-user-plus text-sm"></i>
              <span class="hidden xs:inline">+ Join</span>
            </button>

            ${user ? `
              <!-- PRINCIPAL ACCOUNT SWITCHER DROPDOWN -->
              ${isAdminActive ? `
                <div class="hidden sm:flex items-center bg-blue-950/90 px-3 py-1 rounded-full border border-blue-700/60 shadow-lg">
                  <span class="text-xs text-blue-300 font-bold hidden lg:flex items-center gap-1 mr-1">
                    <i class="ph-bold ph-shield-check text-emerald-400"></i> Admin Switch:
                  </span>
                  <select id="role-switcher-select" class="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer max-w-[140px] sm:max-w-none">
                    ${allUsers.map(u => `
                      <option value="${u.id}" ${u.id === user.id ? 'selected' : ''} class="bg-slate-900 text-white">
                        ${u.name} (${u.role.toUpperCase()}${u.classId ? ' - Class ' + u.classId : ''})
                      </option>
                    `).join('')}
                  </select>

                  ${user.id !== 'admin-1' ? `
                    <button onclick="window.handleReturnToAdmin()" class="btn bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold ml-1">
                      👑 Admin
                    </button>
                  ` : ''}
                </div>
              ` : `
                <!-- REGULAR USER CHIP -->
                <div class="hidden sm:flex items-center gap-2 bg-slate-800/90 px-3 py-1 rounded-full border border-slate-700 text-xs text-white">
                  <img src="${user.avatar}" class="w-6 h-6 rounded-full object-cover">
                  <span class="font-bold hidden md:inline">${user.name}</span>
                  <span class="badge ${user.role === 'teacher' ? 'badge-info' : 'badge-success'} text-[10px] uppercase">
                    ${user.role}
                  </span>
                </div>
              `}

              <!-- Notification Bell -->
              <div class="relative">
                <button id="notification-bell-btn" class="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition relative">
                  <i class="ph-bold ph-bell text-xl"></i>
                  ${unreadCount > 0 ? `
                    <span class="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-extrabold flex items-center justify-center animate-bounce">
                      ${unreadCount}
                    </span>
                  ` : ''}
                </button>

                <div id="notifications-dropdown" class="hidden absolute right-0 mt-2 w-72 sm:w-96 glass-card bg-slate-900/95 border-slate-700 text-slate-100 rounded-2xl shadow-2xl p-4 z-50">
                  <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                    <div class="font-bold text-sm flex items-center gap-2">
                      <i class="ph-bold ph-bell-ringing text-blue-400"></i> Announcements
                    </div>
                    <span class="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-semibold">${unreadCount} Unread</span>
                  </div>
                  <div class="max-h-72 overflow-y-auto space-y-2 pr-1">
                    ${notices.length === 0 ? `<div class="text-xs text-slate-400">No active announcements.</div>` : ''}
                    ${notices.slice(0, 5).map(n => `
                      <div class="p-3 rounded-xl ${n.readBy.includes(user.id) ? 'bg-slate-800/40' : 'bg-blue-950/50 border border-blue-800/50'} text-xs cursor-pointer" onclick="window.markNoticeRead('${n.id}')">
                        <div class="font-bold text-white mb-1">${n.title}</div>
                        <p class="text-slate-300 line-clamp-2">${n.content}</p>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>

              <!-- Sign Out Button -->
              <button onclick="window.handleLogout()" class="btn bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs py-1 px-2.5">
                <i class="ph-bold ph-sign-out text-base"></i>
              </button>
            ` : `
              <!-- Sign In Button -->
              <button onclick="window.router.navigate('login')" class="btn btn-primary text-xs py-1.5 px-3">
                <i class="ph-bold ph-sign-in"></i> Sign In
              </button>
            `}

            <!-- Mobile Menu Hamburger Button -->
            ${user ? `
              <button id="mobile-menu-btn" class="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition">
                <i class="ph-bold ph-list text-2xl"></i>
              </button>
            ` : ''}

          </div>
        </div>

        <!-- Desktop Navigation Sub-Bar -->
        ${user ? `
          <nav class="hidden md:flex items-center space-x-1 py-2 border-t border-slate-800">
            <a href="#dashboard" onclick="window.router.navigate('dashboard')" class="nav-link text-slate-300 hover:text-white" id="nav-dashboard">
              <i class="ph-bold ph-squares-four text-lg"></i>
              <span>Dashboard</span>
            </a>
            <a href="#notices" onclick="window.router.navigate('notices')" class="nav-link text-slate-300 hover:text-white" id="nav-notices">
              <i class="ph-bold ph-megaphone text-lg"></i>
              <span>Notice Board</span>
            </a>
            <a href="#student-attendance" onclick="window.router.navigate('student-attendance')" class="nav-link text-slate-300 hover:text-white" id="nav-student-attendance">
              <i class="ph-bold ph-user-check text-lg"></i>
              <span>Morning Attendance</span>
            </a>
            <a href="#staff-attendance" onclick="window.router.navigate('staff-attendance')" class="nav-link text-slate-300 hover:text-white" id="nav-staff-attendance">
              <i class="ph-bold ph-identification-card text-lg"></i>
              <span>Staff & Leaves</span>
            </a>
            <a href="#reports" onclick="window.router.navigate('reports')" class="nav-link text-slate-300 hover:text-white" id="nav-reports">
              <i class="ph-bold ph-chart-bar text-lg"></i>
              <span>Analytics</span>
            </a>
          </nav>

          <!-- Mobile Slide-Down Navigation Drawer -->
          <div id="mobile-nav-menu" class="hidden md:hidden py-3 border-t border-slate-800 space-y-2">
            
            ${isAdminActive ? `
              <div class="p-3 bg-blue-950/80 rounded-xl border border-blue-800 mb-2">
                <div class="text-xs text-blue-300 font-bold mb-1 flex items-center gap-1">
                  <i class="ph-bold ph-shield-check text-emerald-400"></i> Principal Switcher:
                </div>
                <select id="mobile-role-switcher-select" class="form-select text-xs font-bold bg-slate-900 text-white">
                  ${allUsers.map(u => `
                    <option value="${u.id}" ${u.id === user.id ? 'selected' : ''}>
                      ${u.name} (${u.role.toUpperCase()}${u.classId ? ' - Class ' + u.classId : ''})
                    </option>
                  `).join('')}
                </select>
              </div>
            ` : ''}

            <a href="#dashboard" onclick="window.router.navigate('dashboard'); window.closeMobileMenu()" class="nav-link text-slate-300 hover:text-white">
              <i class="ph-bold ph-squares-four text-xl"></i>
              <span class="text-base font-bold">Dashboard</span>
            </a>
            <a href="#notices" onclick="window.router.navigate('notices'); window.closeMobileMenu()" class="nav-link text-slate-300 hover:text-white">
              <i class="ph-bold ph-megaphone text-xl"></i>
              <span class="text-base font-bold">Notice Board</span>
            </a>
            <a href="#student-attendance" onclick="window.router.navigate('student-attendance'); window.closeMobileMenu()" class="nav-link text-slate-300 hover:text-white">
              <i class="ph-bold ph-user-check text-xl"></i>
              <span class="text-base font-bold">Morning Attendance</span>
            </a>
            <a href="#staff-attendance" onclick="window.router.navigate('staff-attendance'); window.closeMobileMenu()" class="nav-link text-slate-300 hover:text-white">
              <i class="ph-bold ph-identification-card text-xl"></i>
              <span class="text-base font-bold">Staff & Leaves</span>
            </a>
            <a href="#reports" onclick="window.router.navigate('reports'); window.closeMobileMenu()" class="nav-link text-slate-300 hover:text-white">
              <i class="ph-bold ph-chart-bar text-xl"></i>
              <span class="text-base font-bold">Analytics</span>
            </a>

            <button onclick="window.openDbModal(); window.closeMobileMenu()" class="btn bg-slate-800 text-slate-300 text-xs w-full mt-2">
              <i class="ph-bold ph-database text-lg"></i> Cloud DB Config
            </button>
          </div>
        ` : ''}
      </div>
    </header>

    <!-- CLOUD DB PAIRING MODAL -->
    <div id="db-config-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div class="glass-card bg-white dark:bg-slate-900 w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-4">
        <div class="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
              <i class="ph-bold ph-database text-blue-500"></i> Cloud Database Connection
            </h3>
            <p class="text-xs text-slate-500">Pair free Supabase PostgreSQL Cloud database for multi-device sync.</p>
          </div>
          <button onclick="window.closeDbModal()" class="text-slate-400 text-xl font-bold">&times;</button>
        </div>

        <form id="db-config-form" onsubmit="window.handleSaveDbCredentials(event)" class="space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Supabase Project URL</label>
            <input type="url" name="url" value="${db.config.url || ''}" placeholder="https://xyzcompany.supabase.co" class="form-input text-xs">
          </div>

          <div>
            <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Supabase Anon Key</label>
            <input type="password" name="key" value="${db.config.key || ''}" placeholder="eyJhbGciOiJIUzI1..." class="form-input text-xs">
          </div>

          <div class="flex justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button type="button" onclick="window.closeDbModal()" class="btn btn-outline">Cancel</button>
            <button type="submit" class="btn btn-primary"><i class="ph-bold ph-plugs-connected"></i> Save & Connect</button>
          </div>
        </form>
      </div>
    </div>

    <!-- SECURED USER REGISTRATION MODAL -->
    <div id="registration-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div class="glass-card bg-white dark:bg-slate-900 w-full max-w-lg p-6 rounded-2xl shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
              <i class="ph-bold ph-user-plus text-emerald-500"></i> Join RIS School Portal
            </h3>
            <p class="text-xs text-slate-500">Register as a Teacher or Student for Class 8-A / 8-B.</p>
          </div>
          <button onclick="window.closeRegistrationModal()" class="text-slate-400 text-xl font-bold">&times;</button>
        </div>

        <form id="registration-form" onsubmit="window.handleUserRegistration(event)" class="space-y-4">
          
          <div>
            <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Select Account Type</label>
            <div class="grid grid-cols-2 gap-3">
              <label class="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer font-bold text-xs text-slate-800 dark:text-slate-200">
                <input type="radio" name="role" value="student" checked onchange="window.toggleRegRoleFields('student')">
                <i class="ph-bold ph-student text-emerald-500 text-lg"></i> Student
              </label>
              <label class="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer font-bold text-xs text-slate-800 dark:text-slate-200">
                <input type="radio" name="role" value="teacher" onchange="window.toggleRegRoleFields('teacher')">
                <i class="ph-bold ph-chalkboard-teacher text-blue-500 text-lg"></i> Teacher 🔒
              </label>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Full Name</label>
            <input type="text" name="name" placeholder="e.g. Ramesh Kumar" class="form-input" required>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Email Address</label>
            <input type="email" name="email" placeholder="e.g. ramesh@risschool.edu" class="form-input" required>
          </div>

          <!-- TEACHER SECURITY CODE FIELD -->
          <div id="reg-teacher-fields" class="space-y-3 hidden">
            <div class="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-xs text-amber-800 dark:text-amber-300">
              <i class="ph-bold ph-lock text-base"></i> <strong>Teacher Security Required:</strong> Enter the official teacher passcode to verify your faculty status.
            </div>

            <div>
              <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Teacher Security Passcode</label>
              <input type="password" name="teacherPasscode" placeholder="Enter security passcode (e.g. RIS2026)" class="form-input font-mono">
            </div>

            <div>
              <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Homeroom Advisor Class</label>
              <select name="homeroomClass" class="form-select font-bold">
                <option value="">None (Subject Teacher)</option>
                <option value="8A">Class 8-A</option>
                <option value="8B">Class 8-B</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Primary Subject Taught</label>
              <input type="text" name="subjects" placeholder="e.g. Mathematics, Science" class="form-input">
            </div>
          </div>

          <!-- STUDENT CLASS SELECTION -->
          <div id="reg-student-fields" class="space-y-3">
            <div>
              <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Class Section</label>
              <select name="classId" class="form-select font-bold">
                <option value="8A">Class 8-A</option>
                <option value="8B">Class 8-B</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase text-slate-500 mb-1">Roll Number</label>
              <input type="text" name="rollNo" placeholder="e.g. 8A-12" class="form-input">
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button type="button" onclick="window.closeRegistrationModal()" class="btn btn-outline">Cancel</button>
            <button type="submit" class="btn btn-primary"><i class="ph-bold ph-check"></i> Complete Registration</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

export function setupNavbarEvents() {
  const roleSelect = document.getElementById('role-switcher-select');
  if (roleSelect) {
    roleSelect.addEventListener('change', (e) => {
      const selectedUserId = e.target.value;
      const res = store.switchAsPrincipal(selectedUserId);
      if (!res.success) {
        alert(res.error);
        return;
      }
      window.location.reload();
    });
  }

  const mobileRoleSelect = document.getElementById('mobile-role-switcher-select');
  if (mobileRoleSelect) {
    mobileRoleSelect.addEventListener('change', (e) => {
      const selectedUserId = e.target.value;
      const res = store.switchAsPrincipal(selectedUserId);
      if (!res.success) {
        alert(res.error);
        return;
      }
      window.location.reload();
    });
  }

  // Mobile menu drawer toggle
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-nav-menu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  window.closeMobileMenu = () => {
    if (mobileMenu) mobileMenu.classList.add('hidden');
  };

  const bellBtn = document.getElementById('notification-bell-btn');
  const dropdown = document.getElementById('notifications-dropdown');
  if (bellBtn && dropdown) {
    bellBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && e.target !== bellBtn) {
        dropdown.classList.add('hidden');
      }
    });
  }

  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
    });
  }
}
