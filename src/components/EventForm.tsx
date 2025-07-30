import React, { useState } from 'react';

interface EventFormProps {
  onSubmit: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    month: '',
    day: '',
    startTime: '',
    endTime: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Combine month and day with current year to form a valid date
      const currentYear = new Date().getFullYear();
      const date = `${currentYear}-${formData.month}-${formData.day}`;
      
      const response = await fetch('https://huluweb.onrender.com/api/FormEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          title: formData.title,
          date,
          time: `${formData.startTime} - ${formData.endTime}`,
        }),
      });

      if (!response.ok) {
        console.log('Failed to submit form');
        return;
      }

      // Clear form after successful submission
      setFormData({ 
        title: '', 
        month: '', 
        day: '', 
        startTime: '', 
        endTime: '' 
      });

      onSubmit();
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Month data with short names and numeric values
  const months = [
    { value: '01', name: 'Jan' },
    { value: '02', name: 'Feb' },
    { value: '03', name: 'Mar' },
    { value: '04', name: 'Apr' },
    { value: '05', name: 'May' },
    { value: '06', name: 'Jun' },
    { value: '07', name: 'Jul' },
    { value: '08', name: 'Aug' },
    { value: '09', name: 'Sep' },
    { value: '10', name: 'Oct' },
    { value: '11', name: 'Nov' },
    { value: '12', name: 'Dec' },
  ];
  
  // Generate day options (1-31)
  const days = Array.from({ length: 31 }, (_, i) => 
    (i + 1).toString().padStart(2, '0')
  );

  return (
    <div className="space-y-4 mt-10">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Upcoming Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Event Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md text-gray-600 border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50"
            placeholder="Enter event title"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-700">
              Month
            </label>
            <select
              id="month"
              name="month"
              value={formData.month}
              onChange={handleChange}
              className="mt-1 block w-full text-gray-600 rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50"
              required
            >
              <option value="">Select Month</option>
              {months.map(month => (
                <option key={month.value} value={month.value}>
                  {month.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="day" className="block text-sm font-medium text-gray-700">
              Day
            </label>
            <select
              id="day"
              name="day"
              value={formData.day}
              onChange={handleChange}
              className="mt-1 block w-full text-gray-600 rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50"
              required
            >
              <option value="">Select Day</option>
              {days.map(day => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
              Start Time
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50"
              required
            />
          </div>

          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
              End Time
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50"
              required
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
          >
            Add Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;