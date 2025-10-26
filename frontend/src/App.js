import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [menuItems, setMenuItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/menu')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setMenuItems(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching menu:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (item) => {
    // This is where item.price is accessed
    if (item && item.price !== undefined) {
      setCartItems((prevItems) => [...prevItems, { ...item, quantity: 1 }]);
      console.log(`[Frontend] Added ${item.name} to cart. Price: ${item.price}`);
    } else {
      console.error(`[Frontend] 🔴 ERROR: Failed to add ${item?.name || 'item'} to cart - item.price is undefined`);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);
  };

  if (loading) {
    return <div className="App">Loading menu...</div>;
  }

  if (error) {
    return <div className="App">Error: {error.message}</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>KnightShop Cafe Menu</h1>
      </header>
      <main>
        <section className="menu-list">
          <h2>Our Menu</h2>
          <div className="items-grid">
            {menuItems.map(item => (
              <div key={item.id} className="menu-item-card">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p><strong>${item.price.toFixed(2)}</strong></p>
                {/* The BUG was here: Only passing id and name, not the full item */}
                <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
              </div>
            ))}
          </div>
        </section>
        <section className="cart">
          <h2>Your Cart</h2>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <ul>
                {cartItems.map((item, index) => (
                  <li key={index}>{item.name} - ${item.price.toFixed(2)} x {item.quantity}</li>
                ))}
              </ul>
              <h3>Total: ${calculateTotal()}</h3>
              <button>Checkout</button>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
