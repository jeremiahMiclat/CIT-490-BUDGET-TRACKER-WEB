import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const uploadToFirestore = async (data: any, user: any) => {
  const uploadRef = doc(db, 'Users', user.id);
  setDoc(
    uploadRef,
    {
      current: JSON.stringify(data),
    },
    { merge: true }
  );
};
