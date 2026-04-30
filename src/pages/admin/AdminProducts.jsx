import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiImage, FiSearch } from 'react-icons/fi';
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from '../../services/productService';
import toast from 'react-hot-toast';
import './AdminProducts.css';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', comparePrice: '', category: '',
    stock: '', images: [], colors: [], sizes: [], isFeatured: false
  });
  const [colorInput, setColorInput] = useState('');

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
    }
  };

  const handleDelete = async (product) => {
    if (window.confirm(`Delete "${product.name}"?`)) {
      try {
        await deleteProduct(product._id);
        toast.success('Product deleted!');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete product');
      }
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
        colors: product.colors?.map(c => c.name) || [],
        sizes: product.sizes?.map(s => s.name) || [],
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
  };

  const addColor = () => {
    if (colorInput.trim() && !formData.colors.includes(colorInput.trim())) {
      setFormData({ ...formData, colors: [...formData.colors, colorInput.trim()] });
      setColorInput('');
    }
  };

  const removeColor = (color) => {
    setFormData({ ...formData, colors: formData.colors.filter(c => c !== color) });
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
          <p>Manage your product inventory</p>
        </div>
        <button className="btn-primary" onClick={() => openModal()}>
          <FiPlus /> Add Product
        </button>
      </div>

      <div className="search-bar">
        <FiSearch />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="products-table-container">
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
                <td className="product-name-cell">{product.name}</td>
                <td>{product.category?.name || 'Uncategorized'}</td>
                <td>Rs.{product.price?.toLocaleString()}</td>
                <td className={product.stock < 10 ? 'low-stock' : ''}>{product.stock}</td>
                <td>
                  <span className={`status-badge ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className="actions-cell">
                  <button onClick={() => openModal(product)} className="action-btn edit">
                    <FiEdit2 />
                  </button>
                  <button onClick={() => handleDelete(product)} className="action-btn delete">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
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
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required>
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="3" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (Rs.) *</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Compare Price (Original)</label>
                  <input type="number" value={formData.comparePrice} onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Stock Quantity *</label>
                  <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required />
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
                  <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} />
                  Featured Product (Shows on Homepage)
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editingProduct ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}