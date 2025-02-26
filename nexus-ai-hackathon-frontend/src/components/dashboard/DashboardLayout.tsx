import React, { ReactNode } from 'react';
import { ArrowLeftIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import DateRangePicker from './DateRangePicker';

interface DashboardLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  isLoading: boolean;
  error: string | null;
  onBackClick: () => void;
  onGenerateReportClick: () => void;
  onDateRangeChange: (range: { start: Date; end: Date }) => void;
  dateRange: { start: Date; end: Date };
  extraButtons?: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  subtitle,
  children,
  isLoading,
  error,
  onBackClick,
  onGenerateReportClick,
  onDateRangeChange,
  dateRange,
  extraButtons
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <button 
              onClick={onBackClick}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors self-start"
              aria-label="Go back"
            >
              <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
              <p className="text-gray-500">{subtitle}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <DateRangePicker 
                dateRange={dateRange}
                onChange={onDateRangeChange}
              />
              <div className="flex gap-2">
                <button
                  onClick={onGenerateReportClick}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
                >
                  <DocumentTextIcon className="w-5 h-5" />
                  <span>Generate Report</span>
                </button>
                {extraButtons}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" />
              <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
};

export default DashboardLayout; 