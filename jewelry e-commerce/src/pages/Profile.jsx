import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import styles from './Profile.module.css';

const Profile = () => {
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [user, setUser] = useState({});
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', storeName: '', phone: '', bio: '' });
  const [profilePic, setProfilePic] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) {
        navigate('/login');
        return;
      }
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const data = await res.json();
        setUser(data);
        setForm({
          name: data.name || '',
          email: data.email || '',
          password: '',
          storeName: data.storeName || '',
          phone: data.phone || '',
          bio: data.bio || '',
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePicChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const token = userInfo?.token;
    try {
      // Update textual profile fields
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      // If a picture was selected, upload it separately
      if (profilePic) {
        const picData = new FormData();
        picData.append('profilePic', profilePic);
        await fetch(`${process.env.REACT_APP_API_URL}/api/users/profile/picture`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: picData,
        });
      }
      setMessage('Profile updated successfully');
    } catch (err) {
      setMessage('Failed to update profile');
    }
  };

  const handleLogout = () => {
    clearCart();
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>My Profile</h2>
      {message && <p className={styles.msg}>{message}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>Name</label>
        <input className={styles.input} name="name" value={form.name} onChange={handleChange} />
        <label className={styles.label}>Email</label>
        <input className={styles.input} name="email" type="email" value={form.email} onChange={handleChange} />
          <label className={styles.label}>Password</label>
          <div className={styles.passwordWrapper}>
            <input className={styles.input} name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} placeholder="Leave blank to keep unchanged" />
            <button type="button" className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
          {form.password && (
            <div>
              <label className={styles.label}>Confirm Password</label>
              <div className={styles.passwordWrapper}>
                <input className={styles.input} name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={form.confirmPassword || ''} onChange={handleChange} placeholder="Confirm new password" />
                <button type="button" className={styles.eyeIcon} onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
                  {showConfirmPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}
        {user.isSeller && (
          <>
            <label className={styles.label}>Store Name</label>
            <input className={styles.input} name="storeName" value={form.storeName} onChange={handleChange} />
            <label className={styles.label}>Phone</label>
            <input className={styles.input} name="phone" value={form.phone} onChange={handleChange} />
            <label className={styles.label}>Bio</label>
            <textarea className={styles.textarea} name="bio" value={form.bio} onChange={handleChange} />
            <label className={styles.label}>Profile Picture</label>
            <input className={styles.fileInput} type="file" accept="image/*" onChange={handlePicChange} />
          </>
        )}
        <button type="submit" className={styles.submitBtn}>Save Changes</button>
        <button type="button" className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </form>
    </div>
  );
};

export default Profile;
