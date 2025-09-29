import { X, Heart, Reply, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { useState } from 'react';

interface Comment {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  comments: Comment[];
  onAddComment: (postId: string, content: string) => void;
  onLikeComment?: (commentId: string) => void; // Made optional
  onReplyToComment?: (commentId: string, content: string) => void; // Made optional
}

export function CommentsModal({ 
  isOpen, 
  onClose, 
  postId, 
  comments, 
  onAddComment, 
  onLikeComment,
  onReplyToComment 
}: CommentsModalProps) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(postId, newComment);
      setNewComment('');
    }
  };

  const handleReply = (commentId: string) => {
    if (replyContent.trim() && onReplyToComment) {
      onReplyToComment(commentId, replyContent);
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment, isReply?: boolean }) => (
    <div className={`flex gap-3 ${isReply ? 'ml-8 mt-2' : 'mb-4'}`}>
      <Avatar className="w-8 h-8">
        <AvatarImage src={comment.avatar} />
        <AvatarFallback className="bg-gray-700 text-white text-sm">
          {comment.displayName.charAt(0)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="bg-gray-800/50 rounded-2xl px-3 py-2">
          <p className="text-white font-medium text-sm">{comment.displayName}</p>
          <p className="text-gray-100 text-sm leading-relaxed mt-1">{comment.content}</p>
        </div>
        
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
          <span>{comment.timestamp}</span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLikeComment && onLikeComment(comment.id)}
            className={`p-0 h-auto text-xs ${
              comment.isLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
            }`}
          >
            <Heart className={`w-3 h-3 mr-1 ${comment.isLiked ? 'fill-current' : ''}`} />
            {comment.likes > 0 && comment.likes}
          </Button>
          
          {!isReply && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(comment.id)}
              className="p-0 h-auto text-xs text-gray-400 hover:text-white"
            >
              <Reply className="w-3 h-3 mr-1" />
              Reply
            </Button>
          )}
        </div>

        {/* Reply Input */}
        {replyingTo === comment.id && (
          <div className="flex items-center gap-2 mt-3">
            <Input
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={`Reply to ${comment.displayName}...`}
              className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleReply(comment.id)}
            />
            <Button
              onClick={() => handleReply(comment.id)}
              disabled={!replyContent.trim()}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm"
            >
              <Send className="w-3 h-3" />
            </Button>
          </div>
        )}

        {/* Replies */}
        {comment.replies && comment.replies.map((reply) => (
          <CommentItem key={reply.id} comment={reply} isReply={true} />
        ))}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md max-h-[80vh] p-0">
        <DialogHeader className="p-4 border-b border-gray-700">
          <DialogTitle className="text-center">Comments</DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            Join the conversation and share your thoughts
          </DialogDescription>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-4 max-h-[400px]">
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No comments yet</p>
              <p className="text-gray-500 text-sm mt-1">Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))
          )}
        </ScrollArea>
        
        {/* Add Comment Input */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face" />
              <AvatarFallback className="bg-gray-700 text-white">You</AvatarFallback>
            </Avatar>
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <Button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
