import React, { useEffect, useState } from 'react';
import { FriendRequestsScreen } from '@/components/request';
import api from '../../core/api';
import { FriendRequest } from '@/components/request/types';

const FriendRequestsPage = () => {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFriendRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get('users/pending_friend_requests/');
      const data = res.data;

      const formatted = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        avatarUrl: item.profile_picture_url || 'https://placehold.co/40x40',
        tags: item.tags || [],
      }));

      setFriendRequests(formatted);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch friend requests', err);
      setError('Failed to load friend requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      await api.post(`friendships/${id}/accept/`);
      setFriendRequests(prev => prev.filter(req => req.id !== id));
    } catch (err) {
      console.error('Failed to accept', err);
      setError('Failed to accept friend request');
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await api.post(`friendships/${id}/reject/`);
      setFriendRequests(prev => prev.filter(req => req.id !== id));
    } catch (err) {
      console.error('Failed to decline', err);
      setError('Failed to decline friend request');
    }
  };

  return (
    <FriendRequestsScreen
      requests={friendRequests}
      onAccept={handleAccept}
      onDecline={handleDecline}
      loading={loading}
      error={error}
    />
  );
};

export default FriendRequestsPage;