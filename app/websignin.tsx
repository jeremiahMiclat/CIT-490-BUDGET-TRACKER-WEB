import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
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
import {
  deleteField,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { useFocusEffect, useRouter } from 'expo-router';
import GoogleButton from 'react-google-button';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

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

  const router = useRouter();
  const setLocalData = async (item: any) => {
    setLoading(true);
    try {
      const newValue = JSON.parse(item.value);
      const newData = {
        identifier:
          'From cloud (' + dayjs().format('MMMM D, YYYY h:mm:ss A') + ')',
        value: newValue.value,
      };
      const startTime = Date.now();

      dispatch(counterSlice.actions.updateData(newData));

      const timeElapsed = Date.now() - startTime;

      if (timeElapsed < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000 - timeElapsed));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      router.replace('/');
    }
  };

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

  const deleteCloudData = async (itemToDelete: any) => {
    const collectionName = 'Users';
    const documentId = userData.id as unknown as string;
    const fieldName = itemToDelete.fieldName;

    if (userData.isLoggedIn) {
      try {
        const documentRef = doc(db, 'Users', documentId);

        // Use update method to remove the field
        await updateDoc(documentRef, {
          [fieldName]: deleteField(),
        });
        setDataFetched(false);
        console.log('Field deleted successfully.');
      } catch (error) {
        console.error('Error deleting field:', error);
      }
    }
  };

  const renderCloudData = ({ item }: any) =>
    userData.isLoggedIn ? (
      <View style={styles.itemContainer}>
        <View style={styles.itemWrapper}>
          <Pressable
            style={styles.flPressable}
            onPress={() => setLocalData(item)}
          >
            <Text style={styles.flatListItemText}>{item.fieldName}</Text>
          </Pressable>
          <Pressable
            style={styles.flPressable}
            onPress={() => deleteCloudData(item)}
          >
            <MaterialIcons
              name="delete"
              size={24}
              color="#537B2F"
              style={styles.delBtn}
            />
          </Pressable>
        </View>
      </View>
    ) : (
      <View />
    );

  return (
    <View style={styles.safeAreaView}>
      {userData.isLoggedIn ? (
        <View style={styles.container}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>
              Hello {(userProfile as any).displayName}
            </Text>
            <Pressable onPress={handleSignOut} style={styles.signOutBtn}>
              <Text style={styles.signOutBtnText}>Sign Out</Text>
              <FontAwesome name="sign-out" size={24} color="#DCEDC8" />
            </Pressable>
          </View>

          <View style={styles.flatListContainer}>
            <Text style={styles.flatListContainerHeader}>
              Click to Load Saved Data:{' '}
            </Text>
            <FlatList
              data={cloudData as any}
              renderItem={renderCloudData}
              keyExtractor={item => item.fieldName}
            />
          </View>
        </View>
      ) : (
        <GoogleButton onClick={signIn} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  safeAreaView: {
    backgroundColor: '#8DA750',
    flex: 1,
  },
  welcomeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    margin: 20,
  },
  welcomeText: {
    color: '#DCEDC8',
    marginLeft: 10,
    fontSize: 20,
  },
  signOutBtn: {
    alignSelf: 'center',
    marginRight: 10,
    flexDirection: 'row',
  },
  signOutBtnText: { color: '#DCEDC8', marginRight: 10 },
  flatListContainer: {
    borderRadius: 10,
    backgroundColor: '#DCEDC8',
    padding: 10,
    margin: 10,
    flex: 1,
  },
  flatListContainerHeader: {
    color: '#003300',
    alignSelf: 'center',
    padding: 10,
  },
  flPressable: {
    padding: 20,
  },
  itemContainer: {
    justifyContent: 'space-between',
    margin: 5,
  },
  itemWrapper: {
    backgroundColor: '#eaf7da',
  },
  flatListItemText: {
    fontSize: 12,
    color: '#003300',
  },
  delBtn: {
    alignSelf: 'center',
  },
});
