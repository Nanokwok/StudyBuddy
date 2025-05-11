import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MaterialIcons } from '@expo/vector-icons';

interface CalendarEventProps {
  title: string;
  date: string;
  time: string;
}

const CalendarEvent: React.FC<CalendarEventProps> = ({ title, date, time }) => {
  return (
    <ThemedView style={styles.cardContainer}>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <ThemedText type="subtitle">{title}</ThemedText>
          <View style={styles.detailsContainer}>
            <View style={styles.row}>
              <MaterialIcons name="calendar-today" size={16} color="#666" />
              <ThemedText type="default" style={styles.text}>{date}</ThemedText>
            </View>
            <View style={styles.row}>
              <MaterialIcons name="access-time" size={16} color="#666" />
              <ThemedText type="default" style={styles.text}>{time}</ThemedText>
            </View>
          </View>
        </View>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 8,
  },
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  innerContainer: {
    gap: 8,
  },
  detailsContainer: {
    gap: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  text: {
    marginLeft: 4,
  },
});

export default CalendarEvent;