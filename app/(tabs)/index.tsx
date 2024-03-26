import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import { Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import { db } from '../../firebaseConfig';
// import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, counterSlice } from '../_layout';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import dayjs from 'dayjs';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { uploadToFirestore } from '../../functions/webAutoUpload';

type RootStackParamList = {
  Home: undefined;
  create: undefined;
  budgetplan: undefined;
};
type CreateScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'create',
  'budgetplan'
>;

interface DataProps {
  planName: string;
}

export default function HomeScreen() {
  const data = useSelector((state: RootState) => state.data);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigator = useNavigation<CreateScreenNavigationProp>();
  const handleNavToCreate = () => {
    navigator.navigate('(create)' as any);
  };
  const handleNavToBudgetPlan = () => {
    navigator.navigate('budgetplan');
  };
  const handleDeleteItem = async (index: any) => {
    try {
      const newValue = [...data.value];
      newValue.splice(index, 1);
      const newData = {
        identifier:
          'Last Modified: ' + dayjs().format('MMMM D, YYYY h:mm:ss A'),
        value: newValue,
      };

      dispatch(counterSlice.actions.updateData(newData));

      await AsyncStorage.setItem('btData', JSON.stringify(newData));
    } catch (error) {
      console.log(error);
    }
  };
  const saveData = async (data: string) => {
    await AsyncStorage.setItem('btData', data);
  };

  const renderHeader = () => {
    return data.value.length < 1 ? (
      <View style={styles.flheaderContainer}>
        <Text style={styles.flheader}>No saved plans</Text>
      </View>
    ) : (
      <View style={styles.divider}></View>
    );
  };

  const renderItem = ({ item, index }: any) => (
    <View style={styles.itemsContainer}>
      <Pressable
        style={styles.item}
        onPress={() => {
          dispatch(counterSlice.actions.updateViewing(item));
          handleNavToBudgetPlan();
        }}
      >
        <Text style={styles.planNameStyle}>{item?.planName}</Text>
      </Pressable>
      <Pressable onPress={() => handleDeleteItem(index)} style={styles.delBtn}>
        <AntDesign name="delete" size={18} color="#003300" />
      </Pressable>
    </View>
  );

  useEffect(() => {
    try {
      if (user.isLoggedIn && data.value.length > 0) {
        uploadToFirestore(data, user);
      }
    } catch (error) {
      console.log(error);
    }
  }, [data]);

  const isMounted = useRef(false);

  useEffect(() => {
    // Skip the effect on the initial render
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    try {
      console.log('data is updated', data);
      saveData(JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
  }, [data]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const testData = { planName: 'test' };
        const stringedTestData = JSON.stringify(testData);
        // await AsyncStorage.removeItem('btData');
        // await AsyncStorage.setItem('btData', stringedTestData);
        const localData = await AsyncStorage.getItem('btData');
        const localUser = await AsyncStorage.getItem('user');
        if (localData) {
          // console.log('local data is', localData);
          dispatch(counterSlice.actions.updateData(JSON.parse(localData)));
        }
        if (localUser) {
          const parsedUserData = JSON.parse(localUser);
          dispatch(counterSlice.actions.updateUser(parsedUserData));
        }
      } catch (error) {}
    };
    fetchInitialData();
  }, []);

  // async function getTestData() {
  //   let data;
  //   if (db) {
  //     try {
  //       const testDocRef = doc(db, 'Users', 'test');
  //       const testDocSnap = await getDoc(testDocRef);
  //       data = testDocSnap.data();
  //     } catch (error) {
  //       throw new Error('Firebase firestore error');
  //     }
  //   }

  //   if (data) {
  //     return data.data;
  //   }
  // }

  // if (Platform.OS === 'web') {
  //   getTestData()
  //     .then(testData => {
  //       console.log(testData);
  //     })
  //     .catch(error => {
  //       console.error(error.message);
  //     });
  // }

  const renderFLFooter = () => {
    return (
      <View style={styles.flFooter}>
        <Pressable onPress={() => handleNavToCreate()}>
          <Ionicons name="add-circle-sharp" size={24} color="black" />
          <Text>Create New Plan</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <FlatList
        style={styles.flContainer}
        ListHeaderComponent={renderHeader}
        // ListFooterComponent={renderFLFooter}
        data={data.value}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.dateAdded}
      />
      <View style={styles.flFooter}>
        <Pressable onPress={() => handleNavToCreate()} style={styles.row}>
          {/* <Text>Add New Plan</Text> */}
          <Ionicons name="add-circle-sharp" size={50} color="#DCEDC8" />
        </Pressable>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F0F3F4',
    backgroundColor: '#8DA750',
  },
  flheader: {
    // alignSelf: 'center',
    position: 'relative',
    top: 0,
    margin: 10,
    padding: 20,
  },
  flFooter: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
    margin: 10,
    marginBottom: 50,
    flexDirection: 'row',
  },
  flContainer: {},
  itemsContainer: {
    flexDirection: 'row',
    backgroundColor: '#DCEDC8',
    margin: 10,
    padding: 20,
    borderRadius: 10,
  },
  item: {
    flex: 8,
  },
  divider: {
    margin: 10,
  },
  row: { flexDirection: 'row' },
  delBtn: {
    flex: 2,
    alignItems: 'flex-end',
  },
  planNameStyle: {
    color: '#003300',
  },
  flheaderContainer: {
    backgroundColor: '#DCEDC8',
    margin: 20,
    borderRadius: 10,
  },
});
