import firestore from '@react-native-firebase/firestore';

export const uploadToFirestore = async (data: any, user: any) => {
  firestore()
    .collection('Users')
    .doc(user.id)
    .set(
      {
        current: JSON.stringify(data),
      },
      { merge: true }
    )
    .then(() => {
      console.log('auto uploaded');
    });
};
