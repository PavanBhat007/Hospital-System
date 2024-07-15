import React from 'react';
import PropTypes from 'prop-types';
import ServiceCard from '../components/ServiceCard';

export default function Services({ user_id }) {
  return (
    <div className='service-wrapper'>
      <h2 className='page-header'><span className='green-text-header'>Services</span> Offered</h2>
      <ServiceCard 
        img_path="./imgs/appointment.png"
        title="Book Appointments"
        subtitle="Easily schedule consultations with doctors and manage your appointments. Click the arrow to book an appointment now." 
        link="/appointment"
        bgc="rgba(144, 238, 144, 0.7)"
      />
      <ServiceCard 
        img_path="./imgs/pill.png"
        title="Medicine Checker"
        subtitle="Check the availability and details of your prescribed medicines. Click the arrow to use the medicine checker now." 
        link="/know-your-med"
        bgc="rgba(152, 251, 152, 0.7)"
      />
      <ServiceCard 
        img_path="./imgs/bell.png"
        title="Personal Reminder"
        subtitle="Set personal health reminders for medication, appointments, and more. Click the arrow to set a reminder now." 
        link="/calendar"
        bgc="rgba(143, 188, 143, 0.7)"
      />
      <ServiceCard 
        img_path="./imgs/prescription.png"
        title="Prescription Storage"
        subtitle="Store and manage your prescriptions securely in one place. Click the arrow to access your prescriptions now." 
        link="/prescription"
        bgc="rgba(119, 221, 119, 0.7)"
      />
      <ServiceCard 
        img_path="./imgs/chat-gpt.png"
        title="Ask GPT"
        subtitle="Get health advice and answers to your medical questions from our AI. Click the arrow to talk with AI now." 
        link="/ask-ai"
        bgc="rgba(144, 238, 144, 0.7)"
      />
      <ServiceCard 
        img_path="./imgs/chat-gpt.png"
        title="Organ and Blood Donation"
        subtitle="Make a pledge to donate organs or blood. Click the arrow to pledge now." 
        link="/donation"
        bgc="rgba(144, 238, 144, 0.7)"
      />
    </div>
  );
}

Services.propTypes = {
  user_id: PropTypes.number.isRequired,
}
