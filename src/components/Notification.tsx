"use client";
import React, { useState, useEffect } from 'react';
import { 
  HiBell,
  HiCheckCircle,
  HiOutlineBell,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineDocumentText,
  HiOutlineTrash,
  HiOutlineChevronDown
} from 'react-icons/hi';

// Define the Notification interface
interface Notification {
  id: string;
  title: string;
  content: string;
  read: boolean;
  time: string;
  type: string;
  eventTime?: string | null;
}

// Define the API response notification interface (matching backend structure)
interface ApiNotification {
  _id: string;
  title: string;
  discription: string; // Note: Backend uses 'discription'
  mark: boolean;
  time: string;
  type?: string;
  eventTime?: string | null;
}

const NotificationsPage = () => {
  const [filter, setFilter] = useState<string>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]); // Type the notifications state

  useEffect(() => {
    fetchUpcoming();
  }, []);

  const fetchUpcoming = async () => {
    try {
      const response = await fetch('https://huluweb.onrender.com/api/notifications', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ApiNotification[] = await response.json(); // Type the API response
      // Map backend data to frontend structure
      const mappedNotifications: Notification[] = data.map((notification: ApiNotification) => ({
        id: notification._id,
        title: notification.title,
        content: notification.discription, // Map 'discription' to 'content'
        read: notification.mark, // Map 'mark' to 'read'
        time: notification.time,
        type: notification.type || 'system', // Default to 'system' if type is not provided
        eventTime: notification.eventTime || null, // Include eventTime if available
      }));
      setNotifications(mappedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id: string) => {
    try {
      // Update backend
      await fetch(`https://huluweb.onrender.com/api/notifications/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mark: true }),
      });
      // Update frontend state
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Update backend
      await fetch('https://huluweb.onrender.com/api/notifications/mark-all', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      // Update frontend state
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      // Delete from backend
      await fetch(`https://huluweb.onrender.com/api/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // Update frontend state
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const clearAll = async () => {
    try {
      // Clear all notifications in backend
      await fetch('https://huluweb.onrender.com/api/notifications', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // Clear frontend state
      setNotifications([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  const getIcon = (type: string) => {
    switch (type) {
      case "event":
        return <HiOutlineCalendar className="w-5 h-5 text-purple-500" />;
      case "document":
        return <HiOutlineDocumentText className="w-5 h-5 text-green-500" />;
      case "connection":
        return <HiOutlineUser className="w-5 h-5 text-amber-500" />;
      case "system":
        return <HiOutlineBell className="w-5 h-5 text-gray-500" />;
      case "payment":
        return <HiCheckCircle className="w-5 h-5 text-teal-500" />;
      case "task":
        return <HiOutlineDocumentText className="w-5 h-5 text-indigo-500" />;
      case "comment":
        return <HiOutlineUser className="w-5 h-5 text-rose-500" />;
      default:
        return <HiOutlineBell className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "event": return "Event";
      case "document": return "Document";
      case "connection": return "Connection";
      case "system": return "System";
      case "task": return "Task";
      case "comment": return "Comment";
      default: return "Notification";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-indigo-100 p-3 rounded-xl mr-4">
              <HiBell className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600">
                {unreadCount > 0 
                  ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` 
                  : 'All caught up!'}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={markAllAsRead}
              className="px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center"
            >
              <HiCheckCircle className="mr-2 w-5 h-5 text-green-500" />
              Mark all as read
            </button>
            <button 
              onClick={clearAll}
              className="px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center"
            >
              <HiOutlineTrash className="mr-2 w-5 h-5 text-red-500" />
              Clear all
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-5 mb-8 border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-0">Filter notifications</h2>
            
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg flex items-center transition-colors ${
                  filter === 'all' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              
              {['event', 'document', 'task', 'system'].map(type => (
                <button 
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-lg flex items-center transition-colors ${
                    filter === type 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getIcon(type)}
                  <span className="ml-2">{getTypeLabel(type)}</span>
                </button>
              ))}
              
              <div className="relative">
                <button 
                  className="px-4 py-2 rounded-lg flex items-center bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <span>More</span>
                  <HiOutlineChevronDown className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16">
              <HiOutlineBell className="mx-auto w-16 h-16 text-gray-400" />
              <h3 className="mt-4 text-xl font-medium text-gray-900">No notifications</h3>
              <p className="mt-2 text-gray-500">
                {filter === 'all' 
                  ? "You're all caught up!" 
                  : `No ${getTypeLabel(filter).toLowerCase()} notifications`}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filteredNotifications.map(notification => (
                <li 
                  key={notification.id} 
                  className={`p-5 hover:bg-gray-50 transition-colors ${
                    notification.read ? 'bg-white' : 'bg-indigo-50'
                  }`}
                >
                  <div className="flex">
                    <div className="flex-shrink-0 mr-4 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className={`font-medium ${
                          notification.read ? 'text-gray-700' : 'text-gray-900 font-semibold'
                        }`}>
                          {notification.title}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {notification.time}
                        </span>
                      </div>
                      
                      <p className="mt-1 text-gray-600">
                        {notification.content}
                      </p>
                      
                      {notification.type === 'event' && notification.eventTime && (
                        <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                          {notification.eventTime}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-start space-x-3 ml-4">
                      {!notification.read && (
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          className="p-1.5 rounded-full hover:bg-indigo-100 text-indigo-600 transition-colors"
                          title="Mark as read"
                        >
                          <HiCheckCircle className="w-5 h-5" />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1.5 rounded-full hover:bg-red-100 text-red-500 transition-colors"
                        title="Delete notification"
                      >
                        <HiOutlineTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="mt-6 flex justify-between items-center">
          <p className="text-gray-600 text-sm">
            Showing {filteredNotifications.length} of {notifications.length} notifications
          </p>
          <div className="flex space-x-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
              Load more
            </button>
            <button 
              onClick={clearAll}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              <HiOutlineTrash className="mr-2 w-4 h-4" />
              Clear all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;