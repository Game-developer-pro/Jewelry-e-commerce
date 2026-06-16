import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import styles from './SellerSignup.module.css';

const SellerSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    storeName: '',
    phone: '',
    bio: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key]);
      });

      await api.upload('/api/users/register-seller', submitData);

      // Do not log the user in yet, wait for verification
      navigate('/verify', { state: { email: formData.email } });
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.heroPanel}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <p className={styles.heroTag}>BECOME A SELLER</p>
          <h1 className={styles.heroTitle}>Sell Your <em>Jewelry</em> Here</h1>
          <p className={styles.heroText}>
            Join our curated marketplace of fine jewelry makers. Reach thousands of
            passionate buyers and grow your brand.
          </p>
          <ul className={styles.perks}>
            <li>✦ Direct access to a premium customer base</li>
            <li>✦ Full control over your products & pricing</li>
            <li>✦ Apply exclusive sale discounts on your listings</li>
            <li>✦ Cloudinary-powered image hosting</li>
          </ul>
        </div>
      </div>

      <div className={styles.formPanel}>
        <div className={styles.formBox}>
          <h2 className={styles.title}>Create Seller Account</h2>
          <p className={styles.subtitle}>Fill in your details to start selling today</p>

          {error && <div className={styles.errorMsg}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.sectionLabel}>PERSONAL INFORMATION</p>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={styles.input}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                  minLength={2}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={styles.input}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className={styles.input}
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={styles.input}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={styles.input}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  required
                />
              </div>
            </div>

            <p className={styles.sectionLabel} style={{ marginTop: '1.5rem' }}>STORE INFORMATION</p>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="storeName">Store / Brand Name</label>
              <input
                type="text"
                id="storeName"
                name="storeName"
                className={styles.input}
                value={formData.storeName}
                onChange={handleChange}
                placeholder="e.g. Aurelia Fine Jewelry"
                required
                minLength={2}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="bio">About Your Store</label>
              <textarea
                id="bio"
                name="bio"
                className={styles.textarea}
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell buyers about your craftsmanship, materials you use, and what makes your jewelry unique... (min. 30 characters)"
                required
                minLength={30}
                rows={4}
              />
              <p className={styles.charCount}>{formData.bio.length} / 30 min</p>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Creating Account...' : 'Register as Seller'}
            </button>

          </form>

          <p className={styles.switchText}>
            Already have an account? <Link to="/login" className={styles.link}>Log In</Link>
          </p>
          <p className={styles.switchText}>
            Just a shopper? <Link to="/signup" className={styles.link}>Regular Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerSignup;
