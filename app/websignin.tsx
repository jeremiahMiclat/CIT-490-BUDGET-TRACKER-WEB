import { FlatList, Pressable, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-native';
// import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { auth, db, provider } from '../firebaseConfig';
import SignInComponent from '../components/SignIn';
import { signInWithPopup, signOut } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, counterSlice } from './_layout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { useFocusEffect } from 'expo-router';
import GoogleButton from 'react-google-button';
import { FontAwesome } from '@expo/vector-icons';

export default function SignInScreen() {
  const userData = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const localData = useSelector((state: RootState) => state.data);
  const [loading, setLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(true);
  const flData = userData.existingData;
  const userProfile = userData.userProfile;
  const isLogged = userData.isLoggedIn;
  const saveData = async (data: string) => {
    await AsyncStorage.setItem('btData', data);
    setDataFetched(true);
  };
  const [cloudData, setCloudData] = useState({} || undefined);

  useEffect(() => {
    saveData(JSON.stringify(localData));
  }, [localData, dataFetched]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     setLoading(true);
  //     const fetchInitialData = async () => {
  //       try {
  //         if (userData && userData.id && !dataFetched) {
  //           const docRef = doc(db, 'Users', userData.id);
  //           const docSnap = await getDoc(docRef);
  //           console.log('doc snap', docSnap);
  //           const cloudUserData = docSnap.data();
  //           console.log('cloud data', cloudUserData);
  //           console.log('id', userData.id);
  //           const transformedData = Object.entries(cloudUserData as {}).map(
  //             ([fieldName, value]) => ({
  //               fieldName,
  //               value,
  //             })
  //           );

  //           let newUserData = {
  //             isLoggedIn: true,
  //             id: userData.id,
  //             existingData: transformedData as [],
  //             userProfile: userData.userProfile,
  //           };
  //           dispatch(counterSlice.actions.updateUser(newUserData));
  //           setDataFetched(true); // Mark data as fetched
  //         }
  //       } catch (error) {
  //         // Handle error
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchInitialData();
  //   }, [dataFetched])
  // );

  useEffect(() => {
    if (userData.isLoggedIn) {
      const unsub = onSnapshot(doc(db, 'Users', (userData as any).id), doc => {
        const source = doc.metadata.hasPendingWrites ? 'Local' : 'Server';
        console.log(source, ' data: ', doc.data());
        const transformedData = Object.entries(doc.data() as {}).map(
          ([fieldName, value]) => ({
            fieldName,
            value,
          })
        );
        setCloudData(transformedData);
      });

      console.log('unsub', cloudData);
    }
    setDataFetched(true);
  }, [dataFetched]);

  async function signIn() {
    if (userData.isLoggedIn) {
      console.log('User already logged');
      return;
    }
    let user;
    let fieldData = localData as any;
    try {
      if (auth && provider) {
        const result = await signInWithPopup(auth, provider);
        user = result.user;
        const uid = (user as any).auth.currentUser.uid;
        const displayName = (user as any).auth.currentUser.displayName;
        if (displayName != undefined && uid != undefined) {
          const userData = {
            isLoggedIn: true,
            id: uid,
            userProfile: { displayName: displayName },
          };
          dispatch(counterSlice.actions.updateUser(userData));
          await AsyncStorage.setItem('user', JSON.stringify(userData));

          // Upload existing data to cloud
          const upload = async () => {
            const todate = dayjs();
            const newFieldName =
              'Date uploaded' +
              ' - (' +
              todate.format('MMMM D, YYYY h:mm:ss A') +
              ')';
            const uploadRef = doc(db, 'Users', uid);
            setDoc(
              uploadRef,
              { [newFieldName]: JSON.stringify(fieldData) },
              { merge: true }
            );
            // await db()
            //   .collection('Users')
            //   .doc(uid)
            //   .set(
            //     { [newFieldName]: JSON.stringify(fieldData) },
            //     { merge: true }
            //   );
            console.log('Data uploaded!');
          };
          const isEmpty =
            !localData.value || Object.keys(localData.value).length === 0;
          if (localData && !isEmpty) {
            await upload();
          } else {
            console.log('no data to upload');
          }
          setDataFetched(false);
        }
      } else {
        throw new Error('Authentication object is null. Unable to sign in.');
      }
    } catch (error) {
      // Handle Errors here.
      console.error('Sign-in failed:', error);
      throw error; // Re-throw the error for the caller to handle if needed
    }
  }

  async function handleSignOut() {
    try {
      signOut(auth)
        .then(async () => {
          setCloudData(undefined);
          const newUserData = {
            isLoggedIn: false,
            id: null,
            existingData: [{ fieldName: 'no data' }],
          };
          dispatch(counterSlice.actions.updateUser(newUserData));
          const jsonValue = JSON.stringify(newUserData);
          await AsyncStorage.setItem('user', jsonValue);
          console.log('successful signout');
        })
        .catch(error => {
          console.log('error signout');
        });
    } catch (error) {
      console.log(error);
    }
  }

  const renderCloudData = ({ item }: any) =>
    userData.isLoggedIn ? (
      <View>
        <Text>{item.fieldName}</Text>
      </View>
    ) : (
      <View />
    );

  return (
    <View>
      {userData.isLoggedIn ? (
        <View>
          <Text>Hello {(userProfile as any).displayName}</Text>
          <Pressable onPress={handleSignOut}>
            <Text>Sign Out</Text>
            <FontAwesome name="sign-out" size={24} color="#DCEDC8" />
          </Pressable>
        </View>
      ) : (
        <GoogleButton onClick={signIn} />
      )}

      <FlatList
        data={cloudData as any}
        renderItem={renderCloudData}
        keyExtractor={item => item.fieldName}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
