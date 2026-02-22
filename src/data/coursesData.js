
export const coursesData = [
  // Pre Foundation (6-8)
  {
    id: 1,
    slug: "pre-foundation",
    title: "Pre Foundation",
    subtitle: "Building Strong Fundamentals",
    category: "Pre-Foundation",
    grade: "Class 6, 7 & 8",
    duration: "1 Year per Class",
    subjects: ["Math", "Science", "Logical Reasoning", "Olympiad Prep"],
    description: "Early foundation for competitive mindset with Olympiad & NTSE preparation. Building strong fundamentals from Classes 6 to 8.",
    features: [
      "Interactive Science Experiments & Hands-on Learning",
      "Olympiad & NTSE Stage I Preparation",
      "Logic Building & Analytical Reasoning",
      "Weekly Assessments & Progress Tracking"
    ],
    color: "blue",
    link: "/academic?section=pre-foundation"
  },

  // Foundation Class 9
  {
    id: 2,
    slug: "foundation-class-9",
    title: "Foundation Class 9",
    subtitle: "Critical Foundation Year",
    category: "Foundation",
    grade: "Class 9",
    duration: "1 Year",
    subjects: ["Math", "Physics", "Chemistry", "Biology"],
    description: "Advanced concepts with Board + NTSE preparation. Bridging the gap to higher secondary with rigorous conceptual clarity.",
    features: [
      "Complete Board Syllabus Coverage",
      "NTSE Stage I Preparation",
      "Foundation for JEE/NEET Concepts",
      "Regular Practice Tests & Doubt Sessions"
    ],
    color: "green",
    link: "/academic?section=foundation"
  },

  // Foundation Class 10
  {
    id: 3,
    slug: "foundation-class-10",
    title: "Foundation Class 10",
    subtitle: "Board Excellence & Beyond",
    category: "Foundation",
    grade: "Class 10",
    duration: "1 Year",
    subjects: ["Math", "Science", "Social Science", "English", "Hindi"],
    description: "Complete Board syllabus with competitive foundation. Focused preparation for Board Exams ensuring 95%+ targets and NTSE Stage II selection.",
    features: [
      "Board Exam Pattern Practice (95%+ Target)",
      "NTSE Stage II Preparation",
      "Sample Paper Solving & Mock Tests",
      "Interview Skills & Competitive Foundation"
    ],
    color: "teal",
    link: "/academic?section=foundation"
  },

  // Integrated JEE
  {
    id: 4,
    slug: "integrated-jee",
    title: "Integrated JEE",
    subtitle: "Target IIT/NIT",
    category: "Competitive",
    grade: "Class 11-12",
    duration: "2 Years",
    subjects: ["Physics", "Chemistry", "Mathematics"],
    description: "JEE Main & Advanced with Board exam integrated approach. Rigorous program for engineering aspirants targeting IITs/NITs.",
    features: [
      "Daily Practice Problems (DPP)",
      "Board + JEE Integrated Curriculum",
      "All India Test Series",
      "Doubt Clearing Sessions & Mentorship"
    ],
    color: "purple",
    link: "/academic?section=integrated"
  },

  // Integrated NEET
  {
    id: 5,
    slug: "integrated-neet",
    title: "Integrated NEET",
    subtitle: "Target Medical Colleges",
    category: "Competitive",
    grade: "Class 11-12",
    duration: "2 Years",
    subjects: ["Physics", "Chemistry", "Biology"],
    description: "NEET focused curriculum with NCERT mastery emphasis. Specialized coaching for medical aspirants with focus on NCERT-based MCQs.",
    features: [
      "NCERT Line-by-Line Mastery",
      "Biology-focused Teaching Methodology",
      "NEET Pattern Tests & Mock Exams",
      "Speed & Accuracy Enhancement"
    ],
    color: "red",
    link: "/academic?section=integrated"
  },

  // Integrated NTSE
  {
    id: 6,
    slug: "integrated-ntse",
    title: "Integrated NTSE",
    subtitle: "5 Year Excellence Program",
    category: "Long-term",
    grade: "Class 6-10",
    duration: "5 Years",
    subjects: ["Complete Foundation", "Olympiad", "NTSE"],
    description: "Multi-year program building strong fundamentals for competitive excellence. Comprehensive long-term preparation from Class 6 to Class 10.",
    features: [
      "Complete 5-Year Roadmap (Class 6-10)",
      "NTSE Stage I & II Preparation",
      "Olympiad Training (IMO, NSO, etc.)",
      "Strong Conceptual Foundation"
    ],
    color: "amber",
    link: "/academic?section=integrated"
  }
];

// Category metadata for filtering and display
export const categoryMeta = {
  "pre-foundation": {
    title: "Pre Foundation Courses",
    subtitle: "Building Strong Fundamentals (Class 6-8)",
    description: "Early foundation for competitive mindset with Olympiad & NTSE preparation. We focus on conceptual clarity, logical thinking, and building a strong base from Classes 6 to 8.",
    filterKey: "Pre-Foundation"
  },
  "foundation": {
    title: "Foundation Courses",
    subtitle: "Class 9 & 10 Excellence",
    description: "Complete Board syllabus with competitive foundation. Advanced concepts with NTSE preparation and building blocks for JEE/NEET.",
    filterKey: "Foundation"
  },
  "competitive": {
    title: "Competitive Exam Preparation",
    subtitle: "JEE & NEET",
    description: "Rigorous integrated programs for engineering and medical aspirants targeting IITs, NITs, and top Medical Colleges.",
    filterKey: "Competitive"
  },
  "long-term": {
    title: "Long-term Programs",
    subtitle: "Multi-Year Excellence",
    description: "Comprehensive long-term preparation programs designed for sustained academic excellence and competitive exam success.",
    filterKey: "Long-term"
  }
};
