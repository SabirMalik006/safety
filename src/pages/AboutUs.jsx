import React from 'react';
import { FiAward, FiHeart, FiUsers, FiTarget, FiTruck, FiShield, FiRefreshCw, FiStar, FiTrendingUp, FiClock } from 'react-icons/fi';

export default function AboutUs() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <h1>Our Mission</h1>
          <p>Protecting Pakistan's workforce with certified industrial safety gear and professional tools.</p>
        </div>
      </section>

      {/* Leadership Message Section */}
      <section className="leadership-message">
        <div className="container">
          <div className="message-box">
            <span className="message-tag">A Message From Our Leadership</span>
            <h2>Our Commitment to Your Safety</h2>

            <div className="message-content">
              <p>In today's rapidly evolving industrial landscape, organizations face unprecedented challenges in securing their workforce, optimizing safety protocols, and maintaining a competitive advantage through reliable protection gear.</p>

              <p>At <strong>The Horizon Hub</strong>, we understand that successful safety management requires more than just equipment—it demands strategic vision, technical excellence, and an unwavering commitment to our clients' well-being and success.</p>

              <p>Our team brings together decades of experience in industrial safety, occupational health, and risk management to deliver solutions that are not only robust but also perfectly aligned with operational realities and organizational objectives.</p>

              <p>We are proud to serve construction firms, manufacturing plants, and industrial institutions that require the highest standards of reliability and protection. Every product we provide reflects our commitment to excellence and our understanding of the critical role safety plays in modern operations.</p>

              <p>Thank you for considering <strong>The Horizon Hub</strong> as your safety partner. We look forward to helping you achieve your workplace protection goals and ensuring a safer future for your team.</p>
            </div>

            <div className="message-footer">
              <div className="signature-area">
                <div className="signature-font">
                  <span className="sig-word">Ammad</span>
                  <span className="sig-word">Khan</span>
                </div>
                <div className="leader-info">
                  {/* <strong>Ammad Khan</strong> */}
                  <span>CEO, The Horizon Hub</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="brand-story">
        <div className="container">
          <div className="story-grid">
            <div className="story-image">
              <img
                src="https://images.pexels.com/photos/8470884/pexels-photo-8470884.jpeg"
                alt="Industrial safety team at work"
              />
            </div>
            <div className="story-content">
              <span className="story-tag">Our Background</span>
              <h2>Your Partner in Industrial Excellence</h2>
              <p>Founded in 2020, The Horizon Hub was established with a clear mission: to bridge the gap in Pakistan's industrial sector by providing certified, high-performance safety equipment and precision tools. What began as a specialized consultancy has evolved into a leading distributor of professional-grade gear.</p>
              <p>Every piece of equipment in our catalog is rigorously tested to meet international safety standards (CE, ANSI). We believe that the right tools and protection don't just prevent accidents—they empower workers to perform at their definitive best.</p>
              <div className="story-stats">
                <div className="stat">
                  <strong>10,000+</strong>
                  <span>Unit Deliveries</span>
                </div>
                <div className="stat">
                  <strong>500+</strong>
                  <span>Certified Tools</span>
                </div>
                <div className="stat">
                  <strong>4.9★</strong>
                  <span>Reliability Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-icon"><FiTarget /></div>
              <h3>Our Mission</h3>
              <p>To eliminate workplace hazards by providing accessible, certified, and high-quality safety solutions to every industrial sector in Pakistan.</p>
              <div className="card-hover-effect"></div>
            </div>
            <div className="mission-card">
              <div className="mission-icon"><FiHeart /></div>
              <h3>Our Vision</h3>
              <p>To be the definitive standard for industrial safety in the region, recognized for technical expertise and uncompromising quality.</p>
              <div className="card-hover-effect"></div>
            </div>
            <div className="mission-card">
              <div className="mission-icon"><FiUsers /></div>
              <h3>Our Promise</h3>
              <p>Guaranteed certification, technical support, and the most reliable equipment for your workforce.</p>
              <div className="card-hover-effect"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">What We Believe</span>
            <h2>Our Core Values</h2>
            <p className="section-subtitle">The principles that guide everything we do</p>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon"><FiAward /></div>
              <h3>Certified Safety</h3>
              <p>All our products comply with international safety standards (CE/ANSI).</p>
              <div className="card-hover-effect"></div>
            </div>
            <div className="value-card">
              <div className="value-icon"><FiHeart /></div>
              <h3>Integrity</h3>
              <p>We prioritize worker safety above all else in our product selection.</p>
              <div className="card-hover-effect"></div>
            </div>
            <div className="value-card">
              <div className="value-icon"><FiTruck /></div>
              <h3>Industrial Logistics</h3>
              <p>Specialized handling for heavy tools and bulk safety equipment.</p>
              <div className="card-hover-effect"></div>
            </div>
            <div className="value-card">
              <div className="value-icon"><FiShield /></div>
              <h3>Total Support</h3>
              <p>On-site safety consultations and equipment training available.</p>
              <div className="card-hover-effect"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Value Stats Row */}
      <section className="value-stats-section">
        <div className="container">
          <div className="value-stats-grid">
            <div className="value-stat-item">
              <FiTrendingUp className="stat-icon" />
              <div className="stat-info">
                <span className="stat-number">100%</span>
                <span className="stat-label">Certified Products</span>
              </div>
            </div>
            <div className="value-stat-item">
              <FiClock className="stat-icon" />
              <div className="stat-info">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Technical Support</span>
              </div>
            </div>
            <div className="value-stat-item">
              <FiUsers className="stat-icon" />
              <div className="stat-info">
                <span className="stat-number">5000+</span>
                <span className="stat-label">Happy Clients</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Centered properly */}
      <section className="why-us">
        <div className="container">
          <div className="why-us-content">
            <h2>Why Choose The Horizon Hub?</h2>
            <div className="features-grid">
              <div className="feature">
                <FiStar />
                <div>
                  <strong>Premium Quality</strong>
                  <span>High-grade materials for lasting durability</span>
                </div>
                <div className="card-hover-effect"></div>
              </div>
              <div className="feature">
                <FiRefreshCw />
                <div>
                  <strong>Easy Returns</strong>
                  <span>7-day hassle-free return policy</span>
                </div>
                <div className="card-hover-effect"></div>
              </div>
              <div className="feature">
                <FiTruck />
                <div>
                  <strong>Fast Logistics</strong>
                  <span>Expedited shipping for critical site equipment</span>
                </div>
                <div className="card-hover-effect"></div>
              </div>
              <div className="feature">
                <FiShield />
                <div>
                  <strong>Secure Shopping</strong>
                  <span>100% secure payment gateway</span>
                </div>
                <div className="card-hover-effect"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .about-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
        }

        .leadership-message {
          padding: 60px 0;
          background: #fdfdfd;
          background-image: radial-gradient(#F59E0B08 1px, transparent 1px);
          background-size: 20px 20px;
        }

        .message-box {
          max-width: 780px;
          margin: 0 auto;
          background: #ffffff;
          padding: 50px 60px;
          border-radius: 30px;
          box-shadow: 0 20px 50px -10px rgba(0,0,0,0.06);
          border: 1px solid rgba(245, 158, 11, 0.08);
          position: relative;
        }

        .message-box::before {
          content: '"';
          position: absolute;
          top: 30px;
          left: 30px;
          font-size: 100px;
          color: #F59E0B12;
          font-family: serif;
          line-height: 1;
        }

        .message-tag {
          color: #f59e0b;
          font-weight: 800;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 2px;
          display: block;
          margin-bottom: 16px;
        }

        .message-box h2 {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 30px;
          color: #1a1a1a;
          line-height: 1.2;
        }

        .message-content p {
          font-size: 16px;
          line-height: 1.7;
          color: #4a4a4a;
          margin-bottom: 20px;
        }

        .message-content strong {
          color: #1a1a1a;
          font-weight: 700;
        }

        .message-footer {
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid #f0f0f0;
        }

        .signature-font {
          font-family: 'Dancing Script', cursive;
          font-size: 46px;
          color: #f59e0b;
          margin-bottom: 8px;
          transform: rotate(-1.5deg);
          display: flex;
          align-items: center;
          gap: 15px;
          position: relative;
        }

        .sig-word {
          position: relative;
          display: inline-block;
        }

        .sig-word::after {
          content: '';
          position: absolute;
          bottom: 10px;
          left: 0;
          width: 100%;
          height: 1.5px;
          background: #f59e0b;
          opacity: 0.8;
          transform: rotate(-1deg);
          border-radius: 50% 20%;
        }

        .leader-info strong {
          display: block;
          font-size: 17px;
          color: #1a1a1a;
          font-weight: 700;
        }

        .leader-info span {
          font-size: 14px;
          color: #666;
          margin-top: 2px;
          display: block;
        }

        .container {
          /* Using global container styles */
        }

        /* Hero Section */
        .about-hero {
          background:#1C1917;
          padding: 100px 0 90px;
          text-align: center;
          position: relative;
        }
        .about-hero h1 {
          font-size: 52px;
          font-weight: 800;
          color: #f59e0b;
          margin-bottom: 20px;
          letter-spacing: -0.02em;
        }
        .about-hero p {
          font-size: 19px;
          color: #F59E0B;
          max-width: 680px;
          margin: 0 auto;
          line-height: 1.5;
        }

        /* Brand Story */
        .brand-story {
          padding: 96px 0;
          background: #ffffff;
        }
        .story-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }
        .story-image img {
          width: 100%;
          border-radius: 32px;
          box-shadow: 0 30px 45px -20px rgba(0,0,0,0.2);
          transition: transform 0.4s ease;
          object-fit: cover;
        }
        .story-image img:hover {
          transform: scale(1.01);
        }
        .story-tag {
          color: #000;
          text-transform: uppercase;
          font-size: 13px;
          letter-spacing: 2.5px;
          font-weight: 700;
          background: rgba(245,158,11,0.1);
          display: inline-block;
          padding: 4px 12px;
          border-radius: 40px;
        }
        .story-content h2 {
          font-size: 42px;
          font-weight: 800;
          margin: 20px 0 24px;
          color: #000000;
          line-height: 1.2;
        }
        .story-content p {
          color: #3a3a3a;
          line-height: 1.7;
          margin-bottom: 24px;
          font-size: 16px;
        }
        .story-stats {
          display: flex;
          gap: 48px;
          margin-top: 36px;
          flex-wrap: wrap;
        }
        .stat strong {
          display: block;
          font-size: 32px;
          font-weight: 800;
          color: #000000;
          margin-bottom: 6px;
        }
        .stat span {
          font-size: 14px;
          font-weight: 500;
          color: #4a4a4a;
        }

        /* Mission Section */
        .mission-section {
          padding: 80px 0;
          // background: linear-gradient(115deg, #f0f4f8 0%, #e8edf2 100%);
        }
        .mission-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 36px;
        }
        .mission-card {
          text-align: center;
          padding: 44px 28px;
          background: white;
          border-radius: 32px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.06);
          transition: all 0.35s ease;
          border: 1px solid rgba(245,158,11,0.2);
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
        .mission-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 45px -12px rgba(0,0,0,0.2);
          border-color: #F59E0B;
        }
        .mission-icon {
          width: 80px;
          height: 80px;
          background: #F59E0B;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          font-size: 36px;
          color: #1e1e1e;
          transition: transform 0.3s ease;
        }
        .mission-card:hover .mission-icon {
          transform: scale(1.05);
        }
        .mission-card h3 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 16px;
          color: #000000;
        }
        .mission-card p {
          color: #4a4a4a;
          line-height: 1.6;
        }

        /* Values Section */
        .values-section {
          padding: 96px 0 80px;
          background: linear-gradient(135deg, #ffffff 0%, #fefcf8 100%);
        }
        .section-header {
          text-align: center;
          margin-bottom: 64px;
        }
        .section-tag {
          color: #000;
          background: rgba(245,158,11,0.12);
          font-size: 13px;
          letter-spacing: 2px;
          font-weight: 700;
          padding: 5px 14px;
          display: inline-block;
          border-radius: 60px;
        }
        .section-header h2 {
          font-size: 44px;
          font-weight: 800;
          margin-top: 14px;
          margin-bottom: 12px;
          color: #000000;
        }
        .section-subtitle {
          font-size: 16px;
          color: #666;
          max-width: 500px;
          margin: 0 auto;
        }
        .values-grid {
          display: flex;
          justify-content: center;
          align-items: stretch;
          gap: 32px;
          flex-wrap: wrap;
        }
        .value-card {
          flex: 1;
          min-width: 220px;
          max-width: 270px;
          text-align: center;
          padding: 36px 24px;
          background: white;
          border-radius: 28px;
          box-shadow: 0 15px 35px -10px rgba(0,0,0,0.08);
          transition: all 0.35s ease;
          border: 1px solid rgba(245,158,11,0.15);
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
        .value-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 45px -12px rgba(0,0,0,0.15);
          border-color: #F59E0B;
        }
        .value-icon {
          width: 70px;
          height: 70px;
          background: #F59E0B;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          font-size: 28px;
          color: #1c1c1c;
          transition: transform 0.3s ease;
        }
        .value-card:hover .value-icon {
          transform: scale(1.05);
        }
        .value-card h3 {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 16px;
          color: #000000;
        }
        .value-card p {
          color: #555;
          font-size: 14px;
          line-height: 1.6;
          margin: 0;
        }

        /* Value Stats Section */
        .value-stats-section {
          padding: 0 0 80px;
          background: transparent;
        }
        .value-stats-grid {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 60px;
          flex-wrap: wrap;
          background: linear-gradient(115deg, #FCF9F4 0%, #f8f5ee 100%);
          padding: 50px 40px;
          border-radius: 60px;
          margin-top: 20px;
        }
        .value-stat-item {
          display: flex;
          align-items: center;
          gap: 18px;
          transition: transform 0.3s ease;
        }
        .value-stat-item:hover {
          transform: translateY(-4px);
        }
        .stat-icon {
          font-size: 42px;
          color: #F59E0B;
          stroke-width: 1.5;
          transition: transform 0.3s ease;
        }
        .value-stat-item:hover .stat-icon {
          transform: scale(1.1);
        }
        .stat-info {
          display: flex;
          flex-direction: column;
        }
        .stat-number {
          font-size: 32px;
          font-weight: 800;
          color: #000000;
          line-height: 1.2;
        }
        .stat-label {
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }

        /* Why Choose Us - FIXED CENTERING */
        .why-us {
          padding: 80px 0;
          background: linear-gradient(115deg, #f5f2ec 0%, #efeae1 100%);
        }
        .why-us-content {
          text-align: center;
        }
        .why-us-content h2 {
          font-size: 38px;
          font-weight: 800;
          margin-bottom: 56px;
          color: #000000;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
          max-width: 900px;
          margin: 0 auto;
        }
        .feature {
          display: flex;
          align-items: center;
          gap: 20px;
          text-align: left;
          background: #ffffff;
          padding: 18px 22px;
          border-radius: 28px;
          transition: all 0.35s ease;
          box-shadow: 0 5px 15px rgba(0,0,0,0.04);
          border: 1px solid rgba(245,158,11,0.2);
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
        .feature:hover {
          transform: translateX(8px) translateY(-3px);
          border-color: #F59E0B;
          box-shadow: 0 12px 28px rgba(245,158,11,0.15);
        }
        .feature svg {
          background: #F59E0B;
          padding: 10px;
          border-radius: 18px;
          color: #1e1e1e;
          width: 52px;
          height: 52px;
          flex-shrink: 0;
          stroke-width: 1.5;
          transition: transform 0.3s ease;
        }
        .feature:hover svg {
          transform: scale(1.05);
        }
        .feature strong {
          display: block;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 6px;
          color: #000000;
        }
        .feature span {
          font-size: 14px;
          color: #4a4a4a;
        }

        /* UNIVERSAL HOVER EFFECT LINE */
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
        .mission-card:hover .card-hover-effect,
        .value-card:hover .card-hover-effect,
        .feature:hover .card-hover-effect {
          transform: scaleX(1);
        }

        /* Removed redundant container media queries */

        @media (max-width: 768px) {
          .container {
            /* Using global container styles */
          }
          .story-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .about-hero {
            padding: 70px 0;
          }
          .about-hero h1 {
            font-size: 36px;
          }
          .story-content h2 {
            font-size: 30px;
          }
          .story-stats {
            gap: 28px;
            justify-content: center;
          }
          .mission-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .values-grid {
            flex-direction: column;
            align-items: center;
          }
          .value-card {
            max-width: 360px;
            width: 100%;
          }
          .value-stats-grid {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 30px;
            border-radius: 40px;
          }
          .value-stat-item {
            width: 100%;
            justify-content: center;
          }
          .mission-card {
            padding: 32px 20px;
          }
          .why-us-content h2 {
            font-size: 30px;
          }
          .features-grid {
            grid-template-columns: 1fr;
            max-width: 450px;
            gap: 20px;
          }
          .feature svg {
            width: 44px;
            height: 44px;
            padding: 8px;
          }
        }

        @media (max-width: 768px) {
          .message-box {
            padding: 35px 25px;
            border-radius: 20px;
            margin: 0 15px;
          }
          .message-box h2 {
            font-size: 24px;
            margin-bottom: 20px;
          }
          .message-content p {
            font-size: 15px;
            margin-bottom: 15px;
          }
          .signature-font {
            font-size: 34px;
          }
          .leadership-message {
            padding: 40px 0;
          }
          .message-box::before {
            top: 15px;
            left: 15px;
            font-size: 60px;
          }
        }

        @media (max-width: 640px) {
          .container {
            /* Using global container styles */
          }
          .about-hero h1 {
            font-size: 32px;
          }
          .about-hero p {
            font-size: 16px;
          }
          .story-content h2 {
            font-size: 26px;
          }
          .section-header h2 {
            font-size: 30px;
          }
          .value-stats-grid {
            padding: 30px 20px;
          }
          .stat-number {
            font-size: 26px;
          }
          .feature {
            padding: 14px 18px;
          }
        }

        @media (max-width: 480px) {
          .container {
            /* Using global container styles */
          }
          .story-stats {
            flex-direction: column;
            align-items: center;
            gap: 20px;
          }
          .stat {
            text-align: center;
          }
          .mission-card {
            padding: 28px 16px;
          }
          .value-card {
            padding: 28px 20px;
          }
          .feature {
            flex-direction: column;
            text-align: center;
          }
          .feature svg {
            margin-bottom: 8px;
          }
        }
      `}</style>
    </div>
  );
}
