import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

export default function CourseTag({ text }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    backgroundColor: 'rgba(59, 100, 237, 0.1)', // #3a63ed with 0.1 opacity
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  text: {
    color: 'rgb(59, 100, 237)', // #3a63ed
    fontSize: 14,
    fontWeight: '500',
  },
});