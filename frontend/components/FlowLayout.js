import React from 'react';
import { View, StyleSheet } from 'react-native';

/**
 * FlowLayout
 * Arranges children in a horizontal flow, wrapping to new lines as needed.
 * @param {number} spacing - Space (in px) between items.
 * @param {React.ReactNode} children - The items to layout.
 */
export default function FlowLayout({ spacing = 8, children, style }) {
  return (
    <View style={[styles.flow, { margin: -spacing / 2 }, style]}>
      {React.Children.map(children, child => (
        <View style={{ margin: spacing / 2 }}>{child}</View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  flow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    width: '100%',
  },
});