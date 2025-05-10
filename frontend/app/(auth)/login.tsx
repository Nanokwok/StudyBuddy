import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../core/api';
import { useAuth } from '../../context/AuthContext';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('token/', {
        username,
        password,
      });

      if (response.status === 200) {
        const { access, refresh, user } = response.data;

        if (access && refresh) {
          if (user) {
            try {
              await Promise.all([
                AsyncStorage.setItem('accessToken', access),
                AsyncStorage.setItem('refreshToken', refresh),
                AsyncStorage.setItem('userInfo', JSON.stringify(user)),
              ]);
            } catch (storageError) {
              console.error("AsyncStorage Error:", storageError);
              Alert.alert('Error', 'Failed to save login data. Please try again.');
              setIsLoading(false);
              return;
            }
          } else {
             try {
              await Promise.all([
                AsyncStorage.setItem('accessToken', access),
                AsyncStorage.setItem('refreshToken', refresh),
              ]);
            } catch (storageError) {
              console.error("AsyncStorage Error:", storageError);
              Alert.alert('Error', 'Failed to save login data. Please try again.');
              setIsLoading(false);
              return;
            }
          }


          // Set auth header
          api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

          // Update auth context
          await login({ access, refresh, user: user || {} });

          // Navigate to home
          router.replace('/(tabs)/home');
        } else {
          // Handle the case where access or refresh is missing
          console.error("Incomplete data from API:", response.data);
          Alert.alert(
            'Login Error',
            'Login successful, but required data is missing. Please try again.',
          );
          setIsLoading(false);
          return; // Stop login process
        }
      } else {
        // Handle server errors
        let errorMessage = 'Login failed. Invalid credentials.';
        if (response.data && response.data.detail) {
          errorMessage = response.data.detail;
        }
        Alert.alert('Login Failed', errorMessage);
        setIsLoading(false); // Ensure loading is set to false on error
      }
    } catch (error: any) {
      // Improved error handling
      console.error('Login error:', error);
      let errorMessage =
        'An unexpected error occurred. Please check your network connection and try again.';
      if (error.response && error.response.data && error.response.data.detail) {
        errorMessage = error.response.data.detail;
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const goToSignup = () => {
    router.push('/(auth)/signup');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Welcome Back</Text>
            <Text style={styles.headerSubtitle}>Sign in to continue</Text>
          </View>

          {/* Username Field */}
          <View style={styles.fieldContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              keyboardType="default"
              autoCapitalize="none"
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
            />
          </View>

          {/* Password Field */}
          <View style={styles.fieldContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
            />
          </View>

          {/* Login Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Loading...' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Don't have an account */}
          <TouchableOpacity
            style={styles.signupLinkContainer}
            onPress={goToSignup}
          >
            <Text style={styles.signupLinkText}>
              Don't have an account? Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 70,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: 'black',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  fieldContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 24,
    padding: 14,
    fontSize: 16,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  forgotPasswordText: {
    color: '#2563eb',
    fontSize: 14,
  },
  buttonContainer: {
    padding: 16,
    marginTop: 16,
  },
  loginButton: {
    backgroundColor: '#2563eb',
    borderRadius: 56,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '800',
  },
  signupLinkContainer: {
    alignItems: 'center',
    padding: 16,
    marginTop: 8,
  },
  signupLinkText: {
    color: '#2563eb',
    fontSize: 14,
  },
});

export default LoginScreen;
