// RIS School — Clean Data Store & User Registration Base (v3.4)

export const initialMockData = {
  school: {
    name: "RIS School (Rose International School)",
    term: "Academic Session 2026-2027",
    currentDate: new Date().toISOString().split('T')[0],
    teacherPasscode: "RIS2026",
    adminPin: "1612"
  },
  
  // Default Admin account; Teachers and Students join via Secured Registration!
  users: [
    {
      id: "admin-1",
      name: "School Principal (Admin)",
      role: "admin",
      title: "School Principal / Administrator",
      email: "admin@risschool.edu",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
    }
  ],

  classes: [
    { id: "8A", name: "Class 8-A", grade: "8", section: "A" },
    { id: "8B", name: "Class 8-B", grade: "8", section: "B" }
  ],

  subjects: [
    "Mathematics",
    "Science",
    "English",
    "Social Studies",
    "Hindi",
    "Computer Science"
  ],

  notices: [
    {
      id: "notice-201",
      title: "Welcome to Rose International School Portal",
      content: "All teachers and students of Class 8-A and Class 8-B are requested to register their profiles. Teachers must enter the official school passcode (RIS2026) to complete teacher registration.",
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
      details: "Rose International School Portal initialized with Class 8-A & 8-B scoping and Teacher Security Verification."
    }
  ]
};
