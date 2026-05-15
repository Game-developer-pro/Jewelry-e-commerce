import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import styles from './AddProduct.module.css'; // Reusing styles

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await api.get(`/api/products/${id}`);
        setFormData({
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          material: data.material || '',
          image: data.image,
          countInStock: data.countInStock,
          discount: data.discount || '',
        });
        setImagePreview(data.image);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching product data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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
      setError(err.message || 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage('');
    setError('');

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo ? userInfo.token : '';

      await api.put(`/api/products/${id}`, formData, token);

      setMessage('Product updated successfully!');
      setTimeout(() => navigate(`/product/${id}`), 2000);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className={styles.container}><p>Loading product data...</p></div>;

  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <h2 className={styles.title}>Update Product</h2>
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
              minLength={20}
              placeholder="Provide a detailed description (min 20 characters)..."
            />
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
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="image">Product Image</label>
            <input
              type="file"
              id="image"
              name="image"
              className={styles.input}
              accept=".jpg,.jpeg,.png,.webp,.avif"
              onChange={handleImageChange}
            />
            {uploading && <p style={{ fontSize: '12px', color: '#cda052', marginTop: '5px' }}>Uploading to Cloudinary...</p>}
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
              min="0"
              max="99"
              placeholder="0 or leave blank for no discount"
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={updating || uploading}>
            {updating ? 'Updating...' : uploading ? 'Uploading Image...' : 'Update Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
