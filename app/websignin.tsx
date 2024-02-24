import { Pressable, StyleSheet } from 'react-native';
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
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useFocusEffect } from 'expo-router';

export default function SignInScreen() {
  const userData = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const localData = useSelector((state: RootState) => state.data);
  const [loading, setLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const saveData = async (data: string) => {
    await AsyncStorage.setItem('btData', data);
    setDataFetched(true);
  };
  useEffect(() => {
    saveData(JSON.stringify(localData));
  }, [localData, dataFetched]);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      const fetchInitialData = async () => {
        try {
          if (userData && userData.id && !dataFetched) {
            const docRef = doc(db, 'Users', userData.id);
            const docSnap = await getDoc(docRef);
            const cloudUserData = docSnap.data();
            const transformedData = Object.entries(cloudUserData as {}).map(
              ([fieldName, value]) => ({
                fieldName,
                value,
              })
            );
            console.log('transformedData', transformedData);
            let newUserData = {
              isLoggedIn: true,
              id: userData.id,
              existingData: transformedData as [],
              userProfile: userData.userProfile,
            };
            dispatch(counterSlice.actions.updateUser(newUserData));
            setDataFetched(true); // Mark data as fetched
          }
        } catch (error) {
          // Handle error
        } finally {
          setLoading(false);
        }
      };

      fetchInitialData();
    }, [userData, dataFetched])
  );

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
        // The signed-in user info.
        user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
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
    signOut(auth)
      .then(async () => {
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
  }

  return (
    <View>
      <Pressable onPress={signIn}>
        <Text>Sign In</Text>
      </Pressable>
      <Pressable onPress={handleSignOut}>
        <Text>Sign Out</Text>
      </Pressable>
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
