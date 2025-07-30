"use client";
import React, { useEffect, useState } from "react";
import {
  HiUserGroup,
  HiDocumentText,
  HiUsers,
  HiCalendar,
  HiCheckCircle,
  HiClock,
  HiArrowUp,
  HiArrowDown,
} from "react-icons/hi";
import Chart from "./Chart";
import CalendarIcon from "@/components/CalanderIcon";

// Define interfaces for type safety
interface AppNotification {
  id: string;
  title: string;
  content: string;
  read: boolean;
  time: string;
  type?: string;
  eventTime?: string | null;
}

interface DashboardCard {
  title: string;
  value: number;
  icon: React.ElementType;
  trend: "increase" | "decrease";
}

interface Event {
  date: string;
  title: string;
  time: string;
}

interface DashboardStats {
  employeeQuantitySum: number;
  applicants: number;
  reviewApplicants: number;
  interviewApplicants: number;
  rejectedApplicants: number;
  offeredApplicants: number;
  employees: number;
  users: number;
  events: number;
  tasks: {
    completed: number;
    notCompleted: number;
  };
  eventsData: Event[];
}

const Dashboard: React.FC = () => {
  // State with explicit types
  const [employee, setEmployee] = useState<number>(0);
  const [applicants, setApplicants] = useState<number>(0);
  const [reviewApplicants, setReviewApplicants] = useState<number>(0);
  const [interviewApplicants, setInterviewApplicants] = useState<number>(0);
  const [rejectedApplicants, setRejectedApplicants] = useState<number>(0);
  const [offeredApplicants, setOfferedApplicants] = useState<number>(0);
  const [user, setUser] = useState<number>(0);
  const [event, setEvent] = useState<number>(0);
  const [taskCompleted, setTaskCompleted] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [openPostions, setOpenPostion] = useState<number>(0);
  const [tasks, setTasks] = useState<Event[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Fetch dashboard stats
  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await fetch("https://huluweb.onrender.com/api/dashboard-stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: DashboardStats = await response.json();
      setApplicants(data.applicants);
      setReviewApplicants(data.reviewApplicants);
      setInterviewApplicants(data.interviewApplicants);
      setRejectedApplicants(data.rejectedApplicants);
      setOfferedApplicants(data.offeredApplicants);
      setEmployee(data.employees);
      setUser(data.users);
      setEvent(data.events);
      setTaskCompleted(data.tasks.completed);
      setProgress(data.tasks.notCompleted);
      setTasks(data.eventsData);
      setOpenPostion(data.employeeQuantitySum);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  // Fetch notifications
  useEffect(() => {
    fetchUpcoming();
  }, []);

  const fetchUpcoming = async () => {
    try {
      const response = await fetch("https://huluweb.onrender.com/api/notifications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Define interface for backend notification structure
      interface BackendNotification {
        _id: string;
        title: string;
        description: string;
        mark: boolean;
        time: string;
        type?: string;
        eventTime?: string | null;
      }
      
      const data: BackendNotification[] = await response.json();
      
      // Map backend data to frontend structure
      const mappedNotifications: AppNotification[] = data.map(
        (notification) => ({
          id: notification._id,
          title: notification.title,
          content: notification.description,
          read: notification.mark,
          time: notification.time,
          type: notification.type || "system",
          eventTime: notification.eventTime || null,
        })
      );
      setNotifications(mappedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Dashboard card data
  const dashboardCards: DashboardCard[] = [
    { title: "Employees", value: employee, icon: HiUserGroup, trend: "increase" },
    { title: "Applicants", value: applicants, icon: HiDocumentText, trend: "increase" },
    { title: "Open Position", value: openPostions, icon: HiClock, trend: "decrease" },
    { title: "Review Applicants", value: reviewApplicants, icon: HiDocumentText, trend: "increase" },
    { title: "Interview Applicants", value: interviewApplicants, icon: HiDocumentText, trend: "increase" },
    { title: "Rejected Applicants", value: rejectedApplicants, icon: HiDocumentText, trend: "decrease" },
    { title: "Offered Applicants", value: offeredApplicants, icon: HiDocumentText, trend: "increase" },
    { title: "Tasks Completed", value: taskCompleted, icon: HiCheckCircle, trend: "increase" },
    { title: "Tasks Pending", value: progress, icon: HiClock, trend: "decrease" },
    { title: "Users", value: user, icon: HiUsers, trend: "increase" },
    { title: "Events", value: event, icon: HiCalendar, trend: "increase" },
  ];

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Your key metrics and activities at a glance</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                  <card.icon className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                  <p className="text-sm text-gray-600">{card.title}</p>
                </div>
              </div>
              <div
                className={`flex items-center text-sm font-medium ${
                  card.trend === "increase" ? "text-green-600" : "text-red-600"
                }`}
              >
                {card.trend === "increase" ? (
                  <HiArrowUp className="mr-1 w-5 h-5" />
                ) : (
                  <HiArrowDown className="mr-1 w-5 h-5" />
                )}
                {card.trend === "increase" ? "Up" : "Down"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Metrics</h2>
        <div>
          <Chart />
        </div>
      </div>

      {/* Recent Activity & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {notifications.slice(0, 5).map((notification) => (
              <div
                key={notification.id}
                className="flex items-start hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <div className="bg-blue-100 text-blue-600 rounded-lg p-2">
                  <HiUserGroup className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {tasks.map((item, index) => (
              <div
                key={index}
                className="flex items-start hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <div className="bg-blue-100 text-blue-800 rounded-lg p-3 text-center">
                  <CalendarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
                </div>
                <div className="ml-4 mt-2">
                  <p className="text-sm font-medium text-gray-800">Title: {item.title}</p>
                  <p className="text-sm font-medium text-gray-800">Date: {item.date}</p>
                  <p className="text-xs text-gray-500">Time: {item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;