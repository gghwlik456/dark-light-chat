import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD3LkYqJE5Y_TR6A6UnajL304eyL4zO2lM",
  authDomain: "darklight-chat.firebaseapp.com",
  projectId: "darklight-chat",
  storageBucket: "darklight-chat.firebasestorage.app",
  messagingSenderId: "425772939802",
  appId: "1:425772939802:web:5ba327426570f1b0d82fa3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

export default app;
