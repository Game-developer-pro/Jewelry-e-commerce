import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { api } from '../api';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { cartItems, removeFromCart } = useContext(CartContext);

  const [status, setStatus] = useState('verifying'); // verifying | success | failed | cancelled
  const [message, setMessage] = useState('');

  useEffect(() => {
    const transactionId = searchParams.get('transaction_id');
    const txRef = searchParams.get('tx_ref');
    const paymentStatus = searchParams.get('status');

    const verify = async () => {
      if (paymentStatus === 'cancelled') {
        setStatus('cancelled');
        setMessage('Payment was cancelled. Your cart has been kept.');
        try {
          const userInfo = JSON.parse(localStorage.getItem('userInfo'));
          await api.get(
            `/api/payment/verify?transaction_id=${transactionId || ''}&tx_ref=${txRef}&status=${paymentStatus}`,
            userInfo?.token
          );
        } catch (err) {
          console.error('Failed to update cancelled status on backend', err);
        }
        return;
      }

      if (!transactionId || !txRef) {
        setStatus('failed');
        setMessage('Invalid payment response received.');
        return;
      }

      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const data = await api.get(
          `/api/payment/verify?transaction_id=${transactionId}&tx_ref=${txRef}&status=${paymentStatus}`,
          userInfo?.token
        );

        if (data.success) {
          setStatus('success');
          setMessage('Your payment was successful! Thank you for your order.');
          // Clear the cart
          const ids = [...cartItems].map((item) => item._id);
          ids.forEach((id) => removeFromCart(id));
        } else {
          setStatus('failed');
          setMessage(data.message || 'Payment could not be verified.');
        }
      } catch (err) {
        setStatus('failed');
        setMessage(err.message || 'An error occurred while verifying your payment.');
      }
    };

    verify();
  }, []); // eslint-disable-line

  const icon = {
    verifying: '⏳',
    success: '✦',
    failed: '✕',
    cancelled: '○',
  }[status];

  const color = {
    verifying: '#cda052',
    success: '#27ae60',
    failed: '#c0392b',
    cancelled: '#888',
  }[status];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 60px)',
      padding: '40px 20px',
      fontFamily: "'Inter', sans-serif",
      backgroundColor: '#faf9f6',
      textAlign: 'center',
    }}>
      <div style={{
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        backgroundColor: '#1a1a1a',
        color: color,
        fontSize: '26px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '28px',
        animation: status === 'verifying' ? 'spin 1.5s linear infinite' : 'none',
      }}>
        {icon}
      </div>

      <h1 style={{ fontSize: '26px', fontWeight: '500', color: '#1a1a1a', marginBottom: '12px' }}>
        {status === 'verifying' && 'Verifying Payment…'}
        {status === 'success' && 'Payment Successful!'}
        {status === 'failed' && 'Payment Failed'}
        {status === 'cancelled' && 'Payment Cancelled'}
      </h1>

      <p style={{ fontSize: '15px', color: '#666', maxWidth: '400px', lineHeight: '1.6', marginBottom: '36px' }}>
        {message}
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {status === 'success' && (
          <>
            <button
              onClick={() => navigate('/orders')}
              style={{
                padding: '14px 32px',
                backgroundColor: '#cda052',
                color: '#fff',
                border: 'none',
                fontSize: '12px',
                fontWeight: '700',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                borderRadius: '4px',
              }}
            >
              Track Order
            </button>
            <button
              onClick={() => navigate('/jewelry')}
              style={{
                padding: '14px 32px',
                backgroundColor: '#1a1a1a',
                color: '#fff',
                border: 'none',
                fontSize: '12px',
                fontWeight: '700',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                borderRadius: '4px',
              }}
            >
              Continue Shopping
            </button>
          </>
        )}
        {(status === 'failed' || status === 'cancelled') && (
          <button
            onClick={() => navigate('/checkout')}
            style={{
              padding: '14px 32px',
              backgroundColor: '#1a1a1a',
              color: '#fff',
              border: 'none',
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              borderRadius: '4px',
            }}
          >
            Return to Cart
          </button>
        )}
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '14px 32px',
            backgroundColor: 'transparent',
            color: '#1a1a1a',
            border: '1px solid #1a1a1a',
            fontSize: '12px',
            fontWeight: '700',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
        >
          Home
        </button>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PaymentCallback;
