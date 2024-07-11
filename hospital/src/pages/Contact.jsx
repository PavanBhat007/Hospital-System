import React from 'react';

export default function Contact() {
  return (
    <div className="contact">
      <div className='hero'>
        <h1 className='page-header'>Get in Touch with Medico Center</h1>
        <p className='subtext'>
          We're here to assist you with all your healthcare needs. Reach out to us for any inquiries or support.
        </p>
      </div>
      <div className="contact-info">
        <div className="info-card">
          <h2>Contact Information</h2>
          <p>Email: info@medicocenter.com</p>
          <p>Phone: +91 9875641230</p>
          <p>Address: 123 St., Hospital City, Bangalore</p>
        </div>
        <div className="info-card">
          <h2>Office Hours</h2>
          <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
          <p>Saturday: 10:00 AM - 2:00 PM</p>
          <p>Sunday: Closed</p>
        </div>
      </div>
    </div>
  )
}
