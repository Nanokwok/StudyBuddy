import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainTabView from './components/MainTabView';

export default function App() {
  return (
    <NavigationContainer>
      <MainTabView />
    </NavigationContainer>
  );
}