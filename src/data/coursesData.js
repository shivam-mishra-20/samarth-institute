
export const coursesData = [
  // Foundation (6-10)
  {
    id: 1,
    slug: "class-6-foundation",
    title: "Class 6 Foundation",
    category: "Foundation",
    grade: "Class 6",
    duration: "1 Year",
    subjects: ["Maths", "Science", "Mental Ability"],
    description: "Building a strong base in crucial subjects with fun, concept-based learning.",
    features: ["Interactive Science Experiments", "Olympiad Intro", "Logic Building"],
    color: "blue",
    syllabus: [
      "Number System & basic Algebra",
      "Motion, Light & Electricity (Basics)",
      "Living Organisms & Surroundings",
      "Verbal & Non-Verbal Reasoning"
    ],
    outcomes: "Strong conceptual understanding and readiness for middle school challenges."
  },
  {
    id: 2,
    slug: "class-7-advancer",
    title: "Class 7 Advancer",
    category: "Foundation",
    grade: "Class 7",
    duration: "1 Year",
    subjects: ["Maths", "Science", "English", "Reasoning"],
    description: "Stepping up critical thinking and analytical skills for future competitions.",
    features: ["Weekly Tests", "Scholarship Prep", "Concept Maps"],
    color: "blue",
    syllabus: [
      "Integers, Fractions & Decimals",
      "Acids, Bases & Salts, Heat",
      "Respiration & Transportation in Plants",
      "Analytical Reasoning Basics"
    ],
    outcomes: "Enhanced problem-solving skills and exposure to competitive exam patterns."
  },
  {
    id: 3,
    slug: "class-8-pre-foundation",
    title: "Class 8 Pre-Foundation",
    category: "Foundation",
    grade: "Class 8",
    duration: "1 Year",
    subjects: ["Maths", "Science", "SST", "MAT"],
    description: "Early preparation for NMMS and future competitive exams like NTSE.",
    features: ["NMMS Guidance", "Coding Basics", "Research Projects"],
    color: "blue",
    syllabus: [
      "Rational Numbers & Linear Equations",
      "Force, Pressure, Sound & Light",
      "Microorganisms & Cell Structure",
      "History: Modern India & National Movement"
    ],
    outcomes: "Success in scholarship exams (NMMS) and solid foundation for Class 9."
  },
  {
    id: 4,
    slug: "class-9-excellence",
    title: "Class 9 Excellence",
    category: "Foundation",
    grade: "Class 9",
    duration: "1 Year",
    subjects: ["PCMB", "Social Science", "English"],
    description: "Bridging the gap to higher secondary with rigorous conceptual clarity.",
    features: ["IJSO Preparation", "Lab Sessions", "Foundation for JEE/NEET"],
    color: "indigo",
    syllabus: [
      "Polynomials, Circles & Surface Areas",
      "Newton's Laws, Gravitation & Work",
      "Atoms, Molecules & Structure of Atom",
      "Fundamental Unit of Life (Cell), Tissues"
    ],
    outcomes: "Mastery of Class 9 concepts and introduction to JEE/NEET level application."
  },
  {
    id: 5,
    slug: "class-10-board-booster",
    title: "Class 10 Board Booster",
    category: "Foundation",
    grade: "Class 10",
    duration: "1 Year",
    subjects: ["All Subjects"],
    description: "Focused preparation for Board Exams ensuring 95%+ targets and NTSE selection.",
    features: ["Board Pattern Tests", "NTSE Stage 1 & 2", "Sample Paper Solving"],
    color: "indigo",
    syllabus: [
      "Real Numbers, Trigonometry & Statistics",
      "Light: Reflection & Refraction, Electricity",
      "Chemical Reactions & Periodic Classification",
      "Life Processes, Heredity & Evolution"
    ],
    outcomes: "Top scores in Board Exams and qualification in NTSE Stage 1."
  },

  // Higher Secondary (11-12 Boards)
  {
    id: 6,
    slug: "class-11-science",
    title: "Class 11 Science (State/CBSE)",
    category: "Boards",
    grade: "Class 11",
    duration: "1 Year",
    subjects: ["Physics", "Chemistry", "Maths/Bio"],
    description: "Comprehensive school syllabus coverage with focus on NCERT mastery.",
    features: ["NCERT Line-by-Line", "School Exam Prep", "Practical Notebooks"],
    color: "green",
    syllabus: [
      "Physics: Kinematics, Laws of Motion, Thermodynamics",
      "Chemistry: Structure of Atom, Bonding, Thermodynamics",
      "Maths: Sets, Relations, Calculus Basics"
    ],
    outcomes: "Clear understanding of 11th syllabus, essential for 12th Boards."
  },
  {
    id: 7,
    slug: "class-12-board-achiever",
    title: "Class 12 Board Achiever",
    category: "Boards",
    grade: "Class 12",
    duration: "1 Year",
    subjects: ["Physics", "Chemistry", "Maths/Bio"],
    description: "Dedicated board exam batch to ensure top percentage in HSC/CBSE boards.",
    features: ["Previous Year Q-Papers", "Writing Skills Workshops", "3-Hour Mock Boards"],
    color: "green",
    syllabus: [
        "Physics: Electrostatics, Optics, Modern Physics",
        "Chemistry: Solutions, Electrochemistry, Kinetics",
        "Maths: Calculus (Integration/Differentiation), Vectors"
    ],
    outcomes: "Excellence in Board Exams (90%+) and eligibility for top colleges."
  },

  // Competitive (JEE/NEET)
  {
    id: 8,
    slug: "jee-main-advanced",
    title: "JEE Main & Advanced (Target 2026)",
    category: "Competitive",
    grade: "Class 11+",
    duration: "2 Years",
    subjects: ["Physics", "Chemistry", "Maths"],
    description: "Rigorous integrated program for engineering aspirants targeting IITs/NITs.",
    features: ["Daily Practice Problems (DPP)", "All India Test Series", "Doubt Counters"],
    color: "orange",
    syllabus: [
        "Phase 1: Mechanics & Physical Chemistry",
        "Phase 2: Algebra & Inorganic Chemistry",
        "Phase 3: Electrodynamics & Calculus",
        "Phase 4: Modern Physics & Organic Chemistry"
    ],
    outcomes: "Top Rank in JEE Main & Advanced, admission to IITs/NITs/IIITs."
  },
  {
    id: 9,
    slug: "neet-medical",
    title: "NEET Medical (Target 2026)",
    category: "Competitive",
    grade: "Class 11+",
    duration: "2 Years",
    subjects: ["Physics", "Chemistry", "Biology"],
    description: "Specialized coaching for medical aspirants with focus on NCERT-based MCQs.",
    features: ["Bio-Hacks Notes", "NCERT Exemplar", "Speed Accuracy Tests"],
    color: "rose",
    syllabus: [
        "Phase 1: Cell Biology & Mechanics",
        "Phase 2: Human Physiology & Chemical Bonding",
        "Phase 3: Genetics, Evolution & Electrodynamics",
        "Phase 4: Ecology, Optics & Modern Physics"
    ],
    outcomes: "Top Rank in NEET-UG, admission to Government Medical Colleges (MBBS)."
  },
  {
    id: 10,
    slug: "dropper-repeater-batch",
    title: "Dropper / Repeater Batch",
    category: "Competitive",
    grade: "12th Pass",
    duration: "1 Year",
    subjects: ["PCM / PCB"],
    description: "Intensive 1-year program for students dedicating a year for rank improvement.",
    features: ["High Intensity", "Focus on Weak Areas", "Strategy Sessions"],
    color: "purple",
    syllabus: [
        "Accelerated coverage of Class 11 & 12 Syllabus",
        "Special focus on high-weightage topics",
        "Rigorous Mock Test Schedule (Part & Full Syllabus)"
    ],
    outcomes: "Significant rank improvement and selection in desired college."
  }
];

