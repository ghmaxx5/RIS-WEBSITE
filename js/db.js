// RIS School — Cloud Database Client (Embedded Supabase with Leave Requests Sync)

const DEFAULT_SUPABASE_URL = "https://mqrytfngbnwxolatcnng.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xcnl0Zm5nYm53eG9sYXRjbm5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwODE5ODIsImV4cCI6MjEwMzY1Nzk4Mn0.iZAgRly0aglUMmW8-o3EXyJVb282ifMa-7xZt_RlpEs";

class DatabaseService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.config = this.loadConfig();
    
    if (this.config.url && this.config.key) {
      this.connect(this.config.url, this.config.key);
    }
  }

  loadConfig() {
    try {
      const saved = localStorage.getItem('ris_db_credentials');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.url && parsed.key) return parsed;
      }
    } catch (e) {
      // ignore
    }
    return { url: DEFAULT_SUPABASE_URL, key: DEFAULT_SUPABASE_ANON_KEY };
  }

  saveConfig(url, key) {
    const cleanUrl = url ? url.trim().replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '') : DEFAULT_SUPABASE_URL;
    const cleanKey = key ? key.trim() : DEFAULT_SUPABASE_ANON_KEY;

    localStorage.setItem('ris_db_credentials', JSON.stringify({ url: cleanUrl, key: cleanKey }));
    this.config = { url: cleanUrl, key: cleanKey };
    return this.connect(cleanUrl, cleanKey);
  }

  connect(url, key) {
    const cleanUrl = (url || DEFAULT_SUPABASE_URL).trim().replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
    const cleanKey = (key || DEFAULT_SUPABASE_ANON_KEY).trim();

    if (window.supabase && cleanUrl && cleanKey) {
      try {
        this.client = window.supabase.createClient(cleanUrl, cleanKey);
        this.isConnected = true;
        console.log("Connected to Supabase Cloud Database:", cleanUrl);
        return true;
      } catch (e) {
        console.error("Failed to connect to Supabase Cloud DB", e);
        this.isConnected = false;
      }
    }
    return false;
  }

  // --- CLOUD SYNC METHOD HELPERS ---
  async fetchUsers() {
    if (!this.isConnected) return null;
    try {
      const { data, error } = await this.client.from('users').select('*');
      if (error) throw error;
      return data;
    } catch (e) {
      return null;
    }
  }

  async saveUser(user) {
    if (!this.isConnected) return false;
    try {
      const { error } = await this.client.from('users').upsert({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        title: user.title,
        class_teacher_class: user.classTeacherClass,
        subjects: user.subjects,
        class_id: user.classId,
        roll_no: user.rollNo,
        avatar: user.avatar,
        checked_in: user.checkedIn,
        check_in_time: user.checkInTime
      });
      return !error;
    } catch (e) {
      return false;
    }
  }

  async deleteUser(userId) {
    if (!this.isConnected) return false;
    try {
      const { error } = await this.client.from('users').delete().eq('id', userId);
      return !error;
    } catch (e) {
      return false;
    }
  }

  async fetchNotices() {
    if (!this.isConnected) return null;
    try {
      const { data, error } = await this.client.from('notices').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } catch (e) {
      return null;
    }
  }

  async saveNotice(notice) {
    if (!this.isConnected) return false;
    try {
      const { error } = await this.client.from('notices').upsert({
        id: notice.id,
        title: notice.title,
        content: notice.content,
        priority: notice.priority,
        target_audience: notice.targetAudience,
        author_id: notice.authorId,
        author_name: notice.authorName,
        author_role: notice.authorRole,
        read_by: notice.readBy || []
      });
      return !error;
    } catch (e) {
      return false;
    }
  }

  async deleteNotice(noticeId) {
    if (!this.isConnected) return false;
    try {
      const { error } = await this.client.from('notices').delete().eq('id', noticeId);
      return !error;
    } catch (e) {
      return false;
    }
  }

  async fetchAttendance() {
    if (!this.isConnected) return null;
    try {
      const { data, error } = await this.client.from('student_attendance').select('*');
      if (error) throw error;
      return data;
    } catch (e) {
      return null;
    }
  }

  async saveAttendance(classId, dateStr, period, markedBy, records) {
    if (!this.isConnected) return false;
    try {
      const { error } = await this.client.from('student_attendance').upsert({
        class_id: classId,
        date_str: dateStr,
        period: period,
        marked_by: markedBy,
        records: records
      });
      return !error;
    } catch (e) {
      return false;
    }
  }

  // --- LEAVE REQUESTS CLOUD SYNC ---
  async fetchLeaveRequests() {
    if (!this.isConnected) return null;
    try {
      const { data, error } = await this.client.from('leave_requests').select('*').order('submitted_at', { ascending: false });
      if (error) throw error;
      return data;
    } catch (e) {
      return null;
    }
  }

  async saveLeaveRequest(leave) {
    if (!this.isConnected) return false;
    try {
      const { error } = await this.client.from('leave_requests').upsert({
        id: leave.id,
        teacher_id: leave.teacherId,
        teacher_name: leave.teacherName,
        role: leave.role,
        leave_type: leave.leaveType,
        start_date: leave.startDate,
        end_date: leave.endDate,
        reason: leave.reason,
        status: leave.status,
        reviewer_note: leave.reviewerNote
      });
      return !error;
    } catch (e) {
      return false;
    }
  }
}

export const db = new DatabaseService();
