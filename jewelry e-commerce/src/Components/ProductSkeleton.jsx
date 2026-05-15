import React from 'react';
import styles from '../pages/CategoryPage.module.css';

const ProductSkeleton = () => {
  return (
    <div className={styles.productCard} style={{ cursor: 'default' }}>
      <div className={styles.productImgWrapper} style={{ backgroundColor: '#f3f3f3', animation: 'pulse 1.5s infinite ease-in-out' }}>
        <div style={{ width: '100%', height: '100%' }}></div>
      </div>
      <div className={styles.productInfo}>
        <div style={{ height: '14px', width: '80%', backgroundColor: '#f3f3f3', marginBottom: '8px', borderRadius: '2px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
        <div style={{ height: '14px', width: '40%', backgroundColor: '#f3f3f3', borderRadius: '2px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
      </div>
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default ProductSkeleton;
