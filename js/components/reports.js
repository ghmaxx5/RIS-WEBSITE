// RIS School — Attendance Analytics & Reports Component (Dynamic Calculation)
import { store } from '../store.js';

export function renderReports() {
  const students = store.getUsers('student');
  
  const flaggedStudents = students.filter(s => {
    const stats = store.getStudentStats(s.id);
    return stats.flagChronic;
  });

  return `
    <div class="space-y-6">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white font-heading">
            Class 8-A & 8-B Attendance Analytics
          </h1>
          <p class="text-slate-500 dark:text-slate-400 text-sm">
            Real-time morning presence trends, class comparison averages, and absenteeism monitoring.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button onclick="window.print()" class="btn btn-primary">
            <i class="ph-bold ph-printer text-lg"></i> Print Official Report
          </button>
        </div>
      </div>

      <!-- Overview Chart & Flagged Students -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div class="glass-card p-6 lg:col-span-2 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white font-heading">Class Attendance Rate Comparison</h3>
              <p class="text-xs text-slate-500">Calculated from saved daily registers</p>
            </div>
            <span class="badge badge-success">Target: 95%+</span>
          </div>

          <div class="h-64 relative w-full">
            <canvas id="class-attendance-chart"></canvas>
          </div>
        </div>

        <div class="glass-card p-6 space-y-4 border-2 border-amber-500/40">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-8 h-8 rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center font-bold text-sm">⚠️</span>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white font-heading">Low Presence Alert</h3>
            </div>
            <span class="badge badge-warning">${flaggedStudents.length} Flagged</span>
          </div>

          ${flaggedStudents.length === 0 ? `
            <div class="py-8 text-center text-slate-400 text-xs">No students currently flagged (<85% presence).</div>
          ` : `
            <div class="space-y-3">
              ${flaggedStudents.map(s => {
                const stats = store.getStudentStats(s.id);
                return `
                  <div class="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                    <div class="flex items-center gap-3">
                      <img src="${s.avatar}" class="w-9 h-9 rounded-full object-cover">
                      <div>
                        <div class="font-bold text-slate-900 dark:text-white">${s.name}</div>
                        <div class="text-[10px] text-slate-400">Class ${s.classId} • Roll: ${s.rollNo}</div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="font-black text-red-600 text-sm">${stats.percentage}%</div>
                      <div class="text-[10px] text-slate-400">${stats.absent} Absences</div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>

      </div>

      <!-- All Students Table -->
      <div class="glass-card p-6 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white font-heading">Class 8-A & 8-B Attendance Records</h3>
          <input type="text" id="report-search" placeholder="Search student name or roll..." class="form-input text-xs w-full sm:w-64" onkeyup="window.filterReportsTable()">
        </div>

        <div class="overflow-x-auto">
          <table id="reports-table" class="w-full text-left text-xs">
            <thead class="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase">
              <tr>
                <th class="p-3">Student Name</th>
                <th class="p-3">Class & Roll</th>
                <th class="p-3">Total Days</th>
                <th class="p-3">Present</th>
                <th class="p-3">Absent</th>
                <th class="p-3">Attendance %</th>
                <th class="p-3">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
              ${students.length === 0 ? `
                <tr><td colspan="7" class="p-6 text-center text-slate-400">No students registered yet. Click "+ Join App" to register a student!</td></tr>
              ` : students.map(s => {
                const stats = store.getStudentStats(s.id);
                return `
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td class="p-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <img src="${s.avatar}" class="w-7 h-7 rounded-full object-cover">
                      ${s.name}
                    </td>
                    <td class="p-3 text-slate-600 dark:text-slate-400 font-bold">Class ${s.classId} (${s.rollNo})</td>
                    <td class="p-3 font-medium">${stats.totalDays}</td>
                    <td class="p-3 font-bold text-emerald-600">${stats.present}</td>
                    <td class="p-3 font-bold text-red-600">${stats.absent}</td>
                    <td class="p-3 font-black text-sm text-slate-900 dark:text-white">${stats.percentage}%</td>
                    <td class="p-3">
                      ${stats.flagChronic ? `
                        <span class="badge badge-danger">Low Presence Alert</span>
                      ` : (stats.percentage >= 95 ? `
                        <span class="badge badge-success">Excellent</span>
                      ` : `
                        <span class="badge badge-info">Normal</span>
                      `)}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

export function initReportsChart() {
  const ctx = document.getElementById('class-attendance-chart');
  if (!ctx || typeof Chart === 'undefined') return;

  // Dynamically calculate average presence rate for Class 8-A and Class 8-B
  const students8A = store.getUsers('student').filter(s => s.classId === '8A');
  const students8B = store.getUsers('student').filter(s => s.classId === '8B');

  const getAvg = (list) => {
    if (list.length === 0) return 100;
    const sum = list.reduce((acc, s) => acc + store.getStudentStats(s.id).percentage, 0);
    return Math.round((sum / list.length) * 10) / 10;
  };

  const avg8A = getAvg(students8A);
  const avg8B = getAvg(students8B);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Class 8-A', 'Class 8-B'],
      datasets: [{
        label: 'Average Presence Rate (%)',
        data: [avg8A, avg8B],
        backgroundColor: [
          'rgba(37, 99, 235, 0.85)',
          'rgba(5, 150, 105, 0.85)'
        ],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 50,
          max: 100,
          ticks: { callback: v => v + '%' }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}
