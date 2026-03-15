import AcademicModulePage from "../components/dashboard/AcademicModulePage";

const Homework = () => {
  return (
    <AcademicModulePage
      pageTitle="Homework"
      pageSubtitle="Daily homework module for students and parents"
      collectionName="homework_tasks"
      documentPrefix="homework"
      primaryField="title"
      managerLabel="Daily Practice"
      fields={[
        { name: "title", label: "Homework Title", required: true },
        { name: "subject", label: "Subject", required: true },
        { name: "dueDate", label: "Submission Date", type: "date", required: true },
        { name: "workType", label: "Work Type", type: "select", options: [
          { label: "Written", value: "written" },
          { label: "Worksheet", value: "worksheet" },
          { label: "Project", value: "project" },
          { label: "Reading", value: "reading" },
        ] },
        { name: "details", label: "Details", type: "textarea", required: true },
      ]}
      themeColor="teal"
    />
  );
};

export default Homework;
