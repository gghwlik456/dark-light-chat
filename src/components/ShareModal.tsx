import { X, Search, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Checkbox } from './ui/checkbox';
import { useState } from 'react';

interface ShareUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  isOnline: boolean;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  users: ShareUser[];
  onShare: (postId: string, userIds: string[], message?: string) => void;
}

export function ShareModal({ isOpen, onClose, postId, users, onShare }: ShareModalProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [shareMessage, setShareMessage] = useState('');

  const filteredUsers = users.filter(user =>
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleShare = () => {
    if (selectedUsers.length > 0) {
      onShare(postId, selectedUsers, shareMessage || undefined);
      setSelectedUsers([]);
      setShareMessage('');
      setSearchQuery('');
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedUsers([]);
    setShareMessage('');
    setSearchQuery('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md max-h-[80vh] p-0">
        <DialogHeader className="p-4 border-b border-gray-700">
          <DialogTitle className="text-center">Share Post</DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            Share this post with your friends and connections
          </DialogDescription>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </DialogHeader>
        
        {/* Search */}
        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Users List */}
        <ScrollArea className="flex-1 max-h-[300px]">
          <div className="p-4 space-y-3">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50">
                <Checkbox
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={() => handleUserToggle(user.id)}
                  className="border-gray-600"
                />
                
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-gray-700 text-white">
                      {user.displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-900 ${
                    user.isOnline ? 'bg-green-500' : 'bg-gray-500'
                  }`} />
                </div>
                
                <div className="flex-1">
                  <p className="text-white font-medium">{user.displayName}</p>
                  <p className="text-gray-400 text-sm">@{user.username}</p>
                </div>
              </div>
            ))}
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">No users found</p>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {/* Selected Users Count */}
        {selectedUsers.length > 0 && (
          <div className="px-4 py-2 bg-gray-800/50">
            <p className="text-sm text-gray-300">
              {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
            </p>
          </div>
        )}

        {/* Optional Message */}
        <div className="p-4 border-t border-gray-700">
          <Input
            value={shareMessage}
            onChange={(e) => setShareMessage(e.target.value)}
            placeholder="Add a message (optional)..."
            className="mb-3 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
          />
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleShare}
              disabled={selectedUsers.length === 0}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}