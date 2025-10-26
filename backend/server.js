const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// --- Dummy Data (replace with actual database/service calls) ---
const productPrices = {
  'prod_123': 10.99,
  'prod_456': 20.50,
  'prod_789': 5.00,
};
// ----------------------------------------------------------------

// Root endpoint
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Price calculation endpoint
app.post('/api/calculate-price', (req, res) => {
  const { items } = req.body;

  // 1. Input Validation
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid input: "items" array is required and must not be empty.' });
  }

  let totalPriceCents = 0;

  try {
    for (const item of items) {
      const { productId, quantity } = item;

      if (!productId || typeof productId !== 'string' || !quantity || typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).json({ error: `Invalid item format: Each item must have a valid 'productId' (string) and 'quantity' (number > 0). Received: ${JSON.stringify(item)}` });
      }

      const pricePerUnit = productPrices[productId];
      if (pricePerUnit === undefined) {
        return res.status(404).json({ error: `Product with ID '${productId}' not found.` });
      }

      // Convert price to cents for safe calculation to avoid floating-point issues
      const pricePerUnitCents = Math.round(pricePerUnit * 100);
      totalPriceCents += (pricePerUnitCents * quantity);
    }

    // Convert total back to dollars for the response
    const totalPrice = totalPriceCents / 100;

    res.status(200).json({ totalPrice: parseFloat(totalPrice.toFixed(2)) });

  } catch (error) {
    console.error('Price calculation error:', error);
    // 2. Robust Error Handling
    res.status(500).json({ error: 'Failed to calculate price due to an internal server error.' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
