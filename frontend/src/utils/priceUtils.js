export function calculateItemTotal(price, quantity) {
  const parsedPrice = typeof price === 'string' ? parseFloat(price) : price;
  const parsedQuantity = typeof quantity === 'string' ? parseFloat(quantity) : quantity;

  if (isNaN(parsedPrice) || isNaN(parsedQuantity) || parsedPrice == null || parsedQuantity == null) {
    console.error('PriceCalculationError: Invalid numeric input detected.', { originalPrice: price, originalQuantity: quantity, parsedPrice, parsedQuantity });
    throw new Error('PriceCalculationError: Invalid numeric input for price calculation.');
  }

  if (parsedPrice < 0 || parsedQuantity < 0) {
    console.warn('PriceCalculationError: Negative price or quantity detected, defaulting to zero total.');
    // Depending on business logic, you might throw an error or return 0 for negative values.
    // Returning 0 here as a safeguard to prevent negative totals from propagating without explicit handling.
    return 0;
  }

  return parsedPrice * parsedQuantity;
}
