import React, { useState, useRef, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, MicrophoneIcon, VideoCameraIcon, VideoCameraSlashIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

// Add this near the top of the file, after the imports
declare const process: {
  env: {
    NODE_ENV: 'development' | 'production' | 'test';
  };
};

// Character states
const CHARACTER_STATES = {
  IDLE: '/character/doraemon-idle.png',
  TALKING: '/character/doraemon-talking.png',
  LISTENING: '/character/doraemon-listening.png',
  THINKING: '/character/doraemon-thinking.png',
  HAPPY: '/character/doraemon-happy.png',
  SAD: '/character/doraemon-sad.png',
  ANGRY: '/character/doraemon-angry.png',
  SURPRISED: '/character/doraemon-surprised.png',
  SYMPATHETIC: '/character/doraemon-sympathetic.png'
};

// Update the fallback images to use a reliable source
const FALLBACK_IMAGES = {
  IDLE: 'https://raw.githubusercontent.com/madhavendra-singh/neural-nexus-ai-hackathon/main/public/character/doraemon-idle.png',
  TALKING: 'https://raw.githubusercontent.com/madhavendra-singh/neural-nexus-ai-hackathon/main/public/character/doraemon-talking.png',
  LISTENING: 'https://raw.githubusercontent.com/madhavendra-singh/neural-nexus-ai-hackathon/main/public/character/doraemon-listening.png',
  THINKING: 'https://raw.githubusercontent.com/madhavendra-singh/neural-nexus-ai-hackathon/main/public/character/doraemon-thinking.png',
  HAPPY: 'https://raw.githubusercontent.com/madhavendra-singh/neural-nexus-ai-hackathon/main/public/character/doraemon-happy.png',
  SAD: 'https://raw.githubusercontent.com/madhavendra-singh/neural-nexus-ai-hackathon/main/public/character/doraemon-sad.png',
  ANGRY: 'https://raw.githubusercontent.com/madhavendra-singh/neural-nexus-ai-hackathon/main/public/character/doraemon-angry.png',
  SURPRISED: 'https://raw.githubusercontent.com/madhavendra-singh/neural-nexus-ai-hackathon/main/public/character/doraemon-surprised.png',
  SYMPATHETIC: 'https://raw.githubusercontent.com/madhavendra-singh/neural-nexus-ai-hackathon/main/public/character/doraemon-sympathetic.png'
};

// Add this constant at the top of the file, matching what's in chat-page.tsx
const API_BASE_URL = 'http://localhost:3000/api';

// Add interface for emotion detection response
interface EmotionDetectionResponse {
  success: boolean;
  emotion: 'happy' | 'sad' | 'angry' | 'surprised' | 'neutral';
  confidence: number;
}

// Add these types for lip sync
interface LipSyncFrame {
  time: number;
  value: string;
}

interface LipSyncData {
  mouthCues: LipSyncFrame[];
}

// Add these constants at the top of the file
const RETRY_DELAY = 2000; // 2 seconds
const MAX_RETRIES = 3;

// Add these improved fallback responses
const FALLBACK_RESPONSES = {
  GREETING: [
    "Hi there! How are you feeling today?",
    "Hello! It's nice to see you. What would you like to talk about?",
    "Hey! I'm here to chat with you. How's your day going?"
  ],
  EMOTIONS: {
    HAPPY: [
      "I'm glad you're feeling good! What's making you happy today?",
      "That's wonderful to hear! What's something that made you smile recently?",
      "It's great that you're feeling positive! Would you like to share what's going well?"
    ],
    SAD: [
      "I'm sorry you're feeling down. Would you like to talk about what's bothering you?",
      "It's okay to feel sad sometimes. Is there something specific that's making you feel this way?",
      "I'm here for you. Sometimes talking about our feelings can help us feel better."
    ],
    ANGRY: [
      "I can understand feeling frustrated. What happened that made you feel this way?",
      "It sounds like you're upset about something. Would you like to talk about it?",
      "When we're angry, it helps to take deep breaths. Would you like to try that together?"
    ],
    ANXIOUS: [
      "It sounds like you might be feeling worried. What's on your mind?",
      "When we feel anxious, focusing on our breathing can help. Would you like to try a quick breathing exercise?",
      "I'm here to listen if you want to talk about what's making you feel anxious."
    ]
  },
  SCHOOL: [
    "School can be both fun and challenging. What's been happening at school lately?",
    "I'd love to hear about what you're learning in school. What's your favorite subject?",
    "How are things going with your friends and teachers at school?"
  ],
  FRIENDS: [
    "Friends are so important! Would you like to tell me more about your friends?",
    "What kind of things do you enjoy doing with your friends?",
    "Having good friends is wonderful. How do you and your friends support each other?"
  ],
  FAMILY: [
    "Family relationships are important. How are things at home?",
    "What kinds of activities do you enjoy doing with your family?",
    "Families come in all shapes and sizes. Would you like to tell me about yours?"
  ],
  HOBBIES: [
    "What kinds of activities do you enjoy in your free time?",
    "Hobbies are a great way to relax and have fun. What are some of yours?",
    "I'd love to hear about what you like to do for fun!"
  ],
  GENERAL: [
    "That's interesting! Can you tell me more about that?",
    "I'd like to hear more about your thoughts on this.",
    "Thank you for sharing that with me. How does that make you feel?",
    "I'm here to listen. Would you like to talk more about this?",
    "That's a great point. What else is on your mind?"
  ]
};

// Add this function to detect user emotion
const detectEmotion = async (text: string): Promise<EmotionDetectionResponse | null> => {
  try {
    console.log("Detecting emotion for:", text);
    
    const response = await fetch(`${API_BASE_URL}/expression/detect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        text: text
      })
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Emotion detection result:", data);
    return data;
  } catch (error) {
    console.error("Error detecting emotion:", error);
    return null;
  }
};

// Update the handleApiError function to use the improved fallback responses
const handleApiError = (error: any, message: string) => {
  console.error('API Error:', error);
  
  // Check if it's a quota exceeded error
  const isQuotaError = error.message && (
    error.message.includes('429') || 
    error.message.includes('quota') || 
    error.message.includes('exhausted')
  );
  
  let fallbackResponse = '';
  
  if (isQuotaError) {
    fallbackResponse = "I'm sorry, but I've reached my conversation limit for now. " +
      "Please try again in a little while when I've had a chance to rest.";
  } else {
    // Generate a more natural fallback response based on the message content
    const messageLower = message.toLowerCase();
    
    // Select appropriate response category
    if (messageLower.includes('hello') || messageLower.includes('hi') || messageLower.includes('hey')) {
      fallbackResponse = FALLBACK_RESPONSES.GREETING[Math.floor(Math.random() * FALLBACK_RESPONSES.GREETING.length)];
    } 
    else if (messageLower.includes('happy') || messageLower.includes('good') || messageLower.includes('great') || messageLower.includes('wonderful')) {
      fallbackResponse = FALLBACK_RESPONSES.EMOTIONS.HAPPY[Math.floor(Math.random() * FALLBACK_RESPONSES.EMOTIONS.HAPPY.length)];
    }
    else if (messageLower.includes('sad') || messageLower.includes('unhappy') || messageLower.includes('down') || messageLower.includes('depressed')) {
      fallbackResponse = FALLBACK_RESPONSES.EMOTIONS.SAD[Math.floor(Math.random() * FALLBACK_RESPONSES.EMOTIONS.SAD.length)];
    }
    else if (messageLower.includes('angry') || messageLower.includes('mad') || messageLower.includes('upset') || messageLower.includes('frustrated')) {
      fallbackResponse = FALLBACK_RESPONSES.EMOTIONS.ANGRY[Math.floor(Math.random() * FALLBACK_RESPONSES.EMOTIONS.ANGRY.length)];
    }
    else if (messageLower.includes('worried') || messageLower.includes('anxious') || messageLower.includes('nervous') || messageLower.includes('scared')) {
      fallbackResponse = FALLBACK_RESPONSES.EMOTIONS.ANXIOUS[Math.floor(Math.random() * FALLBACK_RESPONSES.EMOTIONS.ANXIOUS.length)];
    }
    else if (messageLower.includes('school') || messageLower.includes('class') || messageLower.includes('teacher') || messageLower.includes('homework')) {
      fallbackResponse = FALLBACK_RESPONSES.SCHOOL[Math.floor(Math.random() * FALLBACK_RESPONSES.SCHOOL.length)];
    }
    else if (messageLower.includes('friend') || messageLower.includes('friends') || messageLower.includes('buddy') || messageLower.includes('pal')) {
      fallbackResponse = FALLBACK_RESPONSES.FRIENDS[Math.floor(Math.random() * FALLBACK_RESPONSES.FRIENDS.length)];
    }
    else if (messageLower.includes('family') || messageLower.includes('mom') || messageLower.includes('dad') || messageLower.includes('parent') || messageLower.includes('sister') || messageLower.includes('brother')) {
      fallbackResponse = FALLBACK_RESPONSES.FAMILY[Math.floor(Math.random() * FALLBACK_RESPONSES.FAMILY.length)];
    }
    else if (messageLower.includes('hobby') || messageLower.includes('game') || messageLower.includes('play') || messageLower.includes('fun') || messageLower.includes('like to')) {
      fallbackResponse = FALLBACK_RESPONSES.HOBBIES[Math.floor(Math.random() * FALLBACK_RESPONSES.HOBBIES.length)];
    }
    else {
      fallbackResponse = FALLBACK_RESPONSES.GENERAL[Math.floor(Math.random() * FALLBACK_RESPONSES.GENERAL.length)];
    }
  }
  
  return {
    userId: "user123",
    message: message,
    response: fallbackResponse,
    timestamp: new Date().toISOString()
  };
};

export const VideoChatPage: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [botResponse, setBotResponse] = useState('');
  const [isTalking, setIsTalking] = useState(false);
  const [characterState, setCharacterState] = useState<keyof typeof CHARACTER_STATES>('IDLE');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const [imageError, setImageError] = useState(false);
  const [useMockResponses, setUseMockResponses] = useState(false);
  const [is3DMode, setIs3DMode] = useState(false);
  const [lipSyncData, setLipSyncData] = useState<LipSyncData | null>(null);
  const [currentMouthShape, setCurrentMouthShape] = useState<string>('X');
  const lipSyncTimerRef = useRef<number | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionAPI();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        
        // Create a variable to store the latest transcript
        let finalTranscript = '';
        
        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          // Get the latest transcript
          const transcript = event.results[0][0].transcript;
          console.log("Recognized speech:", transcript);
          
          // Update the final transcript
          finalTranscript = transcript;
          
          // Update the UI
          setUserMessage(finalTranscript);
          setCharacterState('LISTENING');
        };
        
        recognitionRef.current.onend = () => {
          console.log("Speech recognition ended, final transcript:", finalTranscript);
          setIsListening(false);
          
          // If we have a message, send it to the API
          if (finalTranscript && finalTranscript.trim()) {
            console.log("Sending message:", finalTranscript);
            // Use the final transcript directly
            handleSendMessage(finalTranscript);
          } else {
            setCharacterState('IDLE');
          }
        };
        
        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
          setCharacterState('IDLE');
        };
      }
    }
    
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    
    return () => {
      // Clean up
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      
      if (synthRef.current && synthRef.current.speaking) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Initialize camera
  useEffect(() => {
    if (cameraActive) {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [cameraActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const toggleCamera = () => {
    setCameraActive(!cameraActive);
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      console.log("Speech recognition not available");
      return;
    }
    
    if (isListening) {
      console.log("Stopping speech recognition");
      recognitionRef.current.abort();
      setIsListening(false);
      setCharacterState('IDLE');
    } else {
      console.log("Starting speech recognition");
      setIsListening(true);
      setUserMessage('');
      setCharacterState('LISTENING');
      
      try {
        // Reset the recognition before starting
        if (recognitionRef.current) {
          recognitionRef.current.abort();
          setTimeout(() => {
            if (recognitionRef.current) {
              recognitionRef.current.start();
            }
          }, 100);
        }
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        setIsListening(false);
        setCharacterState('IDLE');
      }
    }
  };

  const testApiConnection = async () => {
    try {
      console.log("Testing API connection to:", `${API_BASE_URL}/chat`);
      
      // Try to connect to the API
      try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: 'test-user',
            message: 'test message',
          }),
        });
        
        console.log("API test response status:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log("API test response data:", data);
          return true;
        } else {
          console.error("API test failed with status:", response.status);
          return false;
        }
      } catch (error) {
        console.error("API test error:", error);
        return false;
      }
    } catch (error) {
      console.error("API test error:", error);
      return false;
    }
  };

  // Call this function when the component mounts
  useEffect(() => {
    const checkApiConnection = async () => {
      const apiAvailable = await testApiConnection();
      setUseMockResponses(!apiAvailable);
      console.log("Using mock responses:", !apiAvailable);
    };
    
    checkApiConnection();
  }, []);

  // Update the fetchChatHistory function with retry logic
  const fetchChatHistory = async (retryCount = 0): Promise<any[]> => {
    try {
      console.log("Fetching chat history...");
      
      const response = await fetch(`${API_BASE_URL}/chat/history/user123`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.status === 429 && retryCount < MAX_RETRIES) {
        // Rate limited - wait and retry
        console.log(`Rate limited. Retrying in ${RETRY_DELAY/1000} seconds... (${retryCount + 1}/${MAX_RETRIES})`);
        setCharacterState('THINKING');
        
        // Wait for the retry delay
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        
        // Retry with incremented retry count
        return fetchChatHistory(retryCount + 1);
      }
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Chat history:", data);
      
      // If we have a previous conversation, show the last response
      if (Array.isArray(data) && data.length > 0) {
        const lastMessage = data[0]; // Get the most recent message
        setBotResponse(lastMessage.response);
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching chat history:", error);
      
      // Show a user-friendly message
      if (retryCount >= MAX_RETRIES) {
        setBotResponse("I'm experiencing some network issues right now. Let's chat anyway!");
        setCharacterState('SYMPATHETIC');
      }
      
      return [];
    }
  };

  // Call this function when the component mounts
  useEffect(() => {
    fetchChatHistory();
  }, []);

  // Update the handleSendMessage function to detect and handle generic responses
  const handleSendMessage = async (messageToSend?: string, retryCount = 0) => {
    // Use the provided message or fall back to the state
    const message = messageToSend || userMessage;
    
    if (!message || !message.trim()) {
      console.log("No message to send");
      return;
    }
    
    console.log("Processing message:", message);
    
    try {
      // Show loading state
      setBotResponse('');
      setCharacterState('THINKING');
      
      // Detect emotion first
      const emotionData = await detectEmotion(message);
      console.log("Detected emotion:", emotionData);
      
      // Set character state based on detected emotion
      if (emotionData && emotionData.success) {
        // Map the detected emotion to a character state
        const emotionToStateMap: Record<string, keyof typeof CHARACTER_STATES> = {
          'happy': 'HAPPY',
          'sad': 'SAD',
          'angry': 'ANGRY',
          'surprised': 'SURPRISED',
          'neutral': 'IDLE'
        };
        
        setCharacterState(emotionToStateMap[emotionData.emotion] || 'IDLE');
      }
      
      let response;
      
      // Always use mock responses if API is not available or if we're in fallback mode
      if (useMockResponses || retryCount >= MAX_RETRIES) {
        // Generate a fallback response based on the message
        const fallbackResponse = handleApiError(new Error("Using fallback response"), message);
        response = fallbackResponse;
      } else {
        // Try to use the real API
        console.log("Sending request to:", `${API_BASE_URL}/chat`);
        
        const apiResponse = await fetch(`${API_BASE_URL}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: 'user123',
            message: message,
          }),
        });
        
        // Handle rate limiting with exponential backoff
        if (apiResponse.status === 429 && retryCount < MAX_RETRIES) {
          // Calculate exponential backoff delay
          const backoffDelay = RETRY_DELAY * Math.pow(2, retryCount);
          console.log(`Rate limited. Retrying in ${backoffDelay/1000} seconds... (${retryCount + 1}/${MAX_RETRIES})`);
          
          // Show waiting message to user
          setBotResponse(`I'm thinking... (retry ${retryCount + 1}/${MAX_RETRIES})`);
          
          // Wait for the backoff delay
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
          
          // Retry with incremented retry count
          return handleSendMessage(message, retryCount + 1);
        }
        
        if (!apiResponse.ok) {
          throw new Error(`API Error: ${apiResponse.status}`);
        }
        
        response = await apiResponse.json();
        
        // Check if the response is the generic fallback
        const isGenericFallback = response.response && (
          response.response.includes("I apologize for the technical difficulty") ||
          response.response.includes("general well-being strategies") ||
          response.response.includes("Take deep breaths") ||
          response.response.includes("Step away for a short break")
        );
        
        // If it's a generic fallback, use our own fallback system instead
        if (isGenericFallback) {
          console.log("Detected generic fallback response, using custom fallback instead");
          response = handleApiError(new Error("Generic fallback detected"), message);
        }
      }
      
      console.log("Response:", response);
      setBotResponse(response.response);
      setCharacterState('TALKING');
      
      // Speak the response
      if (synthRef.current && response.response) {
        const utterance = new SpeechSynthesisUtterance(response.response);
        
        // Estimate speech duration (average speaking rate is about 150 words per minute)
        const wordCount = response.response.split(' ').length;
        const estimatedDuration = (wordCount / 150) * 60; // in seconds
        
        utterance.onstart = () => {
          setIsTalking(true);
          setCharacterState('TALKING');
          // Start lip sync animation
          startLipSync(response.response, estimatedDuration);
        };
        
        utterance.onend = () => {
          setIsTalking(false);
          setCharacterState('IDLE');
          // Lip sync will end automatically
        };
        
        synthRef.current.speak(utterance);
      } else {
        // If speech synthesis is not available, reset after a delay
        setTimeout(() => {
          setIsTalking(false);
          setCharacterState('IDLE');
        }, 3000);
      }
      
      // Clear the user message input
      setUserMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      
      // If we've exceeded max retries, use fallback
      if (retryCount >= MAX_RETRIES) {
        const fallbackResponse = handleApiError(error, message);
        setBotResponse(fallbackResponse.response);
        setIsTalking(false);
        setCharacterState('SYMPATHETIC');
        
        // Still try to speak the fallback response
        if (synthRef.current) {
          const utterance = new SpeechSynthesisUtterance(fallbackResponse.response);
          utterance.onstart = () => {
            setIsTalking(true);
            setCharacterState('TALKING');
          };
          utterance.onend = () => {
            setIsTalking(false);
            setCharacterState('IDLE');
          };
          synthRef.current.speak(utterance);
        }
      }
    }
  };

  // Get the appropriate character image based on state
  const getCharacterImage = (): string => {
    // If we're talking and have a mouth shape, use the talking image
    if (isTalking && currentMouthShape !== 'X') {
      return CHARACTER_STATES.TALKING;
    }
    
    // Otherwise use the current character state
    return imageError 
      ? FALLBACK_IMAGES[characterState] 
      : CHARACTER_STATES[characterState];
  };

  // Handle image loading errors
  const handleImageError = () => {
    setImageError(true);
  };

  // Update the Character3D component
  const Character3D: React.FC<{ 
    characterState: keyof typeof CHARACTER_STATES,
    isTalking: boolean
  }> = ({ characterState, isTalking }) => {
    const group = useRef<THREE.Group>(null);
    
    // Try to load the model with error handling
    let modelLoaded = false;
    let modelData: any = null;
    
    try {
      // Try to load the model with a more accessible path
      modelData = useGLTF('/doraemon.glb');
      modelLoaded = true;
    } catch (error) {
      console.error("Error loading 3D model:", error);
      modelLoaded = false;
    }
    
    // If model loaded successfully, set up animations
    useEffect(() => {
      if (!modelLoaded || !modelData || !modelData.animations || modelData.animations.length === 0) {
        return;
      }
      
      const { animations } = modelData;
      const { actions, names } = useAnimations(animations, group);
      
      // Map character states to animation names
      const animationMap: Record<keyof typeof CHARACTER_STATES, string> = {
        IDLE: 'Idle',
        TALKING: 'Talk',
        LISTENING: 'Listen',
        THINKING: 'Think',
        HAPPY: 'Happy',
        SAD: 'Sad',
        ANGRY: 'Angry',
        SURPRISED: 'Surprised',
        SYMPATHETIC: 'Sympathetic'
      };
      
      // Get the animation name based on character state
      const animationName = animationMap[characterState] || 'Idle';
      
      // Find the closest matching animation
      const closestAnimation = names.find(name => 
        name.toLowerCase().includes(animationName.toLowerCase())
      ) || names[0];
      
      // Reset all animations
      names.forEach(name => {
        const action = actions[name];
        if (action) action.stop();
      });
      
      // Play the selected animation
      if (actions[closestAnimation]) {
        actions[closestAnimation].reset().fadeIn(0.5).play();
      }
      
      return () => {
        // Cleanup animations
        if (actions[closestAnimation]) {
          actions[closestAnimation].fadeOut(0.5);
        }
      };
    }, [characterState, modelData, modelLoaded]);
    
    // Add subtle animation
    useFrame((state) => {
      if (group.current) {
        // Add subtle breathing motion
        group.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.05;
        
        // Add more movement if talking
        if (isTalking) {
          group.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
        }
      }
    });
    
    // If model failed to load, return the fallback
    if (!modelLoaded || !modelData) {
      return <Fallback3DCharacter characterState={characterState} />;
    }
    
    return (
      <group ref={group}>
        <primitive 
          object={modelData.scene.clone()} 
          scale={1.0} 
          position={[0, -2.4, 0]} 
          rotation={[0, Math.PI, 0]}
        />
      </group>
    );
  };

  // Fix the Fallback3DCharacter component name
  const Fallback3DCharacter: React.FC<{ 
    characterState: keyof typeof CHARACTER_STATES 
  }> = ({ characterState }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    
    // Map character states to colors
    const colorMap: Record<keyof typeof CHARACTER_STATES, string> = {
      IDLE: '#4299e1', // blue
      TALKING: '#38b2ac', // teal
      LISTENING: '#9f7aea', // purple
      THINKING: '#667eea', // indigo
      HAPPY: '#f6e05e', // yellow
      SAD: '#90cdf4', // light blue
      ANGRY: '#f56565', // red
      SURPRISED: '#ed8936', // orange
      SYMPATHETIC: '#d6bcfa' // lavender
    };
    
    const color = colorMap[characterState] || '#4299e1';
    
    useFrame((state) => {
      if (meshRef.current) {
        meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
        meshRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.2;
      }
    });
    
    return (
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={color} />
        <mesh position={[0.5, 0.5, 0.8]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[-0.5, 0.5, 0.8]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0, -0.2, 0.8]}>
          <sphereGeometry args={[0.3, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </mesh>
    );
  };

  // Add a toggle function for 3D mode
  const toggle3DMode = () => {
    setIs3DMode(!is3DMode);
    
    // Reset character state when toggling modes
    setCharacterState('IDLE');
    
    // Log the mode change
    console.log("Toggled 3D mode:", !is3DMode);
  };

  // Add a function to generate mock lip sync data
  const generateMockLipSync = (text: string, duration: number): LipSyncData => {
    // Mouth shapes: X (closed), A, B, C, D, E, F, G, H
    const mouthShapes = ['X', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const frames: LipSyncFrame[] = [];
    
    // Calculate roughly how many frames we need based on text length and duration
    const wordCount = text.split(' ').length;
    const framesPerWord = 3; // Average 3 mouth positions per word
    const totalFrames = wordCount * framesPerWord;
    
    // Generate frames
    for (let i = 0; i < totalFrames; i++) {
      // Distribute frames evenly across the duration
      const time = (i / totalFrames) * duration;
      
      // For natural speech, alternate between open and closed mouth shapes
      // with occasional variations
      let shape;
      if (i % 3 === 0) {
        // Closed mouth
        shape = 'X';
      } else if (i % 3 === 1) {
        // Open mouth - pick a random open shape
        shape = mouthShapes[Math.floor(Math.random() * (mouthShapes.length - 1)) + 1];
      } else {
        // Transition shape - either closed or slightly open
        shape = Math.random() > 0.5 ? 'X' : 'A';
      }
      
      frames.push({ time, value: shape });
    }
    
    // Add a final closed mouth frame
    frames.push({ time: duration, value: 'X' });
    
    return { mouthCues: frames };
  };

  // Add a function to start lip sync animation
  const startLipSync = (text: string, duration: number) => {
    // Clear any existing lip sync
    if (lipSyncTimerRef.current) {
      window.clearTimeout(lipSyncTimerRef.current);
      lipSyncTimerRef.current = null;
    }
    
    // Generate mock lip sync data
    const lipSync = generateMockLipSync(text, duration);
    setLipSyncData(lipSync);
    
    // Start the animation
    const startTime = Date.now();
    
    const animateMouth = () => {
      const elapsed = (Date.now() - startTime) / 1000; // Convert to seconds
      
      // Find the current mouth shape
      const currentFrame = lipSync.mouthCues.find((frame, index) => {
        const nextFrame = lipSync.mouthCues[index + 1];
        return frame.time <= elapsed && (!nextFrame || nextFrame.time > elapsed);
      });
      
      if (currentFrame) {
        setCurrentMouthShape(currentFrame.value);
      }
      
      // Continue animation if not finished
      if (elapsed < duration) {
        lipSyncTimerRef.current = window.setTimeout(animateMouth, 50) as unknown as number; // Update every 50ms
      } else {
        // Reset at the end
        setCurrentMouthShape('X');
        setLipSyncData(null);
      }
    };
    
    // Start the animation
    animateMouth();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-sky-50 relative">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg z-10 shadow-sm">
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
              <h1 className="text-xl font-semibold text-gray-800">Video Chat</h1>
              <p className="text-sm text-gray-500">Talk with your 2D buddy</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-20 pb-6 flex flex-col h-[calc(100vh-2rem)]">
        <div className="flex flex-col md:flex-row gap-4 flex-1 bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
          {/* Main Video Area */}
          <div className="flex-1 relative bg-gradient-to-b from-blue-900 to-purple-900 p-4 flex items-center justify-center">
            {/* Character Container */}
            <div className="w-full h-full max-w-2xl mx-auto relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-full rounded-xl overflow-hidden relative"
              >
                {/* 3D/2D Toggle Button */}
                <button
                  onClick={toggle3DMode}
                  className="absolute top-4 right-4 z-20 bg-white/20 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white/30 transition-colors"
                >
                  <span className="text-sm font-medium text-white">
                    {is3DMode ? '2D' : '3D'}
                  </span>
                </button>
                
                {/* 3D Character */}
                {is3DMode ? (
                  <div className="w-full h-full">
                    <Canvas
                      camera={{ position: [0, 0, 5], fov: 50 }}
                      style={{ background: 'linear-gradient(to bottom, #1e3a8a, #4c1d95)' }}
                    >
                      <ambientLight intensity={0.7} />
                      <pointLight position={[10, 10, 10]} intensity={1.5} />
                      <Suspense fallback={<Fallback3DCharacter characterState={characterState} />}>
                        <Character3D 
                          characterState={characterState}
                          isTalking={isTalking}
                        />
                      </Suspense>
                      <OrbitControls 
                        enableZoom={false} 
                        enablePan={false}
                        minPolarAngle={Math.PI / 4}
                        maxPolarAngle={Math.PI / 1.5}
                      />
                    </Canvas>
                  </div>
                ) : (
                  /* 2D Character */
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-blue-800/50 to-purple-800/50 backdrop-blur-sm rounded-xl">
                    {imageError ? (
                      <div className="text-9xl">
                        {characterState === 'HAPPY' ? '😄' : 
                         characterState === 'SAD' ? '😢' : 
                         characterState === 'ANGRY' ? '😠' : 
                         characterState === 'SURPRISED' ? '😲' : 
                         characterState === 'SYMPATHETIC' ? '🥺' : 
                         characterState === 'TALKING' ? '🗣️' : 
                         characterState === 'LISTENING' ? '👂' : 
                         characterState === 'THINKING' ? '🤔' : '🤖'}
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-end justify-center pb-4">
                        <img
                          src={getCharacterImage()}
                          alt="Character"
                          className="max-w-full max-h-[80%] object-contain"
                          style={{ transform: 'translateY(25%)' }}
                          onError={handleImageError}
                        />
                      </div>
                    )}
                  </div>
                )}
                
                {/* Speech bubble when talking */}
                <AnimatePresence>
                  {botResponse && characterState === 'TALKING' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.8 }}
                      className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg max-w-[80%] z-20"
                    >
                      <p className="text-sm text-gray-800">{botResponse.slice(0, 100)}{botResponse.length > 100 ? '...' : ''}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Listening indicator */}
                <AnimatePresence>
                  {isListening && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-200"></div>
                        <span className="text-xs text-white">Listening...</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Character name tag */}
                <div className="absolute bottom-2 left-4 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-lg">
                  <p className="text-sm text-white font-medium">Doraemon</p>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* User Camera & Chat Area */}
          <div className="w-full md:w-80 bg-gray-800 flex flex-col">
            {/* User Camera */}
            <div className="aspect-video bg-black relative">
              {cameraActive && videoRef.current ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-white/70 text-sm">Camera is turned off</p>
                </div>
              )}
              
              {/* Camera toggle button */}
              <button
                onClick={toggleCamera}
                className="absolute bottom-3 right-3 bg-gray-700/80 backdrop-blur-sm p-2 rounded-full hover:bg-gray-600/80 transition-colors"
              >
                {cameraActive ? (
                  <VideoCameraIcon className="w-5 h-5 text-white" />
                ) : (
                  <VideoCameraSlashIcon className="w-5 h-5 text-white" />
                )}
              </button>
              
              {/* User name tag */}
              <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">
                <p className="text-xs text-white">You</p>
              </div>
            </div>
            
            {/* Chat Area */}
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
              <h3 className="text-white/90 text-sm font-medium mb-2">Conversation</h3>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pr-2">
                {userMessage && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400">You</p>
                    <p className="text-sm text-white bg-gray-700 p-2 rounded-lg inline-block">{userMessage}</p>
                  </div>
                )}
                
                {botResponse && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400">Doraemon</p>
                    <p className="text-sm text-white bg-blue-600 p-2 rounded-lg inline-block">{botResponse}</p>
                  </div>
                )}
              </div>
              
              {/* Voice Input Button */}
              <div className="flex justify-center mt-auto">
                <button
                  onClick={handleVoiceInput}
                  className={classNames(
                    "p-4 rounded-full transition-all",
                    isListening 
                      ? "bg-red-500 text-white animate-pulse" 
                      : "bg-blue-500 text-white hover:bg-blue-600",
                    "hover:shadow-lg"
                  )}
                >
                  <MicrophoneIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Call Controls */}
        <div className="mt-4 flex justify-center">
          <div className="bg-gray-800/90 backdrop-blur-sm px-6 py-3 rounded-full flex gap-4">
            <button 
              onClick={() => navigate('/')}
              className="p-3 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
              aria-label="End call"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <button
              onClick={toggleCamera}
              className={`p-3 rounded-full transition-colors ${cameraActive ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-600 hover:bg-gray-500'}`}
            >
              {cameraActive ? (
                <VideoCameraIcon className="w-6 h-6 text-white" />
              ) : (
                <VideoCameraSlashIcon className="w-6 h-6 text-white" />
              )}
            </button>
            
            <button
              onClick={handleVoiceInput}
              className={`p-3 rounded-full transition-colors ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              <MicrophoneIcon className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Debug element for lip sync data */}
      {process.env.NODE_ENV === 'development' && lipSyncData && (
        <div className="hidden">
          {/* This is just to use the variable to satisfy TypeScript */}
          Lip sync frames: {lipSyncData.mouthCues.length}
        </div>
      )}
    </div>
  );
}; 