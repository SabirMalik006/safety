import { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiPhoneCall } from 'react-icons/fi';
import { submitContact } from '../services/contactService';
import toast from 'react-hot-toast';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await submitContact(formData);
      toast.success('Message sent successfully! We will get back to you soon.');
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you. Our team is here to help you with any questions.</p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="contact-info-section">
        <div className="container">
          <div className="contact-cards-grid">
            <div className="contact-card">
              <div className="contact-icon"><FiMapPin /></div>
              <h3>Visit Us</h3>
              <p>Icon 2, Business Square</p>
              <p>Gulberg Greens, Islamabad, Pakistan</p>
              <div className="card-hover-effect"></div>
            </div>
            <div className="contact-card">
              <div className="contact-icon"><FiPhoneCall /></div>
              <h3>Call Us</h3>
              <p>+92 3215366666</p>
              <p>Available 24/7</p>
              <div className="card-hover-effect"></div>
            </div>
            <div className="contact-card">
              <div className="contact-icon"><FiMail /></div>
              <h3>Email Us</h3>
              <p>info@horizonintegratedsolutions@gmail.com</p>
              <div className="card-hover-effect"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Map & Form Section */}
      <section className="contact-form-section">
        <div className="container">
          <div className="contact-grid">
            {/* Map - Updated to Gulberg Greens, Islamabad */}
            <div className="contact-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3319.203578201449!2d73.047129675667!3d33.69799473363481!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfbfd0e0e0e0e1%3A0x0e0e0e0e0e0e0e0e!2sIcon%202%2C%20Business%20Square%2C%20Gulberg%20Greens%2C%20Islamabad!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Icon 2, Business Square, Gulberg Greens, Islamabad"
              ></iframe>
            </div>

            {/* Contact Form */}
            <div className="contact-form">
              <h2>Send us a Message</h2>
              <p>Have a question? Fill out the form and we'll get back to you within 24 hours.</p>
              
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name *"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email *"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject *"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <textarea
                    name="message"
                    placeholder="Your Message *"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'} <FiSend />
                </button>
                {isSubmitted && (
                  <div className="success-message">
                    ✓ Inquiry sent successfully! Our team will contact you soon.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Business Hours Section - 24/7 */}
      <section className="hours-section">
        <div className="container">
          <div className="hours-content">
            <div className="hours-icon"><FiClock /></div>
            <h2>Business Hours</h2>
            <div className="hours-grid">
              <div className="hour-item">
                <span>Monday - Sunday</span>
                <strong>24/7 Open</strong>
              </div>
              <div className="hour-item">
                <span>Customer Support</span>
                <strong>Available 24/7</strong>
              </div>
              <div className="hour-item">
                <span>Emergency Support</span>
                <strong>Always Open</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .contact-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .container {
          /* Using global container styles */
        }

        /* Hero Section */
        .contact-hero {
          background: #1C1917;
          padding: 90px 0;
          text-align: center;
          position: relative;
        }
        .contact-hero h1 {
          font-size: 52px;
          font-weight: 800;
          color: #F59E0B;
          margin-bottom: 20px;
          letter-spacing: -0.02em;
        }
        .contact-hero p {
          font-size: 19px;
          color: #F59E0B;
          margin: 0 auto;
          line-height: 1.5;
        }

        /* Contact Cards */
        .contact-info-section {
          padding: 80px 0;
          background: #ffffff;
        }
        .contact-cards-grid {
          display: flex;
          justify-content: center;
          align-items: stretch;
          gap: 32px;
          flex-wrap: wrap;

          margin: 0 auto;
        }
        .contact-card {
          flex: 1;
          min-width: 260px;
          max-width: 320px;
          text-align: center;
          padding: 40px 24px;
          background: #ffffff;
          border-radius: 28px;
          box-shadow: 0 15px 35px -10px rgba(0,0,0,0.08);
          transition: all 0.35s ease;
          border: 1px solid rgba(245,158,11,0.15);
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
        .contact-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 45px -12px rgba(0,0,0,0.15);
          border-color: #F59E0B;
        }
        .contact-icon {
          width: 70px;
          height: 70px;
          background: #F59E0B;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          font-size: 30px;
          color: #1c1c1c;
          transition: transform 0.3s ease;
        }
        .contact-card:hover .contact-icon {
          transform: scale(1.05);
        }
        .contact-card h3 {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 16px;
          color: #000000;
        }
        .contact-card p {
          color: #555;
          line-height: 1.6;
          margin: 8px 0;
          font-size: 14px;
        }

        /* Contact Form Section */
        .contact-form-section {
          padding: 80px 0;
          // background: linear-gradient(115deg, #f0f4f8 0%, #e8edf2 100%);
        }
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
          align-items: start;
        }
        .contact-map {
          height: 500px;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 20px 40px -12px rgba(0,0,0,0.15);
        }
        .contact-map iframe {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .contact-form {
          background: #ffffff;
          padding: 40px;
          border-radius: 28px;
          box-shadow: 0 15px 35px -10px rgba(0,0,0,0.08);
          border: 1px solid rgba(245,158,11,0.1);
        }
        .contact-form h2 {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 12px;
          color: #000000;
        }
        .contact-form p {
          color: #666;
          margin-bottom: 28px;
          font-size: 15px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 14px 18px;
          border: 1.5px solid #e0e0e0;
          border-radius: 16px;
          font-size: 15px;
          transition: all 0.3s ease;
          font-family: inherit;
          background: #fefefe;
        }
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #F59E0B;
          box-shadow: 0 0 0 3px rgba(245,158,11,0.1);
        }
        .submit-btn {
          background: #F59E0B;
          color: #1c1c1c;
          border: none;
          padding: 14px 32px;
          border-radius: 40px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
          margin-top: 8px;
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .submit-btn:hover:not(:disabled) {
          background: #e0a800;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(245,158,11,0.3);
        }
        .success-message {
          margin-top: 18px;
          padding: 14px;
          background: #e8f5e9;
          color: #2e7d32;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 500;
          text-align: center;
        }

        /* Hours Section - 24/7 */
        .hours-section {
          padding: 80px 0;
          background: #ffffff;
        }
        .hours-content {
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
          background: linear-gradient(115deg, #FCF9F4 0%, #f8f5ee 100%);
          padding: 50px 40px;
          border-radius: 48px;
        }
        .hours-icon {
          width: 70px;
          height: 70px;
          background: #F59E0B;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 32px;
          color: #1c1c1c;
        }
        .hours-content h2 {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 32px;
          color: #000000;
        }
        .hours-grid {
          display: flex;
          justify-content: center;
          gap: 48px;
          flex-wrap: wrap;
        }
        .hour-item {
          text-align: center;
        }
        .hour-item span {
          display: block;
          color: #666;
          margin-bottom: 8px;
          font-size: 14px;
        }
        .hour-item strong {
          font-size: 20px;
          font-weight: 700;
          color: #000000;
        }

        /* Universal Hover Effect */
        .card-hover-effect {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: #F59E0B;
          transform: scaleX(0);
          transition: transform 0.35s cubic-bezier(0.2, 0.9, 0.4, 1.1);
          transform-origin: left;
        }
        .contact-card:hover .card-hover-effect {
          transform: scaleX(1);
        }

        /* Responsive Design */
        @media (max-width: 1280px) {
          .container {
            /* Using global container styles */
          }
        }

        @media (max-width: 1024px) {
          .container {
            /* Using global container styles */
          }
          .contact-hero h1 {
            font-size: 44px;
          }
          .contact-grid {
            gap: 40px;
          }
          .contact-form {
            padding: 32px;
          }
          .hours-grid {
            gap: 32px;
          }
        }

        @media (max-width: 768px) {
          .container {
            /* Using global container styles */
          }
          .contact-hero {
            padding: 70px 0;
          }
          .contact-hero h1 {
            font-size: 36px;
          }
          .contact-hero p {
            font-size: 16px;
          }
          .contact-cards-grid {
            gap: 24px;
          }
          .contact-card {
            min-width: 240px;
            padding: 32px 20px;
          }
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .contact-map {
            height: 350px;
          }
          .form-row {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .contact-form h2 {
            font-size: 28px;
          }
          .hours-content {
            padding: 40px 24px;
          }
          .hours-content h2 {
            font-size: 28px;
          }
          .hours-grid {
            flex-direction: column;
            gap: 20px;
            align-items: center;
          }
          .hour-item strong {
            font-size: 18px;
          }
        }

        @media (max-width: 640px) {
          .container {
            /* Using global container styles */
          }
          .contact-hero h1 {
            font-size: 32px;
          }
          .contact-card {
            min-width: 100%;
          }
          .contact-form {
            padding: 24px;
          }
          .submit-btn {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .container {
            /* Using global container styles */
          }
          .contact-icon {
            width: 60px;
            height: 60px;
            font-size: 26px;
          }
          .contact-card h3 {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
}
