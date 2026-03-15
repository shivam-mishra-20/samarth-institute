import AcademicModulePage from "../components/dashboard/AcademicModulePage";

const Communication = () => {
  return (
    <AcademicModulePage
      pageTitle="Communication"
      pageSubtitle="Class communications, reminders and circulars"
      collectionName="communication_messages"
      documentPrefix="communication"
      primaryField="title"
      managerLabel="Messaging"
      fields={[
        {
          name: "category",
          label: "Category",
          type: "select",
          required: true,
          options: [
            { label: "General", value: "general" },
            { label: "Urgent", value: "urgent" },
            { label: "Parent Meeting", value: "parent-meeting" },
            { label: "Fee Reminder", value: "fee-reminder" },
            { label: "Academic", value: "academic" },
          ],
        },
        { name: "title", label: "Message Title", required: true },
        { name: "validTill", label: "Valid Till", type: "date" },
        { name: "details", label: "Message Body", type: "textarea", required: true },
      ]}
      themeColor="pink"
    />
  );
};

export default Communication;
