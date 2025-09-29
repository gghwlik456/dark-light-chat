import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { X, Image, Smile } from 'lucide-react';

interface CreatePostProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string) => void;
}

export function CreatePost({ isOpen, onClose, onSubmit }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;

    setLoading(true);
    try {
      await onSubmit(content.trim());
      setContent('');
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setContent('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-center text-green-400">إنشاء منشور جديد</DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            شارك ما يجري في بالك مع المجتمع
          </DialogDescription>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute left-4 top-4 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="ماذا يحدث؟"
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 min-h-[120px] resize-none"
              disabled={loading}
              maxLength={500}
              dir="rtl"
            />
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                  disabled={loading}
                >
                  <Image className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                  disabled={loading}
                >
                  <Smile className="w-4 h-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-500">
                {content.length}/500
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              disabled={loading}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={loading || !content.trim()}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? 'جاري النشر...' : 'نشر'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}