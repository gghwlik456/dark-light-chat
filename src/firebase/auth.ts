import {
  auth,
  db
} from './config';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  NextOrObserver
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore';

// Helper function to create a user document in Firestore
const createUserDocument = async (user: User, additionalData: any) => {
  if (!user) return;
  const userRef = doc(db, 'users', user.uid);

  try {
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      const {
        displayName,
        username
      } = additionalData;
      const createdAt = new Date();
      const defaultAvatar = 'https://firebasestorage.googleapis.com/v0/b/darklight-chat.appspot.com/o/profile-pictures%2Fdefault_avatar.png?alt=media&token=0default-avatar-token'; // Replace with your actual default avatar URL

      await setDoc(userRef, {
        displayName,
        username: username.toLowerCase(),
        email: user.email,
        createdAt,
        avatar: defaultAvatar,
        bio: `مرحباً! أنا ${displayName} في Dark*Chat`,
        postsCount: 0,
        followersCount: 0,
        followingCount: 0,
        isGuest: additionalData.isGuest || false,
        ...additionalData,
      });
    }
    return userRef;
  } catch (error) {
    console.error("Error in createUserDocument:", error);
    // Re-throw the error to ensure the entire authentication flow fails if the
    // user document cannot be created or read. This prevents inconsistent states.
    throw error;
  }
};


// Register a new user
export const registerUser = async (username: string, displayName: string, password: string): Promise<User> => {
  const email = `${username.toLowerCase()}@darkchat.app`; // Create a dummy email
  const {
    user
  } = await createUserWithEmailAndPassword(auth, email, password);
  await createUserDocument(user, {
    username,
    displayName
  });
  return user;
};

// Sign in a user
export const signInUser = async (username: string, password: string): Promise<User> => {
  const email = `${username.toLowerCase()}@darkchat.app`; // Use the same dummy email convention
  const {
    user
  } = await signInWithEmailAndPassword(auth, email, password);
  return user;
};

// Sign in as a guest
export const signInAsGuest = async (): Promise<User> => {
  const {
    user
  } = await signInAnonymously(auth);
  const randomNum = Math.floor(Math.random() * 900000) + 100000;
  const guestName = `Anonymous${randomNum}`;
  await createUserDocument(user, {
    username: guestName.toLowerCase(),
    displayName: guestName,
    isGuest: true
  });
  return user;
};

// Sign out the current user
export const signOutUser = () => signOut(auth);

// Observer for auth state changes
export const onAuthChange = (callback: NextOrObserver<User | null>) => onAuthStateChanged(auth, callback);

// Define a type for the user profile
interface UserProfile {
  uid: string;
  username: string;
  displayName: string;
  avatar: string;
  [key: string]: any; // Allow other properties
}

// Get user profile from Firestore
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (!uid) return null;
  const userRef = doc(db, 'users', uid);
  const snapshot = await getDoc(userRef);
  if (snapshot.exists()) {
    return {
      uid,
      ...snapshot.data()
    } as UserProfile;
  }
  return null;
};
