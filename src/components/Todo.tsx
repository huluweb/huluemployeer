"use client";
import React, { useState, useEffect } from 'react';
import { HiPlus,HiMenu, HiTrash, HiCheckCircle, HiUser, HiOutlineSearch } from 'react-icons/hi';
import axiosInstance from '@/helper/axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AxiosError } from 'axios'; // Added AxiosError import

interface Task {
  _id: string;
  text: string;
  assignedTo: string;
  completed: boolean;
  assignedBy: string;
  date: string;
}

interface User {
  id: string;
  name: string;
  role: 'admin' | 'employee';
}

const TodoApp: React.FC = () => {
  const users: User[] = [
    { id: 'abush', name: 'Abush', role: 'admin' },
    { id: 'blen', name: 'Blen', role: 'employee' },
    { id: 'biruk', name: 'Biruk', role: 'employee' },
    { id: 'eldana', name: 'Eldana', role: 'employee' },
    { id: 'eyerus', name: 'Eyerus', role: 'employee' },
    { id: 'kaleab', name: 'Kaleab', role: 'employee' },
    { id: 'Host', name: 'Host', role: 'employee' },
  ];

  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeUser, setActiveUser] = useState<string>('abush');
  const [newTaskText, setNewTaskText] = useState('');
  const [assignedTo, setAssignedTo] = useState<string>('blen');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const currentUser = users.find(user => user.id === activeUser);
  const isAdmin = currentUser?.role === 'admin';
  const filteredTasks = tasks.filter(task => {
    const matchesUser = isAdmin || task.assignedTo === activeUser;
    const matchesSearch = task.text.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesUser && matchesSearch;
  });
  // Fetch tasks on mount and when activeUser changes
  useEffect(() => {
    fetchTasks();
  }, [activeUser]);

  // Reset assignee when user changes
  useEffect(() => {
    if (activeUser === 'kaleab') {
      setAssignedTo('Host');
    } else if (activeUser === 'Host') {
      setAssignedTo('kaleab');
    } else {
      setAssignedTo('eldana');
    }
  }, [activeUser]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('https://huluweb.onrender.com/api/tasks');
      setTasks(response.data);
    } catch (error) {
      let errorMessage = 'Failed to fetch tasks';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async () => {
    if (newTaskText.trim() === '') {
      toast.error('Task description is required', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const newTask = {
        text: newTaskText,
        assignedTo,
        completed: false,
        assignedBy: activeUser,
        date: new Date().toISOString().split('T')[0],
      };

      const response = await axiosInstance.post('https://huluweb.onrender.com/api/tasks', newTask);
      setTasks([...tasks, response.data.task]);
      setNewTaskText('');
      toast.success('Task added successfully', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      let errorMessage = 'Failed to add task';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    setIsLoading(true);
    try {
      await axiosInstance.delete(`https://huluweb.onrender.com/api/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
      toast.success('Task deleted successfully', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      let errorMessage = 'Failed to delete task';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTask = async (id: string) => {
    const taskToUpdate = tasks.find(task => task._id === id);
    if (!taskToUpdate) return;

    setIsLoading(true);
    try {
      const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };
      const response = await axiosInstance.put(`https://huluweb.onrender.com/api/tasks/${id}`, updatedTask);
      setTasks(tasks.map(task => task._id === id ? response.data.task : task));
      toast.success('Task status updated', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      let errorMessage = 'Failed to update task';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };


  // Allow all users (admin or employee) to assign tasks
  const canAssignTasks = true;

  return (
    <div className="bg-white min-h-screen flex flex-col md:flex-row">
      <ToastContainer />
      
      {/* Mobile Header */}
      <div className="md:hidden bg-gray-800 text-white p-4 flex items-center justify-between">
        <button 
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 rounded-md hover:bg-gray-700"
        >
          <HiMenu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Team Tasks</h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>
      
      {/* Mobile Search */}
      <div className="md:hidden p-3 bg-gray-700">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <HiOutlineSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Sidebar - Responsive */}
      <div 
        className={`${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
        fixed md:static inset-y-0 left-0 w-64 bg-gray-800 text-white z-10
        transition-transform duration-300 ease-in-out flex flex-col
        md:flex`}
      >
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Team Tasks</h2>
          <p className="text-gray-400 text-sm">Manage your team's tasks</p>
        </div>

        <div className="p-3 hidden md:block">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiOutlineSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-4">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => {
                setActiveUser(user.id);
                setShowSidebar(false);
              }}
              className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors mb-2 ${
                activeUser === user.id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <div className="bg-gray-200 border-2 border-dashed rounded-full w-8 h-8 flex items-center justify-center">
                <HiUser className="text-gray-600" />
              </div>
              <div className="ml-3 text-left">
                <p className="font-medium text-sm">{user.name}</p>
                <p className="text-xs text-gray-400 capitalize">{user.role}</p>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Overlay for mobile sidebar */}
        {showSidebar && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
            onClick={() => setShowSidebar(false)}
          ></div>
        )}

        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {currentUser?.name}'s Tasks
              </h1>
              <p className="text-sm text-gray-600">
                {isAdmin 
                  ? 'Admin dashboard - Assign and manage tasks' 
                  : 'Your assigned tasks and task assignment'}
              </p>
            </div>
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
          </div>
        </div>

        {/* Task creation form */}
        {canAssignTasks && (
          <div className="bg-blue-50 border-b border-blue-100 p-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-lg font-medium text-blue-800 mb-3">Assign New Task</h2>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="Enter task description..."
                  className="flex-1 border text-black border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  disabled={isLoading}
                />
                
                <div className="flex gap-3">
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="flex-1 border border-gray-300 text-[#333] rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                    disabled={isLoading}
                  >
                    {isAdmin ? (
                      users.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="abush">Abush (Admin)</option>
                        {activeUser === 'kaleab' && <option value="Host">Host</option>}
                        {activeUser === 'Host' && <option value="kaleab">Kaleab</option>}
                      </>
                    )}
                  </select>
                  
                  <button
                    onClick={addTask}
                    className={`bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center justify-center hover:bg-blue-700 transition-colors ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    } text-sm md:text-base`}
                    disabled={isLoading}
                  >
                    <HiPlus className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="ml-1">Assign</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tasks list */}
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {isAdmin ? 'All Tasks' : 'Your Tasks'}
              </h2>
              <p className="text-sm text-gray-600">
                {filteredTasks.filter(t => !t.completed).length} pending, {filteredTasks.filter(t => t.completed).length} completed
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-10">
                <p className="text-lg font-medium text-gray-900">Loading tasks...</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-10">
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl w-16 h-16 mx-auto flex items-center justify-center">
                  <HiCheckCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {canAssignTasks 
                    ? 'Assign tasks using the form above' 
                    : 'No tasks assigned to you yet'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTasks.map((task) => {
                  const assignedUser = users.find(u => u.id === task.assignedTo);
                  const assignedByUser = users.find(u => u.id === task.assignedBy);

                  return (
                    <div 
                      key={task._id} 
                      className={`flex items-start p-3 rounded-lg border ${
                        task.completed 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-white border-gray-200 hover:shadow-sm'
                      }`}
                    >
                      <button
                        onClick={() => toggleTask(task._id)}
                        className={`mt-1 mr-3 ${task.completed ? 'text-green-600' : 'text-gray-400'}`}
                        disabled={isLoading}
                      >
                        <HiCheckCircle className="w-5 h-5" />
                      </button>

                      <div className="flex-1 min-w-0">
                        <p 
                          className={`${task.completed ? 'text-gray-500 line-through' : 'text-gray-800'} text-sm md:text-base truncate`}
                        >
                          {task.text}
                        </p>
                        
                        <div className="mt-2 flex flex-col gap-1 text-xs text-gray-500">
                          <div className="flex items-center">
                            <span className="text-gray-400 mr-1">Assigned to:</span>
                            <div className="flex items-center">
                              <div className="bg-gray-200 border-2 border-dashed rounded-full w-4 h-4 mr-1" />
                              <span className="font-medium">{assignedUser?.name}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <span className="text-gray-400 mr-1">Assigned by:</span>
                            <div className="flex items-center">
                              <div className="bg-gray-200 border-2 border-dashed rounded-full w-4 h-4 mr-1" />
                              <span className="font-medium">{assignedByUser?.name}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <span className="text-gray-400 mr-1">Date:</span>
                            <span className="font-medium">{task.date}</span>
                            {task.completed ? (
                              <span className="ml-2 text-green-600">Completed</span>
                            ) : (
                              <span className="ml-2 text-yellow-500">In Progress</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {isAdmin && (
                        <button
                          onClick={() => deleteTask(task._id)}
                          className={`text-gray-400 hover:text-red-500 p-1 ml-2 ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={isLoading}
                        >
                          <HiTrash className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;