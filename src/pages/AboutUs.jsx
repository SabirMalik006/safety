import { FiAward, FiHeart, FiUsers, FiTarget, FiTruck, FiShield, FiRefreshCw, FiStar } from 'react-icons/fi';

export default function AboutUs() {
  return (
    <div className="about-page page-content">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <h1>Our Story</h1>
          <p>Crafted with passion, designed for the modern Pakistani woman</p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="brand-story">
        <div className="container">
          <div className="story-grid">
            <div className="story-image">
              <img 
                src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&q=80" 
                alt="Our Story"
              />
            </div>
            <div className="story-content">
              <span className="story-tag">Our Journey</span>
              <h2>Carry Your Story in Style</h2>
              <p>Founded in 2020, CarryMe was born from a simple idea — to create beautiful, functional bags that empower women to carry their stories with pride. What started as a small online store has grown into a beloved brand across Pakistan.</p>
              <p>Every bag is thoughtfully designed, blending timeless elegance with modern functionality. We believe that the right accessory can transform not just your outfit, but your entire day.</p>
              <div className="story-stats">
                <div className="stat">
                  <strong>5,000+</strong>
                  <span>Happy Customers</span>
                </div>
                <div className="stat">
                  <strong>50+</strong>
                  <span>Unique Designs</span>
                </div>
                <div className="stat">
                  <strong>4.9★</strong>
                  <span>Customer Rating</span>
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
              <p>To empower women through thoughtfully designed accessories that celebrate their unique style and story.</p>
            </div>
            <div className="mission-card">
              <div className="mission-icon"><FiHeart /></div>
              <h3>Our Vision</h3>
              <p>To become Pakistan's most loved accessory brand, known for quality, design, and customer trust.</p>
            </div>
            <div className="mission-card">
              <div className="mission-icon"><FiUsers /></div>
              <h3>Our Promise</h3>
              <p>Quality craftsmanship, exceptional service, and a shopping experience you'll love.</p>
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
          </div>
          <div className="values-grid">
            <div className="value-item">
              <div className="value-icon"><FiAward /></div>
              <h3>Quality First</h3>
              <p>We never compromise on the quality of materials and craftsmanship.</p>
            </div>
            <div className="value-item">
              <div className="value-icon"><FiHeart /></div>
              <h3>Customer Love</h3>
              <p>Our customers are at the heart of everything we do.</p>
            </div>
            <div className="value-item">
              <div className="value-icon"><FiTruck /></div>
              <h3>Timely Delivery</h3>
              <p>We ensure your orders reach you when you expect them.</p>
            </div>
            <div className="value-item">
              <div className="value-icon"><FiShield /></div>
              <h3>Trust & Safety</h3>
              <p>Secure payments and hassle-free returns for peace of mind.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Meet the Team</span>
            <h2>The Faces Behind CarryMe</h2>
            <p>Passionate individuals dedicated to bringing you the best.</p>
          </div>
          <div className="team-grid">
            {[
              { name: 'Ayesha Khan', role: 'Founder & Creative Director', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
              { name: 'Sara Ahmed', role: 'Head of Design', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80' },
              { name: 'Omar Farooq', role: 'Operations Manager', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
              { name: 'Fatima Ali', role: 'Customer Experience', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' },
            ].map((member, i) => (
              <div key={i} className="team-card">
                <img src={member.image} alt={member.name} />
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-us">
        <div className="container">
          <div className="why-us-content">
            <h2>Why Choose CarryMe?</h2>
            <div className="features-grid">
              <div className="feature">
                <FiStar />
                <div>
                  <strong>Premium Quality</strong>
                  <span>High-grade materials for lasting durability</span>
                </div>
              </div>
              <div className="feature">
                <FiRefreshCw />
                <div>
                  <strong>Easy Returns</strong>
                  <span>7-day hassle-free return policy</span>
                </div>
              </div>
              <div className="feature">
                <FiTruck />
                <div>
                  <strong>Free Delivery</strong>
                  <span>On orders above Rs.3,999</span>
                </div>
              </div>
              <div className="feature">
                <FiShield />
                <div>
                  <strong>Secure Shopping</strong>
                  <span>100% secure payment gateway</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .about-page {
          font-family: 'Inter', sans-serif;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Hero Section */
        .about-hero {
          background: linear-gradient(135deg, #f0ebe4 0%, #e8e0d5 100%);
          padding: 80px 0;
          text-align: center;
        }
        .about-hero h1 {
          font-size: 48px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 16px;
        }
        .about-hero p {
          font-size: 18px;
          color: #555;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Brand Story */
        .brand-story {
          padding: 80px 0;
          background: #fff;
        }
        .story-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
          align-items: center;
        }
        .story-image img {
          width: 100%;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .story-tag {
          color: #c4a47a;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 2px;
          font-weight: 600;
        }
        .story-content h2 {
          font-size: 36px;
          font-weight: 700;
          margin: 15px 0 20px;
          color: #1a1a1a;
        }
        .story-content p {
          color: #666;
          line-height: 1.8;
          margin-bottom: 20px;
        }
        .story-stats {
          display: flex;
          gap: 30px;
          margin-top: 30px;
        }
        .stat strong {
          display: block;
          font-size: 28px;
          font-weight: 700;
          color: #c4a47a;
        }
        .stat span {
          font-size: 14px;
          color: #666;
        }

        /* Mission Section */
        .mission-section {
          padding: 60px 0;
          background: #faf9f8;
        }
        .mission-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
        }
        .mission-card {
          text-align: center;
          padding: 40px 20px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.05);
        }
        .mission-icon {
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
        .mission-card h3 {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 15px;
        }
        .mission-card p {
          color: #666;
          line-height: 1.6;
        }

        /* Values Section */
        .values-section {
          padding: 80px 0;
          background: #fff;
        }
        .section-header {
          text-align: center;
          margin-bottom: 50px;
        }
        .section-tag {
          color: #c4a47a;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 2px;
          font-weight: 600;
        }
        .section-header h2 {
          font-size: 36px;
          font-weight: 700;
          margin-top: 10px;
        }
        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
        }
        .value-item {
          text-align: center;
        }
        .value-icon {
          width: 60px;
          height: 60px;
          background: #f0ebe4;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 24px;
          color: #c4a47a;
        }
        .value-item h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .value-item p {
          color: #666;
          font-size: 14px;
        }

        /* Team Section */
        .team-section {
          padding: 60px 0;
          background: #faf9f8;
        }
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
        }
        .team-card {
          text-align: center;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 5px 20px rgba(0,0,0,0.05);
          padding: 20px;
        }
        .team-card img {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 15px;
        }
        .team-card h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 5px;
        }
        .team-card p {
          color: #c4a47a;
          font-size: 14px;
        }

        /* Why Us Section */
        .why-us {
          padding: 60px 0;
          background: #c4a47a;
          color: white;
        }
        .why-us-content {
          text-align: center;
        }
        .why-us-content h2 {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 40px;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
          max-width: 900px;
          margin: 0 auto;
        }
        .feature {
          display: flex;
          align-items: center;
          gap: 15px;
          text-align: left;
        }
        .feature svg {
          font-size: 28px;
          flex-shrink: 0;
        }
        .feature strong {
          display: block;
          font-size: 16px;
          margin-bottom: 5px;
        }
        .feature span {
          font-size: 13px;
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .story-grid {
            grid-template-columns: 1fr;
          }
          .about-hero h1 {
            font-size: 36px;
          }
          .story-content h2 {
            font-size: 28px;
          }
          .story-stats {
            flex-wrap: wrap;
            justify-content: center;
          }
          .values-grid {
            gap: 30px;
          }
        }
      `}</style>
    </div>
  );
}