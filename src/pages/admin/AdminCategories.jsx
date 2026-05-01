import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiAlertTriangle } from 'react-icons/fi';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/productService';
import toast from 'react-hot-toast';
import './AdminCategories.css';

const DEFAULT_CATEGORIES = [
  { name: 'Construction Site Supplies', slug: 'construction-site-supplies', description: 'Professional construction and site safety equipment', order: 1 },
  { name: 'Safety and Emergency Equipment', slug: 'safety-emergency-equipment', description: 'Emergency response and personal safety gear', order: 2 },
  { name: 'Power Backup and Energy Solutions', slug: 'power-backup-energy', description: 'UPS, generators and portable power solutions', order: 3 },
  { name: 'Gadgets and Utility Items', slug: 'gadgets-utility', description: 'Everyday utility gadgets and smart devices', order: 4 },
  { name: 'Storage and Packaging Solutions', slug: 'storage-packaging', description: 'Industrial storage and packaging materials', order: 5 },
  { name: 'Lights and Portable Lighting Systems', slug: 'lights-portable-lighting', description: 'LED lights, emergency lights, portable systems', order: 6 },
  { name: 'Premium Essentials', slug: 'premium-essentials', description: 'Premium quality essential items', order: 7 }
];

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', order: 0 });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      if (res.success && res.data.length > 0) {
        setCategories(res.data);
      } else {
        await seedDefaultCategories();
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      await seedDefaultCategories();
    } finally {
      setLoading(false);
    }
  };

  const seedDefaultCategories = async () => {
    try {
      for (const cat of DEFAULT_CATEGORIES) {
        await createCategory(cat);
      }
      const res = await getCategories();
      setCategories(res.data);
      toast.success('Default categories added!');
    } catch (error) {
      console.error('Error seeding categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory._id, formData);
        toast.success('Category updated successfully!');
      } else {
        await createCategory(formData);
        toast.success('Category created successfully!');
      }
      fetchCategories();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteModal = (category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete._id);
      toast.success('Category deleted!');
      fetchCategories();
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, description: category.description || '', order: category.order || 0 });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '', order: categories.length + 1 });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', order: 0 });
  };

  return (
    <div className="admin-categories">
      <div className="page-header">
        <div>
          <h1>Categories</h1>
          <p>Manage product categories for your store</p>
        </div>
        <button className="btn-primary" onClick={() => openModal()}>
          <FiPlus /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="admin-loading">Loading categories...</div>
      ) : (
        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category._id} className="category-card">
              <div className="category-card-header">
                <div className="category-order">#{category.order}</div>
                <div className="category-actions">
                  <button onClick={() => openModal(category)} className="action-btn edit">
                    <FiEdit2 />
                  </button>
                  <button onClick={() => openDeleteModal(category)} className="action-btn delete">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <div className="category-card-body">
                <h3>{category.name}</h3>
                <p>{category.description || 'No description'}</p>
                <span className="category-slug">{category.slug}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
              <button className="close-modal" onClick={closeModal}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Safety Equipment"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  placeholder="Brief description of this category..."
                />
              </div>
              <div className="form-group">
                <label>Display Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  min="1"
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && categoryToDelete && (
        <div className="modal-overlay" onClick={() => setDeleteModalOpen(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-icon delete-icon">
              <FiAlertTriangle />
            </div>
            <h3>Delete Category</h3>
            <p>Are you sure you want to delete <strong>"{categoryToDelete.name}"</strong>? Products under this category will be affected.</p>
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