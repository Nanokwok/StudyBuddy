import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Sessions } from '@/components/session';
import type { Session } from '@/components/session/types';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for sessions
  const mockSessions: Session[] = [
    {
      id: '1',
      title: "Calculus",
      date: "Oct 12, 2023",
      time: "3:00 PM"
    },
    {
      id: '2',
      title: "Mobile Dev",
      date: "Oct 12, 2023",
      time: "6:00 PM"
    },
    {
      id: '3',
      title: "Physics",
      date: "Oct 13, 2023",
      time: "2:00 PM"
    },
    {
      id: '4',
      title: "Chemistry",
      date: "Oct 14, 2023",
      time: "4:00 PM"
    },
    {
      id: '5',
      title: "Biology",
      date: "Oct 15, 2023",
      time: "1:00 PM"
    }
  ];

  useEffect(() => {
    setSessions(mockSessions);
    setLoading(false);
  }, []);

  /*
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get<Session[]>('session-api-endpoint');
        setSessions(response.data);
      } catch (err) {
        setError(err.message);
        Alert.alert('Error', 'Failed to fetch sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);
  */

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <Sessions 
      sessions={sessions}
      loading={loading}
      error={error}
      // onSeeAllPress={() => navigation.navigate('AllSessions')}
      // onMorePress={() => navigation.navigate('Friends')}
    />
  );
};

export default HomeScreen;