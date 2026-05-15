import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import styles from "./CategoryPage.module.css"; // Reuse the layout styles
import { api } from "../api";
import Meta from "../Components/Meta";
import ProductSkeleton from "../Components/ProductSkeleton";

function AllJewelry() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);

  // Filters state
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get('/api/products');
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    // Category Filter
    if (categoryFilter !== "All") {
      result = result.filter((p) => p.category && p.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    // Price Sorting
    if (sortOrder === "LowToHigh") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "HighToLow") {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(result);
  }, [categoryFilter, sortOrder, products]);

  const uniqueCategories = ["All", ...new Set(products.map(p => p.category).filter(Boolean))];

  return (
    <div className={styles.page}>
      <Meta title="Shop All" />
      <div className={styles.header}>
        <div className={styles.breadcrumb}>Shop All / Jewelry</div>
        <h1 className={styles.title}>All Jewelry</h1>
      </div>

      <div style={{ padding: "0 40px", display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "20px" }}>
        <select 
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        <select 
          value={sortOrder} 
          onChange={(e) => setSortOrder(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value="">Sort by Price</option>
          <option value="LowToHigh">Low to High</option>
          <option value="HighToLow">High to Low</option>
        </select>
      </div>

      <div className={styles.productSection} style={{ paddingTop: '0' }}>
        <div className={styles.productSectionHeader}>
          <span className={styles.productCount}>
            {!loading && !error && `${filteredProducts.length} ${filteredProducts.length === 1 ? "item" : "items"}`}
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

        {!loading && !error && filteredProducts.length === 0 && (
          <div className={styles.statusWrapper}>
            <p className={styles.statusText}>No products found matching filters.</p>
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div className={styles.productGrid}>
            {filteredProducts.map((product) => (
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

export default AllJewelry;
