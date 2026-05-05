import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSearch, FiAlertTriangle, FiPackage, FiStar, FiImage } from 'react-icons/fi';
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories, uploadProductImages, deleteProductImage } from '../../services/productService';
import toast from 'react-hot-toast';
import './AdminProducts.css';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', comparePrice: '', category: '',
    stock: '', images: [], colors: [], sizes: [], isFeatured: false
  });
  
  const [colorInput, setColorInput] = useState('');
  const [sizeInput, setSizeInput] = useState('');
  const [imageInput, setImageInput] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (modalOpen || deleteModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [modalOpen, deleteModalOpen]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        comparePrice: Number(formData.comparePrice) || 0,
        stock: Number(formData.stock),
        colors: formData.colors.map(c => typeof c === 'string' ? { name: c } : c),
        sizes: formData.sizes.map(s => typeof s === 'string' ? { name: s } : s)
      };

      if (editingProduct) {
        await updateProduct(editingProduct._id, productData);
        toast.success('Product updated successfully!');
      } else {
        await createProduct(productData);
        toast.success('Product created successfully!');
      }
      fetchData();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete._id);
      toast.success('Product deleted!');
      fetchData();
      setDeleteModalOpen(false);
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        comparePrice: product.comparePrice || '',
        category: product.category?._id || product.category,
        stock: product.stock,
        images: product.images || [],
        colors: product.colors?.map(c => c.name || c) || [],
        sizes: product.sizes?.map(s => s.name || s) || [],
        isFeatured: product.isFeatured || false
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '', description: '', price: '', comparePrice: '', category: '',
        stock: '', images: [], colors: [], sizes: [], isFeatured: false
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
    setColorInput('');
    setSizeInput('');
    setImageInput('');
  };

  const addItem = (type, value, setInput) => {
    const trimmed = value.trim();
    if (trimmed && !formData[type].includes(trimmed)) {
      setFormData({ ...formData, [type]: [...formData[type], trimmed] });
      setInput('');
    }
  };

  const removeItem = (type, val) => {
    setFormData({ ...formData, [type]: formData[type].filter(item => item !== val) });
  };

  const addImage = () => {
    const trimmed = imageInput.trim();
    if (trimmed) {
      setFormData({ ...formData, images: [...formData.images, { url: trimmed }] });
      setImageInput('');
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const data = new FormData();
    files.forEach(file => data.append('images', file));

    setUploadingImages(true);
    try {
      const res = await uploadProductImages(data);
      if (res.success) {
        setFormData({ ...formData, images: [...formData.images, ...res.data] });
        toast.success('Images uploaded successfully');
      }
    } catch (error) {
      toast.error('Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = async (imgToRemove) => {
    if (imgToRemove.publicId) {
      try {
        await deleteProductImage(imgToRemove.publicId);
      } catch (error) {
        console.error('Failed to delete from Cloudinary', error);
      }
    }
    setFormData({
      ...formData,
      images: formData.images.filter(img => img !== imgToRemove)
    });
  };

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-products">
      <div className="page-header">
        <div>
          <h1>Inventory Management</h1>
          <p>Total Products: {products.length}</p>
        </div>
        <button className="btn-primary" onClick={() => openModal()}>
          <FiPlus /> Add New Product
        </button>
      </div>

      <div className="admin-controls-row">
        <div className="search-bar">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product._id}>
                <td className="product-cell">
                  <div className="prod-img">
                    <img src={product.images?.[0]?.url || '/placeholder.jpg'} alt="" />
                  </div>
                  <div className="prod-info">
                    <span className="prod-name">{product.name}</span>
                    {product.isFeatured && <span className="feat-tag"><FiStar /> Featured</span>}
                  </div>
                </td>
                <td>{product.category?.name || 'Uncategorized'}</td>
                <td>
                  <div className="price-stack">
                    <span className="price-now">Rs.{product.price?.toLocaleString()}</span>
                    {product.comparePrice > 0 && <span className="price-old">Rs.{product.comparePrice?.toLocaleString()}</span>}
                  </div>
                </td>
                <td>
                  <span className={`stock-text ${product.stock < 10 ? 'low' : ''}`}>
                    {product.stock} units
                  </span>
                </td>
                <td>
                  <span className={`status-pill ${product.stock > 0 ? 'active' : 'inactive'}`}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className="table-actions">
                  <button className="edit-btn" onClick={() => openModal(product)}><FiEdit2 /></button>
                  <button className="delete-btn" onClick={() => { setProductToDelete(product); setDeleteModalOpen(true); }}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Form Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="close-btn" onClick={closeModal}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-grid">
                <div className="form-group full">
                  <label>Product Name *</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label>Category *</label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData({...formData, category: e.target.value})} 
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Stock Quantity *</label>
                  <input 
                    type="number" 
                    value={formData.stock} 
                    onChange={(e) => setFormData({...formData, stock: e.target.value})} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Base Price (Rs.) *</label>
                  <input 
                    type="number" 
                    value={formData.price} 
                    onChange={(e) => setFormData({...formData, price: e.target.value})} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Compare Price (Original)</label>
                  <input 
                    type="number" 
                    value={formData.comparePrice} 
                    onChange={(e) => setFormData({...formData, comparePrice: e.target.value})} 
                  />
                </div>

                <div className="form-group full">
                  <label>Description</label>
                  <textarea 
                    value={formData.description} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})} 
                    rows="3"
                  />
                </div>

                <div className="form-group full">
                  <label>Product Images</label>
                  <div className="tags-wrap">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="tag image-tag">
                        <img src={img.url} alt="" />
                        <button type="button" onClick={() => handleRemoveImage(img)}>×</button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="image-upload-area">
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*"
                      onChange={handleFileUpload}
                      id="product-image-upload"
                      className="file-input-hidden"
                      disabled={uploadingImages}
                    />
                    <label htmlFor="product-image-upload" className="upload-btn">
                      <FiImage /> {uploadingImages ? 'Uploading...' : 'Upload Images'}
                    </label>
                    <span className="upload-hint">Or paste URL below:</span>
                    <div className="tag-input-box" style={{marginTop: '0.5rem', width: '100%'}}>
                      <input 
                        type="text" 
                        value={imageInput} 
                        onChange={(e) => setImageInput(e.target.value)} 
                        placeholder="Paste image URL..." 
                      />
                      <button type="button" onClick={addImage}>Add URL</button>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Colors</label>
                  <div className="tags-wrap">
                    {formData.colors.map(c => (
                      <span key={c} className="tag">
                        {c} <button type="button" onClick={() => removeItem('colors', c)}>×</button>
                      </span>
                    ))}
                    <div className="tag-input-box">
                      <input 
                        type="text" 
                        value={colorInput} 
                        onChange={(e) => setColorInput(e.target.value)} 
                        placeholder="Add color..." 
                      />
                      <button type="button" onClick={() => addItem('colors', colorInput, setColorInput)}>Add</button>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Sizes</label>
                  <div className="tags-wrap">
                    {formData.sizes.map(s => (
                      <span key={s} className="tag">
                        {s} <button type="button" onClick={() => removeItem('sizes', s)}>×</button>
                      </span>
                    ))}
                    <div className="tag-input-box">
                      <input 
                        type="text" 
                        value={sizeInput} 
                        onChange={(e) => setSizeInput(e.target.value)} 
                        placeholder="Add size (e.g. XL, 42)..." 
                      />
                      <button type="button" onClick={() => addItem('sizes', sizeInput, setSizeInput)}>Add</button>
                    </div>
                  </div>
                </div>

                <div className="form-group full checkbox">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={formData.isFeatured} 
                      onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})} 
                    />
                    <span>Mark as Featured Product (Shows on Home Page)</span>
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <FiAlertTriangle className="warn-icon" />
            <h3>Delete Product?</h3>
            <p>Are you sure you want to delete <strong>{productToDelete?.name}</strong>? This action cannot be undone.</p>
            <div className="confirm-actions">
              <button className="btn-secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</button>
              <button className="btn-danger" onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}