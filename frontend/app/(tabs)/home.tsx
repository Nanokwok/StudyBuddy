import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Sessions } from '@/components/Home';
import type { Session } from '@/components/Home';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import api from '../../core/api';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get('enrollments/upcoming_sessions/')
        setSessions(res.data);
      } catch (err) {
        console.error('Failed to fetch sessions', err);
        setError('Failed to load sessions');
      } finally {
        setLoading(false);
      }
    };
  
    fetchSessions();
  }, []);
  

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
    <ProtectedRoute>
      <Sessions 
        sessions={sessions}
        loading={loading}
        error={error}
      />
    </ProtectedRoute>
  );
};

export default HomeScreen;