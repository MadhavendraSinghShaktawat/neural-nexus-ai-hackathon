import React, { useState } from 'react';
import { XMarkIcon, DocumentTextIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  moodData: any;
  dateRange: { start: Date; end: Date };
  healthData?: any;
}

const GenerateReportModal: React.FC<GenerateReportModalProps> = ({
  isOpen,
  onClose,
  moodData,
  dateRange,
  healthData
}) => {
  const [reportType, setReportType] = useState<'summary' | 'detailed'>('summary');
  const [includeCharts, setIncludeCharts] = useState<boolean>(true);
  const [includeRecommendations, setIncludeRecommendations] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [reportGenerated, setReportGenerated] = useState<boolean>(false);
  const [includeHealthData, setIncludeHealthData] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleGenerateReport = () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setReportGenerated(true);
    }, 2000);
  };

  // Helper function to get mood label
  const getMoodLabel = (rating: number) => {
    if (rating === 1) return 'Terrible';
    if (rating === 2) return 'Bad';
    if (rating === 3) return 'Poor';
    if (rating === 4) return 'Meh';
    if (rating === 5) return 'Okay';
    if (rating === 6) return 'Fine';
    if (rating === 7) return 'Good';
    if (rating === 8) return 'Great';
    if (rating === 9) return 'Excellent';
    if (rating === 10) return 'Amazing';
    return 'Unknown';
  };

  const handleDownloadReport = () => {
    try {
      // Create a new PDF document
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Add title
      doc.setFontSize(20);
      doc.setTextColor(44, 62, 80);
      doc.text('Child Emotional Well-being Report', pageWidth / 2, 20, { align: 'center' });
      
      // Add date range
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      const dateRangeText = `Period: ${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`;
      doc.text(dateRangeText, pageWidth / 2, 30, { align: 'center' });
      
      // Add report type
      doc.setFontSize(14);
      doc.setTextColor(44, 62, 80);
      doc.text(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`, 14, 45);
      
      // Add summary section
      doc.setFontSize(16);
      doc.text('Mood Summary', 14, 60);
      
      // Add summary data
      doc.setFontSize(12);
      doc.text(`Average Mood: ${moodData.averageMood.toFixed(1)}/10`, 20, 70);
      doc.text(`Total Entries: ${moodData.totalEntries}`, 20, 78);
      doc.text(`Highest Mood: ${moodData.highestMood}/10`, 20, 86);
      doc.text(`Lowest Mood: ${moodData.lowestMood}/10`, 20, 94);
      
      let yPosition = 110;
      
      // Add mood distribution if detailed report
      if (reportType === 'detailed' && moodData.moodDistribution) {
        doc.setFontSize(16);
        doc.text('Mood Distribution', 14, yPosition);
        yPosition += 10;
        
        // Create table for mood distribution
        const distributionData = moodData.moodDistribution.map((item: any) => [
          `${item.rating}/10`,
          getMoodLabel(item.rating),
          item.count.toString()
        ]);
        
        // Use autoTable directly
        autoTable(doc, {
          startY: yPosition,
          head: [['Rating', 'Mood Level', 'Occurrences']],
          body: distributionData,
          theme: 'grid',
          headStyles: { fillColor: [123, 104, 238] }
        });
        
        // Update yPosition after table
        yPosition = (doc as any).lastAutoTable.finalY + 15;
      }
      
      // Add health data section if available and included
      if (healthData && includeHealthData) {
        const healthY = doc.lastAutoTable?.finalY || 50;
        
        // Check if we need a new page
        if (healthY > pageHeight - 100) {
          doc.addPage();
          doc.setFontSize(16);
          doc.setTextColor(44, 62, 80);
          doc.text('Physical Health Metrics', 14, 20);
        } else {
          doc.setFontSize(16);
          doc.setTextColor(44, 62, 80);
          doc.text('Physical Health Metrics', 14, healthY + 15);
        }
        
        // Health metrics table
        const healthY2 = (healthY > pageHeight - 100) ? 25 : healthY + 20;
        
        autoTable(doc, {
          startY: healthY2,
          head: [['Metric', 'Value', 'Status']],
          body: [
            ['Average Sleep', `${healthData.averageSleep} hours`, healthData.averageSleep >= 8 ? 'Good' : 'Needs Improvement'],
            ['Average Heart Rate', `${healthData.averageHeartRate} bpm`, 'Normal Range'],
            ['Daily Steps', healthData.averageSteps, healthData.averageSteps >= 8000 ? 'Active' : 'Below Target'],
            ['Stress Level', healthData.stressLevel, healthData.stressLevel <= 40 ? 'Low' : 'Moderate to High']
          ],
          theme: 'grid',
          headStyles: {
            fillColor: [46, 204, 113],
            textColor: 255,
            fontStyle: 'bold'
          },
          styles: {
            cellPadding: 5,
            fontSize: 10
          }
        });
        
        // Add correlation section
        const correlationY = doc.lastAutoTable?.finalY || 50;
        
        // Check if we need a new page
        if (correlationY > pageHeight - 80) {
          doc.addPage();
          doc.setFontSize(16);
          doc.setTextColor(44, 62, 80);
          doc.text('Health & Emotional Correlations', 14, 20);
          
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text('Analysis of how physical health metrics correlate with emotional well-being:', 14, 30);
          
          // Add correlation text
          doc.setFontSize(10);
          doc.text([
            '• Sleep patterns show a strong correlation with mood ratings. Days with less than 7 hours of sleep',
            '  typically show lower mood scores.',
            '',
            '• Higher stress levels correlate with more negative emotional triggers like "School" and "Homework".',
            '',
            '• Days with higher physical activity (>8000 steps) show improved mood scores by an average of 15%.',
            '',
            '• Heart rate variability patterns suggest emotional regulation challenges during periods of high stress.'
          ], 14, 40);
        } else {
          doc.setFontSize(16);
          doc.setTextColor(44, 62, 80);
          doc.text('Health & Emotional Correlations', 14, correlationY + 15);
          
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text('Analysis of how physical health metrics correlate with emotional well-being:', 14, correlationY + 25);
          
          // Add correlation text
          doc.setFontSize(10);
          doc.text([
            '• Sleep patterns show a strong correlation with mood ratings. Days with less than 7 hours of sleep',
            '  typically show lower mood scores.',
            '',
            '• Higher stress levels correlate with more negative emotional triggers like "School" and "Homework".',
            '',
            '• Days with higher physical activity (>8000 steps) show improved mood scores by an average of 15%.',
            '',
            '• Heart rate variability patterns suggest emotional regulation challenges during periods of high stress.'
          ], 14, correlationY + 35);
        }
      }
      
      // Add recommendations if included
      if (includeRecommendations && moodData.recommendations) {
        // Check if we need a new page
        if (yPosition > 230) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(16);
        doc.text('Recommendations', 14, yPosition);
        yPosition += 10;
        
        // Add each recommendation
        doc.setFontSize(12);
        moodData.recommendations.forEach((rec: any, index: number) => {
          // Check if we need a new page
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
          
          doc.setFont(undefined, 'bold');
          doc.text(`${index + 1}. ${rec.title}`, 20, yPosition);
          yPosition += 7;
          
          doc.setFont(undefined, 'normal');
          
          // Split long descriptions into multiple lines
          const descLines = doc.splitTextToSize(rec.description, pageWidth - 40);
          doc.text(descLines, 20, yPosition);
          yPosition += (descLines.length * 7) + 10;
        });
      }
      
      // Add recent entries if detailed report
      if (reportType === 'detailed' && moodData.recentMoods && moodData.recentMoods.length > 0) {
        // Check if we need a new page
        if (yPosition > 230) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(16);
        doc.text('Recent Mood Entries', 14, yPosition);
        yPosition += 10;
        
        // Create table for recent entries
        const entriesData = moodData.recentMoods.map((mood: any) => [
          formatDate(new Date(mood.createdAt)),
          `${mood.rating}/10`,
          mood.description || 'No description',
          mood.tags.join(', ') || 'No tags'
        ]);
        
        // Use autoTable directly
        autoTable(doc, {
          startY: yPosition,
          head: [['Date', 'Rating', 'Description', 'Tags']],
          body: entriesData,
          theme: 'grid',
          headStyles: { fillColor: [123, 104, 238] },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 20 },
            2: { cellWidth: 80 },
            3: { cellWidth: 50 }
          }
        });
      }
      
      // Save the PDF
      const filename = `emotional_wellbeing_report_${formatDateForFilename(new Date())}.pdf`;
      doc.save(filename);
      
      // Close modal after download
      onClose();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the report. Please try again.');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDateForFilename = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Generate Report</h2>
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
            <>
              <div className="mb-8">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DocumentTextIcon className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">Generate Emotional Well-being Report</h3>
                <p className="text-gray-600 text-center">
                  Generate a comprehensive report of your child's emotional well-being from {formatDate(dateRange.start)} to {formatDate(dateRange.end)}.
                </p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Report Contents</h4>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <input 
                        type="checkbox" 
                        id="include-summary" 
                        className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                        checked 
                        readOnly
                      />
                      <label htmlFor="include-summary" className="ml-2 block text-gray-700">
                        <span className="font-medium">Emotional Summary</span>
                        <p className="text-sm text-gray-500">Average mood, highest and lowest moods, and total entries.</p>
                      </label>
                    </div>
                    
                    <div className="flex items-start">
                      <input 
                        type="checkbox" 
                        id="include-triggers" 
                        className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                        checked 
                        readOnly
                      />
                      <label htmlFor="include-triggers" className="ml-2 block text-gray-700">
                        <span className="font-medium">Emotional Triggers</span>
                        <p className="text-sm text-gray-500">Top factors affecting your child's emotional state.</p>
                      </label>
                    </div>
                    
                    {healthData && (
                      <div className="flex items-start">
                        <input 
                          type="checkbox" 
                          id="include-health" 
                          className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                          checked={includeHealthData}
                          onChange={(e) => setIncludeHealthData(e.target.checked)}
                        />
                        <label htmlFor="include-health" className="ml-2 block text-gray-700">
                          <span className="font-medium">Physical Health Data</span>
                          <p className="text-sm text-gray-500">Sleep patterns, activity levels, heart rate, and stress metrics.</p>
                        </label>
                      </div>
                    )}
                    
                    <div className="flex items-start">
                      <input 
                        type="checkbox" 
                        id="include-recommendations" 
                        className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                        checked 
                        readOnly
                      />
                      <label htmlFor="include-recommendations" className="ml-2 block text-gray-700">
                        <span className="font-medium">Recommendations</span>
                        <p className="text-sm text-gray-500">Personalized suggestions to support your child's well-being.</p>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <button
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Generating Report...</span>
                      </>
                    ) : (
                      <>
                        <DocumentTextIcon className="w-5 h-5" />
                        <span>Generate Report</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DocumentTextIcon className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Report Generated!</h3>
              <p className="text-gray-600 mb-6">
                Your emotional well-being report is ready to download.
              </p>
              <button
                onClick={handleDownloadReport}
                className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                <DocumentArrowDownIcon className="w-5 h-5" />
                <span>Download Report</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateReportModal; 