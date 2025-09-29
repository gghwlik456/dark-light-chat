import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updates: { displayName?: string; bio?: string; avatar?: File }) => void;
  currentUser: any;
}

export function EditProfileModal({ isOpen, onClose, onSubmit, currentUser }: EditProfileModalProps) {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
      setBio(currentUser.bio || '');
      setAvatarPreview(currentUser.avatar || null);
    }
  }, [currentUser]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const updates: { displayName?: string; bio?: string; avatar?: File } = {};
    if (displayName !== currentUser.displayName) {
      updates.displayName = displayName;
    }
    if (bio !== currentUser.bio) {
      updates.bio = bio;
    }
    if (avatarFile) {
      updates.avatar = avatarFile;
    }
    await onSubmit(updates);
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-green-400">تعديل الملف الشخصي</DialogTitle>
          <DialogDescription>
            قم بتحديث معلومات ملفك الشخصي هنا.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="w-24 h-24 ring-2 ring-green-500">
              <AvatarImage src={avatarPreview || ''} />
              <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <Input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <Label
              htmlFor="avatar-upload"
              className="cursor-pointer text-green-400 hover:underline"
            >
              تغيير الصورة
            </Label>
          </div>
          <div>
            <Label htmlFor="displayName" className="text-gray-300">الاسم الظاهر</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="bg-gray-800 border-gray-600"
            />
          </div>
          <div>
            <Label htmlFor="bio" className="text-gray-300">النبذة التعريفية</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="bg-gray-800 border-gray-600"
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="border-gray-600 text-gray-300 hover:bg-gray-700">
              إلغاء
            </Button>
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
