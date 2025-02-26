import React from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

// Define the type for report options
type ReportOption = 'includeFullChatHistory' | 'includeSentimentAnalysis' | 'includeTherapyRecommendations' | 'includeHealthData';

interface ReportOptionsFormProps {
  isGenerating: boolean;
  options: {
    includeFullChatHistory: boolean;
    includeSentimentAnalysis: boolean;
    includeTherapyRecommendations: boolean;
    includeHealthData: boolean;
  };
  onOptionChange: (option: ReportOption, value: boolean) => void;
  onGenerate: () => void;
  dateRange: { start: Date; end: Date };
  hasHealthData: boolean;
}

const ReportOptionsForm: React.FC<ReportOptionsFormProps> = ({
  isGenerating,
  options,
  onOptionChange,
  onGenerate,
  dateRange,
  hasHealthData
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <div className="mb-8">
        <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <DocumentTextIcon className="w-10 h-10 text-teal-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">Generate Professional Assessment Report</h3>
        <p className="text-gray-600 text-center">
          Create a comprehensive therapeutic assessment report for mental health professionals from {formatDate(dateRange.start)} to {formatDate(dateRange.end)}.
        </p>
      </div>
      
      <div className="space-y-6">
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Report Contents</h4>
          <div className="space-y-3">
            <CheckboxOption
              id="include-sentiment"
              label="Sentiment Analysis"
              description="Detailed analysis of emotional patterns and linguistic markers."
              checked={options.includeSentimentAnalysis}
              onChange={(checked) => onOptionChange('includeSentimentAnalysis', checked)}
            />
            
            {hasHealthData && (
              <CheckboxOption
                id="include-health-pro"
                label="Physiological Data"
                description="Sleep, activity, heart rate variability, and stress biomarkers with clinical significance."
                checked={options.includeHealthData}
                onChange={(checked) => onOptionChange('includeHealthData', checked)}
              />
            )}
            
            <CheckboxOption
              id="include-therapy-rec"
              label="Therapeutic Recommendations"
              description="Evidence-based intervention suggestions based on identified patterns."
              checked={options.includeTherapyRecommendations}
              onChange={(checked) => onOptionChange('includeTherapyRecommendations', checked)}
            />
            
            <CheckboxOption
              id="include-chat"
              label="Conversation Excerpts"
              description="Selected dialogue from therapeutic conversations."
              checked={options.includeFullChatHistory}
              onChange={(checked) => onOptionChange('includeFullChatHistory', checked)}
            />
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="w-full px-4 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:bg-teal-300 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating Report...</span>
              </>
            ) : (
              <>
                <DocumentTextIcon className="w-5 h-5" />
                <span>Generate Professional Report</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

// Checkbox option component for reuse
const CheckboxOption: React.FC<{
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ id, label, description, checked, onChange }) => (
  <div className="flex items-start">
    <input 
      type="checkbox" 
      id={id} 
      className="mt-1 h-4 w-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500" 
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    <label htmlFor={id} className="ml-2 block text-gray-700">
      <span className="font-medium">{label}</span>
      <p className="text-sm text-gray-500">{description}</p>
    </label>
  </div>
);

export default ReportOptionsForm; 