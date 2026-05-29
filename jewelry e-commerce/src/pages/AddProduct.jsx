import React, { useState } from 'react';
import { api } from '../api';
import styles from './AddProduct.module.css';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Rings',
    material: '',
    image: '',
    countInStock: '',
    discount: '',
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    setUploading(true);
    setError('');
    
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo ? userInfo.token : '';

      const uploadData = new FormData();
      uploadData.append('image', file);

      const data = await api.upload('/api/upload', uploadData, token);
      setFormData(prev => ({ ...prev, image: data.url }));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    
    // Validate fields
    const errors = {};
    if (!formData.name || formData.name.trim().length < 3) errors.name = 'Name must be at least 3 characters';
    if (!formData.description || formData.description.trim().length < 10) errors.description = 'Description must be at least 10 characters';
    if (!formData.price || Number(formData.price) < 0) errors.price = 'Price must be a non‑negative number';
    if (!formData.countInStock || Number(formData.countInStock) < 0) errors.countInStock = 'Stock count must be a non‑negative number';
    if (!formData.category) errors.category = 'Category is required';
    if (formData.material && formData.material.trim().length > 0 && formData.material.trim().length < 3) errors.material = 'Material must be at least 3 characters';
    if (!formData.image) errors.image = 'Product image is required';
    
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    } else {
      setFieldErrors({});
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo ? userInfo.token : '';

      await api.post('/api/products', formData, token);
      
      setMessage('Product added successfully!');
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Rings',
        material: '',
        image: '',
        countInStock: '',
        discount: '',
      });
      setImagePreview(null);
    } catch (err) {
      const errMsg = err.response?.data?.message || (Array.isArray(err.response?.data?.errors) ? err.response?.data?.errors.join(', ') : null) || err.message || 'An error occurred. Please try again.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <h2 className={styles.title}>Add New Product</h2>
        {message && <div className={styles.successMsg}>{message}</div>}
        {error && <div className={styles.errorMsg}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="name">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className={styles.input}
              value={formData.name}
              onChange={handleChange}
              required
              minLength={3}
            />
            {fieldErrors.name && <div className={styles.fieldError}>{fieldErrors.name}</div>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className={styles.textarea}
              value={formData.description}
              onChange={handleChange}
              required
              minLength={10}
              placeholder="Provide a detailed description (min 20 characters)..."
            />
            {fieldErrors.description && <div className={styles.fieldError}>{fieldErrors.description}</div>}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.label} htmlFor="price">Price ($)</label>
              <input
                type="number"
                id="price"
                name="price"
                className={styles.input}
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
              />
              {fieldErrors.price && <div className={styles.fieldError}>{fieldErrors.price}</div>}
            </div>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.label} htmlFor="countInStock">Stock Count</label>
              <input
                type="number"
                id="countInStock"
                name="countInStock"
                className={styles.input}
                value={formData.countInStock}
                onChange={handleChange}
                required
                min="0"
              />
              {fieldErrors.countInStock && <div className={styles.fieldError}>{fieldErrors.countInStock}</div>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.label} htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                className={styles.select}
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="Rings">Rings</option>
                <option value="Earrings">Earrings</option>
                <option value="Necklaces">Necklaces</option>
                <option value="Bracelets">Bracelets</option>
              </select>
            </div>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.label} htmlFor="material">Material</label>
              <input
                type="text"
                id="material"
                name="material"
                className={styles.input}
                value={formData.material}
                onChange={handleChange}
                placeholder="e.g. 14k Solid Gold (min 3 chars)"
                minLength={3}
              />
              {fieldErrors.material && <div className={styles.fieldError}>{fieldErrors.material}</div>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="image">Product Image</label>
            <input
              type="file"
              id="image"
              name="image"
              className={`${styles.input} ${styles.uploadInput}`}
              accept=".jpg,.jpeg,.png,.webp,.avif"
              onChange={handleImageChange}
              required={!formData.image}
            />
            {fieldErrors.image && <div className={styles.fieldError}>{fieldErrors.image}</div>}
            {uploading && <p style={{ fontSize: '12px', color: '#cda052', marginTop: '5px' }}>Uploading to Database...</p>}
            <p style={{ fontSize: '13px', color: '#0e0909ff', fontWeight: '500', fontFamily: 'Arial, sans-serif' }}>Image to be uploaded should be less than 2MB in size and have the format of .jpg,.jpeg,.png,.webp,.avif and a white background</p>
            {imagePreview && (
              <div style={{ marginTop: '10px', textAlign: 'center' }}>
                <img src={imagePreview} alt="Preview" style={{ maxWidth: '100px', borderRadius: '4px', border: '1px solid #ddd' }} />
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="discount">Discount (%) - Optional</label>
            <input
              type="number"
              id="discount"
              name="discount"
              className={styles.input}
              value={formData.discount}
              onChange={handleChange}
              min="1"
              max="99"
              placeholder="e.g. 20 (leave blank for no discount)"
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading || uploading}>
            {loading ? 'Adding...' : uploading ? 'Uploading Image...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
