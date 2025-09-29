import { X, ChevronLeft, ChevronRight, Heart, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { useState, useEffect } from 'react';

interface StoryContent {
  id: string;
  type: 'image' | 'text';
  content: string;
  backgroundColor?: string;
  timestamp: string;
}

interface StoryData {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  stories: StoryContent[];
  isViewed: boolean;
}

interface StoryViewerProps {
  stories: StoryData[];
  currentStoryIndex: number;
  currentContentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onReply: (storyId: string, message: string) => void;
}

export function StoryViewer({ 
  stories, 
  currentStoryIndex, 
  currentContentIndex, 
  onClose, 
  onNext, 
  onPrevious,
  onReply 
}: StoryViewerProps) {
  const [progress, setProgress] = useState(0);
  const [replyMessage, setReplyMessage] = useState('');
  const [showReplyInput, setShowReplyInput] = useState(false);

  const currentStory = stories[currentStoryIndex];
  const currentContent = currentStory?.stories[currentContentIndex];

  useEffect(() => {
    setProgress(0);
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          onNext();
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [currentStoryIndex, currentContentIndex, onNext]);

  const handleReply = () => {
    if (replyMessage.trim()) {
      onReply(currentStory.id, replyMessage);
      setReplyMessage('');
      setShowReplyInput(false);
    }
  };

  if (!currentStory || !currentContent) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      {/* Story Progress Bars */}
      <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
        {currentStory.stories.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-100"
              style={{ 
                width: index < currentContentIndex ? '100%' : 
                       index === currentContentIndex ? `${progress}%` : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Story Header */}
      <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-10 mt-6">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 ring-2 ring-white">
            <AvatarImage src={currentStory.avatar} />
            <AvatarFallback className="bg-gray-700 text-white">
              {currentStory.displayName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-white font-medium">{currentStory.displayName}</p>
            <p className="text-gray-300 text-sm">{currentContent.timestamp}</p>
          </div>
        </div>
        
        <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Story Content */}
      <div className="w-full h-full flex items-center justify-center relative">
        {currentContent.type === 'image' ? (
          <img 
            src={currentContent.content} 
            alt="Story" 
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center p-8"
            style={{ backgroundColor: currentContent.backgroundColor || '#1f2937' }}
          >
            <p className="text-white text-center text-xl leading-relaxed max-w-md">
              {currentContent.content}
            </p>
          </div>
        )}

        {/* Navigation Areas */}
        <div 
          className="absolute left-0 top-0 w-1/3 h-full cursor-pointer z-20"
          onClick={onPrevious}
        />
        <div 
          className="absolute right-0 top-0 w-1/3 h-full cursor-pointer z-20"
          onClick={onNext}
        />
      </div>

      {/* Story Actions */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        {showReplyInput ? (
          <div className="flex items-center gap-2 bg-black/50 rounded-full p-2">
            <Input
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder={`Reply to ${currentStory.displayName}...`}
              className="flex-1 bg-transparent border-none text-white placeholder-gray-300 focus:ring-0"
              onKeyPress={(e) => e.key === 'Enter' && handleReply()}
            />
            <Button 
              onClick={handleReply}
              disabled={!replyMessage.trim()}
              className="bg-green-600 hover:bg-green-700 text-white rounded-full p-2"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Heart className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyInput(true)}
              className="text-white hover:bg-white/20"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      {currentStoryIndex > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-30"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      )}
      
      {currentStoryIndex < stories.length - 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-30"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
}