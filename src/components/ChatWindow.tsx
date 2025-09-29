import { ArrowRight, Phone, Video, MoreHorizontal, Send, Plus, Smile } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState, useEffect, useRef } from 'react';
import { GifPicker } from './GifPicker';
import { GiphyGif } from '../services/giphy';
import { getOrCreateChat, sendMessage, listenToMessages } from '../firebase/database';

interface Message {
  id: string;
  content: string;
  timestamp: string | number;
  isSent: boolean;
  isRead: boolean;
  senderId: string;
}

interface ChatUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
}

interface ChatWindowProps {
  user: ChatUser; // The other user in the chat
  onBack: () => void;
  currentUserId: string;
}

const formatTime = (timestamp: string | number) => {
  const time = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp);
  return time.toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' });
};

export function ChatWindow({ user, onBack, currentUserId }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const setupChat = async () => {
      if (currentUserId && user.id) {
        const id = await getOrCreateChat(currentUserId, user.id);
        setChatId(id);
      }
    };
    setupChat();
  }, [currentUserId, user.id]);

  useEffect(() => {
    if (!chatId) return;

    const unsubscribe = listenToMessages(chatId, (newMessages) => {
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (newMessage.trim() && chatId) {
      const messageData = {
        content: newMessage.trim(),
        senderId: currentUserId,
        isRead: false,
      };
      await sendMessage(chatId, messageData);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleGifSelect = async (gif: GiphyGif) => {
    if (chatId) {
      const messageData = {
        content: `[GIF] ${gif.images.fixed_height.url}`,
        senderId: currentUserId,
        isRead: false,
      };
      await sendMessage(chatId, messageData);
      setShowGifPicker(false);
    }
  };

  const handleMediaClick = () => {
    // Photo/Video picker functionality
    console.log('Open photo/video picker');
  };

  const renderMessage = (message: Message) => {
    if (message.content.startsWith('[GIF] ')) {
      const gifUrl = message.content.replace('[GIF] ', '');
      return (
        <div className="rounded-lg overflow-hidden max-w-[200px]">
          <img 
            src={gifUrl} 
            alt="GIF"
            className="w-full h-auto"
          />
        </div>
      );
    }
    return <p className="leading-relaxed">{message.content}</p>;
  };

  return (
    <div className="fixed inset-0 z-[60] min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col" dir="rtl">
      {/* Chat Header */}
      <div className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-800 p-4 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-gray-700">
          <ArrowRight className="w-5 h-5" />
        </Button>
        
        <div className="relative">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-gray-700 text-white">
              {user.displayName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className={`absolute -bottom-1 -left-1 w-3 h-3 rounded-full border-2 border-gray-900 ${
            user.isOnline ? 'bg-green-500' : 'bg-gray-500'
          }`} />
        </div>
        
        <div className="flex-1">
          <h3 className="text-white font-medium">{user.displayName}</h3>
          <p className="text-gray-400 text-sm">
            {user.isOnline ? 'متصل' : user.lastSeen || 'آخر ظهور مؤخراً'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Video className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <Send className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 text-lg mb-2">بداية المحادثة</p>
            <p className="text-gray-500 text-sm">أرسل رسالة لبدء المحادثة مع {user.displayName}</p>
          </div>
        ) : (
          messages.map((message) => {
            const isSent = message.senderId === currentUserId;
            return (
              <div key={message.id} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  isSent 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-700 text-white'
                }`}>
                  {renderMessage(message)}
                  <div className={`flex items-center gap-1 mt-1 ${
                    isSent ? 'justify-end' : 'justify-start'
                  }`}>
                    <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                    {isSent && (
                      <div className={`w-2 h-2 rounded-full ${
                        message.isRead ? 'bg-blue-400' : 'bg-gray-400'
                      }`} />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-t border-gray-700 p-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleMediaClick}
            className="text-gray-400 hover:text-white"
          >
            <Plus className="w-5 h-5" />
          </Button>
          
          <div className="flex-1 bg-gray-700 rounded-full flex items-center px-4 py-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اكتب رسالة..."
              className="flex-1 bg-transparent border-none text-white placeholder-gray-400 focus:ring-0"
              dir="rtl"
            />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowGifPicker(true)}
              className="text-gray-400 hover:text-white ml-2"
            >
              <Smile className="w-5 h-5" />
            </Button>
          </div>
          
          <Button 
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="bg-green-600 hover:bg-green-700 text-white rounded-full p-2"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* GIF Picker */}
      <GifPicker
        isOpen={showGifPicker}
        onClose={() => setShowGifPicker(false)}
        onSelectGif={handleGifSelect}
      />
    </div>
  );
}
