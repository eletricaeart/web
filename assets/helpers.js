/**
 */
const getCleanDate = (date) =>
  date.includes("T") ? date.split("T")[0].split("-").reverse().join("/") : date;
