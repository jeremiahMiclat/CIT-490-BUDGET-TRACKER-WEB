import { Link } from 'expo-router';
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

import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../_layout';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

export default function DailyLogsScreen() {
  const dispatch = useDispatch();
  const dataList = useSelector((state: RootState) => state.data.value);
  const itemOnView = useSelector((state: RootState) => state.viewing);
  const dailyLogs = (itemOnView as any).dailyLogs;
  const spentLogs = dailyLogs.spent;
  const receivedLogs = dailyLogs.received;
  const totalSpent: number = (spentLogs as []).reduce((acc, current) => {
    return acc + Number((current as any).amount);
  }, 0);
  const totalReceived: number = (receivedLogs as []).reduce((acc, current) => {
    return acc + Number((current as any).amount);
  }, 0);

  return (
    <SafeAreaView style={[styles.container, styles.safeAreaView]}>
      <View style={[styles.itemsContainer]}>
        <View style={[styles.containerItem, styles.itemContainer]}>
          <Text style={[styles.text]}>Total Spent: {totalSpent}</Text>
        </View>
        <View style={[styles.containerItem, styles.itemContainer]}>
          <Text style={[styles.text]}>Total Received: {totalReceived}</Text>
        </View>
      </View>
      <Link href={'/(dailylogs)/'} style={styles.addBtn} asChild>
        <Pressable>
          <Ionicons name="add-circle-sharp" size={50} color="#eaf7da" />
        </Pressable>
      </Link>
    </SafeAreaView>
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
  addBtn: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 30,
  },
  containerItem: {
    padding: 20,
  },
  safeAreaView: {
    backgroundColor: '#8DA750',
  },
  text: {
    color: '#003300',
  },
  itemsContainer: {
    backgroundColor: '#DCEDC8',
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  itemContainer: {
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#eaf7da',
  },
});
