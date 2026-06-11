import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import styles from './OrderTracking.module.css';

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userInfoStr = localStorage.getItem('userInfo');
    if (!userInfoStr) {
      navigate('/login');
      return;
    }
    const userInfo = JSON.parse(userInfoStr);

    const fetchOrders = async () => {
      try {
        const data = await api.get('/api/orders/myorders', userInfo.token);
        setOrders(data);
      } catch (err) {
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) {
    return <div className={styles.container}>Loading orders...</div>;
  }

  if (error) {
    return <div className={styles.container}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Order Tracking</h2>
      {orders.length === 0 ? (
        <div className={styles.noOrders}>You have no orders yet.</div>
      ) : (
        orders.map((order) => (
          <div key={order._id} className={styles.orderCard}>
            <div className={styles.orderHeader}>
              <div>
                <div className={styles.orderId}>Order #{order._id.substring(order._id.length - 8).toUpperCase()}</div>
                <div className={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString()}</div>
              </div>
              <div className={`${styles.statusBadge} ${order.paymentStatus === 'paid' ? styles.statusPaid : order.paymentStatus === 'failed' ? styles.statusFailed : styles.statusPending}`}>
                {order.paymentStatus}
              </div>
            </div>
            
            <div className={styles.itemsList}>
              {order.orderItems.map((item, idx) => (
                <div key={idx} className={styles.itemRow}>
                  <img src={item.image} alt={item.name} className={styles.itemImage} />
                  <div className={styles.itemDetails}>
                    <div className={styles.itemName}>{item.name}</div>
                    <div className={styles.itemPriceQty}>${item.price.toFixed(2)} x {item.qty}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.orderFooter}>
              Total: ${order.totalAmount.toFixed(2)}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderTracking;
