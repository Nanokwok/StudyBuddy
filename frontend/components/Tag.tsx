import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';

interface TagProps {
  label: string;
  color?: string;
  outlineColor?: string;
  textStyle?: TextStyle;
  containerStyle?: ViewStyle;
  onPress?: () => void;
}

const Tag: React.FC<TagProps> = ({
  label,
  color = 'transparent',
  outlineColor = '#2563eb',
  textStyle = {},
  containerStyle = {},
  onPress,
}) => {
  const ContainerComponent = onPress ? TouchableOpacity : View;

  return (
    <ContainerComponent
      style={[
        styles.container,
        {
          backgroundColor: color,
          borderColor: outlineColor,
        },
        containerStyle,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: outlineColor }, textStyle]}>
        {label}
      </Text>
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  text: {
    fontSize: 12, 
    fontWeight: 'normal',
    lineHeight: 16,
    textAlign: 'left',
  },
});

export default Tag;