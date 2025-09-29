import { X, Image, Type, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useState } from 'react';

interface AddStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string, type: 'text' | 'image') => void;
}

export function AddStoryModal({ isOpen, onClose, onSubmit }: AddStoryModalProps) {
  const [storyType, setStoryType] = useState<'image' | 'text'>('image');
  const [textContent, setTextContent] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#1f2937');
  const [imageUrl, setImageUrl] = useState('');

  const backgroundColors = [
    '#1f2937', '#7c3aed', '#dc2626', '#059669', 
    '#ea580c', '#0891b2', '#be185d', '#4338ca'
  ];

  const handleAddStory = () => {
    if (storyType === 'text' && textContent.trim()) {
      onSubmit(textContent, 'text');
    } else if (storyType === 'image' && imageUrl.trim()) {
      onSubmit(imageUrl, 'image');
    }
    
    // Reset form
    setTextContent('');
    setImageUrl('');
    setStoryType('image');
    onClose();
  };

  const handleClose = () => {
    setTextContent('');
    setImageUrl('');
    setStoryType('image');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Add New Story</DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            Share a moment with your story that lasts 24 hours
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
        
        {/* Story Type Selection */}
        <div className="flex gap-2 p-4">
          <Button
            variant={storyType === 'image' ? 'default' : 'outline'}
            onClick={() => setStoryType('image')}
            className="flex-1 flex items-center gap-2"
          >
            <Image className="w-4 h-4" />
            صورة
          </Button>
          <Button
            variant={storyType === 'text' ? 'default' : 'outline'}
            onClick={() => setStoryType('text')}
            className="flex-1 flex items-center gap-2"
          >
            <Type className="w-4 h-4" />
            نص
          </Button>
        </div>

        {/* Content Input */}
        <div className="p-4 space-y-4">
          {storyType === 'image' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">رابط الصورة</label>
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="أدخل رابط الصورة..."
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              
              <Button className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-700">
                <Camera className="w-4 h-4" />
                أو اختر من الجهاز
              </Button>
              
              {imageUrl && (
                <div className="relative w-full h-48 bg-gray-800 rounded-lg overflow-hidden">
                  <img 
                    src={imageUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={() => setImageUrl('')}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">محتوى النص</label>
                <Textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="اكتب نصك هنا..."
                  className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
                  maxLength={200}
                />
                <p className="text-xs text-gray-400 mt-1">{textContent.length}/200</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">لون الخلفية</label>
                <div className="flex gap-2 flex-wrap">
                  {backgroundColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setBackgroundColor(color)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        backgroundColor === color ? 'border-white' : 'border-gray-600'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              
              {textContent && (
                <div 
                  className="w-full h-48 rounded-lg flex items-center justify-center p-4"
                  style={{ backgroundColor }}
                >
                  <p className="text-white text-center text-lg leading-relaxed">
                    {textContent}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 p-4">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            إلغاء
          </Button>
          <Button
            onClick={handleAddStory}
            disabled={(storyType === 'text' && !textContent.trim()) || (storyType === 'image' && !imageUrl.trim())}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            نشر الستوري
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}