// components/Sidebar.tsx
import React, { useEffect } from 'react';
import { 
  HiHome, 
  HiClipboardList, 
  HiUserGroup, 
  HiUsers,
  HiChevronDoubleLeft,
  HiChevronDoubleRight
} from 'react-icons/hi';
import { FaBell, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

interface SidebarProps {
  activeComponent: string;
  setActiveComponent: (component: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeComponent, 
  setActiveComponent,
  collapsed,
  setCollapsed
}) => {
  // Auto-collapse on mobile on initial render
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setCollapsed(true);
    }
  }, [setCollapsed]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <HiHome className="w-5 h-5" /> },
    { id: 'todo', label: 'Todo List', icon: <HiClipboardList className="w-5 h-5" /> },
    { id: 'employeer', label: 'Employeer', icon: <HiUserGroup className="w-5 h-5" /> },
    { id: 'applicants', label: 'Applicants', icon: <HiUsers className="w-5 h-5" /> },
    { id: 'Notification', label: 'Notifications', icon: <FaBell className="w-5 h-5" /> },
    { id: 'Location', label: 'Locations', icon: <FaMapMarkerAlt className="w-5 h-5" /> },
    { id: 'EventForm', label: 'EventForm', icon: <FaCalendarAlt className="w-5 h-5" /> },
  ];

  return (
    <div 
      className={`bg-gray-800 text-white transition-all duration-300 ease-in-out flex flex-col 
        ${collapsed ? 'w-20' : 'w-64'}`}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="bg-blue-500 w-8 h-8 rounded-lg"></div>
            <h1 className="text-xl font-bold">Company</h1>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white focus:outline-none"
        >
          {collapsed ? 
            <HiChevronDoubleRight className="w-6 h-6" /> : 
            <HiChevronDoubleLeft className="w-6 h-6" />
          }
        </button>
      </div>
      
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveComponent(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                  activeComponent === item.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                <span className={`${collapsed ? '' : 'mr-3'}`}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      {!collapsed && (
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
            <div>
              <p className="font-medium">Abush</p>
              <p className="text-sm text-gray-400">Admin</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;