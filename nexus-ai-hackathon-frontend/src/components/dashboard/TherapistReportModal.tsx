import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import ReportOptionsForm from './report/ReportOptionsForm';
import ReportGeneratedSuccess from './report/ReportGeneratedSuccess';
import { generateTherapistReport } from '../../utils/report-generators/therapist-report-generator';
import { TherapyRecommendation, SentimentAnalysisData } from '../../types/report-types';
import { mockSentimentData, mockTherapyRecommendations } from '../../utils/mock-data/report-mock-data';

interface TherapistReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  moodData: any;
  chatHistory: any[];
  dateRange: { start: Date; end: Date };
  healthData?: any;
}

// Define the type for report options
type ReportOption = 'includeFullChatHistory' | 'includeSentimentAnalysis' | 'includeTherapyRecommendations' | 'includeHealthData';

const TherapistReportModal: React.FC<TherapistReportModalProps> = ({
  isOpen,
  onClose,
  moodData,
  chatHistory,
  dateRange,
  healthData
}) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [reportGenerated, setReportGenerated] = useState<boolean>(false);
  const [reportOptions, setReportOptions] = useState({
    includeFullChatHistory: true,
    includeSentimentAnalysis: true,
    includeTherapyRecommendations: true,
    includeHealthData: true
  });

  if (!isOpen) return null;

  const handleGenerateReport = () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setReportGenerated(true);
    }, 2000);
  };

  const handleDownloadReport = () => {
    try {
      // Get mock data or real data
      const sentimentData: SentimentAnalysisData = mockSentimentData;
      const therapyRecommendations: TherapyRecommendation[] = mockTherapyRecommendations;
      
      // Generate the PDF report using the utility function
      generateTherapistReport({
        moodData,
        chatHistory,
        dateRange,
        healthData: reportOptions.includeHealthData ? healthData || getDefaultHealthData() : undefined,
        sentimentData: reportOptions.includeSentimentAnalysis ? sentimentData : undefined,
        therapyRecommendations: reportOptions.includeTherapyRecommendations ? therapyRecommendations : undefined,
        includeFullChatHistory: reportOptions.includeFullChatHistory
      });
      
      // Close modal after download
      onClose();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the report. Please try again.');
    }
  };

  // Generate default health data if not provided
  const getDefaultHealthData = () => {
    return {
      averageSleep: 7.2,
      sleepQuality: 68,
      averageSteps: 6500,
      averageHeartRate: 78,
      hrvScore: 45,
      stressLevel: 62
    };
  };

  // Handle option changes - fixed type to match ReportOptionsForm props
  const handleOptionChange = (option: ReportOption, value: boolean) => {
    setReportOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Generate Therapist Report</h2>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {!reportGenerated ? (
            <ReportOptionsForm 
              isGenerating={isGenerating}
              options={reportOptions}
              onOptionChange={handleOptionChange}
              onGenerate={handleGenerateReport}
              dateRange={dateRange}
              hasHealthData={!!healthData}
            />
          ) : (
            <ReportGeneratedSuccess onDownload={handleDownloadReport} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TherapistReportModal; 