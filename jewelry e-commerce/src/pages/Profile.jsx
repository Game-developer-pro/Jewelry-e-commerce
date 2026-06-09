import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import styles from './Profile.module.css';

const Profile = () => {
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);
  const [user, setUser] = useState({});
  const [form, setForm] = useState({ name: '', email: '', password: '', storeName: '', phone: '', bio: '' });
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
        <input className={styles.input} name="password" type="password" value={form.password} onChange={handleChange} placeholder="Leave blank to keep unchanged" />
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
