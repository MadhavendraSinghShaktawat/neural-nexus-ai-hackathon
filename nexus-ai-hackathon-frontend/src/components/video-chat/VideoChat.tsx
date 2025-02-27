import { useEffect, useRef, useState, useCallback } from 'react';

interface VideoChatProps {
  // ... existing props
}

const VideoChat: React.FC<VideoChatProps> = ({ /* existing props */ }) => {
  const [isVideoOn, setIsVideoOn] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Use useCallback to create a stable function reference
  const startVideo = useCallback(async (): Promise<void> => {
    try {
      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Request camera with explicit constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false // Set to true if you need audio as well
      });
      
      // Store the stream reference
      streamRef.current = stream;
      
      // Connect stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsVideoOn(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsVideoOn(false);
    }
  }, []);
  
  const stopVideo = useCallback((): void => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsVideoOn(false);
  }, []);
  
  const toggleVideo = useCallback((): void => {
    if (isVideoOn) {
      stopVideo();
    } else {
      startVideo();
    }
  }, [isVideoOn, startVideo, stopVideo]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  return (
    <div className="video-chat-container">
      <video 
        ref={videoRef}
        autoPlay 
        playsInline
        muted
        className={`video-element ${isVideoOn ? 'active' : 'hidden'}`}
      />
      
      <div className="video-controls">
        <button 
          onClick={toggleVideo}
          className={`video-toggle-btn ${isVideoOn ? 'video-on' : 'video-off'}`}
          aria-label={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
        >
          {isVideoOn ? 'Turn Off Camera' : 'Turn On Camera'}
        </button>
        
        {/* Other controls */}
      </div>
      
      {/* Rest of your component */}
    </div>
  );
};

export default VideoChat; 