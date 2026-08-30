// RIS School — Central State Store (v4.2 Production Security Hardening)
import { initialMockData } from './mockData.js';

const STORAGE_KEY = 'ris_school_app_data_v4.5';

class Store {
  constructor() {
    this.data = this.loadData();
    this.currentUserId = localStorage.getItem('ris_current_user_id') || null;
    this.adminSessionActive = localStorage.getItem('ris_admin_session_active') === 'true';
    this.listeners = [];
  }

  loadData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const studentCount = parsed.users ? parsed.users.filter(u => u.role === 'student').length : 0;
        if (studentCount >= 20) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Initializing fresh store data", e);
    }
    
    this.saveData(initialMockData);
    return JSON.parse(JSON.stringify(initialMockData));
  }

  saveData(data = this.data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      this.data = data;
      this.notifyListeners();
    } catch (e) {
      console.error("Failed to save state to localStorage", e);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(fn => fn(this.data));
  }

  resetStore() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('ris_current_user_id');
    localStorage.removeItem('ris_admin_session_active');
    this.data = JSON.parse(JSON.stringify(initialMockData));
    this.currentUserId = null;
    this.adminSessionActive = false;
    this.saveData();
  }

  // --- USER AUTH & PRINCIPAL SUPERVISION ---
  getCurrentUser() {
    if (!this.currentUserId) return null;
    return this.data.users.find(u => u.id === this.currentUserId) || null;
  }

  isAdminSessionActive() {
    const user = this.getCurrentUser();
    if (user && user.role === 'student') return false;
    return this.adminSessionActive || (user?.role === 'admin');
  }

  setCurrentUser(userId, adminPin = null) {
    const targetUser = this.data.users.find(u => u.id === userId);
    if (!targetUser) return { success: false, error: "User profile not found." };

    if (targetUser.role === 'admin' && !this.adminSessionActive) {
      if (!adminPin || adminPin.trim() !== '1612') {
        return { success: false, error: "Authentication Failed: Invalid Admin Security PIN! Access denied." };
      }
      this.adminSessionActive = true;
      localStorage.setItem('ris_admin_session_active', 'true');
    }

    this.currentUserId = userId;
    localStorage.setItem('ris_current_user_id', userId);
    this.notifyListeners();
    return { success: true, user: targetUser };
  }

  switchAsPrincipal(userId) {
    if (!this.isAdminSessionActive()) {
      return { success: false, error: "Permission Denied: Only Principal Admin can switch accounts." };
    }

    const targetUser = this.data.users.find(u => u.id === userId);
    if (!targetUser) return { success: false, error: "User profile not found." };

    this.currentUserId = userId;
    localStorage.setItem('ris_current_user_id', userId);
    this.notifyListeners();
    return { success: true, user: targetUser };
  }

  returnToAdmin() {
    this.currentUserId = 'admin-1';
    this.adminSessionActive = true;
    localStorage.setItem('ris_current_user_id', 'admin-1');
    localStorage.setItem('ris_admin_session_active', 'true');
    this.notifyListeners();
  }

  logout() {
    this.currentUserId = null;
    this.adminSessionActive = false;
    localStorage.removeItem('ris_current_user_id');
    localStorage.removeItem('ris_admin_session_active');
    this.notifyListeners();
  }

  registerUser(userData) {
    const isTeacher = userData.role === 'teacher';

    if (isTeacher) {
      const correctPasscode = this.data.school.teacherPasscode || "RIS2026";
      if (!userData.teacherPasscode || userData.teacherPasscode.trim() !== correctPasscode) {
        return { 
          success: false, 
          error: "Registration Failed: Invalid Teacher Security Passcode! Verification failed." 
        };
      }
    }

    const newId = isTeacher ? `teacher-${Date.now()}` : `student-${Date.now()}`;
    
    const teacherAvatars = [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
    ];
    const studentAvatars = [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150"
    ];

    const newUser = {
      id: newId,
      name: userData.name,
      role: userData.role,
      email: userData.email,
      avatar: isTeacher ? teacherAvatars[Math.floor(Math.random() * teacherAvatars.length)] : studentAvatars[Math.floor(Math.random() * studentAvatars.length)],
      title: isTeacher ? `Class Teacher ${userData.classTeacherClass || 'Subject'}` : `Student — Class ${userData.classId}`,
      classTeacherClass: isTeacher ? (userData.classTeacherClass || null) : null,
      isClassTeacher: isTeacher && !!userData.classTeacherClass,
      subjects: isTeacher ? (userData.subjects || ["General"]) : [],
      classId: !isTeacher ? (userData.classId || "8A") : null,
      rollNo: !isTeacher ? userData.rollNo : null,
      checkedIn: false,
      checkInTime: null
    };

    this.data.users.push(newUser);
    this.saveData();
    this.setCurrentUser(newId);
    return { success: true, user: newUser };
  }

  deleteUser(userId) {
    if (userId === 'admin-1') return false;
    this.data.users = this.data.users.filter(u => u.id !== userId);
    if (this.currentUserId === userId) {
      this.logout();
    } else {
      this.saveData();
    }
    return true;
  }

  getUsers(role = null) {
    if (!role) return this.data.users;
    return this.data.users.filter(u => u.role === role);
  }

  getClasses() {
    return this.data.classes;
  }

  getClass(classId) {
    return this.data.classes.find(c => c.id === classId);
  }

  getSubjects() {
    return this.data.subjects;
  }

  // --- NOTICE BOARD ---
  getNotices(filters = {}) {
    let list = [...this.data.notices];
    const user = this.getCurrentUser();

    if (user && user.role === 'student') {
      list = list.filter(n => 
        n.targetAudience === 'Whole School' || 
        n.targetAudience === user.classId || 
        n.targetAudience === `Class ${user.classId}`
      );
    }

    if (filters.priority && filters.priority !== 'all') {
      list = list.filter(n => n.priority === filters.priority);
    }

    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  addNotice(notice) {
    const user = this.getCurrentUser();
    if (!user || user.role === 'student') return null;

    const newNotice = {
      id: `notice-${Date.now()}`,
      title: notice.title,
      content: notice.content,
      priority: notice.priority || "normal",
      targetAudience: notice.targetAudience || "Whole School",
      authorId: user.id,
      authorName: user.name,
      authorRole: user.title || user.role,
      createdAt: new Date().toISOString(),
      readBy: [user.id]
    };
    this.data.notices.unshift(newNotice);
    this.saveData();
    return newNotice;
  }

  canDeleteNotice(noticeId) {
    const user = this.getCurrentUser();
    if (!user || user.role === 'student') return false;
    const notice = this.data.notices.find(n => n.id === noticeId);
    if (!notice) return false;
    if (user.role === 'admin') return true;
    if (user.role === 'teacher' && notice.authorId === user.id) return true;
    return false;
  }

  deleteNotice(noticeId) {
    if (this.canDeleteNotice(noticeId)) {
      this.data.notices = this.data.notices.filter(n => n.id !== noticeId);
      this.saveData();
      return true;
    }
    return false;
  }

  markNoticeRead(noticeId) {
    const user = this.getCurrentUser();
    if (!user) return;
    const notice = this.data.notices.find(n => n.id === noticeId);
    if (notice && !notice.readBy.includes(user.id)) {
      notice.readBy.push(user.id);
      this.saveData();
    }
  }

  markAllNoticesRead() {
    const user = this.getCurrentUser();
    if (!user) return;
    this.data.notices.forEach(n => {
      if (!n.readBy.includes(user.id)) {
        n.readBy.push(user.id);
      }
    });
    this.saveData();
  }

  // --- MORNING ATTENDANCE ---
  getStudentAttendance(classId, dateStr) {
    const classRecords = this.data.studentAttendance[classId];
    if (classRecords && classRecords[dateStr]) {
      return classRecords[dateStr];
    }
    return null;
  }

  saveStudentAttendance(classId, dateStr, records) {
    const user = this.getCurrentUser();
    if (!user || user.role === 'student') return false;

    if (!this.data.studentAttendance[classId]) {
      this.data.studentAttendance[classId] = {};
    }

    const previousRecord = this.data.studentAttendance[classId][dateStr];
    const isUpdate = !!previousRecord;

    this.data.studentAttendance[classId][dateStr] = {
      period: "Daily Morning Register",
      markedBy: user.name,
      markedAt: new Date().toISOString(),
      records: records
    };

    const presentCount = Object.values(records).filter(r => r.status === 'present').length;
    const absentCount = Object.values(records).filter(r => r.status === 'absent').length;

    const auditEntry = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: user.name,
      actorRole: user.title || user.role,
      action: isUpdate ? "UPDATED_MORNING_ATTENDANCE" : "MARKED_MORNING_ATTENDANCE",
      details: `${isUpdate ? 'Updated' : 'Submitted'} Morning Attendance for Class ${classId} on ${dateStr}. (${presentCount} Present, ${absentCount} Absent).`
    };
    this.data.auditLogs.unshift(auditEntry);

    this.saveData();
    return true;
  }

  getStudentStats(studentId) {
    const student = this.data.users.find(u => u.id === studentId);
    if (!student || student.role !== 'student') return { totalDays: 0, present: 0, absent: 0, percentage: 100 };

    let totalDays = 0;
    let present = 0;
    let absent = 0;

    const classData = this.data.studentAttendance[student.classId];
    if (classData) {
      Object.keys(classData).forEach(date => {
        const rec = classData[date].records[student.id];
        if (rec) {
          totalDays++;
          if (rec.status === 'present') present++;
          else if (rec.status === 'absent') absent++;
        }
      });
    }

    const percentage = totalDays > 0 ? Math.round((present / totalDays) * 1000) / 10 : 100;
    return {
      totalDays,
      present,
      absent,
      percentage,
      flagChronic: percentage < 85.0 && totalDays > 0
    };
  }

  // --- STAFF CHECK-IN & LEAVE ---
  getStaffRoster() {
    return this.getUsers('teacher').map(t => {
      const today = new Date().toISOString().split('T')[0];
      const activeLeave = this.data.leaveRequests.find(l => 
        l.teacherId === t.id && 
        l.status === 'approved' && 
        l.startDate <= today && 
        l.endDate >= today
      );

      return {
        ...t,
        status: activeLeave ? 'On Leave' : (t.checkedIn ? 'Present' : 'Not Checked In'),
        activeLeave: activeLeave || null
      };
    });
  }

  staffCheckIn(teacherId = null) {
    const user = this.getCurrentUser();
    if (!user || user.role === 'student') return false;

    const targetId = teacherId || this.currentUserId;
    const targetUser = this.data.users.find(u => u.id === targetId);
    if (targetUser && targetUser.role === 'teacher') {
      targetUser.checkedIn = !targetUser.checkedIn;
      targetUser.checkInTime = targetUser.checkedIn ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;
      this.saveData();
      return targetUser.checkedIn;
    }
    return false;
  }

  getLeaveRequests(teacherId = null) {
    let list = [...this.data.leaveRequests];
    if (teacherId) {
      list = list.filter(l => l.teacherId === teacherId);
    }
    return list.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  }

  submitLeaveRequest(leave) {
    const user = this.getCurrentUser();
    if (!user || user.role !== 'teacher') return null;

    const newLeave = {
      id: `leave-${Date.now()}`,
      teacherId: user.id,
      teacherName: user.name,
      role: user.title || "Teacher",
      leaveType: leave.leaveType,
      startDate: leave.startDate,
      endDate: leave.endDate,
      reason: leave.reason,
      status: "pending",
      submittedAt: new Date().toISOString(),
      reviewerNote: null
    };
    this.data.leaveRequests.unshift(newLeave);
    this.saveData();
    return newLeave;
  }

  reviewLeaveRequest(leaveId, status, reviewerNote = "") {
    const user = this.getCurrentUser();
    if (!user || user.role === 'student' || user.role !== 'admin') return false;

    const leave = this.data.leaveRequests.find(l => l.id === leaveId);
    if (leave) {
      leave.status = status;
      leave.reviewerNote = reviewerNote;
      this.saveData();
      return true;
    }
    return false;
  }

  getAuditLogs() {
    return this.data.auditLogs;
  }
}

export const store = new Store();
