import React from 'react';
import { Link } from 'react-router-dom';
import { FaChartLine, FaCalendarAlt, FaComments, FaClipboardList, FaExclamationTriangle } from 'react-icons/fa';

/**
 * Parent Dashboard - Main dashboard for parents to monitor their child's progress
 */
const ParentDashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Parent Dashboard</h1>
        <p className="text-gray-600">
          Monitor your child's progress and access key resources
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Progress Overview Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-500 px-4 py-3">
            <h2 className="text-white text-lg font-semibold flex items-center">
              <FaChartLine className="mr-2" /> Progress Overview
            </h2>
          </div>
          <div className="p-5">
            <p className="text-gray-600 mb-4">View your child's progress across different areas.</p>
            <Link 
              to="/progress" 
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              View Progress
            </Link>
          </div>
        </div>

        {/* Risk Analysis Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-purple-500 px-4 py-3">
            <h2 className="text-white text-lg font-semibold flex items-center">
              <FaExclamationTriangle className="mr-2" /> Risk Analysis
            </h2>
          </div>
          <div className="p-5">
            <p className="text-gray-600 mb-4">Monitor behavioral patterns and identify potential risks.</p>
            <Link 
              to="/risk-analysis" 
              className="inline-block bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              View Risk Analysis
            </Link>
          </div>
        </div>

        {/* Upcoming Sessions Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-500 px-4 py-3">
            <h2 className="text-white text-lg font-semibold flex items-center">
              <FaCalendarAlt className="mr-2" /> Upcoming Sessions
            </h2>
          </div>
          <div className="p-5">
            <p className="text-gray-600 mb-4">View and manage upcoming therapy sessions.</p>
            <Link 
              to="/sessions" 
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Manage Sessions
            </Link>
          </div>
        </div>

        {/* Communication Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-yellow-500 px-4 py-3">
            <h2 className="text-white text-lg font-semibold flex items-center">
              <FaComments className="mr-2" /> Communication
            </h2>
          </div>
          <div className="p-5">
            <p className="text-gray-600 mb-4">Message therapists and view communication history.</p>
            <Link 
              to="/messages" 
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              View Messages
            </Link>
          </div>
        </div>

        {/* Reports Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-red-500 px-4 py-3">
            <h2 className="text-white text-lg font-semibold flex items-center">
              <FaClipboardList className="mr-2" /> Reports
            </h2>
          </div>
          <div className="p-5">
            <p className="text-gray-600 mb-4">Access detailed reports and assessments.</p>
            <Link 
              to="/reports" 
              className="inline-block bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              View Reports
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <ul className="divide-y divide-gray-200">
            <li className="p-4 hover:bg-gray-50">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <FaCalendarAlt className="text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Therapy Session Completed</p>
                  <p className="text-sm text-gray-500">Yesterday at 3:30 PM</p>
                </div>
              </div>
            </li>
            <li className="p-4 hover:bg-gray-50">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <FaExclamationTriangle className="text-purple-500" />
                </div>
                <div>
                  <p className="font-medium">Risk Analysis Updated</p>
                  <p className="text-sm text-gray-500">2 days ago</p>
                </div>
              </div>
            </li>
            <li className="p-4 hover:bg-gray-50">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <FaComments className="text-green-500" />
                </div>
                <div>
                  <p className="font-medium">New Message from Dr. Johnson</p>
                  <p className="text-sm text-gray-500">3 days ago</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard; 