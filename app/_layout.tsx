import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DataProps } from '../data/DataProps';

const initialState = {
  data: {
    identifier: '',
    value: [],
  },
  viewing: {},
  user: {
    isLoggedIn: false,
    id: null,
    existingData: [{ fieldName: 'no data' }],
    userProfile: {},
  },
  formData: { data: {}, debtInfo: {} },
  formDebtInfo: { debtInfo: [] },
  formSchedFunds: {
    scheduledFundsInfo: [],
  },
  formBillsInfo: {
    billsInfo: [],
  },
  formDailyBudget: {
    plannedBudgetInfo: [],
  },
  formDailyLogs: {
    dailyLogs: {
      spent: [],
      received: [],
    },
  },
  formSubmitted: false,
  dataOnEdit: undefined,
};

export const counterSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    updateData: (state, action) => {
      state.data = action.payload;
    },
    updateViewing: (state, action) => {
      state.viewing = action.payload;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    updateFormData: (state, action) => {
      state.formData = action.payload;
    },
    updateDebtInfoForm: (state, action) => {
      state.formDebtInfo = action.payload;
    },
    updateSchedFundForm: (state, action) => {
      state.formSchedFunds = action.payload;
    },
    updateBillsInfoForm: (state, action) => {
      state.formBillsInfo = action.payload;
    },
    updateDailyBudgetForm: (state, action) => {
      state.formDailyBudget = action.payload;
    },
    updateFormSubmitted: (state, action) => {
      state.formSubmitted = action.payload;
    },
    upDateDailyLogs: (state, action) => {
      state.formDailyLogs = action.payload;
    },
    upDateDataOnEdit: (state, action) => {
      state.dataOnEdit = action.payload;
    },
  },
});

const store = configureStore({
  reducer: counterSlice.reducer,
});

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)/index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#537B2F',
          },
          headerTintColor: '#DCEDC8',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="websignin"
          options={{
            presentation: 'modal',
            title: 'Google Account and Cloud Storage',
          }}
        />
        <Stack.Screen
          name="adddebtinfo"
          options={{ presentation: 'modal', title: 'Add Debt Information' }}
        />
        <Stack.Screen
          name="debtlogs"
          options={{ presentation: 'modal', title: 'Add Debt Logs' }}
        />
        <Stack.Screen
          name="addbillsinfo"
          options={{ presentation: 'modal', title: 'Add Bills Information' }}
        />
        <Stack.Screen
          name="billslogs"
          options={{ presentation: 'modal', title: 'Add Bills Logs' }}
        />
        <Stack.Screen
          name="addsfinfo"
          options={{
            presentation: 'modal',
            title: 'Add Scheduled Funds Information',
          }}
        />
        <Stack.Screen
          name="sflogs"
          options={{ presentation: 'modal', title: 'Add Scheduled Fund Logs' }}
        />
        <Stack.Screen
          name="addplannedinfo"
          options={{
            presentation: 'modal',
            title: 'Add Planned Budget Information',
          }}
        />

        <Stack.Screen
          name="plannedlogs"
          options={{ presentation: 'modal', title: 'Add Planned Budget Logs' }}
        />
        <Stack.Screen
          name="(dailylogs)"
          options={{
            title: 'Daily Logs',
            headerStyle: {
              backgroundColor: '#537B2F',
            },
            headerTintColor: '#DCEDC8',
          }}
        />
        <Stack.Screen
          name="addreceived"
          options={{
            presentation: 'modal',
            title: 'Add Received Funds Log',
            headerStyle: { backgroundColor: '#537B2F' },
            headerTintColor: '#DCEDC8',
          }}
        />
        <Stack.Screen
          name="addspent"
          options={{
            presentation: 'modal',
            title: 'Add Spent Funds Log',
            headerStyle: { backgroundColor: '#537B2F' },
            headerTintColor: '#DCEDC8',
          }}
        />
      </Stack>
    </Provider>
  );
}
export type RootState = ReturnType<typeof store.getState>;
