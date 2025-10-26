const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('combined')); // Logging HTTP requests

// In-memory error log store (for quick inspection/debugging)
const errorLogs = [];

// Custom logging middleware
app.use((req, res, next) => {
  console.log(`[Backend] ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Sample menu data with detailed information
const menuItems = [
  {
    id: 1,
    name: 'Knight\'s Brew Coffee',
    description: 'Premium dark roast coffee to fuel your studies',
    fullDescription: 'Our signature dark roast coffee, sourced from sustainable farms and roasted to perfection. The bold, rich flavor will keep you energized through late-night study sessions and early morning classes.',
    price: 3.99,
    category: 'beverages',
    size: '16 oz',
    calories: 5,
    ingredients: ['Dark roast coffee beans', 'Filtered water'],
    allergens: []
  },
  {
    id: 2,
    name: 'Golden Latte',
    description: 'Smooth espresso with steamed milk and a touch of gold',
    fullDescription: 'A luxurious latte featuring our house espresso blend, perfectly steamed milk, and a hint of golden turmeric for that special UCF touch. Smooth, creamy, and absolutely delicious.',
    price: 4.99,
    category: 'beverages',
    size: '16 oz',
    calories: 190,
    ingredients: ['Espresso', 'Whole milk', 'Turmeric', 'Honey'],
    allergens: ['Dairy']
  },
  {
    id: 3,
    name: 'UCF Champion Sandwich',
    description: 'Turkey, bacon, lettuce, tomato on toasted ciabatta',
    fullDescription: 'A championship-worthy sandwich stacked with premium turkey breast, crispy bacon, fresh lettuce, ripe tomatoes, and our signature sauce on perfectly toasted ciabatta bread. A meal fit for a Knight!',
    price: 7.99,
    category: 'food',
    size: 'Full sandwich',
    calories: 520,
    ingredients: ['Ciabatta bread', 'Turkey breast', 'Bacon', 'Lettuce', 'Tomato', 'Mayo', 'Mustard'],
    allergens: ['Gluten', 'Eggs']
  },
  {
    id: 4,
    name: 'Pegasus Panini',
    description: 'Grilled chicken with pesto and mozzarella',
    fullDescription: 'Soar to new heights with this pressed panini featuring grilled chicken breast, fresh basil pesto, melted mozzarella, and sun-dried tomatoes. Grilled to golden perfection.',
    price: 8.49,
    category: 'food',
    size: 'Full panini',
    calories: 580,
    ingredients: ['Grilled chicken', 'Basil pesto', 'Mozzarella cheese', 'Sun-dried tomatoes', 'Ciabatta bread'],
    allergens: ['Gluten', 'Dairy', 'Nuts']
  },
  {
    id: 5,
    name: 'Victory Smoothie',
    description: 'Mango, banana, and passion fruit blend',
    fullDescription: 'Celebrate every small victory with this tropical smoothie! Packed with fresh mango, banana, and exotic passion fruit, blended with Greek yogurt and a touch of honey. Refreshing and nutritious!',
    price: 5.99,
    category: 'beverages',
    size: '20 oz',
    calories: 280,
    ingredients: ['Mango', 'Banana', 'Passion fruit', 'Greek yogurt', 'Honey', 'Ice'],
    allergens: ['Dairy']
  },
  {
    id: 6,
    name: 'Knight Cookies',
    description: 'Freshly baked chocolate chip cookies',
    fullDescription: 'Homemade chocolate chip cookies baked fresh daily. Crispy on the outside, soft and gooey on the inside, loaded with premium chocolate chips. Perfect for a study break or late-night snack.',
    price: 2.99,
    category: 'desserts',
    size: '2 cookies',
    calories: 340,
    ingredients: ['Flour', 'Butter', 'Brown sugar', 'Chocolate chips', 'Eggs', 'Vanilla'],
    allergens: ['Gluten', 'Dairy', 'Eggs']
  }
];

// Routes
app.get('/', (req, res) => {
  console.log('[Backend] Root endpoint accessed');
  res.json({ 
    message: 'KnightShop Cafe API',
    status: 'running',
    endpoints: {
      menu: '/api/menu',
      health: '/api/health'
    }
  });
});

app.get('/api/health', (req, res) => {
  console.log('[Backend] Health check endpoint accessed');
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'KnightShop Backend'
  });
});

app.get('/api/menu', (req, res) => {
  console.log('[Backend] Menu items requested');
  try {
    res.json(menuItems);
    console.log('[Backend] Menu items sent successfully');
  } catch (error) {
    console.error('[Backend] Error sending menu items:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/menu/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  console.log(`[Backend] Menu item requested: ID ${itemId}`);
  
  const item = menuItems.find(i => i.id === itemId);
  
  if (item) {
    console.log(`[Backend] Menu item found: ${item.name}`);
    res.json(item);
  } else {
    console.warn(`[Backend] Menu item not found: ID ${itemId}`);
    res.status(404).json({ error: 'Item not found' });
  }
});

// Error logging endpoint
app.post('/api/log/error', (req, res) => {
  const errorData = req.body || {};

  // Normalize and enrich error data
  const normalized = {
    id: `ERR-${Date.now()}`,
    level: errorData.level || 'ERROR',
    source: errorData.source || 'Frontend',
    message: errorData.message || 'Unknown error',
    errorType: errorData.errorType || 'UnknownError',
    itemName: errorData.itemName || null,
    itemId: errorData.itemId || null,
    userAction: errorData.userAction || null,
    stackTrace: errorData.stackTrace || null,
    timestamp: errorData.timestamp || new Date().toISOString(),
  };

  // Store in memory (keep last 50)
  errorLogs.push(normalized);
  if (errorLogs.length > 50) errorLogs.shift();

  // Print to container logs in a clear format
  console.error('='.repeat(70));
  console.error(`[${normalized.source}] 🔴 ${normalized.level}: ${normalized.message}`);
  console.error(`[${normalized.source}] Error Type: ${normalized.errorType}`);
  if (normalized.itemName) console.error(`[${normalized.source}] Item: ${normalized.itemName} (ID: ${normalized.itemId})`);
  if (normalized.userAction) console.error(`[${normalized.source}] User Action: ${normalized.userAction}`);
  console.error(`[${normalized.source}] Timestamp: ${normalized.timestamp}`);
  if (normalized.stackTrace) console.error(`[${normalized.source}] Stack Trace: ${normalized.stackTrace}`);
  console.error('='.repeat(70));

  res.json({ success: true, id: normalized.id, message: 'Error logged' });
});

// Simple endpoint to retrieve recent error logs (for debugging/verification)
app.get('/api/logs', (req, res) => {
  res.json({ count: errorLogs.length, logs: errorLogs });
});

// Order endpoint
app.post('/api/orders', (req, res) => {
  console.log('[Backend] New order received');
  const { items, total } = req.body;
  
  try {
    if (!items || items.length === 0) {
      console.warn('[Backend] Order rejected: No items in order');
      return res.status(400).json({ error: 'No items in order' });
    }

    const orderId = `ORD-${Date.now()}`;
    const estimatedTime = 15 + Math.floor(Math.random() * 10); // 15-25 minutes
    
    console.log(`[Backend] Order created successfully: ${orderId}`);
    console.log(`[Backend] Order contains ${items.length} items`);
    console.log(`[Backend] Total: $${total}`);
    console.log(`[Backend] Estimated pickup time: ${estimatedTime} minutes`);
    
    res.json({
      success: true,
      orderId,
      estimatedTime,
      message: 'Order placed successfully!'
    });
  } catch (error) {
    console.error('[Backend] Error processing order:', error.message);
    res.status(500).json({ error: 'Failed to process order' });
  }
});

// 404 handler
app.use((req, res) => {
  console.warn(`[Backend] 404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Backend] Error occurred:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(50));
  console.log(`[Backend] KnightShop Cafe API Server`);
  console.log(`[Backend] Server is running on port ${PORT}`);
  console.log(`[Backend] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[Backend] Started at: ${new Date().toISOString()}`);
  console.log('='.repeat(50));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Backend] SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('[Backend] HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('[Backend] SIGINT signal received: closing HTTP server');
  process.exit(0);
});
