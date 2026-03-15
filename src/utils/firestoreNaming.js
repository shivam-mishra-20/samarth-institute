export const slugifySegment = (value = "") => {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
};

export const buildLogicalDocId = (...segments) => {
  return segments
    .filter(Boolean)
    .map((segment) => slugifySegment(segment))
    .filter(Boolean)
    .join("_");
};

export const getDateKey = (date = new Date()) => {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
};

export const getClassBatchTag = (className, batchName) => {
  return [className || "all-class", batchName || "all-batch"].join("-");
};
