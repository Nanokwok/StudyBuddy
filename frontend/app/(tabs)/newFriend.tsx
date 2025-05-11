import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import SearchBarWithSubjects from '@/components/SearchBarWithSubjects';
import AddFriendBox from '@/components/AddFriends/AddFriendBox';

const AddFriendsPage = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [friendRequests, setFriendRequests] = useState([
    {
      id: '1',
      name: 'Amy Worawalan',
      description: 'Engineering, Software and Knowledge Engineering',
      avatarUrl: 'https://placehold.co/40x40',
      tags: ['Mathematics', 'Software Design', 'Mobile Dev']
    },
    {
      id: '2',
      name: 'Nat Peanut',
      description: 'Engineering, Aerospace Engineering',
      avatarUrl: 'https://placehold.co/40x40',
      tags: ['Mathematics']
    },
    {
      id: '3',
      name: 'Tonnam Napasorn',
      description: 'Engineering, Computer Science and Engineering',
      avatarUrl: 'https://placehold.co/40x40',
      tags: ['Mathematics', 'Mobile Dev']
    }
  ]);

  const handleAddFriend = (id: string) => {
    console.log(`Added friend ${id}`);
    // Remove the friend request from the list
    setFriendRequests(prev => prev.filter(friend => friend.id !== id));
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

  const filteredFriends = friendRequests.filter(friend => {
    const matchesSearch = friend.name.toLowerCase().includes(searchText.toLowerCase()) || 
                         friend.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesSubject = !selectedSubject || friend.tags.includes(selectedSubject);
    return matchesSearch && matchesSubject;
  });

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Find New Friends!</ThemedText>
      </ThemedView>

      {/* Search Bar with Subjects */}
      <SearchBarWithSubjects 
        searchText={searchText}
        onSearchChange={handleSearchChange}
        onSubjectPress={handleSubjectSelect}
        selectedSubject={selectedSubject}
      />

      {/* Friend Requests List */}
      <ScrollView style={styles.friendsList}>
        {filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => (
            <AddFriendBox
              key={friend.id}
              request={friend}
              onAdd={() => handleAddFriend(friend.id)}
            />
          ))
        ) : (
          <ThemedView style={styles.emptyState}>
            <ThemedText>No friend requests found</ThemedText>
          </ThemedView>
        )}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 78,
    paddingBottom: 8,
  },
  title: {
    fontSize: 25,
  },
  friendsList: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
});

export default AddFriendsPage;