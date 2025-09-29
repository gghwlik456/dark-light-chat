import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

// User functions
export const fetchUserProfile = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    throw new Error('فشل في تحميل الملف الشخصي');
  }
};

export const updateUserProfile = async (userId: string, updates: any) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, updates);
  } catch (error) {
    console.error("Error updating user profile: ", error);
    throw new Error('فشل في تحديث الملف الشخصي');
  }
};

// Posts functions
export const createPost = async (postData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'posts'), {
      ...postData,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    throw new Error('فشل في إنشاء المنشور');
  }
};

export const getPosts = async () => {
  try {
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'), limit(50));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error('فشل في تحميل المنشورات');
  }
};

export const updatePost = async (postId: string, updates: any) => {
  try {
    await updateDoc(doc(db, 'posts', postId), updates);
  } catch (error) {
    throw new Error('فشل في تحديث المنشور');
  }
};

// Stories functions
export const createStory = async (userId: string, storyContent: any) => {
  try {
    const storyRef = doc(collection(db, 'stories'), userId);
    const userStoryDoc = await getDoc(storyRef);

    const newStory = {
      ...storyContent,
      id: Date.now().toString(),
      timestamp: serverTimestamp(),
      viewedBy: []
    };

    if (userStoryDoc.exists()) {
      // Add to existing stories
      const existingStories = userStoryDoc.data().stories || [];
      await updateDoc(storyRef, {
        stories: [...existingStories, newStory],
        updatedAt: serverTimestamp(),
      });
    } else {
      // Create new story document for the user
      await setDoc(storyRef, {
        userId,
        stories: [newStory],
        updatedAt: serverTimestamp(),
        // You might want to store user info here too for easier access
        // e.g., username, avatar from the user's profile
      });
    }
    return newStory.id;
  } catch (error) {
    console.error("Error creating story: ", error);
    throw new Error('فشل في إنشاء الستوري');
  }
};

export const getActiveStories = async () => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const q = query(
      collection(db, 'stories'),
      where('updatedAt', '>=', twentyFourHoursAgo),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    const storiesByUser = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Filter out stories older than 24 hours on the client-side as a fallback
      const activeStories = data.stories.filter((story: any) => {
        return story.timestamp.toDate() > twentyFourHoursAgo;
      });
      
      return {
        userId: doc.id,
        ...data,
        stories: activeStories,
      };
    }).filter(userStories => userStories.stories.length > 0);

    return storiesByUser;
  } catch (error) {
    console.error("Error getting stories: ", error);
    throw new Error('فشل في تحميل الستوريز');
  }
};

// Messages functions
export const getOrCreateChat = async (currentUserId: string, otherUserId: string) => {
  const participants = [currentUserId, otherUserId].sort();
  const chatId = participants.join('_');
  const chatRef = doc(db, 'chats', chatId);
  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists()) {
    await setDoc(chatRef, {
      participants,
      createdAt: serverTimestamp(),
      lastMessage: null,
    });
  }
  return chatId;
};

export const sendMessage = async (chatId: string, messageData: any) => {
  try {
    const messagesColRef = collection(db, 'chats', chatId, 'messages');
    const docRef = await addDoc(messagesColRef, {
      ...messageData,
      timestamp: serverTimestamp(),
    });
    
    // Update last message in the chat document
    await updateDoc(doc(db, 'chats', chatId), {
      lastMessage: {
        text: messageData.content,
        senderId: messageData.senderId,
        timestamp: serverTimestamp(),
      },
    });

    return docRef.id;
  } catch (error) {
    console.error("Error sending message: ", error);
    throw new Error('فشل في إرسال الرسالة');
  }
};

export const getConversations = (userId: string, callback: (conversations: any[]) => void) => {
  const q = query(
    collection(db, 'chats'),
    where('participants', 'array-contains', userId)
  );

  return onSnapshot(q, async (querySnapshot) => {
    const conversationsPromises = querySnapshot.docs.map(async (doc) => {
      const chatData = doc.data();
      const otherUserId = chatData.participants.find((p: string) => p !== userId);
      
      if (otherUserId) {
        const userProfile = await fetchUserProfile(otherUserId);
        
        // Fetch unread messages count
        const messagesRef = collection(db, 'chats', doc.id, 'messages');
        const unreadQuery = query(
          messagesRef,
          where('senderId', '!=', userId),
          where('isRead', '==', false)
        );
        const unreadSnapshot = await getDocs(unreadQuery);
        const unreadCount = unreadSnapshot.size;

        return {
          id: doc.id,
          ...chatData,
          otherUser: userProfile,
          unreadCount: unreadCount,
        };
      }
      return null;
    });

    const conversations = (await Promise.all(conversationsPromises))
      .filter(c => c !== null)
      .sort((a: any, b: any) => {
        const timeA = a.lastMessage?.timestamp?.toDate() || a.createdAt?.toDate() || 0;
        const timeB = b.lastMessage?.timestamp?.toDate() || b.createdAt?.toDate() || 0;
        return timeB - timeA;
      });

    callback(conversations);
  });
};

// Comments functions
export const addComment = async (commentData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'comments'), {
      ...commentData,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    throw new Error('فشل في إضافة التعليق');
  }
};

export const getComments = async (postId: string) => {
  try {
    const q = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      orderBy('timestamp', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error('فشل في تحميل التعليقات');
  }
};

// Real-time listeners
export const listenToMessages = (chatId: string, callback: (messages: any[]) => void) => {
  const messagesColRef = collection(db, 'chats', chatId, 'messages');
  const q = query(messagesColRef, orderBy('timestamp', 'asc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const messages = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Convert Firestore Timestamp to JS Date if needed, then to string/number
        timestamp: data.timestamp?.toDate ? data.timestamp.toDate().getTime() : Date.now(),
      };
    });
    callback(messages);
  });
};

export const listenToPosts = (callback: (posts: any[]) => void) => {
  const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'), limit(50));
  
  return onSnapshot(q, (querySnapshot) => {
    const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(posts);
  });
};
