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
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    // Basic validation
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    // 
    console.log('Logging in with:', { email, password });
  };

  const goToSignup = () => {
    router.replace('/Signup');
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

          {/* Email Field */}
          <View style={styles.fieldContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
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
            >
              <Text style={styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Don't have an account */}
          <TouchableOpacity 
            style={styles.signupLinkContainer}
            onPress={goToSignup}
          >
            <Text style={styles.signupLinkText}>Don't have an account? Sign up</Text>
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
    paddingTop: 70,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
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