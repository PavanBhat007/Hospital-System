import React from 'react';;
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
          title="Symptom Checker"
          subtitle="Smart Symptom Analysis at Your Fingertips. Take your First Step to Understanding your Health"
        />
        <Card 
          img_path="./imgs/card-2.webp"
          title="Book Appointments"
          subtitle="Your Appointment, Just a Click Away. Schedule your Visit with Ease and Convenience."
        />
        <Card 
          img_path="./imgs/card-3.webp"
          title="Health Tracking"
          subtitle="Track Your Health, Transform Your Life. Monitor your Wellness and Achieve your Health Goals"
        />
      </div>
    </div>
  )
}
