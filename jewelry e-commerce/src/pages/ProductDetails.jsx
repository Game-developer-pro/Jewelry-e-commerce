import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { api } from '../api';
import styles from './ProductDetails.module.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await api.get(`/api/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className={styles.loading}>Loading product details...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!product) return null;

  const hasDiscount = product.discount > 0;
  const finalPrice = hasDiscount 
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : product.price;

  return (
    <div className={styles.container}>
      <button 
        onClick={() => navigate(-1)} 
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.9rem',
          color: '#666',
          marginBottom: '20px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          padding: 0
        }}
        aria-label="Go back"
      >
        <span style={{ fontSize: '1.2rem' }}>&larr;</span> Back
      </button>
      <div className={styles.productWrapper}>
        <div className={styles.imageSection}>
          <img src={product.image} alt={product.name} className={styles.productImg} />
          {hasDiscount && (
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              backgroundColor: '#cda052',
              color: 'white',
              padding: '6px 12px',
              fontSize: '14px',
              fontWeight: 'bold',
              borderRadius: '2px',
              zIndex: 1
            }}>
              {product.discount}% OFF
            </div>
          )}
        </div>
        
        <div className={styles.infoSection}>
          <div className={styles.category}>{product.category}</div>
          <h1 className={styles.title}>{product.name}</h1>
          
          <div className={styles.priceContainer} style={{ marginBottom: '20px' }}>
            {hasDiscount ? (
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <span className={styles.price} style={{ color: '#cda052' }}>${finalPrice}</span>
                <span style={{ textDecoration: 'line-through', opacity: 0.5, fontSize: '1.2rem' }}>${product.price}</span>
              </div>
            ) : (
              <div className={styles.price}>${product.price}</div>
            )}
          </div>
          
          <p className={styles.description}>{product.description}</p>
          
          <ul className={styles.detailsList}>
            <li><span>Material:</span> {product.material || 'Not specified'}</li>
            <li>
              <span>Availability:</span> 
              {product.countInStock > 0 ? (
                <span style={{ color: product.countInStock <= 5 ? '#d9534f' : 'inherit', fontWeight: product.countInStock <= 5 ? 'bold' : 'normal' }}>
                  {product.countInStock <= 5 ? `Only ${product.countInStock} left` : 'In Stock'}
                </span>
              ) : (
                <span style={{ color: '#d9534f', fontWeight: 'bold' }}>Out of Stock</span>
              )}
            </li>
          </ul>

          {/* ── Seller Info Card ── */}
          {product.user && (
            <div className={styles.sellerCard}>
              <div className={styles.sellerAvatar}>
                {(product.user.storeName || product.user.name || '?')[0].toUpperCase()}
              </div>
              <div className={styles.sellerInfo}>
                <p className={styles.sellerLabel}>Sold by</p>
                <p className={styles.sellerName}>
                  {product.user.storeName || product.user.name}
                </p>
                {product.sellerProductCount !== undefined && (
                  <p className={styles.sellerCount}>
                    {product.sellerProductCount} {product.sellerProductCount === 1 ? 'listing' : 'listings'} in store
                  </p>
                )}
              </div>
            </div>
          )}

          <button
            className={styles.addToCartBtn}
            onClick={() => addToCart(product)}
            disabled={product.countInStock === 0}
          >
            {product.countInStock > 0 ? 'Add to Bag' : 'Out of Stock'}
          </button>

          {(() => {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const isOwner = userInfo && product.user && product.user._id === userInfo._id;
            const isAdmin = userInfo && userInfo.isAdmin;
            
            if (isOwner || isAdmin) {
              return (
                <Link to={`/edit-product/${product._id}`} className={styles.editBtn}>
                  Edit Product
                </Link>
              );
            }
            return null;
          })()}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
