import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

// Helper for icons (replace with react-native-vector-icons or similar in production)
const Icon = ({ name, size = 24, color = 'gray' }) => {
  // Simple emoji fallback for demo
  const icons = {
    'arrow.right': '→',
    'calendar': '📅',
    'clock': '⏰',
  };
  return (
    <Text style={{ fontSize: size, color, width: size, textAlign: 'center' }}>
      {icons[name] || '?'}
    </Text>
  );
};

const { width } = Dimensions.get('window');

export default function ContentView() {
  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerRow}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Upcoming Sessions</Text>
          <Text style={styles.headerSubtitle}>Plan your study times</Text>
        </View>
        <Icon name="arrow.right" size={24} color="gray" />
      </View>

      {/* Sub Header */}
      <View style={styles.subHeaderRow}>
        <Text style={styles.subHeaderTitle}>Upcoming Sessions</Text>
        <Text style={styles.seeAll}>See All</Text>
      </View>

      {/* Sessions List */}
      <View style={styles.sessionsList}>
        {[1, 2, 3].map(i => (
          <View key={i} style={styles.sessionCard}>
            <Text style={styles.sessionTitle}>{`Calculus ${i}`}</Text>
            <View style={styles.sessionInfo}>
              <View style={styles.sessionInfoRow}>
                <Icon name="calendar" size={16} color="gray" />
                <Text style={styles.sessionInfoText}>Oct 12, 2023</Text>
              </View>
              <View style={styles.sessionInfoRow}>
                <Icon name="clock" size={16} color="gray" />
                <Text style={styles.sessionInfoText}>3:00 PM</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Friends Section */}
      <View style={styles.headerRow}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Friends</Text>
          <Text style={styles.headerSubtitle}>Connect with classmates</Text>
        </View>
        <Icon name="arrow.right" size={24} color="gray" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingTop: 24,
    paddingBottom: 4,
    gap: 8,
  },
  headerTextContainer: {
    flex: 1,
    minHeight: 52,
    justifyContent: 'center',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: width * 0.06,
    color: '#000',
  },
  headerSubtitle: {
    fontSize: width * 0.04,
    color: 'rgba(0,0,0,0.5)',
  },
  subHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: width * 0.05,
    paddingTop: 24,
    paddingBottom: 2,
  },
  subHeaderTitle: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: width * 0.05,
    color: '#000',
  },
  seeAll: {
    fontWeight: 'bold',
    fontSize: width * 0.04,
    color: '#3a63ed',
  },
  sessionsList: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 16,
  },
  sessionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 2, height: 3 },
    elevation: 2,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 16,
  },
  sessionTitle: {
    fontWeight: 'bold',
    fontSize: width * 0.045,
    color: '#000',
    marginBottom: 8,
  },
  sessionInfo: {
    flexDirection: 'column',
    gap: 8,
  },
  sessionInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sessionInfoText: {
    fontSize: width * 0.04,
    color: 'rgba(0,0,0,0.5)',
    marginLeft: 8,
  },
});
