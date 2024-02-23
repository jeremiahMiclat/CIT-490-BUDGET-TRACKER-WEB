import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootState, counterSlice } from '../_layout';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import DateTimePicker from 'react-native-ui-datepicker';

interface ItemType {
  planName: string;
  dailyBudgetInfo: { description: string }[];
  dateAdded: string;
  description: string;
  initialBudget: string;
  targetDate: string;
}

export default function BudgetPlanScreen() {
  const appData = useSelector((state: RootState) => state.data);
  const itemOnView = useSelector((state: RootState) => state.viewing);
  const planName = (itemOnView as ItemType).planName;
  const dateAdded = (itemOnView as ItemType).dateAdded;
  const description = (itemOnView as ItemType).description;
  const initialBudget = (itemOnView as ItemType).initialBudget;
  const targetDate = (itemOnView as ItemType).targetDate;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  //debtInfo
  const debtInfo = (itemOnView as any).debtInfo;
  const totalDebts =
    (debtInfo as [])?.reduce((acc, current) => {
      const logs = (current as any).debtlogs;
      const totalAmount =
        (logs as [])?.reduce((prev, currLog) => {
          return prev + Number((currLog as any).amountPaid);
        }, 0) || 0;
      return acc + Number((current as any).amount);
    }, 0) || 0;

  const totalPaidDebts =
    (debtInfo as [])?.reduce((acc, current) => {
      const logs = (current as any).debtlogs;
      const totalAmount =
        (logs as [])?.reduce((prev, currLog) => {
          return prev + Number((currLog as any).amountPaid);
        }, 0) || 0;
      return acc + totalAmount;
    }, 0) || 0;

  const totalDebtsRemaining = totalDebts - totalPaidDebts || 'Error';

  //billsInfo
  const billsInfo = (itemOnView as any).billsInfo;
  const totalBills =
    (billsInfo as [])?.reduce((acc, current) => {
      return acc + Number((current as any).amount);
    }, 0) || 0;

  const totalPaidBills =
    (billsInfo as [])?.reduce((acc, current) => {
      const logs = (current as any).billsLogs;
      const totalAmount =
        (logs as [])?.reduce((prev, currLog) => {
          return prev + Number((currLog as any).amountPaid);
        }, 0) || 0;
      return acc + totalAmount;
    }, 0) || 0;

  const totalRemainingBills = totalBills - totalPaidBills || 'Error';

  //total future budget
  const scheduledFundsInfo = (itemOnView as any).scheduledFundsInfo;
  const totalSf =
    (scheduledFundsInfo as [])?.reduce((acc, current) => {
      return acc + Number((current as any).amount);
    }, 0) || 0;

  const totalReceivedSf =
    (scheduledFundsInfo as [])?.reduce((acc, current) => {
      const logs = (current as any).sfLogs;
      const totalAmount =
        (logs as [])?.reduce((prev, currLog) => {
          return prev + Number((currLog as any).amount);
        }, 0) || 0;
      return acc + totalAmount;
    }, 0) || 0;

  const totalRemainingSf = totalSf - totalReceivedSf;

  // daily budget
  const plannedBudgetInfo = (itemOnView as any).plannedBudgetInfo;

  const calculateTotalAmount = (plannedDaily: any[]): number => {
    let totalAmount = 0;

    plannedDaily.forEach(item => {
      const startDateTime = dayjs(item.startDate);
      const endDateTime = dayjs(item.endDate);
      // Calculate the duration in days
      const durationInDays = endDateTime.diff(startDateTime, 'day') + 1;
      // Multiply the duration by the amount and add to the total
      totalAmount += durationInDays * parseFloat(item.amount);
    });

    return totalAmount;
  };

  const calculateTotalAmountFromLogs =
    (plannedBudgetInfo as []).reduce((acc, current) => {
      const logs = (current as any).plannedLogs;
      const totalLogsAmount = (logs as []).reduce((prev, currLog) => {
        return prev + Number((currLog as any).amount);
      }, 0);
      return acc + totalLogsAmount;
    }, 0) || 0;

  const totalPlannedBudget = calculateTotalAmount(plannedBudgetInfo) || 0;

  // daily logs
  const dailyLogs = (itemOnView as any).dailyLogs;
  const spentLogs = dailyLogs.spent;
  const receivedLogs = dailyLogs.received;
  const totalSpent: number =
    (spentLogs as []).reduce((acc, current) => {
      return acc + Number((current as any).amount);
    }, 0) || 0;
  const totalReceived: number =
    (receivedLogs as []).reduce((acc, current) => {
      return acc + Number((current as any).amount);
    }, 0) || 0;

  // overall budget
  const overAllBudget = Number(initialBudget) + totalSf + totalReceived;

  // remaining with sched funds
  const budgetWSf =
    overAllBudget - totalSpent - totalBills - totalDebts - totalPlannedBudget;

  // remaining without sched funds
  const budgetWOSf = budgetWSf - totalSf;

  const decimalPlaces = 2;
  const multiplier = Math.pow(10, decimalPlaces);
  const day = dayjs();
  const durationInDays = dayjs(targetDate).diff(day, 'day') + 1;

  // cash on hand
  const cash =
    Math.round(
      (Number(initialBudget) +
        totalReceived +
        totalReceivedSf -
        totalDebts -
        totalSpent -
        totalPlannedBudget) *
        multiplier
    ) / multiplier;

  // daily budget left with sf

  const dailyBudgetWSf =
    Math.round((budgetWSf / durationInDays) * multiplier) / multiplier;

  // daily budget left without sf
  const dailyBudgetWOSf =
    Math.round((cash / durationInDays) * multiplier) / multiplier;

  // edit plan name
  const [planNameOnEdit, setPlanNameOnEdit] = useState(false);
  const [editedPlanName, setEditedPlanName] = useState(
    (itemOnView as ItemType).planName
  );

  const handleSavePlanName = () => {
    if (editedPlanName == (itemOnView as ItemType).planName) {
      setPlanNameOnEdit(false);
      return;
    }
    const currData = appData;

    const updatedItemOnView = {
      ...itemOnView,
      planName: editedPlanName,
    };

    const indexToUpdate = currData.value.findIndex(
      item => (item as any).dateAdded === (itemOnView as any).dateAdded
    );

    if (indexToUpdate !== -1) {
      const updatedValue = [...currData.value];
      (updatedValue as any)[indexToUpdate] = updatedItemOnView;

      const newData = {
        identifier: currData.identifier,
        value: updatedValue,
      };

      dispatch(counterSlice.actions.updateData(newData));
      dispatch(
        counterSlice.actions.updateViewing((updatedValue as any)[indexToUpdate])
      );
      setPlanNameOnEdit(false);
    } else {
      console.error('save error');
    }
  };

  // edit description
  const [descriptionOnEdit, setDescriptionOnEdit] = useState(false);
  const [editedDesc, setEditedDesc] = useState(
    (itemOnView as ItemType).description
  );

  const handleSaveDesc = () => {
    if (editedDesc == (itemOnView as ItemType).description) {
      setDescriptionOnEdit(false);
      return;
    }

    const currData = appData;

    const updatedItemOnView = {
      ...itemOnView,
      description: editedDesc,
    };

    const indexToUpdate = currData.value.findIndex(
      item => (item as any).dateAdded === (itemOnView as any).dateAdded
    );

    if (indexToUpdate !== -1) {
      const updatedValue = [...currData.value];
      (updatedValue as any)[indexToUpdate] = updatedItemOnView;

      const newData = {
        identifier: currData.identifier,
        value: updatedValue,
      };

      dispatch(counterSlice.actions.updateData(newData));
      dispatch(
        counterSlice.actions.updateViewing((updatedValue as any)[indexToUpdate])
      );
      setDescriptionOnEdit(false);
    } else {
      console.error('save error');
    }
  };

  // edit initial budget
  const [ibOnEdit, setIbOnedit] = useState(false);
  const [editedIb, setEditedIb] = useState(
    (itemOnView as ItemType).initialBudget
  );

  const handleSaveIb = () => {
    if (editedIb == (itemOnView as any).initialBudget) {
      setIbOnedit(false);
      return;
    }
    const currData = appData;

    const updatedItemOnView = {
      ...itemOnView,
      initialBudget: editedIb,
    };

    const indexToUpdate = currData.value.findIndex(
      item => (item as any).dateAdded === (itemOnView as any).dateAdded
    );

    if (indexToUpdate !== -1) {
      const updatedValue = [...currData.value];
      (updatedValue as any)[indexToUpdate] = updatedItemOnView;

      const newData = {
        identifier: currData.identifier,
        value: updatedValue,
      };

      dispatch(counterSlice.actions.updateData(newData));
      dispatch(
        counterSlice.actions.updateViewing((updatedValue as any)[indexToUpdate])
      );
      setIbOnedit(false);
    } else {
      console.error('save error');
    }
  };

  // edit target date
  const [targetDateOnEdit, setTargetDateOnEdit] = useState(false);
  const [editedTargetDate, setEditedTargetDate] = useState(
    (itemOnView as ItemType).targetDate
  );
  const handleSaveTargetDate = (date: any) => {
    if (
      dayjs(date).toString() == dayjs((itemOnView as any).targetDate).toString()
    ) {
      return;
    }

    setEditedTargetDate(date);
    const currData = appData;
    const updatedItemOnView = {
      ...itemOnView,
      targetDate: date,
    };

    const indexToUpdate = currData.value.findIndex(
      item => (item as any).dateAdded === (itemOnView as any).dateAdded
    );

    if (indexToUpdate !== -1) {
      const updatedValue = [...currData.value];
      (updatedValue as any)[indexToUpdate] = updatedItemOnView;

      const newData = {
        identifier: currData.identifier,
        value: updatedValue,
      };

      dispatch(counterSlice.actions.updateData(newData));
      dispatch(
        counterSlice.actions.updateViewing((updatedValue as any)[indexToUpdate])
      );
    } else {
      console.error('save error');
    }
  };

  const saveTargetDate = (date: any) => {
    const targetDate = editedTargetDate;
  };

  // useEffect(() => {
  //   handleSaveTargetDate();
  // }, [editedTargetDate]);

  // edits code ends
  const handleScreenPress = () => {
    Keyboard.dismiss();
    setPlanNameOnEdit(false);
    setDescriptionOnEdit(false);
    setIbOnedit(false);
    setTargetDateOnEdit(false);
  };

  useEffect(() => {
    if (!isFocused) {
      setPlanNameOnEdit(false);
      setDescriptionOnEdit(false);
      setIbOnedit(false);
      setTargetDateOnEdit(false);
    }
    return () => {};
  }, [isFocused]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setTargetDateOnEdit(false);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {}
    );

    // Clean up listeners when component unmounts
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={[styles.container, styles.safeAreaView]}>
      <ScrollView>
        <Pressable style={styles.container} onPress={() => handleScreenPress()}>
          {/**Plan Information */}
          <View style={styles.planInfoContainer}>
            <View style={styles.itemContainerHeader}>
              <Text style={styles.text}>Plan Information</Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.item}>Plan Name</Text>
              {planNameOnEdit != true ? (
                <View style={[styles.row, styles.item]}>
                  <Text style={styles.item}>{planName}</Text>
                  <Feather
                    name="edit"
                    size={24}
                    color="black"
                    onPress={() => {
                      setEditedPlanName(planName);
                      setPlanNameOnEdit(true);
                    }}
                  />
                </View>
              ) : (
                <View
                  style={[styles.row, styles.item, styles.itemInputContainer]}
                >
                  <TextInput
                    style={[styles.item, styles.itemInput]}
                    value={editedPlanName}
                    placeholder="Set Plan Name"
                    onChangeText={value => setEditedPlanName(value)}
                  />
                  <AntDesign
                    name="checkcircle"
                    size={24}
                    color="green"
                    onPress={handleSavePlanName}
                  />
                </View>
              )}
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.item}>Description</Text>
              {descriptionOnEdit != true ? (
                <View style={[styles.row, styles.item]}>
                  <Text style={styles.item}>{description}</Text>
                  <Feather
                    name="edit"
                    size={24}
                    color="black"
                    onPress={() => {
                      setEditedDesc(description);
                      setDescriptionOnEdit(true);
                    }}
                  />
                </View>
              ) : (
                <View
                  style={[styles.row, styles.item, styles.itemInputContainer]}
                >
                  <TextInput
                    style={[styles.item, styles.itemInput]}
                    value={editedDesc}
                    placeholder="Set Description"
                    onChangeText={value => setEditedDesc(value)}
                  />
                  <AntDesign
                    name="checkcircle"
                    size={24}
                    color="green"
                    onPress={handleSaveDesc}
                  />
                </View>
              )}
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.item}>Initial Budget</Text>
              {ibOnEdit != true ? (
                <View style={[styles.row, styles.item]}>
                  <Text style={styles.item}>{initialBudget}</Text>
                  <Feather
                    name="edit"
                    size={24}
                    color="black"
                    onPress={() => {
                      setEditedIb(initialBudget);
                      setIbOnedit(true);
                    }}
                  />
                </View>
              ) : (
                <View
                  style={[styles.row, styles.item, styles.itemInputContainer]}
                >
                  <TextInput
                    style={[styles.item, styles.itemInput]}
                    value={editedIb}
                    placeholder="Set Initial Budget"
                    keyboardType={'number-pad'}
                    onChangeText={value => setEditedIb(value)}
                  />
                  <AntDesign
                    name="checkcircle"
                    size={24}
                    color="green"
                    onPress={() => {
                      handleSaveIb();
                    }}
                  />
                </View>
              )}
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.item}>Target Date</Text>
              <View style={[styles.row, styles.item]}>
                <Text style={styles.item}>
                  {dayjs(editedTargetDate).format('MMMM DD, YYYY')}
                </Text>
              </View>
              <Feather
                name="edit"
                size={24}
                color="black"
                onPress={() => {
                  setTargetDateOnEdit(!targetDateOnEdit);
                  // setEditedTargetDate(dayjs(targetDate));
                }}
              />
            </View>
            {targetDateOnEdit && (
              <DateTimePicker
                value={editedTargetDate}
                onValueChange={(date: any) => {
                  handleSaveTargetDate(date);
                  setTargetDateOnEdit(false);
                }}
                mode="date"
              />
            )}
            <View style={styles.itemContainer}>
              <Text style={styles.item}>
                Overall Budget: {overAllBudget || 0}
              </Text>
            </View>
          </View>

          {/**Debts Information */}
          <View style={styles.planInfoContainer}>
            <View style={styles.itemContainerHeader}>
              <Text style={styles.text}>Debts Information</Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.item}>Total Debts: {totalDebts}</Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.item}>
                Total Paid Debts: {totalPaidDebts}
              </Text>
            </View>
            {totalPaidDebts > 0 ? (
              <View style={styles.itemContainer}>
                <Text style={styles.item}>
                  Debts Remaining: {totalDebtsRemaining}
                </Text>
              </View>
            ) : (
              ''
            )}
          </View>

          {/**Bills Information */}
          <View style={styles.planInfoContainer}>
            <View style={styles.itemContainerHeader}>
              <Text style={styles.text}>Bills Information</Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.item}>Total Bills: {totalBills}</Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.item}>
                Total Paid Bills: {totalPaidBills}
              </Text>
            </View>
            {totalBills > 0 && totalPaidBills > 0 ? (
              <View style={styles.itemContainer}>
                <Text style={styles.item}>
                  Remaining Bills: {totalRemainingBills}
                </Text>
              </View>
            ) : (
              ''
            )}
          </View>

          {/**Scheduled Funds & total budget info */}
          <View style={styles.planInfoContainer}>
            <View style={styles.itemContainerHeader}>
              <Text style={styles.text}>Scheduled Funds Information</Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.item}>Total Incoming Budget: {totalSf}</Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.item}>Total Received: {totalReceivedSf}</Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.item}>
                Total remaining: {totalRemainingSf}
              </Text>
            </View>
          </View>

          {/**planned expenses info */}
          <View style={styles.planInfoContainer}>
            <View style={styles.itemContainerHeader}>
              <Text style={styles.text}>Planned Expenses</Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.item}>
                Total Planned Daily Budget: {totalPlannedBudget || 0}
              </Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.item}>
                Actual Spent: {calculateTotalAmountFromLogs || 0}
              </Text>
            </View>
          </View>

          {/**remaining budget info */}
          <View style={styles.planInfoContainer}>
            <View style={styles.itemContainerHeader}>
              <Text style={styles.text}>Remaining Budget Information</Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.item}>With Scheduled Funds: {budgetWSf}</Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.item}>
                With out Scheduled Funds: {budgetWOSf}
              </Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.item}>On hand: {cash}</Text>
            </View>
          </View>
          {/**daily budget info */}
          <View style={styles.planInfoContainer}>
            <View style={styles.itemContainer}>
              <Text style={styles.item}>
                Daily Budget with Scheduled Funds: {dailyBudgetWSf}
              </Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.item}>
                Daily Budget with out Scheduled Funds: {dailyBudgetWOSf}
              </Text>
            </View>
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  itemContainer: {
    flexDirection: 'row',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#eaf7da',
  },
  itemContainerHeader: {
    flexDirection: 'row',
    margin: 10,
    padding: 10,
    // borderColor: 'green',
    // borderWidth: 1,
    // borderRadius: 10,
    justifyContent: 'space-around',
  },
  item: {
    flex: 1,
    color: '#003300',
  },
  row: {
    flexDirection: 'row',
  },
  itemInput: {
    color: 'gray',
  },
  itemInputContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#142c14',
    padding: 5,
  },
  planInfoContainer: {
    borderRadius: 10,
    backgroundColor: '#DCEDC8',
    padding: 20,
    margin: 10,
    marginBottom: 50,
  },
  safeAreaView: {
    backgroundColor: '#8DA750',
  },
  text: {
    color: '#003300',
  },
});
