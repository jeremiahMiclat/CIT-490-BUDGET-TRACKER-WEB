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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import DateTimePicker from 'react-native-ui-datepicker';
import { useEffect, useState } from 'react';
import { RootState, counterSlice } from '../../_layout';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import dayjs from 'dayjs';

export default function ScheduledFundsCreateScreen() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const formData = useSelector((state: RootState) => state.formData);
  const debtInfoData = useSelector((state: RootState) => state.formDebtInfo);
  const dispatch = useDispatch();
  const [formState, setFormState] = useState({});
  const navigation = useNavigation();
  const formIsSubmitted = useSelector(
    (state: RootState) => state.formSubmitted
  );
  const [day, setDay] = useState(dayjs());
  const [OdatePickerIndex, setODatePickerIndex] = useState(null);
  const [OdateValues, setODateValues] = useState<any>([]);
  const [addBtnVisibility, setAddBtnVisibility] = useState(true);
  const showODatePicker = (index: any) => {
    try {
      Keyboard.dismiss();
    } catch (error) {
      console.log(error);
    }
    setODatePickerIndex(prevIndex => {
      if (prevIndex === null || prevIndex !== index) {
        return index;
      } else {
        hideODatePicker();
        return null;
      }
    });
  };

  const hideODatePicker = () => {
    setODatePickerIndex(null);
  };

  const handleODateConfirm = (date: any, index: any) => {
    hideODatePicker();
    setODateValues((prevDateValues: any) => {
      const updatedValues = [...prevDateValues];
      updatedValues[index] = dayjs(date);
      return updatedValues;
    });

    setValue(`scheduledFundsInfo[${index}].date`, date);
  };

  const [DdatePickerIndex, setDDatePickerIndex] = useState(null);
  const [DdateValues, setDDateValues] = useState<any>([]);

  const showDDatePicker = (index: any) => {
    try {
      Keyboard.dismiss();
    } catch (error) {
      console.log(error);
    }
    setDDatePickerIndex(prevIndex => {
      if (prevIndex === null || prevIndex !== index) {
        return index;
      } else {
        hideDDatePicker();
        return null;
      }
    });
  };

  const hideDDatePicker = () => {
    setDDatePickerIndex(null);
  };

  const handleDDateConfirm = (date: any, index: any) => {
    hideDDatePicker();
    setDDateValues((prevDateValues: any) => {
      const updatedValues = [...prevDateValues];
      updatedValues[index] = dayjs(date);
      return updatedValues;
    });

    setValue(`debtInfo[${index}].dueDate`, date);
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        hideDDatePicker();
        hideODatePicker();
        setAddBtnVisibility(false);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        setAddBtnVisibility(true);
      }
    );

    // Clean up listeners when component unmounts
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const {
    control,
    watch,
    reset,
    getValues,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'scheduledFundsInfo',
  });
  const watchedFields = watch();
  const onSubmit = (data: any) => {
    dispatch(counterSlice.actions.updateFormData(data));
  };

  const handlePressOnScreen = () => {
    Keyboard.dismiss();
  };

  const removeAll = (index: any) => {
    setODateValues([]);
    setDDateValues([]);
    showDDatePicker(null);
    showODatePicker(null);
  };

  useEffect(() => {
    if (isFocused) {
    } else {
      try {
        dispatch(counterSlice.actions.updateSchedFundForm(watch()));
        reset({ scheduledFundsInfo: watch().scheduledFundsInfo });
      } catch (error) {
        console.log('useEffect error');
      }
    }

    // Cleanup function (if needed)
    return () => {};
  }, [isFocused]);

  useEffect(() => {}, [formData]);

  return (
    <SafeAreaView style={[styles.flex1, styles.safeAreaView]}>
      <View style={styles.container}>
        <ScrollView style={styles.sv} keyboardShouldPersistTaps="handled">
          <View style={styles.flex1}>
            {fields.map((field, index) => (
              <View key={field.id} style={styles.itemsContainer}>
                <View style={styles.items}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        placeholder="Description"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        style={styles.text}
                      />
                    )}
                    name={`scheduledFundsInfo[${index}].description`}
                  />
                </View>

                <View style={styles.items}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <>
                        <Pressable onPress={() => showODatePicker(index)}>
                          <TextInput
                            value={
                              OdateValues[index] != undefined
                                ? 'Date: ' +
                                  OdateValues[index].format('MMMM DD, YYYY')
                                : 'Set Date'
                            }
                            editable={false}
                            style={styles.dateInput}
                          />
                        </Pressable>
                      </>
                    )}
                    name={`scheduledFundsInfo[${index}].date`}
                  />
                </View>

                {OdatePickerIndex === index && (
                  <DateTimePicker
                    mode="date"
                    onValueChange={date => handleODateConfirm(date, index)}
                    value={OdateValues[index] || day}
                  />
                )}

                <View style={styles.items}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        placeholder="Amount"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        keyboardType={'number-pad'}
                        style={styles.text}
                      />
                    )}
                    name={`scheduledFundsInfo[${index}].amount`}
                  />
                </View>

                {/* <View style={styles.items}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <>
                        <Pressable onPress={() => showDDatePicker(index)}>
                          <TextInput
                            value={
                              DdateValues[index] != undefined
                                ? 'Due Date: ' +
                                  DdateValues[index].format('MMMM DD, YYYY')
                                : 'Set Due Date'
                            }
                            editable={false}
                            style={styles.dateInput}
                          />
                        </Pressable>
                      </>
                    )}
                    name={`debtInfo[${index}].dueDate`}
                  />
                </View>

                {DdatePickerIndex === index && (
                  <DateTimePicker
                    mode="date"
                    onValueChange={date => handleDDateConfirm(date, index)}
                    value={DdateValues[index] || day}
                  />
                )} */}

                <Pressable
                  onPress={() => [remove(index), removeAll(index)]}
                  style={styles.fieldRBtn}
                >
                  <Text style={styles.RBtnText}>Remove</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </ScrollView>
        {addBtnVisibility ? (
          <TouchableWithoutFeedback onPress={handlePressOnScreen}>
            <View>
              <Pressable
                onPress={() => [
                  append({ description: '', amount: '', sfLogs: [] }),
                ]}
                style={styles.addNewBtn}
              >
                <Text style={styles.addNewBtnText}>Add</Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        ) : (
          <></>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  addNewBtn: {
    backgroundColor: '#537B2F',
    margin: 20,
    padding: 20,
    alignSelf: 'center',
    borderRadius: 10,
  },

  addNewBtnText: {
    color: '#eaf7da',
  },
  fields: {
    margin: 20,
  },
  fieldInput: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  fieldRBtn: {
    backgroundColor: '#537B2F',
    padding: 10,
    alignSelf: 'center',
    borderRadius: 10,
  },
  RBtnText: {
    color: '#eaf7da',
  },
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
  sv: {
    flex: 1,
  },
  errors: {
    backgroundColor: 'red',
  },
  hidden: {
    display: 'none',
  },
  itemsContainer: {
    flex: 1,
    backgroundColor: '#DCEDC8',
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  items: {
    padding: 10,
    backgroundColor: '#eaf7da',
    borderRadius: 10,
    margin: 10,
  },
  dateInput: {
    color: '#003300',
  },
  safeAreaView: {
    backgroundColor: '#8DA750',
  },
  text: {
    color: '#003300',
  },
});
