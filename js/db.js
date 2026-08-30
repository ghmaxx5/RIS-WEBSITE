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
    // Automatically sanitize URL to base Supabase format
    const cleanUrl = url ? url.trim().replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '') : '';
    const cleanKey = key ? key.trim() : '';

    localStorage.setItem('ris_db_credentials', JSON.stringify({ url: cleanUrl, key: cleanKey }));
    this.config = { url: cleanUrl, key: cleanKey };
    return this.connect(cleanUrl, cleanKey);
  }

  connect(url, key) {
    if (!url || !key) {
      this.isConnected = false;
      this.client = null;
      return false;
    }

    const cleanUrl = url.trim().replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
    const cleanKey = key.trim();

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
}

export const db = new DatabaseService();
