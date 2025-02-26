import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  PaperAirplaneIcon, 
  MicrophoneIcon,
  TrashIcon,
  XMarkIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

interface Message {
  id: string;
  userId: string;
  message: string;
  response?: string;
  timestamp: string;
  isLoading?: boolean;
}

const STORAGE_KEY = 'happybuddy_chat_history';
const API_BASE_URL = 'http://localhost:3000/api';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, onClose, onConfirm, title, message 
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Add loading state for chat history
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Add state for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Add state for speech recognition and synthesis
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Add these new state variables
  const [continuousListening, setContinuousListening] = useState(false);
  const [silenceTimer, setSilenceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const lastSpeechRef = useRef<number>(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    // Auto focus input on mount
    inputRef.current?.focus();
  }, [messages]);

  useEffect(() => {
    const loadChatHistory = async () => {
      setIsLoadingHistory(true);
      let localMessages: Message[] = [];
      
      try {
        // Load from localStorage first
        const cachedHistory = localStorage.getItem(STORAGE_KEY);
        if (cachedHistory) {
          try {
            localMessages = JSON.parse(cachedHistory);
            setMessages(localMessages);
            console.log('Loaded from cache:', localMessages);
          } catch (e) {
            console.error('Error parsing cached history:', e);
          }
        }

        // Fetch from API
        const response = await fetch(`${API_BASE_URL}/chat/history/user123`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        // Ensure data is an array
        const history = Array.isArray(data) ? data : [data];
        
        // Transform and sort messages
        const sortedHistory = history
          .filter((msg: any) => msg && msg.message) // Filter out invalid messages
          .map((msg: any) => ({
            id: msg.timestamp || new Date().toISOString(),
            userId: msg.userId || 'user123',
            message: msg.message,
            response: msg.response,
            timestamp: msg.timestamp || new Date().toISOString(),
            isLoading: false
          }))
          .sort((a: Message, b: Message) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );

        console.log('Processed history:', sortedHistory);

        if (sortedHistory.length > 0) {
          setMessages(sortedHistory);
          // Update cache with new data
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedHistory));
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
        // Keep using cached data if API fails
        if (localMessages.length > 0) {
          console.log('Falling back to cached messages');
          setMessages(localMessages);
        }
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadChatHistory();
  }, []);

  // Update localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Handle textarea height
  const handleTextAreaHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    setInputMessage(textarea.value);
  };

  // Check if speech recognition and synthesis are supported
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionAPI();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true; // Enable continuous mode
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          // Get the latest result
          const resultIndex = event.results.length - 1;
          const transcript = event.results[resultIndex][0].transcript;
          
          // Update the input field
          setInputMessage(transcript);
          lastSpeechRef.current = Date.now();
          
          // Auto-adjust textarea height
          if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
          }
          
          // If this is a final result and we detect a pause
          if (event.results[resultIndex].isFinal && continuousListening) {
            // Clear any existing timer
            if (silenceTimer) {
              clearTimeout(silenceTimer);
            }
            
            // Set a new timer to detect silence
            const timer = setTimeout(() => {
              // If there's something to send and we haven't spoken for a while
              if (transcript.trim() && Date.now() - lastSpeechRef.current > 1500) {
                // Create a synthetic form submit event
                const formEvent = new Event('submit', { cancelable: true }) as unknown as React.FormEvent;
                handleSendMessage(formEvent);
                
                // Clear the input after sending
                setInputMessage('');
                
                // Restart recognition for the next utterance
                if (recognitionRef.current && continuousListening) {
                  try {
                    recognitionRef.current.stop();
                    // Recognition will restart via onend handler
                  } catch (e) {
                    console.error('Error stopping recognition:', e);
                  }
                }
              }
            }, 1500); // 1.5 second silence detection
            
            setSilenceTimer(timer);
          }
        };
        
        recognitionRef.current.onend = () => {
          // If we're in continuous mode, restart recognition
          if (continuousListening) {
            try {
              recognitionRef.current?.start();
            } catch (e) {
              console.error('Error restarting recognition:', e);
              setIsListening(false);
              setContinuousListening(false);
            }
          } else {
            setIsListening(false);
          }
        };
        
        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error', event.error);
          
          // Only stop completely on fatal errors
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setIsListening(false);
            setContinuousListening(false);
          }
        };
        
        setSpeechEnabled(true);
      }
    }
    
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    
    return () => {
      // Clean up speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      
      // Clean up speech synthesis
      if (synthRef.current && synthRef.current.speaking) {
        synthRef.current.cancel();
      }
      
      // Clear any pending timers
      if (silenceTimer) {
        clearTimeout(silenceTimer);
      }
    };
  }, []);

  // Update the voice input handler to toggle continuous mode
  const handleVoiceInput = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      // Stop listening
      recognitionRef.current.abort();
      setIsListening(false);
      setContinuousListening(false);
      
      // Clear any pending silence timers
      if (silenceTimer) {
        clearTimeout(silenceTimer);
        setSilenceTimer(null);
      }
    } else {
      // Start continuous listening mode
      setIsListening(true);
      setContinuousListening(true);
      lastSpeechRef.current = Date.now();
      recognitionRef.current.start();
    }
  };
  
  const speakText = (text: string) => {
    if (!synthRef.current) return;
    
    // Stop any ongoing speech
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error('Speech synthesis error', event);
      setIsSpeaking(false);
    };
    
    synthRef.current.speak(utterance);
  };
  
  const stopSpeaking = () => {
    if (synthRef.current && synthRef.current.speaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const newMessage: Message = {
      id: new Date().toISOString(),
      userId: 'user123',
      message: inputMessage.trim(),
      timestamp: new Date().toISOString(),
      isLoading: true
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          userId: 'user123',
          message: newMessage.message,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      const updatedMessage = {
        ...newMessage,
        response: data.response,
        isLoading: false,
      };

      setMessages(prev => {
        const updated = prev.map(msg =>
          msg.id === newMessage.id ? updatedMessage : msg
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });

      // Speak the response
      if (data.response) {
        speakText(data.response);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => {
        const updated = prev.map(msg =>
          msg.id === newMessage.id
            ? {
                ...msg,
                response: 'Sorry, I had trouble processing that. Could you try again?',
                isLoading: false,
              }
            : msg
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    setIsDeleting(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/chat/history`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user123'
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Delete response:', data);
      
      // Clear messages from state
      setMessages([]);
      
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEY);
      
    } catch (error) {
      console.error('Error clearing chat history:', error);
      // Show error toast or notification here
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-800">HappyBuddy</h1>
              <p className="text-sm text-gray-500">Your AI friend is here to help</p>
            </div>
            
            <div className="flex items-center gap-2">
              {isLoadingHistory && (
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
              
              {!isLoadingHistory && messages.length > 0 && (
                <button 
                  onClick={() => setIsDeleteModalOpen(true)}
                  disabled={isDeleting}
                  className={classNames(
                    "p-2 rounded-full transition-colors",
                    "text-gray-500 hover:bg-red-50 hover:text-red-500",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  aria-label="Clear chat history"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="container mx-auto px-4 pt-24 pb-32">
        <div className="max-w-3xl mx-auto">
          {/* Messages */}
          <div className="space-y-6">
            {isLoadingHistory ? (
              <div className="flex justify-center py-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Loading chat history...</p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                  <span className="text-3xl">👋</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome to HappyBuddy!</h2>
                <p className="text-gray-600 text-center max-w-sm">
                  I'm here to listen and help. How are you feeling today?
                </p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {/* User Message */}
                    <div className="flex justify-end">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-primary-500 text-white rounded-2xl rounded-tr-none px-6 py-4 max-w-[80%] md:max-w-[60%] shadow-sm"
                      >
                        <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                      </motion.div>
                    </div>

                    {/* Bot Response */}
                    {(msg.response || msg.isLoading) && (
                      <div className="flex justify-start">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center flex-shrink-0">
                            🤖
                          </div>
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-2xl rounded-tl-none px-6 py-4 max-w-[80%] md:max-w-[60%] shadow-sm relative"
                          >
                            {msg.isLoading ? (
                              <div className="flex gap-2 py-2">
                                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                              </div>
                            ) : (
                              <>
                                <p className="text-gray-800 whitespace-pre-wrap break-words pr-8">{msg.response}</p>
                                {synthRef.current && (
                                  <button
                                    onClick={() => isSpeaking ? stopSpeaking() : speakText(msg.response || '')}
                                    className={classNames(
                                      "absolute top-4 right-4 p-1.5 rounded-full",
                                      isSpeaking && msg.id === messages[messages.length - 1].id
                                        ? "bg-primary-100 text-primary-500"
                                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                                    )}
                                    aria-label={isSpeaking ? "Stop speaking" : "Speak message"}
                                  >
                                    {isSpeaking && msg.id === messages[messages.length - 1].id ? (
                                      <SpeakerXMarkIcon className="w-4 h-4" />
                                    ) : (
                                      <SpeakerWaveIcon className="w-4 h-4" />
                                    )}
                                  </button>
                                )}
                              </>
                            )}
                          </motion.div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSendMessage}
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-lg"
      >
        <div className="container mx-auto max-w-3xl">
          <div className="flex items-end gap-4">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={handleTextAreaHeight}
                placeholder={isListening ? "Listening..." : "Type your message..."}
                rows={1}
                className={classNames(
                  "w-full px-4 py-3 pr-12 rounded-2xl border",
                  isListening 
                    ? "border-primary-500 bg-primary-50" 
                    : "border-gray-200",
                  "focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
                  "resize-none max-h-[120px] min-h-[48px]"
                )}
                disabled={isLoading || isListening}
              />
              <button
                type="button"
                onClick={handleVoiceInput}
                disabled={!speechEnabled || isLoading}
                className={classNames(
                  "absolute right-3 bottom-3 p-1.5 rounded-full transition-colors",
                  isListening 
                    ? "bg-primary-500 text-white animate-pulse" 
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                aria-label={isListening ? "Stop listening" : "Voice input"}
              >
                <MicrophoneIcon className="w-5 h-5" />
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className={classNames(
                "p-3 rounded-full transition-all",
                "bg-primary-500 text-white shadow-lg",
                "hover:bg-primary-600 hover:shadow-primary-500/25",
                "focus:outline-none focus:ring-2 focus:ring-primary-500/20",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "flex-shrink-0"
              )}
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <ConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleClearChat}
            title="Clear Chat History"
            message="Are you sure you want to delete all chat messages? This action cannot be undone."
          />
        )}
      </AnimatePresence>
    </div>
  );
}; 