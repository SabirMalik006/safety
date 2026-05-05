import{t as u,r as o,j as e,G as g,H as f,I as j,J as b,K as v,z as m}from"./index-DdykNTTc.js";const y=async a=>(await u.post("/contact",a)).data;function N(){const[a,n]=o.useState({name:"",email:"",phone:"",subject:"",message:""}),[r,i]=o.useState(!1),[p,c]=o.useState(!1),s=t=>{n({...a,[t.target.name]:t.target.value})},h=async t=>{var d,l;t.preventDefault(),i(!0);try{await y(a),m.success("Message sent successfully! We will get back to you soon."),c(!0),setTimeout(()=>c(!1),3e3),n({name:"",email:"",phone:"",subject:"",message:""})}catch(x){m.error(((l=(d=x.response)==null?void 0:d.data)==null?void 0:l.message)||"Failed to send message. Please try again.")}finally{i(!1)}};return e.jsxs("div",{className:"contact-page page-content",children:[e.jsx("section",{className:"contact-hero",children:e.jsxs("div",{className:"container",children:[e.jsx("h1",{children:"Get in Touch"}),e.jsx("p",{children:"We'd love to hear from you. Our team is here to help you with any questions."})]})}),e.jsx("section",{className:"contact-info-section",children:e.jsx("div",{className:"container",children:e.jsxs("div",{className:"contact-cards-grid",children:[e.jsxs("div",{className:"contact-card",children:[e.jsx("div",{className:"contact-icon",children:e.jsx(g,{})}),e.jsx("h3",{children:"Visit Us"}),e.jsx("p",{children:"Plot #12, Industrial Area"}),e.jsx("p",{children:"SITE Phase II, Karachi, Pakistan"})]}),e.jsxs("div",{className:"contact-card",children:[e.jsx("div",{className:"contact-icon",children:e.jsx(f,{})}),e.jsx("h3",{children:"Call Us"}),e.jsx("p",{children:"+92 300 1234567"}),e.jsx("p",{children:"Mon-Fri: 10am - 8pm"})]}),e.jsxs("div",{className:"contact-card",children:[e.jsx("div",{className:"contact-icon",children:e.jsx(j,{})}),e.jsx("h3",{children:"Email Us"}),e.jsx("p",{children:"support@thehorizonhub.com"}),e.jsx("p",{children:"sales@thehorizonhub.com"})]})]})})}),e.jsx("section",{className:"contact-form-section",children:e.jsx("div",{className:"container",children:e.jsxs("div",{className:"contact-grid",children:[e.jsx("div",{className:"contact-map",children:e.jsx("iframe",{src:"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d217514.64718147625!2d74.172566!3d31.482252!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190483e0c3c8d7%3A0x73a2b2a1b08f8b9!2sLahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s",width:"100%",height:"100%",style:{border:0},allowFullScreen:"",loading:"lazy",title:"Store Location"})}),e.jsxs("div",{className:"contact-form",children:[e.jsx("h2",{children:"Send us a Message"}),e.jsx("p",{children:"Have a question? Fill out the form and we'll get back to you within 24 hours."}),e.jsxs("form",{onSubmit:h,children:[e.jsxs("div",{className:"form-row",children:[e.jsx("div",{className:"form-group",children:e.jsx("input",{type:"text",name:"name",placeholder:"Your Name *",value:a.name,onChange:s,required:!0})}),e.jsx("div",{className:"form-group",children:e.jsx("input",{type:"email",name:"email",placeholder:"Your Email *",value:a.email,onChange:s,required:!0})})]}),e.jsxs("div",{className:"form-row",children:[e.jsx("div",{className:"form-group",children:e.jsx("input",{type:"tel",name:"phone",placeholder:"Phone Number",value:a.phone,onChange:s})}),e.jsx("div",{className:"form-group",children:e.jsx("input",{type:"text",name:"subject",placeholder:"Subject *",value:a.subject,onChange:s,required:!0})})]}),e.jsx("div",{className:"form-group",children:e.jsx("textarea",{name:"message",placeholder:"Your Message *",rows:"5",value:a.message,onChange:s,required:!0})}),e.jsxs("button",{type:"submit",className:"submit-btn",disabled:r,children:[r?"Sending...":"Send Message"," ",e.jsx(b,{})]}),p&&e.jsx("div",{className:"success-message",children:"✓ Inquiry sent successfully! Our team will contact you soon."})]})]})]})})}),e.jsx("section",{className:"hours-section",children:e.jsx("div",{className:"container",children:e.jsxs("div",{className:"hours-content",children:[e.jsx("div",{className:"hours-icon",children:e.jsx(v,{})}),e.jsx("h2",{children:"Business Hours"}),e.jsxs("div",{className:"hours-grid",children:[e.jsxs("div",{className:"hour-item",children:[e.jsx("span",{children:"Monday - Friday"}),e.jsx("strong",{children:"10:00 AM - 8:00 PM"})]}),e.jsxs("div",{className:"hour-item",children:[e.jsx("span",{children:"Saturday"}),e.jsx("strong",{children:"11:00 AM - 6:00 PM"})]}),e.jsxs("div",{className:"hour-item",children:[e.jsx("span",{children:"Sunday"}),e.jsx("strong",{children:"Closed"})]})]})]})})}),e.jsx("style",{jsx:!0,children:`
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
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .submit-btn:hover:not(:disabled) {
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
      `})]})}export{N as default};
