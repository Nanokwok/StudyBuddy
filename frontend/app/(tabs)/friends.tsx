import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import SearchBarWithSubjects from '@/components/SearchBarWithSubjects';
import FriendBox from '@/components/Friends/FriendBox';
import { useRouter } from 'expo-router';
import api from '../../core/api';

const FriendsPage = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const meRes = await api.get('/users/me/');
      const myId = meRes.data.id;

      const friendshipsRes = await api.get(`/users/${myId}/friendships/`);
      const sent = friendshipsRes.data.sent_requests || [];
      const received = friendshipsRes.data.received_requests || [];

      const acceptedFriends = [...sent, ...received]
        .filter(f => f.status === 'accepted')
        .map(f => f.requester.id === myId ? f.addressee : f.requester);

      const friendsWithCourses = await Promise.all(
        acceptedFriends.map(async (friend) => {
          try {
            const enrollRes = await api.get(`/users/${friend.id}/courses/`);
            const tags = enrollRes.data.map((c: any) => c.course.subject);

            return {
              id: friend.id,
              name: `${friend.first_name} ${friend.last_name}`,
              description: friend.major || 'No major info',
              avatarUrl: friend.profile_picture_url || 'https://placehold.co/40x40',
              tags,
            };
          } catch (err) {
            return null;
          }
        })
      );

      setFriends(friendsWithCourses.filter(Boolean));
    } catch (err) {
      console.error('Error fetching friends', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const handleViewProfile = (friendId: string) => {
    router.push({
      pathname: '/Profile',
      params: { userId: friendId }
    });
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

  const filteredFriends = friends.filter(friend => {
    const matchesSearch =
      friend.name.toLowerCase().includes(searchText.toLowerCase()) ||
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
        {loading ? (
          <ThemedText>Loading...</ThemedText>
        ) : filteredFriends.length > 0 ? (
          filteredFriends.map(friend => (
            <FriendBox
              key={friend.id}
              friend={friend}
              onViewProfile={() => handleViewProfile(friend.id)}
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
