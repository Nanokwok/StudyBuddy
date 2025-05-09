import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MaterialIcons } from '@expo/vector-icons';
import { HeaderProps } from './types';
import { styles } from './styles';

export const SectionHeader: React.FC<HeaderProps> = ({ 
  title, 
  subtitle, 
  showArrow = false,
  onPress 
}) => (
  <ThemedView style={styles.headerContainer}>
    <View style={styles.headerTextContainer}>
      <ThemedText type="title">{title}</ThemedText>
      {subtitle && <ThemedText type="subtitle">{subtitle}</ThemedText>}
    </View>
    {showArrow && (
      <TouchableOpacity onPress={onPress} style={styles.arrowIcon}>
        <MaterialIcons name="arrow-forward" size={24} color="#666" />
      </TouchableOpacity>
    )}
  </ThemedView>
);
