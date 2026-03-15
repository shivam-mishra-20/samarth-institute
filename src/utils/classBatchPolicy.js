const BATCH_REQUIRED_CLASSES = new Set(["Class 11", "Class 12"]);

export const isBatchRequiredForClass = (className = "") =>
  BATCH_REQUIRED_CLASSES.has(className);

export const normalizeBatchForClass = (className = "", batchName = "") => {
  if (!isBatchRequiredForClass(className)) {
    return "";
  }
  return batchName || "";
};

export const getBatchLabelForClass = (className = "") => {
  return isBatchRequiredForClass(className)
    ? "Batch"
    : "Batch (Class 11-12 only)";
};
