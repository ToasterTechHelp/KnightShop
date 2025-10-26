import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cart, setCart] = useState([]);
  const [currentView, setCurrentView] = useState('menu'); // 'menu', 'details', 'order'

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Function to log errors to backend
  const logErrorToBackend = (errorData) => {
    axios.post(`${apiUrl}/api/log/error`, errorData)
      .then((res) => {
        console.log('[Frontend] Error logged to backend:', res.data);
      })
      .catch(err => console.error('Failed to log error to backend:', err.message));
  };

  useEffect(() => {
    console.log('[Frontend] Fetching menu items from backend...');
    
    axios.get(`${apiUrl}/api/menu`)
      .then(response => {
        console.log('[Frontend] Menu items fetched successfully:', response.data);
        setMenuItems(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('[Frontend] Error fetching menu items:', err.message);
        setError('Failed to load menu items');
        setLoading(false);
      });
  }, [apiUrl]);

  const handleItemClick = (item) => {
    console.log('[Frontend] Item selected:', item.name);
    setSelectedItem(item);
    setCurrentView('details');
  };

  const handleAddToCart = (item) => {
    console.log('[Frontend] Adding item to cart:', item.name);
    
    // Bug: Golden Latte causes an error when adding to cart
    // This block is removed to fix the intentional error simulation.
    
    setCart([...cart, { ...item, cartId: Date.now() }]);
    console.log('[Frontend] Cart updated. Total items:', cart.length + 1);
  };

  const handleRemoveFromCart = (cartId) => {
    console.log('[Frontend] Removing item from cart');
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const handleBackToMenu = () => {
    console.log('[Frontend] Navigating back to menu');
    setCurrentView('menu');
    setSelectedItem(null);
  };

  const handleGoToOrder = () => {
    console.log('[Frontend] Navigating to order page');
    setCurrentView('order');
  };

  const handlePlaceOrder = () => {
    console.log('[Frontend] Order placed! Items:', cart.length);
    alert('Order placed successfully! We\'ll have it ready for pickup soon.');
    setCart([]);
    setCurrentView('menu');
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price, 0);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎓 KnightShop Cafe</h1>
        <p className="subtitle">Your favorite spot at UCF</p>
        {cart.length > 0 && (
          <div className="cart-badge" onClick={handleGoToOrder}>
            🛒 {cart.length} items - ${getTotalPrice().toFixed(2)}
          </div>
        )}
      </header>

      <main className="App-main">
        {/* Menu View */}
        {currentView === 'menu' && (
          <>
            <section className="menu-section">
              <h2>Our Menu</h2>
              
              {loading && <p className="status-message">Loading menu...</p>}
              {error && <p className="error-message">{error}</p>}
              
              {!loading && !error && (
                <div className="menu-grid">
                  {menuItems.map(item => (
                    <div 
                      key={item.id} 
                      className="menu-item"
                      onClick={() => handleItemClick(item)}
                    >
                      <h3>{item.name}</h3>
                      <p className="description">{item.description}</p>
                      <p className="price">${item.price.toFixed(2)}</p>
                      <button className="learn-more-btn">Learn More →</button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="info-section">
              <h2>Visit Us</h2>
              <p>📍 University of Central Florida</p>
              <p>⏰ Mon-Fri: 7AM - 8PM | Sat-Sun: 8AM - 6PM</p>
            </section>
          </>
        )}

        {/* Item Details View */}
        {currentView === 'details' && selectedItem && (
          <section className="details-section">
            <button className="back-btn" onClick={handleBackToMenu}>← Back to Menu</button>
            
            <div className="item-details">
              <div className="item-details-header">
                <h2>{selectedItem.name}</h2>
                <span className="category-badge">{selectedItem.category}</span>
              </div>
              
              <p className="item-full-description">{selectedItem.fullDescription}</p>
              
              <div className="item-info-grid">
                <div className="info-card">
                  <h4>Ingredients</h4>
                  <ul>
                    {selectedItem.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="info-card">
                  <h4>Nutritional Info</h4>
                  <p>Calories: {selectedItem.calories}</p>
                  <p>Size: {selectedItem.size}</p>
                </div>
              </div>

              {selectedItem.allergens && selectedItem.allergens.length > 0 && (
                <div className="allergen-warning">
                  ⚠️ Contains: {selectedItem.allergens.join(', ')}
                </div>
              )}

              <div className="item-actions">
                <p className="item-price">${selectedItem.price.toFixed(2)}</p>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => {
                    handleAddToCart(selectedItem);
                    handleBackToMenu();
                  }}
                >
                  Add to Order
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Order/Pickup View */}
        {currentView === 'order' && (
          <section className="order-section">
            <button className="back-btn" onClick={handleBackToMenu}>← Back to Menu</button>
            
            <h2>Your Order for Pickup</h2>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>Your cart is empty!</p>
                <button className="primary-btn" onClick={handleBackToMenu}>Browse Menu</button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div key={item.cartId} className="cart-item">
                      <div className="cart-item-info">
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                      </div>
                      <div className="cart-item-actions">
                        <p className="cart-item-price">${item.price.toFixed(2)}</p>
                        <button 
                          className="remove-btn"
                          onClick={() => handleRemoveFromCart(item.cartId)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax (6.5%):</span>
                    <span>${(getTotalPrice() * 0.065).toFixed(2)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>${(getTotalPrice() * 1.065).toFixed(2)}</span>
                  </div>
                </div>

                <div className="pickup-info">
                  <h3>Pickup Information</h3>
                  <p>📍 KnightShop Cafe - Student Union Building</p>
                  <p>⏰ Estimated pickup time: 15-20 minutes</p>
                  <p>📱 We'll send you a notification when your order is ready!</p>
                </div>

                <button className="place-order-btn" onClick={handlePlaceOrder}>
                  Place Order for Pickup
                </button>
              </>
            )}
          </section>
        )}
      </main>

      <footer className="App-footer">
        <p>&copy; 2025 KnightShop Cafe - Go Knights!</p>
      </footer>
    </div>
  );
}

export default App;
