import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import FriendRequestList from './FriendRequestList';
import { FriendRequest } from './types';

interface FriendRequestsScreenProps {
  requests: FriendRequest[];
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  loading?: boolean;
  error?: string | null;
}

const FriendRequestsScreen: React.FC<FriendRequestsScreenProps> = ({
  requests,
  onAccept,
  onDecline,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header Section */}
      <ThemedView style={styles.headerSection}>
        <ThemedView style={styles.headerContainer}>
          <ThemedView style={styles.headerTextContainer}>
            <ThemedText type="title">Friend Requests</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <FriendRequestList
        requests={requests}
        onAccept={onAccept}
        onDecline={onDecline}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
  },
  headerSection: {
    width: '100%',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
});

export default FriendRequestsScreen;