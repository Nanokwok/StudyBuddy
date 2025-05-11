import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import FriendRequestBox from './FriendRequestBox';
import { FriendRequestListProps } from './types';

const FriendRequestList: React.FC<FriendRequestListProps> = ({
  requests,
  onAccept,
  onDecline,
}) => {
  return (
    <ScrollView 
      style={styles.scrollContainer}
      contentContainerStyle={styles.requestsContainer}
    >
      {requests.map((request) => (
        <ThemedView key={request.id} style={styles.section}>
          <FriendRequestBox
            request={request}
            onAccept={() => onAccept(request.id)}
            onDecline={() => onDecline(request.id)}
          />
        </ThemedView>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    paddingBottom: 24,
  },
  requestsContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  section: {
    width: '100%',
    marginBottom: 16,
  },
});

export default FriendRequestList;