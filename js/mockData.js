// RIS School — Clean Data Store with Full Faculty Roster & 30 Students (v4.6)

export const initialMockData = {
  school: {
    name: "RIS School (Rose International School)",
    term: "Academic Session 2026-2027",
    currentDate: new Date().toISOString().split('T')[0],
    teacherPasscode: "RIS2026",
    adminPin: "1612"
  },
  
  users: [
    // 1. DEFAULT ADMIN ACCOUNT
    {
      id: "admin-1",
      name: "School Principal (Admin)",
      role: "admin",
      title: "School Principal / Administrator",
      email: "principal@risschool.edu",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
    },

    // 2. TEACHERS & FACULTY MEMBERS (With Subject Name Included in Name)
    {
      id: "teacher-alina",
      name: "Alina Ma'am (English)",
      role: "teacher",
      title: "Class Teacher 8-A & English Faculty",
      email: "alina@risschool.edu",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
      classTeacherClass: "8A",
      isClassTeacher: true,
      subjects: ["English"],
      checkedIn: true,
      checkInTime: "07:50 AM"
    },
    {
      id: "teacher-swapnil",
      name: "Swapnil Ma'am (Maths)",
      role: "teacher",
      title: "Class Teacher 8-B & Mathematics Faculty",
      email: "swapnil@risschool.edu",
      avatar: "https://images.unsplash.com/photo-1580894732413-80c42732c510?auto=format&fit=crop&q=80&w=150",
      classTeacherClass: "8B",
      isClassTeacher: true,
      subjects: ["Mathematics"],
      checkedIn: true,
      checkInTime: "07:55 AM"
    },
    {
      id: "teacher-fina",
      name: "Fina Ma'am (Science)",
      role: "teacher",
      title: "Science Faculty",
      email: "fina@risschool.edu",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
      subjects: ["Science"],
      checkedIn: true,
      checkInTime: "08:00 AM"
    },
    {
      id: "teacher-preeti",
      name: "Preeti Ma'am (Hindi)",
      role: "teacher",
      title: "Hindi Faculty",
      email: "preeti@risschool.edu",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150",
      subjects: ["Hindi"],
      checkedIn: true,
      checkInTime: "08:05 AM"
    },
    {
      id: "teacher-rohit",
      name: "Rohit Sir (Computer)",
      role: "teacher",
      title: "Computer Science Faculty",
      email: "rohit@risschool.edu",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
      subjects: ["Computer Science"],
      checkedIn: true,
      checkInTime: "08:00 AM"
    },
    {
      id: "teacher-ritu",
      name: "Ritu Ma'am (GK)",
      role: "teacher",
      title: "General Knowledge (GK) Faculty",
      email: "ritu@risschool.edu",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      subjects: ["General Knowledge"],
      checkedIn: false
    },
    {
      id: "teacher-harsh",
      name: "Harsh Sir (Games)",
      role: "teacher",
      title: "Physical Education & Games Faculty",
      email: "harsh@risschool.edu",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
      subjects: ["Games / PE"],
      checkedIn: true,
      checkInTime: "07:45 AM"
    },
    {
      id: "teacher-rose",
      name: "Rose Ma'am (Games)",
      role: "teacher",
      title: "Physical Education & Games Faculty",
      email: "rose@risschool.edu",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      subjects: ["Games / PE"],
      checkedIn: true,
      checkInTime: "07:45 AM"
    },
    {
      id: "teacher-lily",
      name: "Lily Ma'am (Music)",
      role: "teacher",
      title: "Music Faculty",
      email: "lily@risschool.edu",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150",
      subjects: ["Music"],
      checkedIn: false
    },
    {
      id: "teacher-priyanshi",
      name: "Priyanshi Ma'am (Music)",
      role: "teacher",
      title: "Music Faculty",
      email: "priyanshi@risschool.edu",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150",
      subjects: ["Music"],
      checkedIn: true,
      checkInTime: "08:10 AM"
    },
    {
      id: "teacher-heena",
      name: "Heena Ma'am (Art & Craft)",
      role: "teacher",
      title: "Art & Craft Faculty",
      email: "heena@risschool.edu",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150",
      subjects: ["Art & Craft"],
      checkedIn: true,
      checkInTime: "08:15 AM"
    },

    // 3. CLASS 8-A STUDENTS (15 Students)
    { id: "student-8A-01", name: "Aarav Sharma", role: "student", classId: "8A", rollNo: "8A-01", email: "aarav.s@student.risschool.edu", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150" },
    { id: "student-8A-02", name: "Ananya Gupta", role: "student", classId: "8A", rollNo: "8A-02", email: "ananya.g@student.risschool.edu", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" },
    { id: "student-8A-03", name: "Rohan Patel", role: "student", classId: "8A", rollNo: "8A-03", email: "rohan.p@student.risschool.edu", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150" },
    { id: "student-8A-04", name: "Diya Singh", role: "student", classId: "8A", rollNo: "8A-04", email: "diya.s@student.risschool.edu", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150" },
    { id: "student-8A-05", name: "Vihaan Joshi", role: "student", classId: "8A", rollNo: "8A-05", email: "vihaan.j@student.risschool.edu", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150" },
    { id: "student-8A-06", name: "Ishita Mehta", role: "student", classId: "8A", rollNo: "8A-06", email: "ishita.m@student.risschool.edu", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150" },
    { id: "student-8A-07", name: "Kabir Nair", role: "student", classId: "8A", rollNo: "8A-07", email: "kabir.n@student.risschool.edu", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150" },
    { id: "student-8A-08", name: "Meera Reddy", role: "student", classId: "8A", rollNo: "8A-08", email: "meera.r@student.risschool.edu", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" },
    { id: "student-8A-09", name: "Arjun Aggarwal", role: "student", classId: "8A", rollNo: "8A-09", email: "arjun.a@student.risschool.edu", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" },
    { id: "student-8A-10", name: "Sanjana Choudhury", role: "student", classId: "8A", rollNo: "8A-10", email: "sanjana.c@student.risschool.edu", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" },
    { id: "student-8A-11", name: "Yash Malhotra", role: "student", classId: "8A", rollNo: "8A-11", email: "yash.m@student.risschool.edu", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150" },
    { id: "student-8A-12", name: "Pooja Saxena", role: "student", classId: "8A", rollNo: "8A-12", email: "pooja.s@student.risschool.edu", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" },
    { id: "student-8A-13", name: "Aditya Roy", role: "student", classId: "8A", rollNo: "8A-13", email: "aditya.r@student.risschool.edu", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150" },
    { id: "student-8A-14", name: "Riya Rao", role: "student", classId: "8A", rollNo: "8A-14", email: "riya.r@student.risschool.edu", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150" },
    { id: "student-8A-15", name: "Siddharth Chopra", role: "student", classId: "8A", rollNo: "8A-15", email: "siddharth.c@student.risschool.edu", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150" },

    // 4. CLASS 8-B STUDENTS (15 Students)
    { id: "student-8B-01", name: "Tanvi Kulkarni", role: "student", classId: "8B", rollNo: "8B-01", email: "tanvi.k@student.risschool.edu", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150" },
    { id: "student-8B-02", name: "Varun Shah", role: "student", classId: "8B", rollNo: "8B-02", email: "varun.s@student.risschool.edu", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150" },
    { id: "student-8B-03", name: "Sneha Das", role: "student", classId: "8B", rollNo: "8B-03", email: "sneha.d@student.risschool.edu", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" },
    { id: "student-8B-04", name: "Devansh Vardhan", role: "student", classId: "8B", rollNo: "8B-04", email: "devansh.v@student.risschool.edu", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" },
    { id: "student-8B-05", name: "Anishka Iyer", role: "student", classId: "8B", rollNo: "8B-05", email: "anishka.i@student.risschool.edu", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" },
    { id: "student-8B-06", name: "Harsh Bhatia", role: "student", classId: "8B", rollNo: "8B-06", email: "harsh.b@student.risschool.edu", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150" },
    { id: "student-8B-07", name: "Kavya Kapoor", role: "student", classId: "8B", rollNo: "8B-07", email: "kavya.k@student.risschool.edu", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" },
    { id: "student-8B-08", name: "Dev Pandey", role: "student", classId: "8B", rollNo: "8B-08", email: "dev.p@student.risschool.edu", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150" },
    { id: "student-8B-09", name: "Navya Bansal", role: "student", classId: "8B", rollNo: "8B-09", email: "navya.b@student.risschool.edu", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150" },
    { id: "student-8B-10", name: "Ishan Dutta", role: "student", classId: "8B", rollNo: "8B-10", email: "ishan.d@student.risschool.edu", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150" },
    { id: "student-8B-11", name: "Priya Mishra", role: "student", classId: "8B", rollNo: "8B-11", email: "priya.m@student.risschool.edu", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150" },
    { id: "student-8B-12", name: "Reyansh Jain", role: "student", classId: "8B", rollNo: "8B-12", email: "reyansh.j@student.risschool.edu", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150" },
    { id: "student-8B-13", name: "Shreya Sengupta", role: "student", classId: "8B", rollNo: "8B-13", email: "shreya.s@student.risschool.edu", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" },
    { id: "student-8B-14", name: "Tanishq Verma", role: "student", classId: "8B", rollNo: "8B-14", email: "tanishq.v@student.risschool.edu", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" },
    { id: "student-8B-15", name: "Trisha Sharma", role: "student", classId: "8B", rollNo: "8B-15", email: "trisha.s@student.risschool.edu", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" }
  ],

  classes: [
    { id: "8A", name: "Class 8-A", grade: "8", section: "A" },
    { id: "8B", name: "Class 8-B", grade: "8", section: "B" }
  ],

  subjects: [
    "English",
    "Mathematics",
    "Science",
    "Hindi",
    "Computer Science",
    "General Knowledge",
    "Games / PE",
    "Music",
    "Art & Craft"
  ],

  notices: [
    {
      id: "notice-201",
      title: "Welcome to Rose International School Portal",
      content: "All Class Teachers, subject faculty, and students of Class 8-A and Class 8-B are requested to register their profiles. Teachers must enter the official school passcode (RIS2026) to complete teacher registration.",
      priority: "important",
      targetAudience: "Whole School",
      authorId: "admin-1",
      authorName: "School Administration",
      authorRole: "Principal / Admin",
      createdAt: new Date().toISOString(),
      readBy: ["admin-1"]
    }
  ],

  studentAttendance: {},
  staffCheckIns: {},
  leaveRequests: [],

  auditLogs: [
    {
      id: "audit-01",
      timestamp: new Date().toISOString(),
      actorName: "System",
      actorRole: "Admin",
      action: "SECURITY_INIT",
      details: "Rose International School Portal initialized with full faculty roster and Class 8-A & 8-B students."
    }
  ]
};
