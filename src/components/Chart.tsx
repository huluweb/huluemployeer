'use client';

import React from 'react';
import PieChart from './PieChart';
import BarChart from './BarChart';

type Applicant = {
  name: string;
  status: 'Review' | 'Interview' | 'Rejected' | 'Offer';
};

const applicants: Applicant[] = [
  { name: 'John', status: 'Review' },
  { name: 'Alice', status: 'Interview' },
  { name: 'Bob', status: 'Rejected' },
  { name: 'Diana', status: 'Offer' },
  { name: 'Eve', status: 'Interview' },
  { name: 'Mike', status: 'Review' },
];

// Calculate status counts
const statusCounts: Record<string, number> = applicants.reduce((acc, applicant) => {
  acc[applicant.status] = (acc[applicant.status] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

// Prepare chart data
const pieChartData = {
  labels: Object.keys(statusCounts),
  datasets: [
    {
      data: Object.values(statusCounts),
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)',   // Review
        'rgba(255, 206, 86, 0.8)',   // Interview
        'rgba(255, 99, 132, 0.8)',   // Rejected
        'rgba(75, 192, 192, 0.8)'    // Offer
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(75, 192, 192, 1)'
      ],
      borderWidth: 1
    }
  ]
};

const barChartData = {
  labels: Object.keys(statusCounts),
  datasets: [
    {
      label: 'Applicants by Status',
      data: Object.values(statusCounts),
      backgroundColor: 'rgba(53, 162, 235, 0.8)',
      borderColor: 'rgba(53, 162, 235, 1)',
      borderWidth: 1
    }
  ]
};

const ApplicantsDashboard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-5xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">📊 Applicants Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-center">Applicants by Status (Pie)</h2>
          <PieChart data={pieChartData} />
        </div>
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-center">Applicants by Status (Bar)</h2>
          <BarChart data={barChartData} />
        </div>
      </div>
    </div>
  );
};

export default ApplicantsDashboard;

