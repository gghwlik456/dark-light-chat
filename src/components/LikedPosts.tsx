import { Heart, MessageCircle, Share, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface LikedPost {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
  likedAt: string;
  isOnline: boolean;
}

interface LikedPostsProps {
  likedPosts: LikedPost[];
  onUnlike: (postId: string) => void;
  onReply: (postId: string) => void;
  onShare: (postId: string) => void;
}

export function LikedPosts({ likedPosts, onUnlike, onReply, onShare }: LikedPostsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-16">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl text-white font-bold mb-2">Liked Posts</h2>
          <p className="text-gray-400">Posts you've liked recently</p>
        </div>

        {/* Liked Posts List */}
        {likedPosts.length === 0 ? (
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <div className="p-8 text-center">
              <Heart className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg text-gray-300 mb-2">No liked posts yet</h3>
              <p className="text-gray-500">Start exploring and like posts that interest you!</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {likedPosts.map((post) => (
              <Card key={post.id} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <div className="p-4">
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={post.avatar} />
                          <AvatarFallback className="bg-gray-700 text-white">
                            {post.displayName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {/* Online Status */}
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${
                          post.isOnline ? 'bg-green-500' : 'bg-gray-500'
                        }`} />
                      </div>
                      <div>
                        <p className="text-white font-medium">{post.displayName}</p>
                        <p className="text-gray-400 text-sm">@{post.username}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 text-sm">{post.timestamp}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>Liked {post.likedAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-gray-100 mb-4 leading-relaxed">{post.content}</p>

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onUnlike(post.id)}
                      className="flex items-center gap-2 text-red-500 hover:text-red-400"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                      <span>{post.likes}</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onReply(post.id)}
                      className="flex items-center gap-2 text-gray-400 hover:text-blue-400"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.replies}</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onShare(post.id)}
                      className="flex items-center gap-2 text-gray-400 hover:text-green-400"
                    >
                      <Share className="w-4 h-4" />
                      <span>Share</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}