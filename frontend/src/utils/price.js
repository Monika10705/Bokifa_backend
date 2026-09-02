/** Parses any price value (number, "₹26,95", "₹26.95") → raw float */
export function parsePrice(price) {

  if (typeof price === "number") return price;
  // Remove currency symbol, then normalize comma decimal → dot
  const cleaned = String(price).replace(/[^0-9.,]/g, "");

  // If both comma and dot exist, comma is thousands separator → remove it
  if (cleaned.includes(",") && cleaned.includes(".")) {
    return parseFloat(cleaned.replace(/,/g, ""));
  }

  // If only comma, it's the decimal separator
  if (cleaned.includes(",")) {
    return parseFloat(cleaned.replace(",", "."));
  }
  
  return parseFloat(cleaned);
}

/** Formats a raw float → "26,95" display string (no symbol) */
export function fmt(num) {
  return num.toFixed(2).replace(".", ",");
}
