import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import styles from "./CategoryPage.module.css";
import { api } from "../api";

function CategoryPage({ category, title }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      setProducts([]);
      try {
        const data = await api.get(`/api/products?category=${encodeURIComponent(category)}`);
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.breadcrumb}>Shop All / {title}</div>
        <h1 className={styles.title}>{title}</h1>
      </div>

      <div className={styles.productSection}>
        <div className={styles.productSectionHeader}>
          <span className={styles.productCount}>
            {!loading && !error && `${products.length} ${products.length === 1 ? "item" : "items"}`}
          </span>
        </div>

        {loading && (
          <div className={styles.statusWrapper}>
            <div className={styles.spinner} />
            <p className={styles.statusText}>Loading products…</p>
          </div>
        )}

        {error && !loading && (
          <div className={styles.statusWrapper}>
            <p className={styles.errorText}>Something went wrong: {error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className={styles.statusWrapper}>
            <p className={styles.statusText}>No products found in this category.</p>
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
                    {product.countInStock === 0 && (
                      <p style={{ fontSize: '10px', color: '#d9534f', fontWeight: 'bold', margin: '5px 0' }}>
                        OUT OF STOCK
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

export default CategoryPage;
