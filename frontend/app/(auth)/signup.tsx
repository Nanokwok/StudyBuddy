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
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/core/api';
import { useAuth } from '@/context/AuthContext';

export default function SignupScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleCreateAccount = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    console.log('Signup data being sent:', { username, email, password });

    try {
      const signupResponse = await api.post('/register/', {
        username: username,
        email: email,
        password: password,
      });

      console.log('Signup successful:', signupResponse.data);

      const loginResponse = await api.post('/token/', {
        username: username,
        password: password,
      });

      console.log('Login successful:', loginResponse.data);

      const { access, refresh } = loginResponse.data;
      const user = {
        id: signupResponse.data.id,
        username: signupResponse.data.username,
        email: signupResponse.data.email,
      };

      try {
        await Promise.all([
          AsyncStorage.setItem('accessToken', access),
          AsyncStorage.setItem('refreshToken', refresh),
          AsyncStorage.setItem('userInfo', JSON.stringify(user)),
        ]);
        console.log('Login data saved to AsyncStorage');
      } catch (storageError) {
        console.error("AsyncStorage Error:", storageError);
        Alert.alert('Error', 'Failed to save login data. Please try again.');
        setIsLoading(false);
        return;
      }

      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      await login({
        access: access,
        refresh: refresh,
        user: user
      });

      router.replace('/(tabs)/home');
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.response) {
        console.error('Signup error details:', error.response.data);
      }
      let errorMessage = 'An error occurred during signup';

      if (error.response) {
        if (error.response.status === 400) {
          if (error.response.data?.email) {
            errorMessage = error.response.data.email[0];
          } else if (error.response.data?.username) {
            errorMessage = error.response.data.username[0];
          } else if (error.response.data?.password) {
            errorMessage = error.response.data.password[0];
          } else {
            errorMessage = 'Invalid data provided';
          }
        } else if (error.response.status === 500) {
          errorMessage = 'Server error - please try again later';
        }
      } else if (error.isNetworkError) {
        errorMessage = 'Network error - please check your connection';
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const goToLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Create Account</Text>
          </View>

          {/* Username Field */}
          <View style={styles.fieldContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username *"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
              editable={!isLoading}
            />
          </View>

          {/* Email Field */}
          <View style={styles.fieldContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email Address *"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
              editable={!isLoading}
            />
          </View>

          {/* Password Field */}
          <View style={styles.fieldContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password *"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
              editable={!isLoading}
            />
          </View>

          {/* Confirm Password Field */}
          <View style={styles.fieldContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password *"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
              editable={!isLoading}
            />
          </View>

          {/* Create Account Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.createAccountButton, isLoading && styles.disabledButton]}
              onPress={handleCreateAccount}
              disabled={isLoading}
            >
              <Text style={styles.createAccountButtonText}>
                {isLoading ? <ActivityIndicator size="small" color="white" /> : 'Create Account'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Already have an account */}
          <TouchableOpacity
            style={styles.loginLinkContainer}
            onPress={goToLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginLinkText}>Already have an account? Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: 'black',
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
  buttonContainer: {
    padding: 16,
    marginTop: 8,
  },
  createAccountButton: {
    backgroundColor: '#2563eb',
    borderRadius: 56,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#a5b4fc', // Lighter shade when disabled
  },
  createAccountButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '800',
  },
  loginLinkContainer: {
    alignItems: 'center',
    padding: 16,
  },
  loginLinkText: {
    color: '#2563eb',
    fontSize: 14,
  },
});