import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const DUMMY_REQUESTS = [
  {
    id: '1',
    title: 'Join Calculus Study Group',
    description: 'Looking for 2 more members for Calculus I group.',
    date: 'Oct 15, 2023',
    status: 'Pending',
  },
  {
    id: '2',
    title: 'Physics II Lab Partner',
    description: 'Need a partner for upcoming Physics II lab.',
    date: 'Oct 18, 2023',
    status: 'Accepted',
  },
  // Add more dummy requests as needed
];

export default function RequestView() {
  const [requests, setRequests] = useState(DUMMY_REQUESTS);

  const handleAccept = (id) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id ? { ...req, status: 'Accepted' } : req
      )
    );
  };

  const handleDecline = (id) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id ? { ...req, status: 'Declined' } : req
      )
    );
  };

  const renderRequest = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.description}</Text>
      <Text style={styles.date}>{item.date}</Text>
      <View style={styles.actions}>
        {item.status === 'Pending' ? (
          <>
            <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAccept(item.id)}>
              <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.declineBtn} onPress={() => handleDecline(item.id)}>
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={[
            styles.status,
            item.status === 'Accepted' ? styles.accepted : styles.declined
          ]}>
            {item.status}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Requests</Text>
      <FlatList
        data={requests}
        keyExtractor={item => item.id}
        renderItem={renderRequest}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 6,
  },
  desc: {
    fontSize: 15,
    color: '#444',
    marginBottom: 8,
  },
  date: {
    fontSize: 13,
    color: '#888',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  acceptBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 22,
    marginRight: 8,
  },
  acceptText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  declineBtn: {
    backgroundColor: '#eee',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 22,
  },
  declineText: {
    color: '#888',
    fontWeight: 'bold',
    fontSize: 15,
  },
  status: {
    fontWeight: 'bold',
    fontSize: 15,
    paddingVertical: 8,
    paddingHorizontal: 22,
    borderRadius: 18,
    overflow: 'hidden',
  },
  accepted: {
    backgroundColor: '#d1e7fd',
    color: '#2563eb',
  },
  declined: {
    backgroundColor: '#f8d7da',
    color: '#c82333',
  },
});