// RIS School — Cloud Database Client (Supabase / PostgreSQL Integration)

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
      return saved ? JSON.parse(saved) : { url: '', key: '' };
    } catch (e) {
      return { url: '', key: '' };
    }
  }

  saveConfig(url, key) {
    localStorage.setItem('ris_db_credentials', JSON.stringify({ url, key }));
    this.connect(url, key);
  }

  connect(url, key) {
    if (window.supabase && url && key) {
      try {
        this.client = window.supabase.createClient(url, key);
        this.isConnected = true;
        console.log("Connected to Supabase Cloud Database!");
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
      console.warn("Cloud DB fetchUsers failed, falling back to local store", e);
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
        homeroom_class: user.homeroomClass,
        is_homeroom_teacher: user.isHomeroomTeacher,
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

  async fetchHomework() {
    if (!this.isConnected) return null;
    try {
      const { data, error } = await this.client.from('homework').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } catch (e) {
      return null;
    }
  }

  async saveHomework(hw) {
    if (!this.isConnected) return false;
    try {
      const { error } = await this.client.from('homework').upsert({
        id: hw.id,
        title: hw.title,
        subject: hw.subject,
        class_id: hw.classId,
        teacher_id: hw.teacherId,
        teacher_name: hw.teacherName,
        description: hw.description,
        due_date: hw.dueDate,
        status: hw.status,
        completed_by: hw.completedBy || []
      });
      return !error;
    } catch (e) {
      return false;
    }
  }

  async deleteHomework(hwId) {
    if (!this.isConnected) return false;
    try {
      const { error } = await this.client.from('homework').delete().eq('id', hwId);
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

  async saveAttendance(classId, dateStr, period, markedBy, records) {
    if (!this.isConnected) return false;
    try {
      const { error } = await this.client.from('student_attendance').upsert({
        class_id: classId,
        date_str: dateStr,
        period: period,
        marked_by: markedBy,
        records: records
      }, { onConflict: 'class_id,date_str' });
      return !error;
    } catch (e) {
      return false;
    }
  }
}

export const db = new DatabaseService();
