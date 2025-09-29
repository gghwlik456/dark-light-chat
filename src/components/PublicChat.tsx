import { Heart, MessageCircle, Share, MoreHorizontal, Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Stories } from './Stories';
import { Card } from './ui/card';

interface Post {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  content: string;
  timestamp: string | { seconds: number };
  likes: number;
  replies: number;
  isLiked: boolean;
  isOnline: boolean;
  likedBy?: { [key: string]: boolean };
}

interface PublicChatProps {
  posts: Post[];
  stories: any[];
  currentUser: any;
  onLike: (postId: string) => void;
  onReply: (postId: string) => void;
  onShare: (postId: string) => void;
  onStoryClick: (story: any) => void;
  onUserClick: (userId: string) => void;
  onAddStory: () => void;
  onCreatePost: () => void;
  currentUserId?: string;
}

export function PublicChat({ posts, stories, currentUser, onLike, onReply, onShare, onStoryClick, onUserClick, onAddStory, onCreatePost, currentUserId }: PublicChatProps) {
  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'الآن';
    
    if (typeof timestamp === 'object' && timestamp.seconds) {
      // Firebase timestamp
      const date = new Date(timestamp.seconds * 1000);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'الآن';
      if (diffInMinutes < 60) return `${diffInMinutes}د`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}س`;
      return `${Math.floor(diffInMinutes / 1440)}ي`;
    }
    
    return timestamp;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black" dir="rtl">
      {/* Stories Section */}
      <div className="bg-gray-900/80 backdrop-blur-sm sticky top-16 z-40">
        <Stories 
          currentUser={currentUser}
          onStoryClick={onStoryClick}
          onAddStory={onAddStory}
        />
      </div>

      {/* Create Post Floating Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={onCreatePost}
          className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      {/* Posts Feed */}
      <div className="max-w-2xl mx-auto px-4 pb-20 pt-4">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 text-lg mb-2">لا توجد منشورات بعد</p>
            <p className="text-gray-500 text-sm mb-4">كن أول من يشارك شيئاً!</p>
            <Button
              onClick={onCreatePost}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-4 h-4 ml-2" />
              إنشاء منشور
            </Button>
          </div>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="mb-4 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <div className="p-4">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10 cursor-pointer" onClick={() => onUserClick(post.userId)}>
                        <AvatarImage src={post.avatar} />
                        <AvatarFallback className="bg-gray-700 text-white">
                          {post.displayName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {/* Online Status */}
                      <div className={`absolute -bottom-1 -left-1 w-3 h-3 rounded-full border-2 border-gray-800 ${
                        post.isOnline ? 'bg-green-500' : 'bg-gray-500'
                      }`} />
                    </div>
                    <div>
                      <p 
                        className="text-white font-medium cursor-pointer hover:text-green-400 transition-colors"
                        onClick={() => onUserClick(post.userId)}
                      >
                        {post.displayName}
                      </p>
                      <p 
                        className="text-gray-400 text-sm cursor-pointer hover:text-green-400 transition-colors"
                        onClick={() => onUserClick(post.userId)}
                      >
                        @{post.username}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm">{formatTimestamp(post.timestamp)}</span>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Post Content */}
                <p className="text-gray-100 mb-4 leading-relaxed">{post.content}</p>

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onLike(post.id)}
                    className={`flex items-center gap-2 ${
                      (post.likedBy && currentUserId && post.likedBy[currentUserId]) || post.isLiked
                        ? 'text-red-500 hover:text-red-400' 
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${
                      (post.likedBy && currentUserId && post.likedBy[currentUserId]) || post.isLiked
                        ? 'fill-current' 
                        : ''
                    }`} />
                    <span>{post.likes || 0}</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onReply(post.id)}
                    className="flex items-center gap-2 text-gray-400 hover:text-blue-400"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.replies || 0}</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onShare(post.id)}
                    className="flex items-center gap-2 text-gray-400 hover:text-green-400"
                  >
                    <Share className="w-4 h-4" />
                    <span>مشاركة</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
