import { useState, useEffect } from 'react';
import { onAuthChange, getUserProfile, signOutUser } from './firebase/auth';
import { createPost, listenToPosts, updatePost, createStory, getActiveStories, addComment, getComments, getConversations, updateUserProfile } from './firebase/database';
import { uploadAvatar } from './firebase/storage';
import { Navigation } from './components/Navigation';
import { PublicChat } from './components/PublicChat';
import { DirectMessages } from './components/DirectMessages';
import { Profile } from './components/Profile';
import { LikedPosts } from './components/LikedPosts';
import { ChatWindow } from './components/ChatWindow';
import { StoryViewer } from './components/StoryViewer';
import { CommentsModal } from './components/CommentsModal';
import { ShareModal } from './components/ShareModal';
import { UserProfile } from './components/UserProfile';
import { AddStoryModal } from './components/AddStoryModal';
import { AuthModal } from './components/AuthModal';
import { CreatePost } from './components/CreatePost';
import { EditProfileModal } from './components/EditProfileModal';
import { Code } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'feed' | 'chat' | 'messages' | 'likes' | 'profile'>('feed');
  const [user, setUser] = useState<any>(null); // Firebase auth user
  const [userProfile, setUserProfile] = useState<any>(null); // User profile from Firestore
  const [loading, setLoading] = useState(true);
  
  // Firestore data states
  const [posts, setPosts] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [likedPosts, setLikedPosts] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  
  // Modal and state management
  const [currentChatUser, setCurrentChatUser] = useState<any>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [currentStoryUserIndex, setCurrentStoryUserIndex] = useState(0);
  const [currentStoryContentIndex, setCurrentStoryContentIndex] = useState(0);
  const [showAddStoryModal, setShowAddStoryModal] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [currentPostForComments, setCurrentPostForComments] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentPostForShare, setCurrentPostForShare] = useState<string | null>(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  const handleDevModeToggle = () => {
    const pass = prompt('أدخل رمز المطور:');
    if (pass === '9760') {
      console.log('Developer mode activated');
      const devUser = { uid: 'dev_user_01' };
      const devProfile = {
        uid: 'dev_user_01',
        username: 'developer',
        displayName: 'المطور',
        avatar: 'https://firebasestorage.googleapis.com/v0/b/darklight-chat.appspot.com/o/profile-pictures%2Fdefault_avatar.png?alt=media&token=0default-avatar-token',
        bio: 'أنا أستخدم وضع المطور لتجربة التطبيق.',
        postsCount: 42,
        followersCount: 1337,
        followingCount: 42,
        isGuest: false,
      };
      setUser(devUser);
      setUserProfile(devProfile);
      setLoading(false);
    } else if (pass) {
      alert('الرمز غير صحيح!');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthChange(async (authUser) => {
      if (authUser) {
        try {
          const profile = await getUserProfile(authUser.uid);
          if (profile) {
            setUser(authUser);
            setUserProfile(profile);
          } else {
            console.warn("No user profile found for authenticated user. Signing out to resolve inconsistency.");
            await signOutUser();
            setUser(null);
            setUserProfile(null);
          }
        } catch (error) {
          console.error("Error fetching user profile, signing out:", error);
          await signOutUser();
          setUser(null);
          setUserProfile(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && userProfile) {
      const unsubscribePosts = listenToPosts(setPosts);
      const unsubscribeConversations = getConversations(user.uid, setConversations);
      const fetchStories = async () => {
        const activeStories = await getActiveStories();
        setStories(activeStories);
      };
      fetchStories();
      return () => {
        unsubscribePosts();
        unsubscribeConversations();
      };
    } else {
      setPosts([]);
      setStories([]);
      setConversations([]);
      setLikedPosts([]);
      setComments([]);
    }
  }, [user, userProfile]);

  const handleCreatePost = async (content: string) => {
    if (!userProfile) return;
    const postData = {
      content,
      userId: userProfile.uid,
      username: userProfile.username,
      displayName: userProfile.displayName,
      avatar: userProfile.avatar,
      likes: 0,
      replies: 0,
      likedBy: [],
    };
    await createPost(postData);
    setShowCreatePost(false);
  };

  const handleLike = async (postId: string) => {
    if (!user) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const isLiked = post.likedBy.includes(user.uid);
    const newLikedBy = isLiked
      ? post.likedBy.filter((uid: string) => uid !== user.uid)
      : [...post.likedBy, user.uid];
    await updatePost(postId, {
      likedBy: newLikedBy,
      likes: newLikedBy.length,
    });
  };

  const handleAddComment = async (postId: string, content: string) => {
    if (!userProfile) return;
    const commentData = {
      postId,
      content,
      userId: userProfile.uid,
      username: userProfile.username,
      displayName: userProfile.displayName,
      avatar: userProfile.avatar,
    };
    await addComment(commentData);
    const post = posts.find(p => p.id === postId);
    if (post) {
      await updatePost(postId, { replies: (post.replies || 0) + 1 });
    }
  };

  const handleAddStory = async (content: string, type: 'text' | 'image') => {
    if (!user) return;
    const storyContent = {
      type,
      content,
      backgroundColor: type === 'text' ? '#1f2937' : undefined,
    };
    await createStory(user.uid, storyContent);
    setShowAddStoryModal(false);
    const activeStories = await getActiveStories();
    setStories(activeStories);
  };

  const handleUpdateProfile = async (updates: { displayName?: string; bio?: string; avatar?: File }) => {
    if (!userProfile) return;
    const dbUpdates: { displayName?: string; bio?: string; avatar?: string } = {};
    if (updates.displayName) dbUpdates.displayName = updates.displayName;
    if (updates.bio) dbUpdates.bio = updates.bio;
    if (updates.avatar) {
      const avatarUrl = await uploadAvatar(userProfile.uid, updates.avatar);
      dbUpdates.avatar = avatarUrl;
    }
    if (Object.keys(dbUpdates).length > 0) {
      await updateUserProfile(userProfile.uid, dbUpdates);
    }
    const updatedProfile = await getUserProfile(userProfile.uid);
    setUserProfile(updatedProfile);
    setShowEditProfileModal(false);
  };

  const handleStoryClick = (clickedStory: any) => {
    const userIndex = stories.findIndex(story => story.userId === clickedStory.userId);
    if (userIndex !== -1) {
      setCurrentStoryUserIndex(userIndex);
      setCurrentStoryContentIndex(0);
      setShowStoryViewer(true);
    }
  };

  const handleNextStory = () => {
    const currentUserStories = stories[currentStoryUserIndex]?.stories;
    if (currentStoryContentIndex < currentUserStories.length - 1) {
      setCurrentStoryContentIndex(prev => prev + 1);
    } else if (currentStoryUserIndex < stories.length - 1) {
      setCurrentStoryUserIndex(prev => prev + 1);
      setCurrentStoryContentIndex(0);
    } else {
      setShowStoryViewer(false);
    }
  };

  const handlePreviousStory = () => {
    if (currentStoryContentIndex > 0) {
      setCurrentStoryContentIndex(prev => prev - 1);
    } else if (currentStoryUserIndex > 0) {
      const prevUserIndex = currentStoryUserIndex - 1;
      const prevUserStories = stories[prevUserIndex].stories;
      setCurrentStoryUserIndex(prevUserIndex);
      setCurrentStoryContentIndex(prevUserStories.length - 1);
    }
  };

  const handleUserClick = async (userId: string) => {
    const profile = await getUserProfile(userId);
    setCurrentUserProfile(profile);
  };

  const handleConversationClick = (conversation: any) => {
    if (conversation.otherUser) {
      setCurrentChatUser(conversation.otherUser);
    } else {
      console.error("Conversation is missing otherUser property", conversation);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">تحميل Dark*Chat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black">
        <AuthModal
          isOpen={true}
          onClose={() => {}}
          onDevModeToggle={handleDevModeToggle}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black" dir="rtl">
      <Navigation 
        currentView={currentView} 
        onViewChange={setCurrentView}
        unreadCount={conversations.reduce((total, conv) => total + (conv.unreadCount || 0), 0)}
      />
      
      {currentUserProfile && (
        <UserProfile
          profile={currentUserProfile}
          onBack={() => setCurrentUserProfile(null)}
          onMessage={() => {
            setCurrentChatUser(currentUserProfile);
            setCurrentUserProfile(null);
          }}
        />
      )}
      
      {currentChatUser && (
        <ChatWindow
          user={currentChatUser}
          onBack={() => setCurrentChatUser(null)}
          currentUserId={user.uid}
        />
      )}
      
      {showStoryViewer && stories.length > 0 && (
        <StoryViewer
          stories={stories}
          currentStoryIndex={currentStoryUserIndex}
          currentContentIndex={currentStoryContentIndex}
          onClose={() => setShowStoryViewer(false)}
          onNext={handleNextStory}
          onPrevious={handlePreviousStory}
          onReply={(storyId, message) => console.log('Reply to story:', storyId, message)}
        />
      )}
      
      <AddStoryModal
        isOpen={showAddStoryModal}
        onClose={() => setShowAddStoryModal(false)}
        onSubmit={handleAddStory}
      />
      
      <CreatePost
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onSubmit={handleCreatePost}
      />
      
      <CommentsModal
        isOpen={showCommentsModal}
        onClose={() => {
          setShowCommentsModal(false);
          setCurrentPostForComments(null);
          setComments([]);
        }}
        postId={currentPostForComments || ''}
        comments={comments}
        onAddComment={handleAddComment}
      />
      
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        postId={currentPostForShare || ''}
        users={[]}
        onShare={(postId, userIds, message) => console.log('Share post:', postId, userIds, message)}
      />

      {userProfile && (
        <EditProfileModal
          isOpen={showEditProfileModal}
          onClose={() => setShowEditProfileModal(false)}
          onSubmit={handleUpdateProfile}
          currentUser={userProfile}
        />
      )}
      
      <div className={currentChatUser || currentUserProfile ? 'hidden' : ''}>
        {currentView === 'feed' && (
          <PublicChat
            posts={posts}
            stories={stories}
            onLike={handleLike}
            onReply={async (postId) => {
              const postComments = await getComments(postId);
              setComments(postComments);
              setCurrentPostForComments(postId);
              setShowCommentsModal(true);
            }}
            onShare={(postId) => {
              setCurrentPostForShare(postId);
              setShowShareModal(true);
            }}
            onStoryClick={handleStoryClick}
            onUserClick={handleUserClick}
            onAddStory={() => setShowAddStoryModal(true)}
            onCreatePost={() => setShowCreatePost(true)}
            currentUserId={user?.uid}
            currentUser={userProfile}
          />
        )}
        
        {currentView === 'messages' && (
          <DirectMessages
            conversations={conversations}
            onConversationClick={handleConversationClick}
          />
        )}
        
        {currentView === 'likes' && (
          <LikedPosts
            likedPosts={posts.filter(p => p.likedBy.includes(user.uid))}
            onUnlike={handleLike}
            onReply={async (postId) => {
              const postComments = await getComments(postId);
              setComments(postComments);
              setCurrentPostForComments(postId);
              setShowCommentsModal(true);
            }}
            onShare={(postId) => {
              setCurrentPostForShare(postId);
              setShowShareModal(true);
            }}
          />
        )}
        
        {currentView === 'profile' && userProfile && (
          <Profile
            profile={userProfile}
            isOwnProfile={true}
            onEditProfile={() => setShowEditProfileModal(true)}
            onShareProfile={() => console.log("Share profile clicked")}
            onFollow={() => console.log("Follow clicked")}
          />
        )}
      </div>
    </div>
  );
}
