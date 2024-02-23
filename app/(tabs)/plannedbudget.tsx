import {
  FlatList,
  GestureResponderEvent,
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
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function SFScreen() {
  const dispatch = useDispatch();
  const dataList = useSelector((state: RootState) => state.data.value);
  const dataIdentifier = useSelector(
    (state: RootState) => state.data.identifier
  );
  const itemOnView = useSelector((state: RootState) => state.viewing);
  const logs = itemOnView;

  const [showLogs, setShowLogs] = useState<boolean[]>([]);

  const toggleLogs = (index: number) => {
    const newShowLogs = [...showLogs];
    newShowLogs[index] = !newShowLogs[index];
    setShowLogs(newShowLogs);
  };

  const toggleSaveLogs = (index: number) => {
    // saving implementaion
  };

  const renderLogs = (
    item: any,
    plannedBudgetInfo: any
    // index: any
  ) => {
    return (
      <View style={styles.logItemContainer}>
        <Text style={[styles.logItemText, styles.text]}>
          {item.item.notes != undefined ? item.item.notes : 'No notes'}
        </Text>
        <Text style={[styles.logItemText, styles.text]}>
          {item.item.amount != undefined ? item.item.amount : '0'}
        </Text>
        <Text style={[styles.logItemText, styles.text]}>
          {item.item.date != undefined
            ? dayjs(item.item.date).format('MMMM DD, YYYY')
            : 'not set'}
        </Text>
        <Pressable
          onPress={(event: GestureResponderEvent) =>
            handleDeleteLog(item, plannedBudgetInfo)
          }
          style={styles.delLogBtn}
        >
          <MaterialIcons name="delete" size={24} color="#DCEDC8" />
        </Pressable>
      </View>
    );
  };

  const handleDeltePlannedInfo = (item: any) => {
    const updatedPlannedBudgetInfo = [...(itemOnView as any).plannedBudgetInfo];
    updatedPlannedBudgetInfo.splice(item.index, 1);
    const updatedItemOnView = {
      ...itemOnView,
      plannedBudgetInfo: updatedPlannedBudgetInfo,
    };
    const itemOnViewIndex = (dataList as []).findIndex(
      (obj: any) => obj.dateAdded === (itemOnView as any).dateAdded
    );
    const upDatedDataList = [...dataList];
    (upDatedDataList as any)[itemOnViewIndex] = updatedItemOnView;
    dispatch(counterSlice.actions.updateViewing({ ...updatedItemOnView }));
    dispatch(
      counterSlice.actions.updateData({
        identifier: dataIdentifier,
        value: upDatedDataList,
      })
    );
  };

  const handleDeleteLog = (item: any, plannedBudgetInfo: any) => {
    const pBInfoIndex = plannedBudgetInfo.index;
    const logIndex = item.index;
    // console.log('log index', logIndex);
    // console.log('debtInfo index', debtInfoIndex);
    // console.log('log', item);
    // console.log('debtInfo', debtInfo);
    // console.log('Item on View', itemOnView);

    const updatedPBLogs = [...plannedBudgetInfo.item.plannedLogs];
    // console.log('Current', updatedDebtLogs);
    updatedPBLogs.splice(logIndex, 1);
    // console.log('Updated', updatedDebtLogs);

    // console.log('Current', debtInfo.item);

    const updatedPBInfoItem = {
      ...plannedBudgetInfo.item,
      plannedLogs: updatedPBLogs,
    };
    // console.log('Updated', updatedDebtInfoItem);

    // console.log('c', (itemOnView as any).debtInfo);
    const updatedPBInfo = [...(itemOnView as any).plannedBudgetInfo];
    // console.log('Current dI', updatedDebtInfo);
    updatedPBInfo[pBInfoIndex] = updatedPBInfoItem;
    // console.log('Updated dI', updatedDebtInfo);
    const updatedItemOnView = {
      ...itemOnView,
      plannedBudgetInfo: updatedPBInfo,
    };
    // console.log('u', updatedItemOnView.debtInfo);
    const itemOnViewIndex = (dataList as []).findIndex(
      (obj: any) => obj.dateAdded === (itemOnView as any).dateAdded
    );
    const upDatedDataList = [...dataList];
    (upDatedDataList as any)[itemOnViewIndex] = updatedItemOnView;

    dispatch(counterSlice.actions.updateViewing({ ...updatedItemOnView }));
    dispatch(
      counterSlice.actions.updateData({
        identifier: dataIdentifier,
        value: upDatedDataList,
      })
    );
  };

  const renderItem = (item: any) => {
    return (
      <View style={styles.flatListContainer}>
        <View style={[styles.row, styles.itemContainer]}>
          <Text style={styles.text}>Description: </Text>
          <Text style={styles.text}>{item.item.description + ''}</Text>
        </View>

        <View style={[styles.row, styles.itemContainer]}>
          <Text style={styles.text}>Amount: </Text>
          <Text style={styles.text}>{item.item.amount + ''}</Text>
        </View>

        <View style={[styles.row, styles.itemContainer]}>
          <Text style={styles.text}>Start Date: </Text>
          <Text style={styles.text}>
            {dayjs(item.item.startDate).format('MMMM DD, YYYY') + ''}
          </Text>
        </View>

        <View style={[styles.row, styles.itemContainer]}>
          <Text style={styles.text}>End Date: </Text>
          <Text style={styles.text}>
            {dayjs(item.item.endDate).format('MMMM DD, YYYY') + ''}
          </Text>
        </View>

        <Pressable
          style={[styles.row, styles.itemContainer]}
          onPress={() => {
            toggleLogs(item.index);
          }}
        >
          <Text style={styles.text}>Logs</Text>
          <Entypo name="select-arrows" size={24} color="#537B2F" />
        </Pressable>

        {showLogs[item.index] && (
          <View>
            <Link href={'/plannedlogs'} asChild style={styles.addLogBtn}>
              <Pressable
                onPress={() => {
                  dispatch(
                    counterSlice.actions.upDateDataOnEdit({
                      onView: itemOnView,
                      plannedBudgetInfo: item.item,
                      index: item.index,
                    })
                  );
                }}
              >
                <Ionicons name="add-circle" size={24} color="#537B2F" />
              </Pressable>
            </Link>
            {item.item.plannedLogs.length > 0 ? (
              <FlatList
                data={item.item.plannedLogs}
                renderItem={logItem => renderLogs(logItem, item)}
                keyExtractor={(logItem: any, logIndex: any) => logIndex}
              />
            ) : (
              <View style={styles.logItemContainer}>
                <Text style={[styles.logItemText, styles.text]}>No logs</Text>
              </View>
            )}
          </View>
        )}

        <Pressable
          style={styles.delDebtInfo}
          onPress={(event: GestureResponderEvent) =>
            handleDeltePlannedInfo(item)
          }
        >
          <MaterialIcons name="delete" size={24} color="#537B2F" />
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, styles.safeAreaView]}>
      <View style={styles.container}>
        <FlatList
          // style={styles.flContainer}
          // ListHeaderComponent={renderHeader}
          // ListFooterComponent={renderFLFooter}
          data={(itemOnView as any).plannedBudgetInfo}
          renderItem={renderItem}
          keyExtractor={(item: any, index: any) => index}
        />
      </View>
      <View style={styles.addBtn}>
        <Link href={'/addplannedinfo'} asChild>
          <Pressable>
            <Ionicons name="add-circle" size={40} color="#eaf7da" />
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  row: {
    flexDirection: 'row',
  },
  itemContainer: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#eaf7da',
  },
  itemTitle: {},
  itemText: {},
  addBtn: {
    alignSelf: 'center',
    padding: 10,
    margin: 10,
  },
  addLogBtn: {
    alignSelf: 'center',
  },
  logItemContainer: {
    padding: 10,
    margin: 10,
    backgroundColor: '#8DA750',
    borderRadius: 10,
  },
  logItemText: {
    backgroundColor: '#DCEDC8',
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  flatListContainer: {
    backgroundColor: '#DCEDC8',
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  delDebtInfo: {
    alignSelf: 'center',
    padding: 10,
  },
  delLogBtn: {
    alignSelf: 'center',
    padding: 10,
  },
  safeAreaView: {
    backgroundColor: '#8DA750',
  },
  text: {
    color: '#003300',
  },
  itemsContainer: {
    backgroundColor: '#DCEDC8',
  },
});
