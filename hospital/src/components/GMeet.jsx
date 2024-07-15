import React, { useState } from 'react';
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function GMeet() {
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");

  const session = useSession(); // tokens, when session exists we have a user
  const supabase = useSupabaseClient(); // talk to supabase!
  const { isLoading } = useSessionContext();

  if (isLoading) {
    return <></>;
  }

  async function googleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar'
      }
    });
    if (error) {
      alert("Error logging in to Google provider with Supabase");
      console.log(error);
    }
  }
  async function signOut() {
    await supabase.auth.signOut();
  }

  
  async function createCalendarEvent() {
    console.log("Creating calendar event");
  
    const event = {
      summary: eventName,
      description: eventDescription,
      start: {
        dateTime: start,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: end,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      attendees: [{ email: doctorEmail }],
      conferenceData: {
        createRequest: {
          requestId: Math.random().toString(36).substring(7), // unique request ID
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
    };
  
    console.log('Token:', session.provider_token);
  
    try {
      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + session.provider_token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message);
      }
  
      const data = await response.json();
  
      if (data.hangoutLink) {
        console.log('Google Meet link:', data.hangoutLink);
        alert(`Event created with Google Meet link: ${data.hangoutLink}`);
      } else {
        console.log(data);
        alert('Event created, but no Google Meet link found');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event: ' + error.message);
    }
  }
  

  return (
    <div className="App">
      <div style={{ width: "400px", margin: "30px auto" }}>
        {session ?
          <>
            <h2>Hey there {session.user.email}</h2>
            <p>Start of your event</p>
            <input type="datetime-local" onChange={(e) => setStart(e.target.value)} />
            <p>End of your event</p>
            <input type="datetime-local" onChange={(e) => setEnd(e.target.value)} />
            <p>Event name</p>
            <input type="text" onChange={(e) => setEventName(e.target.value)} />
            <p>Event description</p>
            <input type="text" onChange={(e) => setEventDescription(e.target.value)} />
            <p>Doctor's Email</p>
            <input type="email" onChange={(e) => setDoctorEmail(e.target.value)} />
            <hr />
            <button onClick={() => createCalendarEvent()}>Create Calendar Event</button>
            <p></p>
            <button onClick={() => signOut()}>Sign Out</button>
          </>
          :
          <>
            <button onClick={() => googleSignIn()}>Sign In With Google</button>
          </>
        }
      </div>
    </div>
  );
}

export default GMeet;