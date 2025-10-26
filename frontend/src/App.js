import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate fetching products from an API or provide mock data
    const fetchProducts = async () => {
      try {
        // In a real application, replace with an actual API call (e.g., fetch('/api/products'))
        // For demonstration, using mock data
        const mockProducts = [
          { id: 'latte', name: 'Golden Latte', description: 'A luxurious blend with turmeric', price: 5.50 },
          { id: 'espresso', name: 'Espresso', description: 'A strong shot of coffee', price: 3.00 },
          { id: 'cappuccino', name: 'Cappuccino', description: 'Espresso with steamed milk foam', price: 4.25 },
          // Example of a product that might initially come without a price, which the fix prevents
          // { id: 'test_item_no_price', name: 'Test Item (No Price)', description: 'This item has no price.' },
        ];
        setProducts(mockProducts);
      } catch (e) {
        console.error("Failed to fetch products:", e);
        setError("Failed to load products. Please try again later.");
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (item) => {
    // FrontendAgent Fix: Validate item.price to prevent 'undefined' errors
    if (typeof item.price === 'undefined' || item.price === null || isNaN(item.price)) {
      const errorMessage = `Failed to add ${item.name || 'item'} to cart - price is missing or invalid.`;
      setError(errorMessage);
      console.error(errorMessage, 'Item:', item);
      return; // Prevent adding to cart if price is invalid
    }

    try {
      setCart((prevCart) => {
        const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
        if (existingItem) {
          return prevCart.map((cartItem) =>
            cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
          );
        } else {
          return [...prevCart, { ...item, quantity: 1 }];
        }
      });
      setError(null); // Clear any previous errors on successful add
      console.log(`Added ${item.name} to cart.`);
    } catch (e) {
      const errorMessage = `Failed to add ${item.name || 'item'} to cart: ${e.message}`;
      setError(errorMessage);
      console.error(`Error adding item to cart:`, e);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0).toFixed(2);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>☕ Coffee Shop</h1>
      </header>
      <main>
        {error && <p className="error-message">🔴 ERROR: {error}</p>}

        <section className="products">
          <h2>Our Products</h2>
          <div className="product-list">
            {products.length === 0 ? (
              <p>Loading products...</p>
            ) : (
              products.map((product) => (
                <div key={product.id} className="product-item">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p>${product.price ? product.price.toFixed(2) : 'N/A'}</p>
                  <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="cart">
          <h2>Your Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className="cart-items">
              <ul>
                {cart.map((item) => (
                  <li key={item.id}>
                    {item.name} (x{item.quantity}) - ${item.price ? (item.price * item.quantity).toFixed(2) : 'N/A'}
                  </li>
                ))}
              </ul>
              <p className="cart-total">Total: <strong>${calculateTotal()}</strong></p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
