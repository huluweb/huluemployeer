"use client"
// App.tsx
import React, { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import TodoList from '@/components/Todo';
import Employeer from '@/components/Employeer';
import Applicants from '@/components/Employee';
import Sidebar from '@/components/Sidebar';
// pages/index.js or wherever you use MapWithSearch
import dynamic from 'next/dynamic';
// Dynamically import MapWithSearch with SSR disabled
const Location = dynamic(() => import('@/components/Location'), {
  ssr: false, // Disables server-side rendering
});
import Notification from '@/components/Notification';
import EventManager from '@/components/EventManager';

const App: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);


  const renderComponent = () => {
    switch (activeComponent) {
      case 'dashboard':
        return <Dashboard />;
      case 'todo':
        return <TodoList />;
      case 'employeer':
        return <Employeer />;
      case 'applicants':
        return <Applicants />;
      case 'Notification':
        return <Notification />;
      case 'EventForm':
        return <EventManager />;
      case 'Location':
        return <Location />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen relative bg-gray-50">
      <Sidebar 
        activeComponent={activeComponent}
        setActiveComponent={setActiveComponent}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {renderComponent()}
        </main>
      </div>
    </div>
  );
};

export default App;