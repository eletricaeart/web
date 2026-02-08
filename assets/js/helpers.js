/**
 */
const getCleanDate = (date) =>
  date.includes("T") ? date.split("T")[0].split("-").reverse().join("/") : date;

/* gerador de UUIDs */
function generateUUID() {
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback para navegadores antigos
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
