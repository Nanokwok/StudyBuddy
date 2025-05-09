import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import your screens/components here
import ContentView from './ContentView';
import CourseView from './CourseView';
import LoginView from './LoginView';
// Add more imports as needed

const Tab = createBottomTabNavigator();

export default function MainTabView() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tab.Screen name="Home" component={ContentView} />
      <Tab.Screen name="Courses" component={CourseView} />
      <Tab.Screen name="Login" component={LoginView} />
      {/* Add more Tab.Screen as needed */}
    </Tab.Navigator>
  );
}