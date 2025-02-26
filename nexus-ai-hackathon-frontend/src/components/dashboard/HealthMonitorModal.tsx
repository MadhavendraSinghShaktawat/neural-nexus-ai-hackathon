import React, { useState, useEffect, useRef } from 'react';
import { XMarkIcon, HeartIcon, ClockIcon, BoltIcon, FireIcon, DevicePhoneMobileIcon, DocumentTextIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Area, AreaChart } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

interface HealthMonitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateRange: { start: Date; end: Date };
}

const HealthMonitorModal: React.FC<HealthMonitorModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'sleep' | 'heart' | 'activity' | 'stress'>('sleep');
  const [showDataOptions, setShowDataOptions] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<'dummy' | 'connected'>('dummy');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [connectionStep, setConnectionStep] = useState<'initial' | 'auth' | 'permissions' | 'connecting' | 'success'>('initial');
  const [googleAuthWindow, setGoogleAuthWindow] = useState<Window | null>(null);
  const authCheckIntervalRef = useRef<number | null>(null);

  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setShowDataOptions(true);
        setConnectionStep('initial');
      }, 300);
    }
    
    // Clean up any open auth windows when the modal closes
    return () => {
      if (googleAuthWindow && !googleAuthWindow.closed) {
        googleAuthWindow.close();
      }
      
      if (authCheckIntervalRef.current) {
        window.clearInterval(authCheckIntervalRef.current);
      }
    };
  }, [isOpen, googleAuthWindow]);

  // Check if the auth window is still open
  useEffect(() => {
    if (googleAuthWindow && connectionStep === 'auth') {
      authCheckIntervalRef.current = window.setInterval(() => {
        if (googleAuthWindow.closed) {
          // User closed the auth window, move to the next step
          setConnectionStep('permissions');
          window.clearInterval(authCheckIntervalRef.current!);
        }
      }, 500);
    }
    
    return () => {
      if (authCheckIntervalRef.current) {
        window.clearInterval(authCheckIntervalRef.current);
      }
    };
  }, [googleAuthWindow, connectionStep]);

  if (!isOpen) return null;

  // Mock data for health metrics
  const sleepData = [
    { date: 'Mon', hours: 7.5, quality: 85 },
    { date: 'Tue', hours: 6.8, quality: 72 },
    { date: 'Wed', hours: 8.2, quality: 90 },
    { date: 'Thu', hours: 7.1, quality: 78 },
    { date: 'Fri', hours: 6.5, quality: 65 },
    { date: 'Sat', hours: 9.0, quality: 95 },
    { date: 'Sun', hours: 8.5, quality: 88 }
  ];

  const heartRateData = [
    { time: '8am', rate: 72 },
    { time: '10am', rate: 78 },
    { time: '12pm', rate: 85 },
    { time: '2pm', rate: 80 },
    { time: '4pm', rate: 76 },
    { time: '6pm', rate: 82 },
    { time: '8pm', rate: 74 }
  ];

  const activityData = [
    { day: 'Mon', steps: 5200, calories: 320 },
    { day: 'Tue', steps: 7800, calories: 450 },
    { day: 'Wed', steps: 4500, calories: 280 },
    { day: 'Thu', steps: 6300, calories: 380 },
    { day: 'Fri', steps: 8200, calories: 490 },
    { day: 'Sat', steps: 10500, calories: 620 },
    { day: 'Sun', steps: 3800, calories: 240 }
  ];

  const stressData = [
    { day: 'Mon', level: 42 },
    { day: 'Tue', level: 58 },
    { day: 'Wed', level: 35 },
    { day: 'Thu', level: 40 },
    { day: 'Fri', level: 65 },
    { day: 'Sat', level: 30 },
    { day: 'Sun', level: 25 }
  ];

  const getStressLevelLabel = (level: number) => {
    if (level < 30) return 'Low';
    if (level < 50) return 'Moderate';
    if (level < 70) return 'High';
    return 'Very High';
  };

  const getAverageStressLevel = () => {
    const avg = stressData.reduce((sum, item) => sum + item.level, 0) / stressData.length;
    return Math.round(avg);
  };

  const getAverageSleepHours = () => {
    return (sleepData.reduce((sum, item) => sum + item.hours, 0) / sleepData.length).toFixed(1);
  };

  const getAverageHeartRate = () => {
    return Math.round(heartRateData.reduce((sum, item) => sum + item.rate, 0) / heartRateData.length);
  };

  const getTotalSteps = () => {
    return activityData.reduce((sum, item) => sum + item.steps, 0).toLocaleString();
  };

  const handleConnectGoogleFit = () => {
    // Start the connection flow
    setConnectionStep('auth');
    
    // Open a new window for Google authentication (simulated)
    const authWindow = window.open('about:blank', 'GoogleFitAuth', 'width=600,height=700');
    if (authWindow) {
      authWindow.document.write(`
        <html>
          <head>
            <title>Google Sign-In</title>
            <style>
              body {
                font-family: 'Roboto', Arial, sans-serif;
                margin: 0;
                padding: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                background-color: #f8f9fa;
              }
              .google-logo {
                width: 100px;
                margin-bottom: 20px;
                margin-top: 40px;
              }
              .container {
                background: white;
                border-radius: 8px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.12);
                padding: 48px 40px;
                width: 100%;
                max-width: 450px;
                text-align: center;
              }
              h1 {
                font-size: 24px;
                font-weight: 400;
                margin-bottom: 30px;
                color: #202124;
              }
              .form-group {
                margin-bottom: 20px;
                text-align: left;
              }
              label {
                display: block;
                margin-bottom: 8px;
                font-size: 14px;
                color: #5f6368;
              }
              input {
                width: 100%;
                padding: 12px;
                border: 1px solid #dadce0;
                border-radius: 4px;
                font-size: 16px;
                color: #202124;
                box-sizing: border-box;
              }
              button {
                background-color: #1a73e8;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 4px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                margin-top: 20px;
              }
              button:hover {
                background-color: #1765cc;
              }
              .footer {
                margin-top: 20px;
                font-size: 12px;
                color: #5f6368;
              }
              .close-btn {
                position: absolute;
                top: 20px;
                right: 20px;
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #5f6368;
              }
            </style>
          </head>
          <body>
            <button class="close-btn" onclick="window.close()">&times;</button>
            <img src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" alt="Google" class="google-logo">
            <div class="container">
              <h1>Sign in with Google</h1>
              <div class="form-group">
                <label for="email">Email or phone</label>
                <input type="email" id="email" placeholder="Enter your email">
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" placeholder="Enter your password">
              </div>
              <button onclick="window.close()">Next</button>
              <div class="footer">
                Not your computer? Use Guest mode to sign in privately.
                <br><br>
                Learn more about using Guest mode
              </div>
            </div>
          </body>
        </html>
      `);
      setGoogleAuthWindow(authWindow);
    }
  };

  const handlePermissionsConfirm = () => {
    setConnectionStep('connecting');
    
    // Simulate connection process
    setTimeout(() => {
      setConnectionStep('success');
    }, 2000);
    
    // After success, show the health data
    setTimeout(() => {
      setDataSource('connected');
      setShowDataOptions(false);
      setConnectionStep('initial');
    }, 3500);
  };

  const handleUseDummyData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setDataSource('dummy');
      setShowDataOptions(false);
      setIsLoading(false);
    }, 800);
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
          <p className="font-medium text-gray-700">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: {entry.value} {entry.unit}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Render Google Fit permissions screen
  const renderPermissionsScreen = () => (
    <motion.div 
      className="py-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <img 
            src="https://www.gstatic.com/images/branding/product/1x/google_fit_96dp.png" 
            alt="Google Fit" 
            className="w-16 h-16 mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-800">Google Fit wants to access</h3>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">Activity and fitness data</h4>
                <p className="text-sm text-gray-600">Steps, calories, heart rate, and sleep data</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">Device information</h4>
                <p className="text-sm text-gray-600">Device type, model, and sensors</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">Health metrics</h4>
                <p className="text-sm text-gray-600">Heart rate, sleep patterns, and activity levels</p>
              </div>
            </li>
          </ul>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          This app will receive ongoing access to the data described above. You can turn off access at any time in your Google Account settings.
        </p>
        
        <div className="flex gap-3 justify-end">
          <motion.button
            onClick={() => setConnectionStep('initial')}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={handlePermissionsConfirm}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Allow
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  // Render connecting screen
  const renderConnectingScreen = () => (
    <motion.div 
      className="py-16 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Connecting to Google Fit</h3>
      <p className="text-gray-600">Please wait while we establish a connection...</p>
    </motion.div>
  );

  // Render success screen
  const renderSuccessScreen = () => (
    <motion.div 
      className="py-16 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircleIcon className="w-10 h-10 text-green-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Successfully Connected!</h3>
      <p className="text-gray-600">Your Google Fit account has been linked successfully.</p>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Health Monitoring</h2>
                <motion.button 
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </motion.button>
              </div>
            </div>
            
            <div className="p-6">
              <AnimatePresence mode="wait">
                {showDataOptions && connectionStep === 'initial' && (
                  <motion.div 
                    key="options"
                    className="py-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-xl font-semibold text-gray-800 text-center mb-8">Choose Data Source</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                      <motion.div 
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                        whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                      >
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <DevicePhoneMobileIcon className="w-8 h-8 text-blue-600" />
                        </div>
                        <h4 className="text-lg font-medium text-center mb-3">Connect Google Fit</h4>
                        <p className="text-gray-600 text-center mb-6">
                          Connect to your child's Google Fit account to monitor real health data from their device.
                        </p>
                        <div className="flex justify-center">
                          <motion.button
                            onClick={handleConnectGoogleFit}
                            className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Connecting...</span>
                              </div>
                            ) : (
                              "Connect Device"
                            )}
                          </motion.button>
                        </div>
                        <p className="text-xs text-gray-500 text-center mt-4">
                          Requires a Google Fit account and compatible device
                        </p>
                      </motion.div>
                      
                      <motion.div 
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                        whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                      >
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <DocumentTextIcon className="w-8 h-8 text-purple-600" />
                        </div>
                        <h4 className="text-lg font-medium text-center mb-3">Use Sample Data</h4>
                        <p className="text-gray-600 text-center mb-6">
                          View sample health data to explore the features without connecting a device.
                        </p>
                        <div className="flex justify-center">
                          <motion.button
                            onClick={handleUseDummyData}
                            className="px-5 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-400"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Loading...</span>
                              </div>
                            ) : (
                              "Use Sample Data"
                            )}
                          </motion.button>
                        </div>
                        <p className="text-xs text-gray-500 text-center mt-4">
                          No account or device required
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
                
                {connectionStep === 'permissions' && renderPermissionsScreen()}
                {connectionStep === 'connecting' && renderConnectingScreen()}
                {connectionStep === 'success' && renderSuccessScreen()}
                
                {!showDataOptions && (
                  <motion.div 
                    key="dashboard"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Status badge */}
                    <div className="flex justify-end mb-4">
                      {dataSource === 'connected' ? (
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                          Connected to Google Fit
                        </div>
                      ) : (
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                          Sample Data
                        </div>
                      )}
                    </div>
                    
                    {/* Health Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                      <motion.div 
                        className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200 shadow-sm hover:shadow-md transition-shadow"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ y: -3 }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-blue-500 bg-opacity-10 p-2 rounded-lg">
                            <ClockIcon className="w-5 h-5 text-blue-600" />
                          </div>
                          <h3 className="font-medium">Sleep</h3>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{getAverageSleepHours()} <span className="text-lg font-medium text-gray-500">hrs</span></p>
                        <p className="text-sm text-gray-600 mt-1">Avg. per night</p>
                      </motion.div>
                      
                      <motion.div 
                        className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 border border-red-200 shadow-sm hover:shadow-md transition-shadow"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ y: -3 }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-red-500 bg-opacity-10 p-2 rounded-lg">
                            <HeartIcon className="w-5 h-5 text-red-600" />
                          </div>
                          <h3 className="font-medium">Heart Rate</h3>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{getAverageHeartRate()} <span className="text-lg font-medium text-gray-500">bpm</span></p>
                        <p className="text-sm text-gray-600 mt-1">Avg. rate</p>
                      </motion.div>
                      
                      <motion.div 
                        className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200 shadow-sm hover:shadow-md transition-shadow"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ y: -3 }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-green-500 bg-opacity-10 p-2 rounded-lg">
                            <BoltIcon className="w-5 h-5 text-green-600" />
                          </div>
                          <h3 className="font-medium">Activity</h3>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{getTotalSteps()}</p>
                        <p className="text-sm text-gray-600 mt-1">Total steps</p>
                      </motion.div>
                      
                      <motion.div 
                        className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5 border border-amber-200 shadow-sm hover:shadow-md transition-shadow"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ y: -3 }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-amber-500 bg-opacity-10 p-2 rounded-lg">
                            <FireIcon className="w-5 h-5 text-amber-600" />
                          </div>
                          <h3 className="font-medium">Stress</h3>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{getStressLevelLabel(getAverageStressLevel())}</p>
                        <p className="text-sm text-gray-600 mt-1">Avg. stress level</p>
                      </motion.div>
                    </div>
                    
                    {/* Tabs */}
                    <div className="border-b border-gray-200 mb-6">
                      <nav className="flex space-x-8">
                        {[
                          { id: 'sleep', label: 'Sleep', color: 'blue' },
                          { id: 'heart', label: 'Heart Rate', color: 'red' },
                          { id: 'activity', label: 'Activity', color: 'green' },
                          { id: 'stress', label: 'Stress', color: 'amber' }
                        ].map(tab => (
                          <motion.button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`py-4 px-1 border-b-2 font-medium text-sm relative ${
                              activeTab === tab.id
                                ? `border-${tab.color}-500 text-${tab.color}-600`
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                            whileHover={{ y: -2 }}
                            whileTap={{ y: 0 }}
                          >
                            {tab.label}
                            {activeTab === tab.id && (
                              <motion.div
                                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-${tab.color}-500`}
                                layoutId="activeTab"
                                initial={false}
                              />
                            )}
                          </motion.button>
                        ))}
                      </nav>
                    </div>
                    
                    {/* Tab Content */}
                    <motion.div 
                      className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 h-80"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <AnimatePresence mode="wait">
                        {activeTab === 'sleep' && (
                          <motion.div
                            key="sleep"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="font-medium text-gray-800">Sleep Duration & Quality</h3>
                              <div className="text-sm text-gray-500 flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                  <span className="inline-block w-3 h-3 bg-blue-500 rounded-full"></span>
                                  <span>Hours</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="inline-block w-3 h-3 bg-purple-500 rounded-full"></span>
                                  <span>Quality</span>
                                </div>
                              </div>
                            </div>
                            <ResponsiveContainer width="100%" height={280}>
                              <AreaChart data={sleepData}>
                                <defs>
                                  <linearGradient id="sleepHours" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                  </linearGradient>
                                  <linearGradient id="sleepQuality" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" stroke="#9ca3af" />
                                <YAxis yAxisId="left" orientation="left" domain={[0, 10]} stroke="#9ca3af" />
                                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} stroke="#9ca3af" />
                                <Tooltip content={<CustomTooltip />} />
                                <Area 
                                  yAxisId="left" 
                                  type="monotone" 
                                  dataKey="hours" 
                                  stroke="#3b82f6" 
                                  fillOpacity={1} 
                                  fill="url(#sleepHours)" 
                                  name="Hours"
                                  unit="hrs"
                                />
                                <Area 
                                  yAxisId="right" 
                                  type="monotone" 
                                  dataKey="quality" 
                                  stroke="#8b5cf6" 
                                  fillOpacity={1} 
                                  fill="url(#sleepQuality)" 
                                  name="Quality"
                                  unit="%"
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </motion.div>
                        )}
                        
                        {activeTab === 'heart' && (
                          <motion.div
                            key="heart"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="font-medium text-gray-800">Heart Rate Throughout Day</h3>
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
                                <span>BPM</span>
                              </div>
                            </div>
                            <ResponsiveContainer width="100%" height={280}>
                              <AreaChart data={heartRateData}>
                                <defs>
                                  <linearGradient id="heartRate" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="time" stroke="#9ca3af" />
                                <YAxis domain={[60, 100]} stroke="#9ca3af" />
                                <Tooltip content={<CustomTooltip />} />
                                <Area 
                                  type="monotone" 
                                  dataKey="rate" 
                                  stroke="#ef4444" 
                                  fillOpacity={1} 
                                  fill="url(#heartRate)" 
                                  name="Heart Rate"
                                  unit=" bpm"
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </motion.div>
                        )}
                        
                        {activeTab === 'activity' && (
                          <motion.div
                            key="activity"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="font-medium text-gray-800">Daily Activity</h3>
                              <div className="text-sm text-gray-500 flex items-center gap-3">
                                <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                                <span>Steps</span>
                                <span className="inline-block w-3 h-3 bg-orange-500 rounded-full"></span>
                                <span>Calories</span>
                              </div>
                            </div>
                            <ResponsiveContainer width="100%" height={280}>
                              <BarChart data={activityData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis yAxisId="left" orientation="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip />
                                <Legend />
                                <Bar yAxisId="left" dataKey="steps" fill="#22c55e" name="Steps" />
                                <Bar yAxisId="right" dataKey="calories" fill="#f97316" name="Calories" />
                              </BarChart>
                            </ResponsiveContainer>
                          </motion.div>
                        )}
                        
                        {activeTab === 'stress' && (
                          <motion.div
                            key="stress"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="font-medium text-gray-800">Stress Levels</h3>
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <span className="inline-block w-3 h-3 bg-amber-500 rounded-full"></span>
                                <span>Stress Level</span>
                              </div>
                            </div>
                            <ResponsiveContainer width="100%" height={280}>
                              <AreaChart data={stressData}>
                                <defs>
                                  <linearGradient id="stressLevels" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="day" stroke="#9ca3af" />
                                <YAxis domain={[0, 100]} stroke="#9ca3af" />
                                <Tooltip />
                                <Area 
                                  type="monotone" 
                                  dataKey="level" 
                                  stroke="#f59e0b" 
                                  fillOpacity={1} 
                                  fill="url(#stressLevels)" 
                                  name="Stress Level"
                                  unit=""
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                    
                    <motion.div 
                      className="mt-6 pt-6 border-t border-gray-100"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">
                          <strong>Note:</strong> {dataSource === 'connected' 
                            ? "This data is synced from Google Fit and represents your child's health metrics." 
                            : "This is sample data for demonstration purposes only."}
                          {dataSource === 'connected' && " Consult with a healthcare professional for any concerns about your child's health patterns."}
                        </p>
                        
                        {dataSource === 'dummy' && (
                          <motion.button
                            onClick={() => setShowDataOptions(true)}
                            className="text-sm text-blue-600 hover:text-blue-800 px-3 py-1 rounded-full hover:bg-blue-50 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Connect Real Device
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HealthMonitorModal; 