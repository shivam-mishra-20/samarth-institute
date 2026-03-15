import AcademicModulePage from "../components/dashboard/AcademicModulePage";

const Exams = () => {
  return (
    <AcademicModulePage
      pageTitle="Exam Schedule"
      pageSubtitle="Create and review exam schedules and syllabus coverage"
      collectionName="exam_schedules"
      documentPrefix="exam"
      primaryField="examName"
      managerLabel="Exam Planner"
      fields={[
        { name: "examName", label: "Exam Name", required: true },
        { name: "subject", label: "Subject", required: true },
        { name: "examDate", label: "Exam Date", type: "date", required: true },
        { name: "startTime", label: "Start Time", type: "time" },
        { name: "maxMarks", label: "Max Marks", type: "number" },
        { name: "syllabus", label: "Syllabus", type: "textarea", required: true },
      ]}
      themeColor="orange"
    />
  );
};

export default Exams;