// Category metadata for dedicated category pages
export const categoryMeta = {
  jee: {
    title: "JEE Preparation",
    subtitle: "Your Path to IITs & NITs",
    description: "Rigorous and result-oriented coaching for JEE Main & Advanced. Our expert faculty and structured curriculum are designed to help you crack one of India's toughest engineering entrance exams.",
    heroImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop",
    filterKey: "Competitive",
    filterValue: "JEE" // Used for additional filtering if needed
  },
  neet: {
    title: "NEET Preparation",
    subtitle: "Your Dream of MBBS Starts Here",
    description: "Comprehensive medical entrance coaching with NCERT-focused strategies, expert biology faculty, and proven teaching methodologies that have produced top ranks year after year.",
    heroImage: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=1200&auto=format&fit=crop",
    filterKey: "Competitive",
    filterValue: "NEET"
  },
  foundation: {
    title: "Foundation Courses",
    subtitle: "Building Tomorrow's Toppers (Class 6-10)",
    description: "Lay the groundwork for academic success with our Foundation programs. We focus on conceptual clarity, logical thinking, and building a strong base for future competitive exams like NTSE, NMMS, and Olympiads.",
    heroImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop",
    filterKey: "Foundation"
  },
  boards: {
    title: "Board Exam Courses",
    subtitle: "Excel in Class 11 & 12 Exams",
    description: "Dedicated preparation for CBSE, State Boards, and HSC exams. Our approach ensures NCERT mastery, strong answer-writing skills, and consistent practice to help you achieve 90%+ marks.",
    heroImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop",
    filterKey: "Boards"
  }
};
