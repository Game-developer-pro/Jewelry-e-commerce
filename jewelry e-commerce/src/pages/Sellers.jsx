import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import styles from './HomePage.module.css'; // Reusing some layout styles
import sellerStyles from './SellerSignup.module.css'; // Reusing some seller styles

const Sellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const data = await api.get('/api/users/sellers');
        setSellers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSellers();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading our artisan community...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ 
        textAlign: 'center', 
        fontSize: '2.5rem', 
        fontFamily: 'serif', 
        marginBottom: '10px',
        fontStyle: 'italic'
      }}>
        Meet Our Sellers
      </h1>
      <p style={{ 
        textAlign: 'center', 
        color: '#666', 
        marginBottom: '50px',
        maxWidth: '700px',
        margin: '0 auto 50px'
      }}>
        Discover the independent artisans and jewelry makers who bring their unique visions to life on our platform.
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '30px' 
      }}>
        {sellers.map((seller) => (
          <div key={seller._id} style={{
            backgroundColor: '#fff',
            border: '1px solid #eee',
            padding: '30px',
            textAlign: 'center',
            transition: 'transform 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#f9f9f9',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              color: '#cda052',
              marginBottom: '20px',
              border: '2px solid #cda052'
            }}>
              {(seller.storeName || seller.name || '?')[0].toUpperCase()}
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#1a1a1a' }}>
              {seller.storeName || seller.name}
            </h2>
            <p style={{ 
              color: '#666', 
              fontSize: '0.9rem', 
              lineHeight: '1.6',
              marginBottom: '20px',
              height: '80px',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical'
            }}>
              {seller.bio || "This seller hasn't provided a description yet, but their jewelry speaks volumes."}
            </p>
            <div style={{ marginTop: 'auto' }}>
              <Link to={`/seller/${seller._id}`}>
                <button style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #1a1a1a',
                  padding: '10px 20px',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: 'pointer'
                }}>
                  View Store
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {sellers.length === 0 && (
        <p style={{ textAlign: 'center', color: '#999' }}>No sellers registered yet.</p>
      )}
    </div>
  );
};

export default Sellers;
