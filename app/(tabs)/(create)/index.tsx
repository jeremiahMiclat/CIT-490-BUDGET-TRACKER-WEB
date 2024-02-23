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
import { RootState, counterSlice } from '../../_layout';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { Link, useRouter } from 'expo-router';
import Restart from 'react-native-restart';
import { router } from 'expo-router';
type RootStackParamList = {
  index: undefined;
  Home: undefined;
  create: undefined;
  budgetplan: undefined;
};
type CreateScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'create',
  'budgetplan'
>;

export default function CreatePlan() {
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const dispatch = useDispatch();
  const stateData = useSelector((state: RootState) => state.data);
  const formDailyLogs = useSelector((state: RootState) => state.formDailyLogs);
  const debtInfoData = useSelector((state: RootState) => state.formDebtInfo);
  const schedFundsInfoData = useSelector(
    (state: RootState) => state.formSchedFunds
  );
  const billsInfoData = useSelector((state: RootState) => state.formBillsInfo);
  const dailyBudgetInfo = useSelector(
    (state: RootState) => state.formDailyBudget
  );
  const [showTDPicker, setShowTDPicker] = useState(false);
  const initialTargetDateVal = dayjs().add(30, 'day');
  const [targetDateVal, setTargetDateVal] = useState(initialTargetDateVal);
  const navigator = useNavigation<CreateScreenNavigationProp>();
  const navRouter = useRouter();
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      initialBudget: '',
      planName: '',
      description: '',
      targetDate: '',
      dateAdded: '',
    },
  });

  useEffect(() => {
    if (showTDPicker) {
      try {
        Keyboard.dismiss();
      } catch (error) {
        console.log(error);
      }
    }
  }, [showTDPicker]);

  const onSubmit = (data: any) => {
    try {
      setIsLoading(true);

      const day = dayjs().format('MMMM D, YYYY h:mm:ss A');
      const targetDate = dayjs(targetDateVal);

      const dateString = targetDate.toString();
      setValue('targetDate', dateString);
      setValue('dateAdded', day);

      const updatedData = getValues();
      const newData = {
        ...updatedData,
        ...debtInfoData,
        ...schedFundsInfoData,
        ...billsInfoData,
        ...dailyBudgetInfo,
        ...formDailyLogs,
      };
      dispatch(
        counterSlice.actions.updateData(
          // { value: [...localData.value, data] }
          stateData.value.length < 1
            ? {
                identifier:
                  'Date Created: ' + dayjs().format('MMMM D, YYYY h:mm:ss A'),
                value: [...stateData.value, newData],
              }
            : {
                identifier:
                  'Last Modified: ' + dayjs().format('MMMM D, YYYY h:mm:ss A'),
                value: [...stateData.value, newData],
              }
        )
      );
      dispatch(counterSlice.actions.updateFormSubmitted(true));
      reset();
      setTargetDateVal(initialTargetDateVal);
      // Restart.Restart();
      // navRouter.replace('/(tabs)/');

      router.replace('/(tabs)/');
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePressOnScreen = () => {
    Keyboard.dismiss();
    setShowTDPicker(false);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setShowTDPicker(false);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    // Clean up listeners when component unmounts
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return isLoading ? (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#00ff00" />
    </View>
  ) : (
    <SafeAreaView style={[styles.container, styles.safeAreaView]}>
      {/* <TouchableWithoutFeedback onPress={handlePressOnScreen}> */}
      <View style={styles.container}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View style={styles.scrollViewContainer}>
            {/* DATE ADDED & TARGET DATE*/}
            <View style={styles.scrollViewItems}>
              <Controller
                control={control}
                name="dateAdded"
                render={() => <></>}
              />
              <Pressable onPress={() => setShowTDPicker(!showTDPicker)}>
                <Text style={styles.text}>
                  {'Target date:        ' +
                    dayjs(targetDateVal).format('MMMM DD, YYYY')}
                </Text>
              </Pressable>
              {showTDPicker && (
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <DateTimePicker
                      value={targetDateVal}
                      onValueChange={(date: any) => {
                        setTargetDateVal(date);
                        setShowTDPicker(false);
                      }}
                      mode="date"
                    />
                  )}
                  name="targetDate"
                />
              )}
              {errors.targetDate && (
                <Text style={styles.required}>This is required.</Text>
              )}
            </View>
            {/* PLAN NAME*/}
            <View style={styles.scrollViewItems}>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Plan Name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={styles.text}
                  />
                )}
                name="planName"
              />

              {errors.planName && (
                <Text style={styles.required}>This is required.</Text>
              )}
            </View>

            {/* DESCRIPTION*/}
            <View style={styles.scrollViewItems}>
              <Controller
                control={control}
                rules={
                  {
                    // required: true,
                  }
                }
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Description"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    numberOfLines={3}
                    textAlignVertical="top"
                    style={styles.text}
                  />
                )}
                name="description"
              />
            </View>

            {/* INITIAL BUDGET*/}
            <View style={styles.scrollViewItems}>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Initial Budget"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType={'number-pad'}
                    style={styles.text}
                  />
                )}
                name="initialBudget"
              />

              {errors.initialBudget && (
                <Text style={styles.required}>This is required.</Text>
              )}
            </View>
          </View>
          <Pressable style={styles.submitBtn} onPress={handleSubmit(onSubmit)}>
            <Text style={styles.submitBtnTxt}>Submit</Text>
          </Pressable>
        </ScrollView>
      </View>
      {/* </TouchableWithoutFeedback> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    flex: 1,
    justifyContent: 'space-around',
  },
  scrollViewItems: {
    padding: 15,
    backgroundColor: '#DCEDC8',
    borderRadius: 5,
    margin: 20,
  },
  submitBtn: {
    backgroundColor: '#537B2F',
    padding: 20,
    margin: 50,
    borderRadius: 10,
  },
  submitBtnTxt: {
    color: '#ffffff',
    alignSelf: 'center',
    fontSize: 20,
  },
  required: {
    color: 'red',
  },
  safeAreaView: {
    backgroundColor: '#8DA750',
  },
  text: {
    color: '#003300',
  },
});
