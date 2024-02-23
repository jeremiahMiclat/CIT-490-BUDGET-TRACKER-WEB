import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Platform, Pressable, useColorScheme } from 'react-native';
import { Foundation, MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useSelector } from 'react-redux';
import { RootState } from '../_layout';
import { Entypo } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const itemOnView = useSelector((state: RootState) => state.viewing) || 'Info';
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#537B2F',
        },
        headerTintColor: '#DCEDC8',
        tabBarStyle: {
          backgroundColor: '#537B2F',
        },
        tabBarActiveTintColor: '#003300',
        tabBarInactiveTintColor: '#eaf7da',
        tabBarActiveBackgroundColor: '#eaf7da',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Saved Budget Plans',
          tabBarStyle: {
            display: 'none',
          },
          headerRight: () => (
            <Link
              href={Platform.OS === 'android' ? '/signin' : '/websignin'}
              asChild
            >
              <Pressable>
                {({ pressed }) => (
                  <MaterialCommunityIcons
                    name="account-circle"
                    size={24}
                    color="#DCEDC8"
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                  // <FontAwesome
                  //   name="info-circle"
                  //   size={25}
                  //   style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  // />
                )}
              </Pressable>
            </Link>
          ),
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="home"
              size={24}
              color={focused ? '#003300' : '#eaf7da'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="budgetplan"
        options={{
          title: (itemOnView as any).planName,
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="info-with-circle"
              size={24}
              color={focused ? '#003300' : '#eaf7da'}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="(create)"
        options={{
          title: 'Create',
          tabBarHideOnKeyboard: true,
          headerShown: false,
          href: null,
          tabBarStyle: {
            display: 'none',
          },
        }}
      />
      <Tabs.Screen
        name="dailylogs"
        options={{
          title: 'Daily Logs',
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="note-text-outline"
              size={24}
              color={focused ? '#003300' : '#eaf7da'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="plannedbudget"
        options={{
          title: 'Planned Budgets',
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="notebook-multiple"
              size={24}
              color={focused ? '#003300' : '#eaf7da'}
            />
          ),
          tabBarLabel: 'Planned',
        }}
      />

      <Tabs.Screen
        name="scheduledfunds"
        options={{
          title: 'Scheduled Funds',
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="schedule"
              size={24}
              color={focused ? '#003300' : '#eaf7da'}
            />
          ),
          tabBarLabel: 'Scheduled',
        }}
      />
      <Tabs.Screen
        name="bills"
        options={{
          title: 'Bills',
          tabBarIcon: ({ focused }) => (
            <Foundation
              name="dollar"
              size={24}
              color={focused ? '#003300' : '#eaf7da'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="debts"
        options={{
          title: 'Debts',
          tabBarIcon: ({ focused }) => (
            <FontAwesome5
              name="book-dead"
              size={24}
              color={focused ? '#003300' : '#eaf7da'}
            />
          ),
        }}
      />
    </Tabs>
  );
}
