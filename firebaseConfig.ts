import { initializeApp } from 'firebase/app';
import {
  Auth,
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { Platform } from 'react-native';

let auth: Auth | null = null;
let provider: GoogleAuthProvider | null = null;
let db: Firestore | null = null;

const firebaseConfig = {
  apiKey: 'AIzaSyBV2t1mZTFBOlYcMV5d0xstojiOesVblrQ',
  authDomain: 'cit-490-846c7.firebaseapp.com',
  projectId: 'cit-490-846c7',
  storageBucket: 'cit-490-846c7.appspot.com',
  messagingSenderId: '774298954456',
  appId: '1:774298954456:web:84cc61cf5ff0ae7f7185ad',
};

if (Platform.OS === 'web') {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  provider = new GoogleAuthProvider();
  db = getFirestore(app);
}

export { auth, provider, db };
