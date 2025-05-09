import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function SearchTag({ text, selected = false, onPress }) {
  return (
    <TouchableOpacity
      style={[
        styles.tag,
        selected && styles.selectedTag
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tag: {
    backgroundColor: 'rgba(59, 100, 237, 0.1)', // #3a63ed with 0.1 opacity
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTag: {
    backgroundColor: 'rgba(59, 100, 237, 0.25)',
  },
  text: {
    color: 'rgb(59, 100, 237)', // #3a63ed
    fontSize: 14,
    fontWeight: '500',
  },
  selectedText: {
    color: '#fff',
  },
});