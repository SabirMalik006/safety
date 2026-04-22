import { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiPhoneCall } from 'react-icons/fi';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page page-content">
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
              <p>Plot #12, Industrial Area</p>
              <p>SITE Phase II, Karachi, Pakistan</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon"><FiPhoneCall /></div>
              <h3>Call Us</h3>
              <p>+92 300 1234567</p>
              <p>Mon-Fri: 10am - 8pm</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon"><FiMail /></div>
              <h3>Email Us</h3>
              <p>support@safetyme.pk</p>
              <p>sales@safetyme.pk</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map & Form Section */}
      <section className="contact-form-section">
        <div className="container">
          <div className="contact-grid">
            {/* Map */}
            <div className="contact-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d217514.64718147625!2d74.172566!3d31.482252!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190483e0c3c8d7%3A0x73a2b2a1b08f8b9!2sLahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Store Location"
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
                <button type="submit" className="submit-btn">
                  Send Message <FiSend />
                </button>
                {isSubmitted && (
                  <div className="success-message">
                    ✓ Inquiry sent successfully! Our safety consultants will contact you soon.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Business Hours Section */}
      <section className="hours-section">
        <div className="container">
          <div className="hours-content">
            <div className="hours-icon"><FiClock /></div>
            <h2>Business Hours</h2>
            <div className="hours-grid">
              <div className="hour-item">
                <span>Monday - Friday</span>
                <strong>10:00 AM - 8:00 PM</strong>
              </div>
              <div className="hour-item">
                <span>Saturday</span>
                <strong>11:00 AM - 6:00 PM</strong>
              </div>
              <div className="hour-item">
                <span>Sunday</span>
                <strong>Closed</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .contact-page {
          font-family: 'Inter', sans-serif;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Hero Section */
        .contact-hero {
          background: linear-gradient(135deg, #f0ebe4 0%, #e8e0d5 100%);
          padding: 80px 0;
          text-align: center;
        }
        .contact-hero h1 {
          font-size: 48px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 16px;
        }
        .contact-hero p {
          font-size: 18px;
          color: #555;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Contact Cards */
        .contact-info-section {
          padding: 60px 0;
          background: #fff;
        }
        .contact-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
        }
        .contact-card {
          text-align: center;
          padding: 40px 20px;
          background: #f8f8f8;
          border-radius: 16px;
          transition: transform 0.3s ease;
        }
        .contact-card:hover {
          transform: translateY(-5px);
        }
        .contact-icon {
          width: 70px;
          height: 70px;
          background: #c4a47a;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 28px;
          color: white;
        }
        .contact-card h3 {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #1a1a1a;
        }
        .contact-card p {
          color: #666;
          line-height: 1.6;
          margin: 5px 0;
        }

        /* Contact Form Section */
        .contact-form-section {
          padding: 60px 0;
          background: #faf9f8;
        }
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
        }
        .contact-map {
          height: 450px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .contact-form h2 {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #1a1a1a;
        }
        .contact-form p {
          color: #666;
          margin-bottom: 30px;
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
          padding: 14px 16px;
          border: 1px solid #ddd;
          border-radius: 12px;
          font-size: 14px;
          transition: border-color 0.3s;
          font-family: inherit;
        }
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #c4a47a;
        }
        .submit-btn {
          background: #c4a47a;
          color: white;
          border: none;
          padding: 14px 30px;
          border-radius: 30px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: background 0.3s;
        }
        .submit-btn:hover {
          background: #a8885e;
        }
        .success-message {
          margin-top: 15px;
          padding: 12px;
          background: #e8f5e9;
          color: #2e7d32;
          border-radius: 8px;
          font-size: 14px;
        }

        /* Hours Section */
        .hours-section {
          padding: 60px 0;
          background: #fff;
        }
        .hours-content {
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }
        .hours-icon {
          width: 70px;
          height: 70px;
          background: #c4a47a;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 32px;
          color: white;
        }
        .hours-content h2 {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 30px;
        }
        .hours-grid {
          display: flex;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
        }
        .hour-item {
          text-align: center;
        }
        .hour-item span {
          display: block;
          color: #666;
          margin-bottom: 8px;
        }
        .hour-item strong {
          font-size: 18px;
          color: #1a1a1a;
        }

        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }
          .contact-hero h1 {
            font-size: 36px;
          }
          .form-row {
            grid-template-columns: 1fr;
          }
          .hours-grid {
            flex-direction: column;
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
}