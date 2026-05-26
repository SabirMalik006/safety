import React from 'react';
import './Policy.css';

export default function Policy() {
  return (
    <div className="policy-page">
      <section className="policy-hero">
        <div className="container">
          <h1>Policies & Terms</h1>
          <p>Everything you need to know about our terms and shipping policies.</p>
        </div>
      </section>

      <section className="policy-content">
        <div className="container">
          <div className="policy-section">
            <h2>Terms & Conditions</h2>
            <p>
              Welcome to <strong>The Horizon Hub</strong>. By using our services, you agree to follow our terms and policies. 
              Please make sure all information provided by you is correct. We reserve the right to update products, prices, 
              and policies at any time without prior notice.
            </p>
          </div>

          <div className="policy-section">
            <h2>Shipping Policy</h2>
            <p>
              At <strong>The Horizon Hub</strong>, we process and ship orders as quickly as possible. Delivery times may vary 
              depending on your location and courier service. Customers will receive order updates after confirmation. 
              If you face any issue with shipping, feel free to contact our support team.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
