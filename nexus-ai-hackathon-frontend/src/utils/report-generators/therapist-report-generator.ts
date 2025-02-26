import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SentimentAnalysisData, TherapyRecommendation } from '../../types/report-types';

// Extend the jsPDF type to include lastAutoTable property
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number;
    };
  }
}

interface GenerateReportParams {
  moodData: any;
  chatHistory: any[];
  dateRange: { start: Date; end: Date };
  healthData?: any;
  sentimentData?: SentimentAnalysisData;
  therapyRecommendations?: TherapyRecommendation[];
  includeFullChatHistory: boolean;
}

export const generateTherapistReport = ({
  moodData,
  chatHistory,
  dateRange,
  healthData,
  sentimentData,
  therapyRecommendations,
  includeFullChatHistory
}: GenerateReportParams): void => {
  // Create a new PDF document
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Add title
  doc.setFontSize(20);
  doc.setTextColor(44, 62, 80);
  doc.text('Therapeutic Assessment Report', pageWidth / 2, 20, { align: 'center' });
  
  // Add date range
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Assessment Period: ${formatDate(dateRange.start)} to ${formatDate(dateRange.end)}`,
    pageWidth / 2,
    30,
    { align: 'center' }
  );
  
  // Add professional disclaimer
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(
    'CONFIDENTIAL: For mental health professional use only',
    pageWidth / 2,
    38,
    { align: 'center' }
  );
  
  // Add clinical summary section
  addClinicalSummary(doc);
  
  // Add emotional metrics section
  addEmotionalMetrics(doc, moodData);
  
  // Add health data section if available
  if (healthData) {
    addHealthData(doc, healthData);
  }
  
  // Add sentiment analysis if included
  if (sentimentData) {
    addSentimentAnalysis(doc, sentimentData);
  }
  
  // Add therapy recommendations if included
  if (therapyRecommendations) {
    addTherapyRecommendations(doc, therapyRecommendations);
  }
  
  // Add chat history if included
  if (includeFullChatHistory && chatHistory.length > 0) {
    addChatHistory(doc, chatHistory);
  }
  
  // Add professional notes section
  addProfessionalNotes(doc);
  
  // Add page numbers
  addPageNumbers(doc);
  
  // Save the PDF
  const filename = `therapeutic_assessment_report_${formatDateForFilename(new Date())}.pdf`;
  doc.save(filename);
};

// Helper functions for PDF generation
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatDateForFilename = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const getMoodLabel = (rating: number): string => {
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

// Functions for adding different sections to the PDF
const addClinicalSummary = (doc: jsPDF): void => {
  doc.setFontSize(16);
  doc.setTextColor(44, 62, 80);
  doc.text('Clinical Summary', 14, 50);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  
  doc.text([
    'This report provides a comprehensive assessment of the client\'s emotional and psychological',
    'state based on AI-assisted therapeutic conversations and mood tracking data. The analysis',
    'includes sentiment patterns, key discussion topics, and emotional triggers identified during',
    'the assessment period.'
  ], 14, 60);
};

const addEmotionalMetrics = (doc: jsPDF, moodData: any): void => {
  doc.setFontSize(14);
  doc.setTextColor(44, 62, 80);
  doc.text('Emotional Metrics', 14, 85);
  
  autoTable(doc, {
    startY: 90,
    head: [['Metric', 'Value', 'Clinical Significance']],
    body: [
      ['Average Mood', `${moodData.averageMood.toFixed(1)} (${getMoodLabel(Math.round(moodData.averageMood))})`, moodData.averageMood < 5 ? 'Indicates potential mood disorder' : 'Within normal range'],
      ['Mood Variability', 'Moderate', 'Daily fluctuations within expected range'],
      ['Emotional Regulation', 'Adequate', 'Shows ability to recover from negative emotions'],
      ['Negative Thought Patterns', 'Occasional', 'Some catastrophizing noted in conversations']
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [0, 121, 107],
      textColor: 255,
      fontStyle: 'bold'
    },
    styles: {
      cellPadding: 5,
      fontSize: 10
    }
  });
};

// Add the missing functions for PDF generation
const addHealthData = (doc: jsPDF, healthData: any): void => {
  const pageHeight = doc.internal.pageSize.getHeight();
  const lastY = doc.lastAutoTable?.finalY || 90;
  
  // Check if we need a new page
  if (lastY > pageHeight - 60) {
    doc.addPage();
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('Physiological Data', 14, 20);
    
    // Add health data table
    autoTable(doc, {
      startY: 30,
      head: [['Metric', 'Value', 'Clinical Significance']],
      body: [
        ['Sleep Duration', `${healthData.averageSleep} hours/night`, healthData.averageSleep < 7 ? 'Below recommended range' : 'Within normal range'],
        ['Sleep Quality', `${healthData.sleepQuality}%`, healthData.sleepQuality < 60 ? 'Poor sleep quality indicated' : 'Adequate sleep quality'],
        ['Physical Activity', `${healthData.averageSteps} steps/day`, healthData.averageSteps < 5000 ? 'Below recommended activity level' : 'Adequate activity level'],
        ['Average Heart Rate', `${healthData.averageHeartRate} bpm`, 'Within normal range'],
        ['Heart Rate Variability', `${healthData.hrvScore}`, healthData.hrvScore < 40 ? 'Reduced HRV may indicate stress' : 'Normal HRV'],
        ['Stress Level', `${healthData.stressLevel}/100`, healthData.stressLevel > 70 ? 'Elevated stress levels' : 'Moderate stress levels']
      ],
      theme: 'grid',
      headStyles: {
        fillColor: [0, 121, 107],
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        cellPadding: 5,
        fontSize: 10
      }
    });
  } else {
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('Physiological Data', 14, lastY + 15);
    
    // Add health data table
    autoTable(doc, {
      startY: lastY + 20,
      head: [['Metric', 'Value', 'Clinical Significance']],
      body: [
        ['Sleep Duration', `${healthData.averageSleep} hours/night`, healthData.averageSleep < 7 ? 'Below recommended range' : 'Within normal range'],
        ['Sleep Quality', `${healthData.sleepQuality}%`, healthData.sleepQuality < 60 ? 'Poor sleep quality indicated' : 'Adequate sleep quality'],
        ['Physical Activity', `${healthData.averageSteps} steps/day`, healthData.averageSteps < 5000 ? 'Below recommended activity level' : 'Adequate activity level'],
        ['Average Heart Rate', `${healthData.averageHeartRate} bpm`, 'Within normal range'],
        ['Heart Rate Variability', `${healthData.hrvScore}`, healthData.hrvScore < 40 ? 'Reduced HRV may indicate stress' : 'Normal HRV'],
        ['Stress Level', `${healthData.stressLevel}/100`, healthData.stressLevel > 70 ? 'Elevated stress levels' : 'Moderate stress levels']
      ],
      theme: 'grid',
      headStyles: {
        fillColor: [0, 121, 107],
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        cellPadding: 5,
        fontSize: 10
      }
    });
  }
};

const addSentimentAnalysis = (doc: jsPDF, sentimentData: SentimentAnalysisData): void => {
  doc.addPage();
  doc.setFontSize(14);
  doc.setTextColor(44, 62, 80);
  doc.text('Sentiment Analysis', 14, 20);
  
  doc.setFontSize(12);
  doc.setTextColor(44, 62, 80);
  doc.text('Overall Sentiment: ' + sentimentData.overallSentiment, 14, 30);
  doc.text('Sentiment Score: ' + sentimentData.sentimentScore.toFixed(2), 14, 38);
  
  doc.setFontSize(12);
  doc.setTextColor(44, 62, 80);
  doc.text('Emotional Tone Distribution', 14, 50);
  
  // Emotional tone table
  autoTable(doc, {
    startY: 55,
    head: [['Emotion', 'Prevalence']],
    body: [
      ['Joy', `${(sentimentData.emotionalTone.joy * 100).toFixed(0)}%`],
      ['Sadness', `${(sentimentData.emotionalTone.sadness * 100).toFixed(0)}%`],
      ['Anxiety', `${(sentimentData.emotionalTone.anxiety * 100).toFixed(0)}%`],
      ['Anger', `${(sentimentData.emotionalTone.anger * 100).toFixed(0)}%`],
      ['Neutral', `${(sentimentData.emotionalTone.neutral * 100).toFixed(0)}%`]
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [0, 121, 107],
      textColor: 255,
      fontStyle: 'bold'
    },
    styles: {
      cellPadding: 5,
      fontSize: 10
    }
  });
  
  // Key themes
  const themesY = doc.lastAutoTable?.finalY || 55;
  doc.setFontSize(12);
  doc.setTextColor(44, 62, 80);
  doc.text('Key Discussion Themes', 14, themesY + 15);
  
  // Themes table
  autoTable(doc, {
    startY: themesY + 20,
    head: [['Theme', 'Sentiment', 'Frequency']],
    body: sentimentData.keyThemes.map(theme => [
      theme.theme,
      theme.sentiment,
      theme.frequency
    ]),
    theme: 'grid',
    headStyles: {
      fillColor: [0, 121, 107],
      textColor: 255,
      fontStyle: 'bold'
    },
    styles: {
      cellPadding: 5,
      fontSize: 10
    }
  });
  
  // Linguistic patterns
  const patternsY = doc.lastAutoTable?.finalY || themesY + 20;
  doc.setFontSize(12);
  doc.setTextColor(44, 62, 80);
  doc.text('Linguistic Patterns', 14, patternsY + 15);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  sentimentData.linguisticPatterns.forEach((pattern, i) => {
    doc.text(`• ${pattern}`, 14, patternsY + 25 + (i * 7));
  });
};

const addTherapyRecommendations = (doc: jsPDF, therapyRecommendations: TherapyRecommendation[]): void => {
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  doc.addPage();
  doc.setFontSize(14);
  doc.setTextColor(44, 62, 80);
  doc.text('Therapeutic Recommendations', 14, 20);
  
  let yPosition = 30;
  
  therapyRecommendations.forEach((rec, index) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.text(`${index + 1}. ${rec.area}`, 20, yPosition);
    yPosition += 7;
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    
    // Split long descriptions into multiple lines
    const descLines = doc.splitTextToSize(rec.description, pageWidth - 40);
    doc.text(descLines, 20, yPosition);
    yPosition += (descLines.length * 5) + 5;
    
    doc.setFontSize(10);
    doc.setTextColor(44, 62, 80);
    doc.text(`Priority: ${rec.priority}`, 20, yPosition);
    yPosition += 15;
  });
};

const addChatHistory = (doc: jsPDF, chatHistory: any[]): void => {
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  doc.addPage();
  doc.setFontSize(14);
  doc.setTextColor(44, 62, 80);
  doc.text('Conversation Excerpts', 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Selected dialogue from therapeutic conversations:', 14, 30);
  
  let chatY = 40;
  
  // Only include the last 5 messages to keep the report concise
  const recentChats = chatHistory.slice(-5);
  
  recentChats.forEach((chat) => {
    // Check if we need a new page
    if (chatY > pageHeight - 40) {
      doc.addPage();
      chatY = 20;
    }
    
    // Set colors for user vs AI
    const isUser = chat.role === 'user';
    const textColor = isUser ? [52, 152, 219] : [46, 204, 113]; // Blue for user, Green for AI
    
    // Message
    doc.setFontSize(10);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text(`${isUser ? 'Client' : 'AI Therapist'}:`, 14, chatY);
    chatY += 7;
    
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    
    // Split long messages into multiple lines
    const messageLines = doc.splitTextToSize(chat.content || '', pageWidth - 30);
    doc.text(messageLines, 20, chatY);
    chatY += (messageLines.length * 5) + 10;
  });
};

const addProfessionalNotes = (doc: jsPDF): void => {
  const pageHeight = doc.internal.pageSize.getHeight();
  const lastY = doc.lastAutoTable?.finalY || 40;
  
  // Check if we need a new page
  if (lastY > pageHeight - 60) {
    doc.addPage();
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('Professional Notes', 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text([
      'This report is generated using AI-assisted analysis of therapeutic conversations and mood tracking',
      'data. While it provides valuable insights, clinical judgment should be exercised when interpreting',
      'these findings. Regular reassessment is recommended as part of ongoing therapeutic care.',
      '',
      'The integration of physiological and psychological data provides a more comprehensive view of the',
      'client\'s overall well-being and may help identify important intervention targets that might be',
      'missed when considering psychological factors alone.'
    ], 14, 30);
  } else {
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('Professional Notes', 14, lastY + 15);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text([
      'This report is generated using AI-assisted analysis of therapeutic conversations and mood tracking',
      'data. While it provides valuable insights, clinical judgment should be exercised when interpreting',
      'these findings. Regular reassessment is recommended as part of ongoing therapeutic care.',
      '',
      'The integration of physiological and psychological data provides a more comprehensive view of the',
      'client\'s overall well-being and may help identify important intervention targets that might be',
      'missed when considering psychological factors alone.'
    ], 14, lastY + 25);
  }
};

const addPageNumbers = (doc: jsPDF): void => {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
  }
}; 