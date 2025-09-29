import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Ghost, LogIn, UserPlus, ArrowRight, Code } from 'lucide-react';
import { registerUser, signInUser, signInAsGuest } from '../firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDevModeToggle: () => void;
}

type AuthMode = 'options' | 'login' | 'register';

export function AuthModal({ isOpen, onClose, onDevModeToggle }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('options');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Login form
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const resetForms = () => {
    setLoginUsername('');
    setLoginPassword('');
    setRegisterUsername('');
    setRegisterPassword('');
    setConfirmPassword('');
    setDisplayName('');
    setError('');
    setMode('options');
  };

  const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
    return username.length >= 2 && usernameRegex.test(username);
  };

  const validatePassword = (password: string): boolean => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return password.length >= 8 && hasLetter && hasNumber;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername.trim() || !loginPassword.trim()) {
      setError('يرجى ملء جميع الحقول');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signInUser(loginUsername, loginPassword);
      // onSuccess is removed, onAuthChange in App.tsx will handle the state update
    } catch (error: any) {
      console.error("Login Error:", error);
      setError('اسم المستخدم او كلمة المرور غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerUsername.trim() || !registerPassword.trim() || !confirmPassword.trim() || !displayName.trim()) {
      setError('يرجى ملء جميع الحقول');
      return;
    }
    if (!validateUsername(registerUsername)) {
      setError('اسم المستخدم يجب أن يبدأ بحرف ويحتوي على حروف وأرقام انجليزية و _ فقط (حد أدنى حرفين)');
      return;
    }
    if (!validatePassword(registerPassword)) {
      setError('كلمة المرور يجب أن تكون 8 خانات على الأقل وتحتوي على حرف ورقم انجليزي');
      return;
    }
    if (registerPassword !== confirmPassword) {
      setError('كلمة المرور وتأكيد كلمة المرور غير متطابقتين');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await registerUser(registerUsername, displayName, registerPassword);
      // onSuccess is removed, onAuthChange in App.tsx will handle the state update
    } catch (error: any) {
      console.error("Registration Error:", error);
      setError('فشل في إنشاء الحساب. قد يكون اسم المستخدم مستخدماً بالفعل.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInAsGuest();
      // onSuccess is removed, onAuthChange in App.tsx will handle the state update
    } catch (error: any) {
      console.error("Guest Login Error:", error);
      setError('فشل في تسجيل الدخول كضيف. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => {
      if (!open) {
        resetForms();
        onClose();
      }
    }}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md relative" dir="rtl">
        <button
          onClick={onDevModeToggle}
          className="absolute top-2 left-2 z-10 bg-gray-800/50 text-white p-2 rounded-full border border-gray-600 hover:bg-gray-700 transition-colors"
          aria-label="Developer Mode"
        >
          <Code className="h-5 w-5" />
        </button>
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-green-400">
            مرحباً بك في Dark*Chat
          </DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            {mode === 'options' && 'اختر كيف تريد الانضمام للمحادثة'}
            {mode === 'login' && 'سجل دخولك إلى حسابك'}
            {mode === 'register' && 'أنشئ حسابك الجديد'}
          </DialogDescription>
        </DialogHeader>
        
        {mode === 'options' && (
          <div className="space-y-4">
            <Button
              onClick={() => setMode('login')}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <LogIn className="ml-2 h-4 w-4" />
              تسجيل الدخول
            </Button>
            
            <Button
              onClick={() => setMode('register')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <UserPlus className="ml-2 h-4 w-4" />
              إنشاء حساب جديد
            </Button>
            
            <div className="relative">
              <Separator className="bg-gray-600" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-gray-900 px-2 text-gray-400 text-sm">أو</span>
              </div>
            </div>
            
            <Button
              onClick={handleGuestLogin}
              disabled={loading}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white border-gray-600 border"
            >
              <Ghost className="ml-2 h-4 w-4" />
              {loading ? 'جاري الدخول...' : 'الدخول كضيف'}
            </Button>
          </div>
        )}

        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded">
                {error}
              </div>
            )}
            <div>
              <Label htmlFor="loginUsername" className="text-gray-300">
                اسم المستخدم
              </Label>
              <Input
                id="loginUsername"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="اسم المستخدم"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                disabled={loading}
                dir="ltr"
              />
            </div>
            
            <div>
              <Label htmlFor="loginPassword" className="text-gray-300">
                كلمة المرور
              </Label>
              <Input
                id="loginPassword"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="كلمة المرور"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                disabled={loading}
                dir="ltr"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => setMode('options')}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                disabled={loading}
              >
                <ArrowRight className="ml-2 h-4 w-4" />
                رجوع
              </Button>
              <Button
                type="submit"
                disabled={loading || !loginUsername.trim() || !loginPassword.trim()}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {loading ? 'جاري تسجيل الدخول...' : 'دخول'}
              </Button>
            </div>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="displayName" className="text-gray-300">
                الاسم الكامل
              </Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="اسمك الكامل"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                disabled={loading}
                dir="rtl"
              />
            </div>
            
            <div>
              <Label htmlFor="registerUsername" className="text-gray-300">
                اسم المستخدم
              </Label>
              <Input
                id="registerUsername"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value.toLowerCase())}
                placeholder="username"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                disabled={loading}
                dir="ltr"
              />
              <p className="text-xs text-gray-500 mt-1">
                يجب أن يبدأ بحرف، حروف وأرقام انجليزية و _ فقط
              </p>
            </div>
            
            <div>
              <Label htmlFor="registerPassword" className="text-gray-300">
                كلمة المرور
              </Label>
              <Input
                id="registerPassword"
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="كلمة المرور"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                disabled={loading}
                dir="ltr"
              />
              <p className="text-xs text-gray-500 mt-1">
                8 خانات على الأقل، حرف ورقم انجليزي
              </p>
            </div>
            
            <div>
              <Label htmlFor="confirmPassword" className="text-gray-300">
                تأكيد كلمة المرور
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="تأكيد كلمة المرور"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                disabled={loading}
                dir="ltr"
              />
            </div>
            
            {error && (
              <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded">
                {error}
              </div>
            )}
            
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => setMode('options')}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                disabled={loading}
              >
                <ArrowRight className="ml-2 h-4 w-4" />
                رجوع
              </Button>
              <Button
                type="submit"
                disabled={loading || !registerUsername.trim() || !registerPassword.trim() || !confirmPassword.trim() || !displayName.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
