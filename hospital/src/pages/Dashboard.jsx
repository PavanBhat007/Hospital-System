import React from 'react';
import Card from '../components/Card';

export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className='hero'>
        <h1 className='page-header'>Your Path to Wellness Starts Here</h1>
        <p className='subtext'>Your body holds deep wisdom. Trust in it. Learn from it. Nourish it. Watch your life transform and be healthy</p>
      </div>
      <div className='card-container'>
        <Card 
          img_path="./imgs/card-1.webp"
          title="Know Your Med"
          subtitle="Check the availability and details of your prescribed medicines. Click the arrow to use the medicine checker now."
          href="/know-your-med"
        />
        <Card 
          img_path="./imgs/card-2.webp"
          title="Book Appointments"
          subtitle="Your Appointment, Just a Click Away. Schedule your Visit with Ease and Convenience."
          href="/appointment"
        />
        <Card 
          img_path="./imgs/card-3.webp"
          title="Personal Reminder"
          subtitle="Set personal health reminders for medication, appointments, and more. Click the arrow to set a reminder now."
          href="/calendar"
        />
      </div>
    </div>
  )
}
