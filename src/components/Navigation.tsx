import { MessageCircle, Heart, User, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface NavigationProps {
  currentView: 'feed' | 'chat' | 'messages' | 'likes' | 'profile';
  onViewChange: (view: 'feed' | 'chat' | 'messages' | 'likes' | 'profile') => void;
  unreadCount?: number;
}

export function Navigation({ currentView, onViewChange, unreadCount = 0 }: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-white font-bold text-lg">Dark*Chat</h1>
          <span className="text-green-400 text-sm">•</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewChange('feed')}
            className={`p-2 ${currentView === 'feed' ? 'text-green-400' : 'text-gray-400 hover:text-white'}`}
          >
            <Users className="w-5 h-5" />
            <span className="hidden sm:inline mr-2">الرئيسية</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewChange('messages')}
            className={`p-2 relative ${currentView === 'messages' ? 'text-green-400' : 'text-gray-400 hover:text-white'}`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="hidden sm:inline mr-2">الرسائل</span>
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center rounded-full bg-red-500 text-white"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewChange('likes')}
            className={`p-2 ${currentView === 'likes' ? 'text-green-400' : 'text-gray-400 hover:text-white'}`}
          >
            <Heart className="w-5 h-5" />
            <span className="hidden sm:inline mr-2">الإعجابات</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewChange('profile')}
            className={`p-2 ${currentView === 'profile' ? 'text-green-400' : 'text-gray-400 hover:text-white'}`}
          >
            <User className="w-5 h-5" />
            <span className="hidden sm:inline mr-2">الملف الشخصي</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}