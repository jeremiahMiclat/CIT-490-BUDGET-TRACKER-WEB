import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Platform, Pressable, useColorScheme } from 'react-native';
import {
  FontAwesome5,
  Foundation,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

export default function TabLayout() {
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
          title: 'Create New Plan',
          tabBarHideOnKeyboard: true,
          headerRight: () => (
            <Link href={'/(tabs)/'} asChild>
              <Pressable>
                {({ pressed }) => (
                  <MaterialCommunityIcons
                    name="home"
                    size={24}
                    color="#eaf7da"
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
          tabBarLabel: 'Save',
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="save"
              size={24}
              color={focused ? '#003300' : '#eaf7da'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="plannedbudgetinfo"
        options={{
          title: 'Planned Budget',
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="notebook-multiple"
              size={24}
              color={focused ? '#003300' : '#eaf7da'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="debtinfo"
        options={{
          title: 'Debts',
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ focused }) => (
            <FontAwesome5
              name="book-dead"
              size={24}
              color={focused ? '#003300' : '#eaf7da'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="billsinfo"
        options={{
          title: 'Bills',
          tabBarHideOnKeyboard: true,
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
        name="sf"
        options={{
          title: 'Scheduled',
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="schedule"
              size={24}
              color={focused ? '#003300' : '#eaf7da'}
            />
          ),
        }}
      />
    </Tabs>
  );
}
