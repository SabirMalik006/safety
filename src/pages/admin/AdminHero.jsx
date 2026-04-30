import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiImage } from 'react-icons/fi';
import { getHeroes, getAllHeroes, createHero, updateHero, deleteHero } from '../../services/heroService';
import toast from 'react-hot-toast';
import './AdminHero.css';

export default function AdminHero() {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHero, setEditingHero] = useState(null);
  const [formData, setFormData] = useState({
    title: '', subtitle: '', description: '', imageUrl: '', buttonText: 'Shop Now',
    buttonLink: '/collections/all-products', order: 0, isActive: true
  });

  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    setLoading(true);
    try {
      const res = await getAllHeroes();
      setHeroes(res.data || []);
    } catch (error) {
      console.error('Error fetching heroes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingHero) {
        await updateHero(editingHero._id, formData);
        toast.success('Hero slide updated!');
      } else {
        await createHero(formData);
        toast.success('Hero slide created!');
      }
      fetchHeroes();
      closeModal();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (hero) => {
    if (window.confirm(`Delete "${hero.title}"?`)) {
      try {
        await deleteHero(hero._id);
        toast.success('Hero slide deleted!');
        fetchHeroes();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const toggleActive = async (hero) => {
    try {
      await updateHero(hero._id, { isActive: !hero.isActive });
      fetchHeroes();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const openModal = (hero = null) => {
    if (hero) {
      setEditingHero(hero);
      setFormData({
        title: hero.title, subtitle: hero.subtitle || '', description: hero.description || '',
        imageUrl: hero.imageUrl, buttonText: hero.buttonText, buttonLink: hero.buttonLink,
        order: hero.order, isActive: hero.isActive
      });
    } else {
      setEditingHero(null);
      setFormData({
        title: '', subtitle: '', description: '', imageUrl: '', buttonText: 'Shop Now',
        buttonLink: '/collections/all-products', order: heroes.length + 1, isActive: true
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingHero(null);
  };

  if (loading) return <div className="admin-loading">Loading hero slides...</div>;

  return (
    <div className="admin-hero">
      <div className="page-header">
        <div>
          <h1>Hero Section</h1>
          <p>Manage homepage hero slideshow</p>
        </div>
        <button className="btn-primary" onClick={() => openModal()}>
          <FiPlus /> Add Slide
        </button>
      </div>

      <div className="hero-slides-grid">
        {heroes.map(hero => (
          <div key={hero._id} className={`hero-slide-card ${!hero.isActive ? 'inactive' : ''}`}>
            <div className="hero-slide-preview">
              <img src={hero.imageUrl} alt={hero.title} />
              <div className="hero-slide-overlay">
                <div className="hero-slide-text">
                  <h3>{hero.title}</h3>
                  <p>{hero.subtitle}</p>
                </div>
              </div>
            </div>
            <div className="hero-slide-info">
              <div className="hero-slide-header">
                <span className="hero-order">Order: #{hero.order}</span>
                <label className="toggle-switch">
                  <input type="checkbox" checked={hero.isActive} onChange={() => toggleActive(hero)} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="hero-slide-actions">
                <button onClick={() => openModal(hero)} className="action-btn edit"><FiEdit2 /></button>
                <button onClick={() => handleDelete(hero)} className="action-btn delete"><FiTrash2 /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingHero ? 'Edit Hero Slide' : 'Add Hero Slide'}</h2>
              <button className="close-modal" onClick={closeModal}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Subtitle</label>
                <input type="text" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Image URL *</label>
                <input type="url" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} required />
                <small>Use direct image link (Pexels, Unsplash, etc.)</small>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Button Text</label>
                  <input type="text" value={formData.buttonText} onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Button Link</label>
                  <input type="text" value={formData.buttonLink} onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Display Order</label>
                  <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} />
                </div>
                <div className="form-group checkbox">
                  <label>
                    <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                    Active (Show on homepage)
                  </label>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editingHero ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}