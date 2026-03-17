import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

import HomeScreen from './screens/HomeScreen';
import AddScreen from './screens/AddScreen';
import HistoryScreen from './screens/HistoryScreen';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const Tab = createBottomTabNavigator();

function AppNavigator() {
  const { colors, toggleTheme, theme } = useTheme();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.subText,
          tabBarStyle: {
            backgroundColor: colors.tabBar,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            height: 60,
            paddingBottom: 8,
          },
          headerStyle: {
            backgroundColor: colors.header,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: colors.primary,
            fontSize: 22,
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={toggleTheme}
              style={{ marginRight: 16 }}
            >
              <Ionicons
                name={theme === 'light' ? 'moon-outline' : 'sunny-outline'}
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
          ),
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Budgetly',
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Add"
          component={AddScreen}
          options={{
            title: 'Add Transaction',
            tabBarLabel: 'Add',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{
            title: 'History',
            tabBarLabel: 'History',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list-outline" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}