import React, { useState } from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';

interface DateRangePickerProps {
  dateRange: { start: Date; end: Date };
  onChange: (range: { start: Date; end: Date }) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ dateRange, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const presetRanges = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 90 days', days: 90 },
    { label: 'This year', days: 365 }
  ];

  const handlePresetClick = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    
    onChange({ start, end });
    setIsOpen(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
      >
        <CalendarIcon className="w-5 h-5 text-gray-500" />
        <span className="text-gray-700">
          {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
        </span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <div className="p-3 border-b border-gray-100">
            <h3 className="font-medium text-gray-700">Select Range</h3>
          </div>
          <div className="p-3 space-y-2">
            {presetRanges.map((range) => (
              <button
                key={range.label}
                onClick={() => handlePresetClick(range.days)}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md transition-colors"
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker; 