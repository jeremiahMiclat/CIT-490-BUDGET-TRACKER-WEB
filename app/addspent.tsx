import { SafeAreaView } from 'react-native-safe-area-context';
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
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';

import { useForm, Controller, useFieldArray } from 'react-hook-form';
import DateTimePicker from 'react-native-ui-datepicker';
import { useEffect, useState } from 'react';
import { RootState, counterSlice } from './_layout';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import dayjs from 'dayjs';
import { Link } from 'expo-router';

export default function AddDebtInfoScreen() {
  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => state.data);
  const [dataValue, setDataValue] = useState(data.value);
  const onView = useSelector((state: RootState) => state.viewing);
  const [dateIncurred, setDateIncurred] = useState(dayjs());
  const [dateIncurredVisible, setDateIncurredVisible] = useState(false);
  const dueDataInitialValue = dayjs().add(30, 'day');
  const [dueDate, setDueDate] = useState(dueDataInitialValue);
  const [dueDateVisible, setDueDateVisible] = useState(false);
  const [subtmitBtnVisible, setSubmitBtnVisible] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: '',
      amount: '',
      date: dayjs().toString(),
    },
  });

  useEffect(() => {
    // console.log('data', data);
    // console.log('onView', onView);
    // console.log('dataValue', dataValue);
  }, []);

  const handleScreenPress = () => {
    setDateIncurredVisible(false);
    setDueDateVisible(false);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setSubmitBtnVisible(false);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setSubmitBtnVisible(true);
      }
    );

    // Clean up listeners when component unmounts
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const onSubmit = (data: any) => {
    const currSpentLogs = (onView as any).dailyLogs.spent;
    const currReceivedLogs = (onView as any).dailyLogs.received;
    if (data.amount == '') {
      data.amount = '0';
    }
    const newSpentData = [...currSpentLogs, data];
    const currItemOnView = onView;
    const newOnView = {
      ...currItemOnView,
      dailyLogs: { spent: [...newSpentData], received: [...currReceivedLogs] },
    };
    dispatch(
      counterSlice.actions.updateViewing({
        ...newOnView,
      })
    );
    const onViewIndex = (dataValue as []).findIndex(
      (obj: any) => obj.dateAdded == (newOnView as any).dateAdded
    );
    let prevDataValues = [...dataValue];

    (prevDataValues as any)[onViewIndex] = newOnView;
    dispatch(
      counterSlice.actions.updateData({
        identifier: data.identifier,
        value: prevDataValues,
      })
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, styles.contentContainer, styles.safeAreaView]}
    >
      <ScrollView style={[styles.container]}>
        <Pressable style={styles.container} onPress={handleScreenPress}>
          <View style={styles.itemContainer}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.itemInput}
                  placeholder="Description"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="description"
            />
          </View>
          <View style={styles.itemContainer}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.itemInput}
                  placeholder="Amount"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="number-pad"
                />
              )}
              name="amount"
            />
          </View>
          <View style={styles.itemContainer}>
            <Pressable
              onPress={() => setDateIncurredVisible(!dateIncurredVisible)}
            >
              <Text style={styles.text}>
                Date: {dateIncurred && dateIncurred.format('MMMM DD, YYYY')}
              </Text>
            </Pressable>
            {dateIncurredVisible && (
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <DateTimePicker
                    value={dateIncurred}
                    onValueChange={(date: any) => {
                      setDateIncurred(dayjs(date));
                      setDateIncurredVisible(false);
                    }}
                    mode="date"
                  />
                )}
                name="date"
              />
            )}
          </View>
          {/* <View style={styles.itemContainer}>
            <Pressable onPress={() => setDueDateVisible(!dueDateVisible)}>
              <Text>
                Due Date: {dueDate && dueDate.format('MMMM DD, YYYY')}
              </Text>
            </Pressable>
            {dueDateVisible && (
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <DateTimePicker
                    value={dueDataInitialValue}
                    onValueChange={(date: any) => {
                      setDueDate(dayjs(date));
                      setDueDateVisible(false);
                    }}
                    mode="date"
                  />
                )}
                name="dueDate"
              />
            )}
          </View> */}
        </Pressable>
      </ScrollView>
      {subtmitBtnVisible && (
        <Link href={'/(dailylogs)/'} asChild>
          <Pressable
            style={styles.subtmitBtn}
            onPress={() => {
              setValue('date', dateIncurred.toString());
              //   setValue('dueDate', dueDate.toString());
              handleSubmit(onSubmit)();
            }}
          >
            <Text style={styles.subtmitBtnTxt}>Confirm</Text>
          </Pressable>
        </Link>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: '#DCEDC8',
    borderRadius: 10,
  },
  itemInput: { color: '#003300' },
  subtmitBtn: {
    alignSelf: 'center',
    padding: 20,
    marginBottom: 30,
    backgroundColor: '#537B2F',
    borderRadius: 10,
  },
  subtmitBtnTxt: {
    color: '#DCEDC8',
  },
  contentContainer: {
    flexDirection: 'column',
  },
  safeAreaView: {
    backgroundColor: '#8DA750',
  },
  text: {
    color: '#003300',
  },
});
