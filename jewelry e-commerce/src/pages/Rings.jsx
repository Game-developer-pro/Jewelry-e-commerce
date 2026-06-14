import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { api } from "../api";
import ProductSkeleton from "../Components/ProductSkeleton";
import styles from "./Rings.module.css";
import ring1 from "../assets/RingsAssets/Rings-1.webp";
import ring2 from "../assets/RingsAssets/Rings-2.webp";
import ring3 from "../assets/RingsAssets/Rings-3.webp";
import ring4 from "../assets/RingsAssets/Rings-4.webp";
import ring5 from "../assets/RingsAssets/Rings-5.webp";
import ring6 from "../assets/RingsAssets/Rings-6.webp";

const categories = [
  { key: "RINGS",         img: ring1 },
  { key: "SIGNET",        img: ring2 },
  { key: "STATEMENT",     img: ring3 },
  { key: "WEDDING BANDS", img: ring4 },
  { key: "MEN'S RINGS",   img: ring5 },
  { key: "ETERNITY",      img: ring6 },
];

function Rings() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [products, setProducts]             = useState([]);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState(null);
  const { addToCart } = useContext(CartContext);

  // Fetch products whenever the active category changes
  useEffect(() => {
    if (!activeCategory) return;

      const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        setProducts([]);
        try {
          const data = await api.get(`/api/products?category=${encodeURIComponent(activeCategory)}`);
          setProducts(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }, [activeCategory]);

    const handleCategoryClick = (key) => {
      // Toggle off if clicking the same category again
      setActiveCategory((prev) => (prev === key ? null : key));
    };

    return (
      <div className={styles.page}>
        {/* Header */}
        <div className={styles.shopallText}>Shop All</div>
        <div className={styles.ringsText}>RINGS</div>

        {/* Category image grid */}
        <div className={styles.ringsGrid}>
          {categories.map((cat) => (
            <img
              key={cat.key}
              className={`${styles.categoryImg} ${
                activeCategory === cat.key ? styles.categoryImgActive : ""
              }`}
              src={cat.img}
              alt={cat.key}
              onClick={() => handleCategoryClick(cat.key)}
            />
          ))}
        </div>

        {/* Category label bar */}
        <div className={styles.ringTextContainer}>
          {categories.map((cat) => (
            <div
              key={cat.key}
              className={`${styles.categoryLabel} ${
                activeCategory === cat.key ? styles.categoryLabelActive : ""
              }`}
              onClick={() => handleCategoryClick(cat.key)}
            >
              {cat.key}
            </div>
          ))}
        </div>

        {/* ── Product section ──────────────────────────────────────────── */}
        {activeCategory && (
          <div className={styles.productSection}>
            <div className={styles.productSectionHeader}>
              <span className={styles.productSectionTitle}>{activeCategory}</span>
              {!loading && !error && (
                <span className={styles.productCount}>
                  {products.length} {products.length === 1 ? "item" : "items"}
                </span>
              )}
            </div>

            {/* Loading */}
            {loading && (
              <div className={styles.productGrid}>
                {[...Array(8)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className={styles.statusWrapper}>
                <p className={styles.errorText}>Something went wrong: {error}</p>
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && products.length === 0 && (
              <div className={styles.statusWrapper}>
                <p className={styles.statusText}>No products found.</p>
              </div>
            )}

            {/* Product grid — rendered once backend supplies data */}
            {!loading && !error && products.length > 0 && (
              <div className={styles.productGrid}>
                {products.map((product) => (
                  <div key={product._id ?? product.id} className={styles.productCard}>
                    <div className={styles.productImgWrapper}>
                      <Link to={`/product/${product._id}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className={styles.productImg}
                        />
                      </Link>
                      <button className={styles.quickAddBtn} onClick={() => addToCart(product)}>Quick Add</button>
                    </div>
                    <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                      <div className={styles.productInfo}>
                        <p className={styles.productName}>{product.name}</p>
                        <p className={styles.productPrice}>${product.price}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
    </div>
  );
}

export default Rings;