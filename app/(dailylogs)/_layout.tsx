import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Platform, Pressable, useColorScheme } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();

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
          title: 'Spent',
          tabBarHideOnKeyboard: true,
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="arrow-with-circle-up"
              size={24}
              color={focused ? '#003300' : '#eaf7da'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="received"
        options={{
          title: 'Received',
          tabBarHideOnKeyboard: true,
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="arrow-with-circle-down"
              size={24}
              color={focused ? '#003300' : '#eaf7da'}
            />
          ),
        }}
      />
    </Tabs>
  );
}
