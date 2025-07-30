import React, { useState } from 'react';

interface EmployeeFormProps {
  setSee: () => void;
  onEmployeeAdded: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ setSee, onEmployeeAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    status: 'Active',
    companyName: '',
    phone: '',
    address: ''
  });
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     const to = "zgju9781@gmail.com";
        const subject = "Adding Employeer";
        const text =
          "We noticed a seeing to your Employer.\n" +
          "Time: Tuesday, July 29, 2025 – 10:42 AM\n" +
          "Location: Addis Ababa, Ethiopia (approximate)";
  
        const res = await fetch('/api/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to, subject, text }),
        });
    try {
      const response = await fetch('https://huluweb.onrender.com/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        onEmployeeAdded();
        setSee();
      } else {
        const errorData = await response.json();
        console.error('Error adding employee:', errorData.message);
      }
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg mx-auto my-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Add New Employee</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
         <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={setSee}
            className="px-5 py-2.5 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Add Employee
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;