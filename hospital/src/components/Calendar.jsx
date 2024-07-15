import React, { useState } from 'react';
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import DatePicker from 'react-datepicker';


function Calendar() {
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");

  const session = useSession();
  const supabase = useSupabaseClient();
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
      'summary': eventName,
      'description': eventDescription,
      'start': {
        'dateTime': start,
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      'end': {
        'dateTime': end,
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      'attendees': [
        { 'email': doctorEmail }
      ],
    };

    await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: {
        'Authorization': 'Bearer ' + session.provider_token
      },
      body: JSON.stringify(event)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
      alert("Event created, check your Google Calendar!");
    });
  }

  console.log(start, end);

  return (
    <div className="wrapper calendar">
      <h2 className='page-header'>Personal Medicine <span className='green-text-header'>Reminder</span></h2>
      <div>
        {session ?
          <>
            <h2>Hey! <span className='green-text'>{session.user.email}</span></h2>
            <label>When do you have to take your medicine (start)
              <input type="datetime-local" onChange={(e) => setStart(e.target.value)} />
            </label>
            <label>When do you have to take your medicine (end)
              <input type="datetime-local" onChange={(e) => setEnd(e.target.value)} />
            </label>
            <label>Medicine Names
              <input type="text" onChange={(e) => setEventName(e.target.value)} />
            </label>
            <label>Descriptions (instructions)
              <input type="text" onChange={(e) => setEventDescription(e.target.value)} />
            </label>
            <label>Your email
              <input type="email" onChange={(e) => setDoctorEmail(e.target.value)} />
            </label>
            <hr />
            <button className='btn btn-submit' onClick={() => createCalendarEvent()}>Create A Reminder</button>
            <p></p>
            <button className='btn btn-submit' onClick={() => signOut()}>Sign Out</button>
          </>
          :
          <>
            <button className='btn btn-submit' onClick={() => googleSignIn()}>Sign In With Google</button>
          </>
        }
      </div>
    </div>
  );
}

export default Calendar;
