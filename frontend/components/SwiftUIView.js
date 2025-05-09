import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SwiftUIView() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is SwiftUIView (React Native version)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f6fa',
  },
  text: {
    fontSize: 20,
    color: '#2563eb',
    fontWeight: 'bold',
  },
});