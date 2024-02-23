import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import DateTimePicker from 'react-native-ui-datepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { RootState, counterSlice } from './_layout';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { Link, useRouter } from 'expo-router';
import Restart from 'react-native-restart';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
type RootStackParamList = {
  Home: undefined;
  debts: undefined;
};
type CreateScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'debts'
>;

export default function AddSfLogScreen() {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      notes: '',
      amount: '',
      date: '',
      dateAdded: '',
    },
  });
  const [showDTPicker, setShowDTPicker] = useState(false);
  const [date, setDate] = useState(dayjs());
  const dataIdentifier = useSelector(
    (state: RootState) => state.data.identifier
  );
  const dataList = useSelector((state: RootState) => state.data.value);
  const itemOnView = useSelector((state: RootState) => state.viewing);
  const dataOnEdit = useSelector((state: RootState) => state.dataOnEdit);
  const dispatch = useDispatch();

  const appData = useSelector((state: RootState) => state.data);

  const onSubmit = (data: any) => {
    if (data.amount == '') {
      data.amount = '0';
    }
    if (data.notes == '') {
      data.notes = 'No notes';
    }
    const sfInfoItems = (itemOnView as any).scheduledFundsInfo;
    const sfInfoIndex = (dataOnEdit as any).index;
    const sfInfoItemOnEdit = (dataOnEdit as any).scheduledFundsInfo;

    const newDebtInfoOnEdit = {
      ...sfInfoItemOnEdit,
      sfLogs: [...sfInfoItemOnEdit.sfLogs, data],
    };

    const newSfInfoItems = [...sfInfoItems];
    newSfInfoItems[sfInfoIndex] = newDebtInfoOnEdit;

    const newItemOnView = {
      ...itemOnView,
      scheduledFundsInfo: newSfInfoItems,
    };

    dispatch(counterSlice.actions.updateViewing({ ...newItemOnView }));

    const itemOnViewIndex = (dataList as []).findIndex(
      (obj: any) => obj.dateAdded === (itemOnView as any).dateAdded
    );
    const newDataList = [...dataList];

    (newDataList as any)[itemOnViewIndex] = newItemOnView;
    console.log(newDataList);
    dispatch(
      counterSlice.actions.updateData({
        identifier: dataIdentifier,
        value: newDataList,
      })
    );
  };
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView>
        <View style={styles.controllerContainer}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Notes"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.text}
              />
            )}
            name="notes"
          />
        </View>
        <View style={styles.controllerContainer}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Amount Received"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType={'number-pad'}
                style={styles.text}
              />
            )}
            name="amount"
          />
        </View>

        <View style={styles.controllerContainer}>
          <Controller control={control} name="date" render={() => <></>} />
          <Pressable onPress={() => setShowDTPicker(!showDTPicker)}>
            <Text style={styles.text}>
              {'Date:        ' + dayjs(date).format('MMMM DD, YYYY')}
            </Text>
          </Pressable>
          {showDTPicker && (
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <DateTimePicker
                  value={date}
                  onValueChange={(date: any) => {
                    setDate(date);
                    setShowDTPicker(false);
                  }}
                  mode="date"
                />
              )}
              name="date"
            />
          )}
        </View>
      </ScrollView>
      <Link href={'/(tabs)/scheduledfunds'} asChild style={styles.subtmitBtn}>
        <Pressable
          onPress={() => {
            setValue('date', date.toString());
            setValue('dateAdded', dayjs().toString());
            handleSubmit(onSubmit)();
          }}
        >
          <AntDesign name="checkcircle" size={50} color="#eaf7da" />
        </Pressable>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controllerContainer: {
    borderRadius: 10,
    backgroundColor: '#DCEDC8',
    padding: 10,
    margin: 10,
  },
  subtmitBtn: {
    alignSelf: 'center',
    padding: 10,
    margin: 50,
  },
  safeAreaView: {
    backgroundColor: '#8DA750',
    flex: 1,
  },
  text: {
    color: '#003300',
  },
});
