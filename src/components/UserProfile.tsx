import { ArrowLeft, UserPlus, MessageCircle, MoreHorizontal, Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useState } from 'react';

interface UserProfileData {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isOnline: boolean;
  joinDate: string;
  isFollowing?: boolean;
  isBlocked?: boolean;
}

interface UserProfileProps {
  profile: UserProfileData;
  onBack: () => void;
  onMessage: () => void;
  onFollow?: () => void; // Made optional
  onBlock?: () => void; // Made optional
}

export function UserProfile({ profile, onBack, onFollow, onMessage, onBlock }: UserProfileProps) {
  const [isFollowing, setIsFollowing] = useState(profile.isFollowing || false);
  const [isBlocked, setIsBlocked] = useState(profile.isBlocked || false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    if (onFollow) {
      onFollow();
    }
  };

  const handleBlock = () => {
    setIsBlocked(true);
    if (onBlock) {
      onBlock();
    }
  };

  if (isBlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-16">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-gray-700">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-xl text-white font-bold">User Profile</h2>
          </div>
          
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <div className="p-8 text-center">
              <Shield className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg text-gray-300 mb-2">User Blocked</h3>
              <p className="text-gray-500">You have blocked this user. You won't see their posts or messages.</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-16">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-gray-700">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-xl text-white font-bold">@{profile.username}</h2>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
              <DropdownMenuItem 
                onClick={handleBlock}
                className="text-red-400 hover:text-red-300 hover:bg-gray-700"
              >
                <Shield className="w-4 h-4 mr-2" />
                Block User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Profile Header */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm mb-6">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="relative">
                <Avatar className="w-20 h-20 ring-2 ring-green-500">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="bg-gray-700 text-white text-xl">
                    {profile.displayName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {/* Online Status */}
                <div className={`absolute -bottom-2 -right-2 w-5 h-5 rounded-full border-2 border-gray-800 ${
                  profile.isOnline ? 'bg-green-500' : 'bg-gray-500'
                }`} />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleFollow}
                  className={`${
                    isFollowing 
                      ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  <UserPlus className="w-4 h-4 mr-1" />
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
                <Button
                  onClick={onMessage}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Message
                </Button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-2">
              <div>
                <h1 className="text-xl text-white font-bold">{profile.displayName}</h1>
                <p className="text-gray-400">@{profile.username}</p>
              </div>
              
              {profile.bio && (
                <p className="text-gray-300 leading-relaxed">{profile.bio}</p>
              )}
              
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                  {profile.isOnline ? '✅ Online' : '⚫ Offline'}
                </Badge>
                <span className="text-gray-500 text-sm">Joined {profile.joinDate}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm mb-6">
          <div className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-xl text-white font-bold">{profile.postsCount}</p>
                <p className="text-gray-400 text-sm">Posts</p>
              </div>
              <div className="space-y-1">
                <p className="text-xl text-white font-bold">{profile.followersCount}</p>
                <p className="text-gray-400 text-sm">Followers</p>
              </div>
              <div className="space-y-1">
                <p className="text-xl text-white font-bold">{profile.followingCount}</p>
                <p className="text-gray-400 text-sm">Following</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Posts Section */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <div className="p-4">
            <h3 className="text-white font-medium mb-4">Recent Posts</h3>
            <div className="text-center py-8">
              <p className="text-gray-400">No recent posts to show</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
