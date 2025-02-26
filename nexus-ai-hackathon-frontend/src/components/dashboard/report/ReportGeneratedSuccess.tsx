import React from 'react';
import { DocumentTextIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

interface ReportGeneratedSuccessProps {
  onDownload: () => void;
}

const ReportGeneratedSuccess: React.FC<ReportGeneratedSuccessProps> = ({ onDownload }) => {
  return (
    <div className="text-center py-6">
      <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <DocumentTextIcon className="w-10 h-10 text-teal-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Report Generated!</h3>
      <p className="text-gray-600 mb-6">
        Your professional assessment report is ready to download.
      </p>
      <button
        onClick={onDownload}
        className="px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 mx-auto"
      >
        <DocumentArrowDownIcon className="w-5 h-5" />
        <span>Download Report</span>
      </button>
    </div>
  );
};

export default ReportGeneratedSuccess; 