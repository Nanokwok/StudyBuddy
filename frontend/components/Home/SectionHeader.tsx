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
}) => (
  <ThemedView style={styles.headerContainer}>
    <View style={styles.headerTextContainer}>
      <ThemedText type="title">{title}</ThemedText>
      {subtitle && <ThemedText type="subtitle">{subtitle}</ThemedText>}
    </View>
  </ThemedView>
);
