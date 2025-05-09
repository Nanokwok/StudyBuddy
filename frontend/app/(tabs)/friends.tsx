import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import SearchBarWithSubjects from '@/components/SearchBarWithSubjects';
import FriendBox from '@/components/friends/FriendBox';
import { useNavigation } from '@react-navigation/native';

const FriendsPage = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  
  // Sample data for existing friends
  const [friends] = useState([
    {
      id: '1',
      name: 'John Doe',
      description: 'Computer Science, Year 2',
      avatarUrl: 'https://placehold.co/40x40',
      tags: ['Programming', 'Algorithms', 'Web Dev']
    },
    {
      id: '2',
      name: 'Jane Smith',
      description: 'Electrical Engineering, Year 3',
      avatarUrl: 'https://placehold.co/40x40',
      tags: ['Circuits', 'Mathematics']
    },
    {
      id: '3',
      name: 'Alex Johnson',
      description: 'Data Science, Year 1',
      avatarUrl: 'https://placehold.co/40x40',
      tags: ['Statistics', 'Machine Learning']
    }
  ]);

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

  const filteredFriends = friends.filter(friend => {
    const matchesSearch = friend.name.toLowerCase().includes(searchText.toLowerCase()) || 
                         friend.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesSubject = !selectedSubject || friend.tags.includes(selectedSubject);
    return matchesSearch && matchesSubject;
  });

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Your Friends</ThemedText>
      </ThemedView>

      <SearchBarWithSubjects 
        searchText={searchText}
        onSearchChange={handleSearchChange}
        onSubjectPress={handleSubjectSelect}
        selectedSubject={selectedSubject}
      />

      <ScrollView style={styles.friendsList}>
        {filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => (
            <FriendBox 
            friend={friend} 
            onViewProfile={() => navigation.navigate('Profile', { userId: friend.id })}
            />
          ))
        ) : (
          <ThemedView style={styles.emptyState}>
            <ThemedText>No friends found</ThemedText>
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

export default FriendsPage;