export function transformPrice(price: string): number {
  // Remove all non-numeric characters except for the last comma
  const cleanedPrice = price.replace(/[^\d,]/g, "").replace(/,(?=.*,)/g, "");

  // Replace the last comma with a dot for decimal point
  const formattedPrice = cleanedPrice.replace(/,/, ".");

  // Parse the formatted string to a float
  return parseFloat(formattedPrice);
}
