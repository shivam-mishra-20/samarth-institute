import AcademicModulePage from "../components/dashboard/AcademicModulePage";

const Assignments = () => {
  return (
    <AcademicModulePage
      pageTitle="Assignments"
      pageSubtitle="Manage and track assignment instructions"
      collectionName="assignments"
      documentPrefix="assignment"
      primaryField="title"
      managerLabel="Academic Work"
      fields={[
        { name: "title", label: "Assignment Title", required: true },
        { name: "subject", label: "Subject", required: true },
        { name: "dueDate", label: "Due Date", type: "date", required: true },
        { name: "resourceLink", label: "Resource Link", type: "text" },
        { name: "instructions", label: "Instructions", type: "textarea", required: true },
      ]}
        themeColor="indigo"
    />
  );
};

export default Assignments;
