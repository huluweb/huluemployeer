// components/Applicants.tsx
import React, { useState } from 'react';
import { HiOutlineSearch, HiChevronDown, HiOutlineMail, HiOutlinePhone, HiStar } from 'react-icons/hi';

const Applicants: React.FC = () => {
  const [applicants, setApplicants] = useState([
    { 
      id: 1, 
      name: 'Sarah Johnson', 
      position: 'Frontend Developer', 
      status: 'Review', 
      rating: 4, 
      applied: '2 days ago',
      email: 'sarah@example.com',
      phone: '(555) 123-4567'
    },
    { 
      id: 2, 
      name: 'David Wilson', 
      position: 'Backend Developer', 
      status: 'Interview', 
      rating: 5, 
      applied: '1 week ago',
      email: 'david@example.com',
      phone: '(555) 987-6543'
    },
    { 
      id: 3, 
      name: 'Lisa Chen', 
      position: 'UX Designer', 
      status: 'Rejected', 
      rating: 3, 
      applied: '3 days ago',
      email: 'lisa@example.com',
      phone: '(555) 456-7890'
    },
    { 
      id: 4, 
      name: 'Michael Brown', 
      position: 'Product Manager', 
      status: 'Offer', 
      rating: 4, 
      applied: '5 days ago',
      email: 'michael@example.com',
      phone: '(555) 789-0123'
    },
  ]);
  
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = 
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || applicant.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusOptions = ['All', 'Review', 'Interview', 'Rejected', 'Offer'];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Applicants</h1>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiOutlineSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search applicants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {statusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <HiChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApplicants.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No applicants found matching your criteria</p>
          </div>
        ) : (
          filteredApplicants.map(applicant => (
            <div key={applicant.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-800">{applicant.name}</h3>
                    <p className="text-sm text-gray-600">{applicant.position}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <HiStar 
                      key={i} 
                      className={`w-4 h-4 ${
                        i < applicant.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  applicant.status === 'Review' ? 'bg-blue-100 text-blue-800' :
                  applicant.status === 'Interview' ? 'bg-yellow-100 text-yellow-800' :
                  applicant.status === 'Offer' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {applicant.status}
                </span>
                <span className="text-xs text-gray-500">{applicant.applied}</span>
              </div>
              
              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <HiOutlineMail className="w-4 h-4 mr-2" />
                  <span>{applicant.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <HiOutlinePhone className="w-4 h-4 mr-2" />
                  <span>{applicant.phone}</span>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
                  View Profile
                </button>
                <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-md text-sm hover:bg-gray-50 transition-colors">
                  Schedule
                </button>
              </div>
            </div>
          ))
        )}
      </div>
   
    </div>
  );
};

export default Applicants;