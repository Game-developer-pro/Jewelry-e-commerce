import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../api';
import styles from './Auth.module.css'; // Reusing Auth styles or creating new ones

const Verify = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.post('/api/users/verify', { email, code });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/add-product');
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h2 className={styles.authTitle}>Verify Your Email</h2>
        <p className={styles.authSubtitle}>
          Please enter your email and the 6-digit code sent to you to activate your seller account.
        </p>

        {error && <div className={styles.errorMsg}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <input
              type="email"
              id="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="code" className={styles.label}>Verification Code</label>
            <input
              type="text"
              id="code"
              className={styles.input}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              maxLength="6"
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Account'}
          </button>
        </form>

        <p className={styles.switchText}>
          Didn't receive the code? <button onClick={() => window.location.reload()} className={styles.linkBtn}>Resend Email</button>
        </p>
      </div>
    </div>
  );
};

export default Verify;
