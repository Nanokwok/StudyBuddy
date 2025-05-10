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

export default function SignupScreen() {
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleCreateAccount = () => {
    // Basic validation
    if (!firstName || !surname || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    // This would be connected to your backend in a real implementation
    console.log('Creating account with:', { firstName, surname, phone, email, password });
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

          {/* Name Fields (First Name and Surname) */}
          <View style={styles.nameContainer}>
            <View style={styles.nameField}>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                placeholderTextColor="rgba(0, 0, 0, 0.5)"
              />
            </View>
            <View style={styles.nameField}>
              <TextInput
                style={styles.input}
                placeholder="Surname"
                value={surname}
                onChangeText={setSurname}
                placeholderTextColor="rgba(0, 0, 0, 0.5)"
              />
            </View>
          </View>

          {/* Phone Field */}
          <View style={styles.fieldContainer}>
            <TextInput
              style={styles.input}
              placeholder="Mobile Phone (Optional)"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
            />
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

          {/* Confirm Password Field */}
          <View style={styles.fieldContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
            />
          </View>

          {/* Create Account Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.createAccountButton}
              onPress={handleCreateAccount}
            >
              <Text style={styles.createAccountButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>

          {/* Already have an account */}
          <TouchableOpacity 
            style={styles.loginLinkContainer}
            onPress={goToLogin}
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
  nameContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  nameField: {
    flex: 1,
    paddingHorizontal: 4,
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
    backgroundColor: '#2563eb', // blue-600
    borderRadius: 56,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
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