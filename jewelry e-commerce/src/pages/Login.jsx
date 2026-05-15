import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../api';
import styles from './Auth.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (location.state && location.state.message) {
      setMessage(location.state.message);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await api.post('/api/users/login', { email, password });
      // Save user data/token (e.g., in localStorage)
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/'); // Redirect to home on success
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h2 className={styles.title}>Login</h2>
        {message && <div className={styles.errorMsg} style={{color: '#cda052'}}>{message}</div>}
        {error && <div className={styles.errorMsg}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.submitBtn}>Sign In</button>
        </form>
        <p className={styles.switchText}>
          Don't have an account? <Link to="/signup" className={styles.link}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
