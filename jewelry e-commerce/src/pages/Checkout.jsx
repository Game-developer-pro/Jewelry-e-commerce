import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { api } from '../api';
import styles from './Checkout.module.css';

const Checkout = () => {
  const context = useContext(CartContext);
  const navigate = useNavigate();
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');

  // Safety fallback for context
  const cartItems = context?.cartItems || [];
  const removeFromCart = context?.removeFromCart || (() => {});

  const total = Array.isArray(cartItems)
    ? cartItems.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.qty) || 0), 0)
    : 0;

  const handleCheckout = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      navigate('/login', { state: { message: 'Only logged in users can checkout.' } });
      return;
    }

    setPaying(true);
    setPayError('');

    try {
      const data = await api.post('/api/payment/initiate', {
        cartItems,
        totalAmount: parseFloat(total.toFixed(2)),
      }, userInfo.token);

      if (data.paymentLink) {
        // Redirect user to Flutterwave's hosted payment page
        window.location.href = data.paymentLink;
      } else {
        setPayError(data.message || 'Could not initiate payment. Please try again.');
      }
    } catch (err) {
      setPayError(err.message || 'Network error. Please check your connection and try again.');
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Your Shopping Bag</h1>
          <p className={styles.subtitle}>{cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}</p>
        </header>
        
        {cartItems.length === 0 ? (
          <div className={styles.emptyCart}>
            <div className={styles.emptyIcon}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <h2>Your bag is empty</h2>
            <p>Looks like you haven't added anything to your bag yet.</p>
            <button className={styles.continueBtn} onClick={() => navigate('/jewelry')}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div className={styles.checkoutLayout}>
            <div className={styles.cartSection}>
              <ul className={styles.cartList}>
                {cartItems.map((item) => (
                  <li key={item._id || Math.random()} className={styles.cartItem}>
                    <div className={styles.itemImageContainer}>
                      <img src={item.image} alt={item.name} className={styles.itemImage} />
                    </div>
                    <div className={styles.itemDetails}>
                      <div className={styles.itemHeader}>
                        <h3 className={styles.itemName}>{item.name || 'Unnamed Product'}</h3>
                        <button 
                          className={styles.removeBtn} 
                          onClick={() => removeFromCart(item._id)}
                          aria-label="Remove item"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                      <p className={styles.itemMeta}>Quantity: {item.qty || 1}</p>
                      <div className={styles.itemPriceRow}>
                        <span className={styles.unitPrice}>${Number(item.price || 0).toFixed(2)} each</span>
                        <span className={styles.itemTotal}>${(Number(item.price || 0) * Number(item.qty || 0)).toFixed(2)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <aside className={styles.summarySection}>
              <div className={styles.summaryCard}>
                <h2 className={styles.summaryTitle}>Order Summary</h2>
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Shipping</span>
                  <span className={styles.freeHighlight}>FREE</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Estimated Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                
                {payError && (
                  <p style={{ color: '#c0392b', fontSize: '13px', marginTop: '12px', textAlign: 'center' }}>
                    {payError}
                  </p>
                )}

                <button
                  className={styles.checkoutBtn}
                  onClick={handleCheckout}
                  disabled={paying}
                  style={{ opacity: paying ? 0.7 : 1 }}
                >
                  {paying ? 'Redirecting to payment...' : 'Proceed to Payment'}
                </button>
                
                <div className={styles.trustBadges}>
                  <p>Secure SSL checkout</p>
                  <p>Free returns within 30 days</p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
