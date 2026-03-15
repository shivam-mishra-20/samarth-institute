import {
  Newspaper,
  CalendarDays,
  Megaphone,
  BookMarked,
  NotebookPen,
  FileClock,
  PlayCircle,
  ScrollText,
  Clock3,
  Wallet,
  ClipboardCheck,
  MessageSquareText,
} from "lucide-react";

const makeItem = (title, subtitle, route, icon, accent = "blue") => ({
  title,
  subtitle,
  route,
  icon,
  accent,
});

export const getFeatureSectionsByRole = (role) => {
  const schoolUpdates = [
    makeItem("News", "Latest institute announcements", "/school-updates?type=news", Newspaper, "cyan"),
    makeItem("Events", "Upcoming activities & events", "/school-updates?type=event", CalendarDays, "amber"),
    makeItem("Bulletin", "Daily notice board updates", "/school-updates?type=bulletin", Megaphone, "rose"),
  ];

  const academics = [
    makeItem("Assignments", "Submit & track assignments", "/assignments", BookMarked, "indigo"),
    makeItem("Homework", "Daily home practice tasks", "/homework", NotebookPen, "teal"),
    makeItem("Exams", "Schedules, syllabus & prep", "/exams", FileClock, "orange"),
    makeItem("E-Learning", "Recorded video lectures", "/recorded-lectures", PlayCircle, "blue"),
    makeItem("Report Card", "Results & progress report", "/results", ScrollText, "emerald"),
  ];

  const myUpdatesCommon = [
    makeItem("Timetable", "Daily class schedule", "/timetable", Clock3, "violet"),
    makeItem("Attendance", "Track attendance records", "/attendance", ClipboardCheck, "green"),
  ];

  const feeForRole =
    role === "admin"
      ? makeItem("Fee Manager", "Manage all student fees", "/fee-management", Wallet, "yellow")
      : role === "parent"
        ? makeItem("Fee Status", "Child fee & payment status", "/student-fees", Wallet, "yellow")
        : role === "student"
          ? makeItem("My Fees", "Fee status & payment history", "/student-fees", Wallet, "yellow")
          : null;

  const communication = [
    makeItem("Communication", "Messages & circulars", "/communication", MessageSquareText, "pink"),
  ];

  return [
    { key: "school", title: "School Updates", items: schoolUpdates },
    { key: "academics", title: "Academics", items: academics },
    {
      key: "my",
      title: "My Updates",
      items: feeForRole ? [...myUpdatesCommon, feeForRole] : myUpdatesCommon,
    },
    { key: "communication", title: "Communication", items: communication },
  ];
};
