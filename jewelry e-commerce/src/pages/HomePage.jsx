import React, { useState, useEffect } from 'react';
import styles from './HomePage.module.css';
import Meta from '../Components/Meta';
import heroImage from '../assets/hero_image.png';
import collections from '../assets/collections.PNG';
import ringImg from '../assets/product_rings.png';
import earringsImg from '../assets/product_earrings.png';
import braceletsImg from '../assets/product_bracelets.png';
import necklaceImg from '../assets/product_necklace.png';
import { Link } from 'react-router-dom';
import { api } from '../api';

const mobileProducts = [
  { img: ringImg,      name: 'Rings',      to: '/rings' },
  { img: earringsImg,  name: 'Earrings',   to: '/earrings' },
  { img: braceletsImg, name: 'Bracelets',  to: '/bracelets' },
  { img: necklaceImg,  name: 'Necklaces',  to: '/necklaces' },
];

const HomePage = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await api.get('/api/products?discounted=true');
        setTrendingProducts(data);
      } catch (err) {
        console.error("Failed to fetch trending products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className={styles.page}>
      <Meta />
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <img src={heroImage} alt="Elegant gold necklace" />
          <div className={styles.overlay}></div>
        </div>
        <div className={styles.heroContent}>
          <p className={styles.heroSubtitle}>THE SUMMER COLLECTION</p>
          <h1 className={styles.heroTitle}>
            Everyday <em>Luxury</em>, <br /> Just for You.
          </h1>
          <p className={styles.heroText}>
            Discover our new arrivals featuring handcrafted fine jewelry designed
            to be lived in. No markups, just brilliant craftsmanship.
          </p>
          <div className={styles.heroActions}>
            <Link to="/jewelry">
              <button className={styles.primaryBtn}>Shop New Arrivals</button>
            </Link>
            <Link to="/sellers">
              <button className={styles.secondaryBtn}>Explore Best Sellers</button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Collections — desktop: one collage image ── */}
      <section className={styles.collections}>
        <div className={styles.collectionImageContainer}>
          <img src={collections} alt="Rings, earrings, bracelets and necklace collection" />
        </div>
      </section>

      {/* ── Collections — mobile: individual product cards ── */}
      <section className={styles.mobileProducts}>
        {mobileProducts.map((p) => (
          <Link to={p.to} key={p.name} className={styles.productCard}>
            <div className={styles.productImgWrap}>
              <img src={p.img} alt={p.name} />
            </div>
            <p className={styles.productName}>{p.name}</p>
          </Link>
        ))}
      </section>

      {/* ── Trending Section ── */}
      <section className={styles.trendingSection}>
        <h2 className={styles.sectionTitle}>
          Trending <em>Now</em>
        </h2>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>Loading trending products...</p>
        ) : trendingProducts.length > 0 ? (
          <div className={styles.mobileProducts} style={{ padding: '0', backgroundColor: 'transparent' }}>
            {trendingProducts.slice(0, 4).map((p) => (
              <Link to={`/product/${p._id}`} key={p._id} className={styles.productCard}>
                <div className={styles.productImgWrap}>
                  <img src={p.image} alt={p.name} />
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    backgroundColor: '#cda052',
                    color: 'white',
                    padding: '4px 8px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    borderRadius: '2px'
                  }}>
                    {p.discount}% OFF
                  </div>
                </div>
                <div style={{ padding: '10px' }}>
                  <p className={styles.productName}>{p.name}</p>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ color: '#cda052', fontWeight: 'bold', margin: '5px 0' }}>
                      ${(p.price * (1 - p.discount / 100)).toFixed(2)}
                    </p>
                    <p style={{ textDecoration: 'line-through', opacity: 0.5, margin: '5px 0', fontSize: '13px' }}>
                      ${p.price}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', padding: '20px' }}>No trending products available right now.</p>
        )}
      </section>

      {/* ── Feature Banner ── */}
      <section className={styles.featureBanner}>
        <div className={styles.featureText}>
          <h2>Sustainable Gold</h2>
          <p>We believe in creating beautiful jewelry without compromising our planet. Our pieces are crafted using 100% recycled solid gold, ensuring ethical and sustainable luxury.</p>
          <button className={styles.secondaryBtn}>Learn More</button>
        </div>
        <div className={styles.featureImage}>
          <img src={collections} alt="Sustainable Jewelry" style={{ objectFit: 'cover' }} />
        </div>
      </section>

      {/* ── Seller CTA (formerly Newsletter) ── */}
      <section className={styles.newsletterSection}>
        <div className={styles.newsletterContent}>
          <h2>Join the Club</h2>
          <p>Are you a jewelry maker? Sell your pieces to thousands of passionate buyers. Register as a seller and start listing today.</p>
          <div className={styles.heroActions} style={{ justifyContent: 'center', marginTop: '24px' }}>
            <Link to="/seller-signup">
              <button className={styles.primaryBtn}>Become a Seller</button>
            </Link>
            <Link to="/signup">
              <button className={styles.secondaryBtn}>Shop as Customer</button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
