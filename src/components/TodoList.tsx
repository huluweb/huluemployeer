import React, { useState, useEffect, useCallback } from 'react';
import { 
  HiPlus, HiTrash, HiCheckCircle, 
  HiUser, HiOutlineSearch, HiChat, HiUserAdd,
  HiOutlineDocumentText, HiOutlineChatAlt2
} from 'react-icons/hi';

interface User {
  id: string;
  name: string;
  role: 'admin' | 'video editor' | 'host' | 'website developer' | 'call center';
}

interface Task {
  id: number;
  text: string;
  assignedTo: string;
  status: 'completed' | 'in progress' | 'pending';
  assignedBy: string;
  date: string;
}

interface Message {
  id: number;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'read';
}

const TodoApp: React.FC = () => {
  // Initial users data
  const initialUsers: User[] = [
    { id: 'abush', name: 'Abush', role: 'admin' },
    { id: 'blen', name: 'Blen', role: 'video editor' },
    { id: 'biruk', name: 'Biruk', role: 'host' },
    { id: 'eldana', name: 'Eldana', role: 'website developer' },
    { id: 'eyerus', name: 'Eyerus', role: 'call center' },
    { id: 'kaleab', name: 'Kaleab', role: 'call center' },
  ];

  // Initial tasks data
  const initialTasks: Task[] = [
    { id: 1, text: 'Complete project documentation', assignedTo: 'eldana', status: 'in progress', assignedBy: 'abush', date: '2023-05-15' },
    { id: 2, text: 'Review client feedback', assignedTo: 'biruk', status: 'completed', assignedBy: 'abush', date: '2023-05-10' },
    { id: 3, text: 'Update website content', assignedTo: 'blen', status: 'pending', assignedBy: 'abush', date: '2023-05-12' },
    { id: 4, text: 'Prepare quarterly report', assignedTo: 'eyerus', status: 'pending', assignedBy: 'abush', date: '2023-05-14' },
    { id: 5, text: 'Fix login page issues', assignedTo: 'kaleab', status: 'completed', assignedBy: 'abush', date: '2023-05-08' },
  ];

  // Initial messages data
  const initialMessages: Message[] = [
    { id: 1, senderId: 'eyerus', receiverId: 'abush', text: 'Need clarification on the new requirements', timestamp: '2023-05-20 10:30', status: 'read' },
    { id: 2, senderId: 'abush', receiverId: 'eyerus', text: 'Please check the document I shared', timestamp: '2023-05-20 11:15', status: 'read' },
    { id: 3, senderId: 'blen', receiverId: 'abush', text: 'Video editing is complete', timestamp: '2023-05-21 09:45', status: 'sent' },
    { id: 4, senderId: 'eldana', receiverId: 'abush', text: 'Facing issue with the API integration', timestamp: '2023-05-21 14:20', status: 'read' },
  ];

  // State management
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [activeUser, setActiveUser] = useState<string>('abush');
  const [newTaskText, setNewTaskText] = useState('');
  const [assignedTo, setAssignedTo] = useState<string>('eldana');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState<'tasks' | 'messages'>('tasks');
  const [newMessageText, setNewMessageText] = useState('');
  const [messageRecipient, setMessageRecipient] = useState<string>('');
  const [showUserForm, setShowUserForm] = useState(false);
  const [newUser, setNewUser] = useState({ id: '', name: '', role: 'call center' as User['role'] });
  const currentUser = users.find(user => user.id === activeUser);
  const isAdmin = currentUser?.role === 'admin';

  // Filter tasks based on active user and search term
  const filteredTasks = tasks.filter(task => {
    const matchesUser = isAdmin || task.assignedTo === activeUser;
    const matchesSearch = task.text.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesUser && matchesSearch;
  });

  // Filter messages for current user
  const userMessages = messages.filter(msg => 
    msg.senderId === activeUser || msg.receiverId === activeUser
  );

  // Memoize getMessageRecipients to avoid unnecessary re-renders
  const getMessageRecipients = useCallback(() => {
    if (!currentUser) return [];
    
    switch(currentUser.role) {
      case 'admin':
        return users.filter(u => u.id !== activeUser);
      case 'video editor':
        return users.filter(u => 
          u.role === 'admin' || u.role === 'host'
        );
      case 'host':
        return users.filter(u => 
          u.role === 'admin' || u.role === 'video editor'
        );
      case 'website developer':
        return users.filter(u => u.role === 'admin');
      case 'call center':
        return users.filter(u => u.role === 'admin');
      default:
        return [];
    }
  }, [currentUser, users, activeUser]);

  // Task functions
  const addTask = () => {
    if (newTaskText.trim() !== '') {
      const newTask: Task = {
        id: Date.now(),
        text: newTaskText,
        assignedTo,
        status: 'pending',
        assignedBy: activeUser,
        date: new Date().toISOString().split('T')[0]
      };
      
      setTasks([...tasks, newTask]);
      setNewTaskText('');
    }
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const updateTaskStatus = (id: number, status: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status } : task
    ));
  };

  // Message functions
  const sendMessage = () => {
    if (newMessageText.trim() !== '' && messageRecipient) {
      const newMessage: Message = {
        id: Date.now(),
        senderId: activeUser,
        receiverId: messageRecipient,
        text: newMessageText,
        timestamp: new Date().toLocaleString(),
        status: 'sent'
      };
      
      setMessages([...messages, newMessage]);
      setNewMessageText('');
    }
  };

  // User management functions
  const addUser = () => {
    if (newUser.id.trim() !== '' && newUser.name.trim() !== '') {
      setUsers([...users, { ...newUser }]);
      setNewUser({ id: '', name: '', role: 'call center' });
      setShowUserForm(false);
    }
  };

  const deleteUser = (id: string) => {
    // Don't allow deleting self or admin
    if (id === activeUser || id === 'abush') return;
    
    setUsers(users.filter(user => user.id !== id));
    setTasks(tasks.filter(task => task.assignedTo !== id));
  };

  // Set initial message recipient
  useEffect(() => {
    if (activeView === 'messages' && getMessageRecipients().length > 0) {
      setMessageRecipient(getMessageRecipients()[0].id);
    }
  }, [activeView, activeUser, getMessageRecipients]);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Team Tasks</h2>
          <p className="text-gray-400 text-sm">Manage your team&apos;s workflow</p>
        </div>
        
        <div className="p-3">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiOutlineSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        
        {/* View Toggle */}
        <div className="flex border-b border-gray-700 px-2">
          <button
            onClick={() => setActiveView('tasks')}
            className={`flex-1 py-2 text-center ${
              activeView === 'tasks' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <HiOutlineDocumentText className="inline-block mr-2" />
            Tasks
          </button>
          <button
            onClick={() => setActiveView('messages')}
            className={`flex-1 py-2 text-center ${
              activeView === 'messages' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <HiOutlineChatAlt2 className="inline-block mr-2" />
            Messages
          </button>
        </div>
        
        {/* User List */}
        <div className="flex-1 overflow-y-auto px-2 py-3">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => setActiveUser(user.id)}
              className={`w-full flex items-center px-3 py-2 rounded-lg mb-2 transition-colors ${
                activeUser === user.id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <div className="bg-gray-200 border-2 border-dashed rounded-full w-8 h-8 flex items-center justify-center">
                <HiUser className="text-gray-600" />
              </div>
              <div className="ml-3 text-left flex-1">
                <p className="font-medium truncate">{user.name}</p>
                <p className="text-xs text-gray-400 capitalize">{user.role}</p>
              </div>
              {isAdmin && user.id !== 'abush' && (
                <button 
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    deleteUser(user.id);
                  }}
                  className="text-gray-400 hover:text-red-400 ml-2"
                >
                  <HiTrash className="w-4 h-4" />
                </button>
              )}
            </button>
          ))}
          
          {/* Add User Button (Admin only) */}
          {isAdmin && (
            <button
              onClick={() => setShowUserForm(true)}
              className="mt-4 w-full flex items-center justify-center py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <HiUserAdd className="mr-2" />
              Add Team Member
            </button>
          )}
        </div>
        
        {/* Current User */}
        <div className="p-3 border-t border-gray-700 bg-gray-900 flex items-center">
          <div className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10 flex items-center justify-center">
            <HiUser className="text-gray-600 w-6 h-6" />
          </div>
          <div className="ml-3">
            <p className="font-medium">{currentUser?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{currentUser?.role}</p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {activeView === 'tasks' 
                  ? `${currentUser?.name}&apos;s Tasks` 
                  : `${currentUser?.name}&apos;s Messages`}
              </h1>
              <p className="text-sm text-gray-600">
                {activeView === 'tasks'
                  ? (isAdmin 
                      ? 'Admin dashboard - Assign tasks to your team' 
                      : 'Your assigned tasks')
                  : 'Communicate with your team'}
              </p>
            </div>
            
            <div className="flex items-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
            </div>
          </div>
        </div>
        
        {/* Conditional Content */}
        <div className="flex-1 overflow-y-auto">
          {activeView === 'tasks' ? (
            <TasksView 
              isAdmin={isAdmin}
              users={users}
              tasks={filteredTasks}
              newTaskText={newTaskText}
              assignedTo={assignedTo}
              setNewTaskText={setNewTaskText}
              setAssignedTo={setAssignedTo}
              addTask={addTask}
              updateTaskStatus={updateTaskStatus}
              deleteTask={deleteTask}
            />
          ) : (
            <MessagesView 
              users={users}
              messages={userMessages}
              currentUserId={activeUser}
              newMessageText={newMessageText}
              messageRecipient={messageRecipient}
              setNewMessageText={setNewMessageText}
              setMessageRecipient={setMessageRecipient}
              sendMessage={sendMessage}
              getMessageRecipients={getMessageRecipients}
            />
          )}
        </div>
      </div>
      
      {/* Add User Modal */}
      {showUserForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Team Member</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User ID
                </label>
                <input
                  type="text"
                  value={newUser.id}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewUser({...newUser, id: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter unique ID"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewUser({...newUser, role: e.target.value as User['role']})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="video editor">Video Editor</option>
                  <option value="host">Host</option>
                  <option value="website developer">Website Developer</option>
                  <option value="call center">Call Center</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowUserForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Tasks View Component
const TasksView: React.FC<{
  isAdmin: boolean;
  users: User[];
  tasks: Task[];
  newTaskText: string;
  assignedTo: string;
  setNewTaskText: React.Dispatch<React.SetStateAction<string>>;
  setAssignedTo: React.Dispatch<React.SetStateAction<string>>;
  addTask: () => void;
  updateTaskStatus: (id: number, status: Task['status']) => void;
  deleteTask: (id: number) => void;
}> = ({ 
  isAdmin, users, tasks, newTaskText, assignedTo, 
  setNewTaskText, setAssignedTo, addTask, updateTaskStatus, deleteTask 
}) => {
  return (
    <div className="h-full flex flex-col">
      {/* Task creation form (only for admin) */}
      {isAdmin && (
        <div className="bg-blue-50 border-b border-blue-100 p-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-medium text-blue-800 mb-3">Assign New Task</h2>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                value={newTaskText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTaskText(e.target.value)}
                placeholder="Enter task description..."
                className="flex-1 border text-black border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && addTask()}
              />
              
              <select
                value={assignedTo}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAssignedTo(e.target.value)}
                className="border border-gray-300 text-[#333] rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {users
                  .filter(user => user.role !== 'admin')
                  .map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
              </select>
              
              <button
                onClick={addTask}
                className="bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <HiPlus className="w-5 h-5" />
                <span className="ml-1">Assign Task</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Tasks list */}
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {isAdmin ? 'All Tasks' : 'Your Tasks'}
            </h2>
            <p className="text-sm text-gray-600">
              {tasks.filter(t => t.status !== 'completed').length} pending, {tasks.filter(t => t.status === 'completed').length} completed
            </p>
          </div>
          
          {tasks.length === 0 ? (
            <div className="text-center py-10">
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl w-16 h-16 mx-auto flex items-center justify-center">
                <HiCheckCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {isAdmin 
                  ? 'Assign tasks to your team using the form above' 
                  : 'No tasks assigned to you yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => {
                const assignedUser = users.find(u => u.id === task.assignedTo);
                const assignedByUser = users.find(u => u.id === task.assignedBy);
                
                return (
                  <div 
                    key={task.id} 
                    className={`flex items-start p-4 rounded-lg border ${
                      task.status === 'completed' 
                        ? 'bg-green-50 border-green-200' 
                        : task.status === 'in progress'
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-white border-gray-200 hover:shadow-sm'
                    }`}
                  >
                    <div className="mr-3 mt-1">
                      <select
                        value={task.status}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateTaskStatus(task.id, e.target.value as Task['status'])}
                        className={`text-xs font-medium rounded-full px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                          task.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : task.status === 'in progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    
                    <div className="flex-1">
                      <p 
                        className={`${task.status === 'completed' ? 'text-gray-500' : 'text-gray-800'}`}
                      >
                        {task.text}
                      </p>
                      
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <span className="text-gray-400">Assigned to:</span>
                          <div className="flex items-center ml-1">
                            <div className="bg-gray-200 border-2 border-dashed rounded-full w-5 h-5 mr-1" />
                            <span className="font-medium">{assignedUser?.name}</span>
                          </div>
                        </div>
                        
                        {isAdmin && (
                          <div className="flex items-center">
                            <span className="text-gray-400 ml-2">Assigned by:</span>
                            <div className="flex items-center ml-1">
                              <div className="bg-gray-200 border-2 border-dashed rounded-full w-5 h-5 mr-1" />
                              <span className="font-medium">{assignedByUser?.name}</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center">
                          <span className="text-gray-400 ml-2">Date:</span>
                          <span className="font-medium ml-1">{task.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    {isAdmin && (
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-gray-400 hover:text-red-500 p-1"
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
  );
};

// Messages View Component
const MessagesView: React.FC<{
  users: User[];
  messages: Message[];
  currentUserId: string;
  newMessageText: string;
  messageRecipient: string;
  setNewMessageText: React.Dispatch<React.SetStateAction<string>>;
  setMessageRecipient: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => void;
  getMessageRecipients: () => User[];
}> = ({ 
  users, messages, currentUserId, newMessageText, messageRecipient,
  setNewMessageText, setMessageRecipient, sendMessage, getMessageRecipients 
}) => {
  // Filter messages for selected recipient
  const conversation = messages.filter(msg => 
    (msg.senderId === currentUserId && msg.receiverId === messageRecipient) ||
    (msg.senderId === messageRecipient && msg.receiverId === currentUserId)
  );
  
  const recipient = users.find(u => u.id === messageRecipient);
  
  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-lg font-semibold text-gray-800 mr-3">
                Messages
              </h2>
              <select
                value={messageRecipient}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMessageRecipient(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {getMessageRecipients().map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          {recipient && (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex items-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10 flex items-center justify-center">
                <HiUser className="text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="font-medium">{recipient.name}</p>
                <p className="text-xs text-gray-500 capitalize">{recipient.role}</p>
              </div>
            </div>
          )}
          
          {conversation.length === 0 ? (
            <div className="text-center py-10">
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl w-16 h-16 mx-auto flex items-center justify-center">
                <HiChat className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No messages yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start a conversation with {recipient?.name}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {conversation.map((msg) => {
                const sender = users.find(u => u.id === msg.senderId);
                const isCurrentUser = msg.senderId === currentUserId;
                
                return (
                  <div 
                    key={msg.id} 
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-md rounded-lg p-3 ${
                        isCurrentUser 
                          ? 'bg-blue-100 border border-blue-200 rounded-br-none' 
                          : 'bg-white border border-gray-200 rounded-bl-none'
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        <div className="bg-gray-200 border-2 border-dashed rounded-full w-6 h-6 mr-2" />
                        <span className="font-medium text-sm">
                          {isCurrentUser ? 'You' : sender?.name}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {msg.timestamp}
                        </span>
                      </div>
                      <p className="text-gray-800">{msg.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Message input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center">
            <input
              type="text"
              value={newMessageText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessageText(e.target.value)}
              placeholder={`Message ${recipient?.name || '...'}`}
              className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="ml-3 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors"
              disabled={!newMessageText.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;