import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

export default function LoginView({ onAccountCreated }) {
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isFormComplete = firstName && surname && email && password;

  const handleCreateAccount = () => {
    if (isFormComplete) {
      if (onAccountCreated) onAccountCreated();
      // Navigation logic here if using React Navigation
    } else {
      Alert.alert('StudyBuddy', 'Please check your input', [{ text: 'Close' }]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f5f6fa' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create Account</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputHalf}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
            autoCorrect={false}
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.inputHalf}
            placeholder="Surname"
            value={surname}
            onChangeText={setSurname}
            autoCapitalize="words"
            autoCorrect={false}
            placeholderTextColor="#888"
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Mobile Phone (Optional)"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.createButton} onPress={handleCreateAccount} activeOpacity={0.8}>
          <Text style={styles.createButtonText}>Create Account</Text>
        </TouchableOpacity>
        <View style={styles.orRow}>
          <View style={styles.line} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.line} />
        </View>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={() => {
            // Handle Google Sign-Up
          }}
          activeOpacity={0.8}
        >
          <Image
            source={require('../assets/images/google.png')}
            style={styles.googleIcon}
            resizeMode="contain"
          />
          <Text style={styles.googleButtonText}>Sign up with Google</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'stretch',
    backgroundColor: '#f5f6fa',
    minHeight: '100%',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 28,
    color: '#000',
    marginBottom: 20,
    marginLeft: 20,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  inputHalf: {
    flex: 1,
    height: 50,
    backgroundColor: '#f1f1f6',
    borderRadius: 23,
    paddingHorizontal: 16,
    fontSize: 16,
    marginRight: 6,
    color: '#000',
  },
  input: {
    height: 50,
    backgroundColor: '#f1f1f6',
    borderRadius: 23,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    color: '#000',
  },
  createButton: {
    height: 50,
    backgroundColor: '#2563eb',
    borderRadius: 23,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  orText: {
    color: '#888',
    marginHorizontal: 8,
    fontSize: 16,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 23,
    borderWidth: 1,
    borderColor: '#ccc',
    height: 50,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 16,
  },
  googleButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
});