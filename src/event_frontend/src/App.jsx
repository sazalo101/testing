import { useState, useEffect } from 'react';
import { event_backend } from 'declarations/event_backend';

const styles = {
  container: {
    padding: '20px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px'
  },
  section: {
    marginBottom: '40px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '20px'
  },
  input: {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  eventCard: {
    padding: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '10px'
  }
};

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [eventId, setEventId] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const eventList = await event_backend.get_events();
      setEvents(eventList);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await event_backend.add_event(name, date);
      setName('');
      setDate('');
      fetchEvents();
    } catch (error) {
      console.error("Failed to add event:", error);
    }
  };

  const handleGetEvent = async () => {
    try {
      const event = await event_backend.get_event(BigInt(eventId));
      setSelectedEvent(event[0]);
    } catch (error) {
      console.error("Failed to get event:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Event Management</h1>
      
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Add New Event</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Event Name"
            style={styles.input}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Add Event
          </button>
        </form>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Get Event by ID</h2>
        <input
          type="number"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          placeholder="Event ID"
          style={styles.input}
        />
        <button onClick={handleGetEvent} style={styles.button}>
          Get Event
        </button>
        
        {selectedEvent && (
          <div style={styles.eventCard}>
            <h3>Event Details:</h3>
            <p>ID: {selectedEvent.id.toString()}</p>
            <p>Name: {selectedEvent.name}</p>
            <p>Date: {selectedEvent.date}</p>
          </div>
        )}
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>All Events</h2>
        {events.map((event) => (
          <div key={event.id.toString()} style={styles.eventCard}>
            <p>ID: {event.id.toString()}</p>
            <p>Name: {event.name}</p>
            <p>Date: {event.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventManagement;