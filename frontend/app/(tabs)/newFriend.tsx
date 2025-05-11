import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import SearchBarWithSubjects from '@/components/SearchBarWithSubjects';
import AddFriendBox from '@/components/AddFriends/AddFriendBox';
import api from '../../core/api';

type AddableUser = {
  id: string;
  name: string;
  description: string;
  avatarUrl: string;
  tags: string[];
};

const AddFriendsPage = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [users, setUsers] = useState<AddableUser[]>([]);
  const [error, setError] = useState('');

  const fetchAddableUsers = async () => {
    try {
      const response = await api.get('friendships/addable-users/');
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch addable users', err);
      setError('Failed to load users');
    }
  };

  useEffect(() => {
    fetchAddableUsers();
  }, []);

  const handleAddFriend = async (id: string) => {
    try {
      await api.post(`friendships/${id}/request/`);
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      console.error('Failed to send request', err);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    if (selectedSubject && !text.includes(selectedSubject)) {
      setSelectedSubject(null);
    }
  };

  const handleSubjectSelect = (subject: string) => {
    const newSubject = selectedSubject === subject ? null : subject;
    setSelectedSubject(newSubject);
    setSearchText(newSubject || '');
  };

  const filteredUsers = users.filter(user => {
    const matchText =
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.description.toLowerCase().includes(searchText.toLowerCase());

    const matchTag =
      !selectedSubject || user.tags.includes(selectedSubject);

    return matchText && matchTag;
  });

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Find New Friends!</ThemedText>
      </ThemedView>

      <SearchBarWithSubjects 
        searchText={searchText}
        onSearchChange={handleSearchChange}
        onSubjectPress={handleSubjectSelect}
        selectedSubject={selectedSubject}
      />

      <ScrollView style={styles.friendsList}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <AddFriendBox
              key={user.id}
              request={user}
              onAdd={() => handleAddFriend(user.id)}
            />
          ))
        ) : (
          <ThemedView style={styles.emptyState}>
            <ThemedText>No users found</ThemedText>
          </ThemedView>
        )}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { paddingHorizontal: 16, paddingTop: 78, paddingBottom: 8 },
  title: { fontSize: 25 },
  friendsList: { flex: 1 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 40 },
});

export default AddFriendsPage;