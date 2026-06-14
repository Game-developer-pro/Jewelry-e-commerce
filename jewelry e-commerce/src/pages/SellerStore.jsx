import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { api } from "../api";
import styles from "./CategoryPage.module.css";
import ProductSkeleton from "../Components/ProductSkeleton";

function SellerStore() {
  const { sellerId } = useParams();
  const [products, setProducts] = useState([]);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        // Fetch products by seller
        const prodData = await api.get(`/api/products?seller=${sellerId}`);
        setProducts(prodData);

        // Try to get seller info from the first product if available, or fetch from users if needed
        // For simplicity, we'll use the user info populated in the products or fetch it
        if (prodData.length > 0 && prodData[0].user) {
          // In our backend, products don't always populate user fully in list view
          // Let's assume we need to fetch seller profile or it's partially there
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [sellerId]);

  return (
    <div className={styles.page}>
      <div className={styles.header} style={{ textAlign: 'center' }}>
        <div className={styles.breadcrumb}>Artisans / Store</div>
        <h1 className={styles.title} style={{ textTransform: 'uppercase' }}>
          {products.length > 0 && products[0].user ? products[0].user.storeName || products[0].user.name : "Seller Store"}
        </h1>
        <p style={{ color: '#666', marginTop: '10px', maxWidth: '600px', margin: '10px auto' }}>
          Browse the unique collection from this independent jewelry maker.
        </p>
      </div>

      <div className={styles.productSection}>
        <div className={styles.productSectionHeader}>
          <span className={styles.productCount}>
            {!loading && !error && `${products.length} ${products.length === 1 ? "item" : "items"} in collection`}
          </span>
        </div>

        {loading && (
          <div className={styles.productGrid}>
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className={styles.statusWrapper}>
            <p className={styles.errorText}>Something went wrong: {error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className={styles.statusWrapper}>
            <p className={styles.statusText}>No products found for this seller.</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className={styles.productGrid}>
            {products.map((product) => (
              <div key={product._id} className={styles.productCard}>
                <div className={styles.productImgWrapper}>
                  <Link to={`/product/${product._id}`}>
                    <img src={product.image} alt={product.name} className={styles.productImg} />
                  </Link>
                  <button className={styles.quickAddBtn} onClick={() => addToCart(product)}>
                    Quick Add
                  </button>
                  {product.discount > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      backgroundColor: '#cda052',
                      color: 'white',
                      padding: '4px 8px',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      borderRadius: '2px'
                    }}>
                      {product.discount}% OFF
                    </div>
                  )}
                </div>
                <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                  <div className={styles.productInfo}>
                    <p className={styles.productName}>{product.name}</p>
                    {product.discount > 0 ? (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <p className={styles.productPrice} style={{ color: '#cda052', fontWeight: 'bold' }}>
                          ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                        </p>
                        <p className={styles.productPrice} style={{ textDecoration: 'line-through', opacity: 0.5, fontSize: '0.9em' }}>
                          ${product.price}
                        </p>
                      </div>
                    ) : (
                      <p className={styles.productPrice}>${product.price}</p>
                    )}
                    {product.countInStock <= 5 && product.countInStock > 0 && (
                      <p style={{ fontSize: '10px', color: '#d9534f', fontWeight: 'bold', margin: '5px 0' }}>
                        ONLY {product.countInStock} LEFT
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerStore;
