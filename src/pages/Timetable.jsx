import AcademicModulePage from "../components/dashboard/AcademicModulePage";

const Timetable = () => {
  return (
    <AcademicModulePage
      pageTitle="TimeTable"
      pageSubtitle="Weekly schedule for classes and batches"
      collectionName="timetable_entries"
      documentPrefix="timetable"
      primaryField="title"
      managerLabel="Class Routine"
      fields={[
        {
          name: "dayOfWeek",
          label: "Day",
          type: "select",
          required: true,
          options: [
            { label: "Monday", value: "monday" },
            { label: "Tuesday", value: "tuesday" },
            { label: "Wednesday", value: "wednesday" },
            { label: "Thursday", value: "thursday" },
            { label: "Friday", value: "friday" },
            { label: "Saturday", value: "saturday" },
          ],
        },
        { name: "title", label: "Period Title", required: true },
        { name: "subject", label: "Subject", required: true },
        { name: "startTime", label: "Start Time", type: "time", required: true },
        { name: "endTime", label: "End Time", type: "time", required: true },
        { name: "teacherName", label: "Teacher Name" },
      ]}
      themeColor="violet"
    />
  );
};

export default Timetable;
