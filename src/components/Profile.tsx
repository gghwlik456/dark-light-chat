import { Edit, Share, Settings, UserPlus, Users, FileText } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface UserProfile {
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
}

interface ProfileProps {
  profile: UserProfile;
  isOwnProfile?: boolean;
  onEditProfile: () => void;
  onShareProfile: () => void;
  onFollow: () => void;
}

export function Profile({ profile, isOwnProfile = true, onEditProfile, onShareProfile, onFollow }: ProfileProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-16">
      <div className="max-w-md mx-auto px-4 py-6">
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
                {isOwnProfile ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onEditProfile}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onShareProfile}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Share className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={onFollow}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    Follow
                  </Button>
                )}
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

        {/* Profile Actions */}
        {isOwnProfile && (
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <div className="p-4 space-y-3">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:bg-gray-700"
              >
                <Settings className="w-4 h-4 mr-3" />
                Account Settings
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:bg-gray-700"
              >
                <Users className="w-4 h-4 mr-3" />
                Manage Followers
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:bg-gray-700"
              >
                <FileText className="w-4 h-4 mr-3" />
                Privacy Policy
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}