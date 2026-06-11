import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * SellerRoute — only allows sellers and admins through.
 * Redirects anyone else to the login page.
 */
const SellerRoute = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (userInfo.isSeller && !userInfo.isVerified) {
    return <Navigate to="/verify" state={{ email: userInfo.email, error: 'Unverified account please verify to continue' }} replace />;
  }

  if (!userInfo.isSeller && !userInfo.isAdmin) {
    // Authenticated but not a seller — show an access-denied page
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
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: '#1a1a1a',
          color: '#cda052',
          fontSize: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
        }}>
          ✕
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: '500', color: '#1a1a1a', marginBottom: '12px' }}>
          Seller Access Only
        </h1>
        <p style={{ fontSize: '15px', color: '#666', maxWidth: '400px', lineHeight: '1.6', marginBottom: '32px' }}>
          This page is restricted to registered sellers and administrators.
          Register as a seller to list your jewelry products.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="/seller-signup" style={{
            padding: '14px 28px',
            backgroundColor: '#1a1a1a',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '12px',
            fontWeight: '700',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            borderRadius: '4px',
          }}>
            Become a Seller
          </a>
          <a href="/" style={{
            padding: '14px 28px',
            backgroundColor: 'transparent',
            color: '#1a1a1a',
            border: '1px solid #1a1a1a',
            textDecoration: 'none',
            fontSize: '12px',
            fontWeight: '700',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            borderRadius: '4px',
          }}>
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default SellerRoute;
