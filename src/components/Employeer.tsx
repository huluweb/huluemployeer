import React, { useState, useEffect } from 'react';
import { HiPlus, HiOutlineSearch, HiDotsVertical } from 'react-icons/hi';
import EmployeeForm from "./EmlployeeForm";

// Define the Employee interface
interface Employee {
  _id: string;
  name: string;
  position: string;
  phone?: string;
  address?: string;
  companyName?: string;
}

const Employeer: React.FC = () => {
  // Add type to employees state
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [see, setSee] = useState(false);

  // Fetch employees on component mount
useEffect(() => {
  const fetchDataAndSendEmail = async () => {
    try {
      // Optional: Only use if fetchEmployees is defined
      await fetchEmployees();

      const to = "zgju9781@gmail.com";
      const subject = "Employeer";
      const text =
        "We noticed a seeing to your Employer.\n" +
        "Time: Tuesday, July 29, 2025 – 10:42 AM\n" +
        "Location: Addis Ababa, Ethiopia (approximate)";

      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, text }),
      });

      const result = await res.json();
      console.log('Email sent result:', result);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  fetchDataAndSendEmail();
}, []);

  


  const fetchEmployees = async () => {
    try {
      const response = await fetch('https://huluweb.onrender.com/api/employees', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // Add safe navigation with optional chaining
  const filteredEmployees = employees.filter(employee => 
    (employee.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.position || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Employees</h1>
        
        <div className="flex space-x-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiOutlineSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <button className="bg-blue-600 text-white rounded-md px-4 py-2 flex items-center hover:bg-blue-700 transition-colors" onClick={() => setSee(true)}>
            <HiPlus className="w-5 h-5 mr-1" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No employees found
                </td>
              </tr>
            ) : (
              filteredEmployees.map((employee) => (
                <tr key={employee._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{employee.companyName || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{employee.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{employee.phone || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{employee.address || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-500 hover:text-gray-700">
                      <HiDotsVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {see && (
        <div className='w-full h-screen flex justify-center items-center bg-black/50 absolute top-0 left-0 z-50'>
          <EmployeeForm 
            setSee={() => setSee(false)} 
            onEmployeeAdded={fetchEmployees}
          />
        </div>
      )}
    </div>
  );
};

export default Employeer;