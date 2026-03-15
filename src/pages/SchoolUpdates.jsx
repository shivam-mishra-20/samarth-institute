import AcademicModulePage from "../components/dashboard/AcademicModulePage";

const SchoolUpdates = () => {
  return (
    <AcademicModulePage
      pageTitle="School Updates"
      pageSubtitle="News, events and bulletin notices for all roles"
      collectionName="school_updates"
      documentPrefix="school-update"
      primaryField="title"
      managerLabel="Notice Board"
      filterableField="type"
      fields={[
        {
          name: "type",
          label: "Update Type",
          type: "select",
          required: true,
          options: [
            { label: "News", value: "news" },
            { label: "Event", value: "event" },
            { label: "Bulletin", value: "bulletin" },
          ],
        },
        { name: "title", label: "Title", required: true },
        { name: "eventDate", label: "Relevant Date", type: "date" },
        { name: "details", label: "Details", type: "textarea", required: true },
      ]}
      themeColor="cyan"
    />
  );
};

export default SchoolUpdates;
