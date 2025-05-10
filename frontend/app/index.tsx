import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log('Index component mounted'); // Debug 1
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    console.log('checkAuthStatus called'); // Debug 2
    
    try {
      console.log('Checking auth status...'); // Debug 3
      const accessToken = await AsyncStorage.getItem('accessToken');
      console.log('Retrieved accessToken:', accessToken); // Debug 4
      
      setIsAuthenticated(!!accessToken);
      console.log('Auth status set to:', !!accessToken); // Debug 5
    } catch (error) {
      console.error('Error checking auth status:', error); // Debug 6
    } finally {
      console.log('Finished auth check, setting loading false'); // Debug 7
      setIsLoading(false);
    }
  };

  if (isLoading) {
    console.log('Showing loading indicator'); // Debug 8
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  console.log('Rendering redirect, isAuthenticated:', isAuthenticated); // Debug 9
  return <Redirect href={isAuthenticated ? "/(tabs)/home" : "/(auth)/login"} />;
}