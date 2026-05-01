import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSearch, FiAlertTriangle, FiPackage } from 'react-icons/fi';
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from '../../services/productService';
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
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', comparePrice: '', category: '',
    stock: '', images: [], colors: [], sizes: [], isFeatured: false
  });
  const [colorInput, setColorInput] = useState('');
  const [imageInput, setImageInput] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

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
        colors: formData.colors,
        sizes: formData.sizes
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

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete._id);
      toast.success('Product deleted!');
      fetchData();
      setDeleteModalOpen(false);
      setProductToDelete(null);
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
        colors: product.colors?.map(c => typeof c === 'string' ? c : c.name) || [],
        sizes: product.sizes?.map(s => typeof s === 'string' ? s : s.name) || [],
        isFeatured: product.isFeatured || false
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '', description: '', price: '', comparePrice: '', category: '',
        stock: '', images: [], colors: [], sizes: [], isFeatured: false
      });
    }
    setColorInput('');
    setImageInput('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
    setColorInput('');
    setImageInput('');
  };

  const addColor = () => {
    const trimmed = colorInput.trim();
    if (trimmed && !formData.colors.includes(trimmed)) {
      setFormData({ ...formData, colors: [...formData.colors, trimmed] });
      setColorInput('');
    }
  };

  const removeColor = (color) => {
    setFormData({ ...formData, colors: formData.colors.filter(c => c !== color) });
  };

  const addImage = () => {
    const trimmed = imageInput.trim();
    if (trimmed) {
      setFormData({ ...formData, images: [...formData.images, { url: trimmed }] });
      setImageInput('');
    }
  };

  const removeImage = (idx) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) });
  };

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="admin-loading">Loading products...</div>;

  return (
    <div className="admin-products">
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p>Manage your product inventory — {products.length} items</p>
        </div>
        <button className="btn-primary" onClick={() => openModal()}>
          <FiPlus /> Add Product
        </button>
      </div>

      <div className="search-bar">
        <FiSearch />
        <input
          type="text"
          placeholder="Search products by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button className="search-clear" onClick={() => setSearchTerm('')}>
            <FiX />
          </button>
        )}
      </div>

      <div className="products-table-container">
        {filteredProducts.length === 0 ? (
          <div className="products-empty">
            <FiPackage size={40} />
            <p>{searchTerm ? 'No products match your search.' : 'No products yet. Add your first product!'}</p>
          </div>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
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
                  <td className="product-image-cell">
                    <img src={product.images?.[0]?.url || '/placeholder.jpg'} alt={product.name} />
                  </td>
                  <td className="product-name-cell">
                    <span className="product-name">{product.name}</span>
                    {product.isFeatured && <span className="featured-badge">Featured</span>}
                  </td>
                  <td className="product-category-cell">{product.category?.name || 'Uncategorized'}</td>
                  <td>
                    <div className="price-cell">
                      <span className="price-main">Rs.{product.price?.toLocaleString()}</span>
                      {product.comparePrice > 0 && (
                        <span className="price-compare">Rs.{product.comparePrice?.toLocaleString()}</span>
                      )}
                    </div>
                  </td>
                  <td className={product.stock < 10 ? 'low-stock' : 'stock-cell'}>
                    {product.stock}
                  </td>
                  <td>
                    <span className={`status-badge ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button onClick={() => openModal(product)} className="action-btn edit" title="Edit">
                      <FiEdit2 />
                    </button>
                    <button onClick={() => openDeleteModal(product)} className="action-btn delete" title="Delete">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button className="close-modal" onClick={closeModal}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  placeholder="Describe the product..."
                />
              </div>

              <div className="form-row three-col">
                <div className="form-group">
                  <label>Price (Rs.) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Compare Price (Original)</label>
                  <input
                    type="number"
                    value={formData.comparePrice}
                    onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="form-group">
                  <label>Stock Quantity *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Product Images</label>
                <div className="tags-input">
                  {formData.images.map((img, idx) => (
                    <span key={idx} className="tag image-tag">
                      <img src={img.url || img} alt="" onError={(e) => e.target.style.display='none'} />
                      <button type="button" onClick={() => removeImage(idx)}><FiX /></button>
                    </span>
                  ))}
                  <div className="tag-add">
                    <input
                      type="text"
                      value={imageInput}
                      onChange={(e) => setImageInput(e.target.value)}
                      placeholder="Paste image URL..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                    />
                    <button type="button" onClick={addImage}>Add</button>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Colors</label>
                <div className="tags-input">
                  {formData.colors.map(color => (
                    <span key={color} className="tag">
                      {color} <button type="button" onClick={() => removeColor(color)}><FiX /></button>
                    </span>
                  ))}
                  <div className="tag-add">
                    <input
                      type="text"
                      value={colorInput}
                      onChange={(e) => setColorInput(e.target.value)}
                      placeholder="Add color..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                    />
                    <button type="button" onClick={addColor}>Add</button>
                  </div>
                </div>
              </div>

              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  Featured Product (Shows on Homepage)
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && productToDelete && (
        <div className="modal-overlay" onClick={() => setDeleteModalOpen(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-icon delete-icon">
              <FiAlertTriangle />
            </div>
            <h3>Delete Product</h3>
            <p>Are you sure you want to delete <strong>"{productToDelete.name}"</strong>? This action cannot be undone.</p>
            <div className="confirm-modal-actions">
              <button className="confirm-cancel-btn" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </button>
              <button className="confirm-danger-btn" onClick={handleDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}