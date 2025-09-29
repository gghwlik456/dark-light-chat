import { Camera, Edit, Search, MoreVertical } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { useState, MouseEvent } from 'react';

interface Conversation {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  isOnline: boolean;
  unreadCount: number;
  lastSeen?: string;
}

interface DirectMessagesProps {
  conversations: Conversation[];
  onConversationClick: (conversation: Conversation) => void;
  onStartChat?: (userId: string) => void; // Made optional
  onDeleteChat?: (chatId: string) => void; // Made optional
  onSearchUsers?: () => void; // Made optional
}

export function DirectMessages({ conversations, onStartChat, onDeleteChat, onConversationClick, onSearchUsers }: DirectMessagesProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conversation =>
    conversation.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-16">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="px-4 py-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-white font-bold">Messages</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSearchUsers && onSearchUsers()}
                className="text-gray-400 hover:text-green-400"
              >
                <Search className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-green-400 hover:text-green-300"
              >
                <Edit className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="px-4 py-2">
          {filteredConversations.length === 0 && searchQuery ? (
            <div className="text-center py-8">
              <p className="text-gray-400">لا توجد نتائج</p>
              <p className="text-gray-500 text-sm mt-1">No results found for "{searchQuery}"</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <Card 
                key={conversation.id} 
                className="mb-2 bg-gray-800/30 border-gray-700 hover:bg-gray-800/50 transition-colors cursor-pointer"
                onClick={() => onConversationClick(conversation)}
              >
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar with Online Status */}
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={conversation.avatar} />
                        <AvatarFallback className="bg-gray-700 text-white">
                          {conversation.displayName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
                        conversation.isOnline ? 'bg-green-500' : 'bg-gray-500'
                      }`} />
                    </div>

                    {/* Conversation Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-white font-medium truncate">{conversation.displayName}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-sm">{conversation.timestamp}</span>
                          {conversation.unreadCount > 0 && (
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-xs text-white font-medium">{conversation.unreadCount}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-gray-400 text-sm truncate flex-1">{conversation.lastMessage}</p>
                        <div className="flex items-center gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e: MouseEvent<HTMLButtonElement>) => {
                              e.stopPropagation();
                              if (onStartChat) onStartChat(conversation.id);
                            }}
                            className="text-gray-400 hover:text-green-400 p-1"
                          >
                            <Camera className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e: MouseEvent<HTMLButtonElement>) => {
                              e.stopPropagation();
                              if (onDeleteChat) onDeleteChat(conversation.id);
                            }}
                            className="text-gray-400 hover:text-red-400 p-1"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {!conversation.isOnline && conversation.lastSeen && (
                        <p className="text-gray-500 text-xs mt-1">{conversation.lastSeen}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
