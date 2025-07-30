import React, { useState, useEffect } from 'react';
import EventForm from './EventForm';
import Upcoming from './Upcoming';

interface Event {
  _id: string;
  title: string;
  date: string;
  time: string;
}

const EventManager: React.FC = () => {
  const [upcoming, setUpcoming] = useState<Event[]>([]);

  // Fetch events on component mount
  useEffect(() => {
    fetchUpcoming();
  }, []);

  const fetchUpcoming = async () => {
    try {
      const response = await fetch('https://huluweb.onrender.com/api/FormEvent', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setUpcoming(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl h-screen shadow-sm p-6 grid gap-10 grid-cols-1 md:grid-cols-[4fr_1fr]">
  <Upcoming upcoming={upcoming} />
  <EventForm onSubmit={fetchUpcoming} />
</div>

  );
};

export default EventManager;