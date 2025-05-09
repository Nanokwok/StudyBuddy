import React from 'react';
import { FriendRequestsScreen } from '@/components/request';
import { useState } from 'react';

const FriendRequestsPage = () => {
  // Mock data for friend requests
  const [friendRequests, setFriendRequests] = useState([
    {
      id: '1',
      name: 'Poy Napapach',
      description: 'Engineering, Software and Knowledge Engineering',
      avatarUrl: 'https://placehold.co/40x40',
      tags: ['Software Design', 'Mobile Dev'],
    },
    {
      id: '2',
      name: 'Nano Atikarn',
      description: 'Engineering, Software and Knowledge Engineering',
      avatarUrl: 'https://placehold.co/40x40',
      tags: ['ISP', 'Mobile Dev'],
    },
    {
      id: '3',
      name: 'Amara Lin',
      description: 'Humanity, Chinese',
      avatarUrl: 'https://placehold.co/40x40',
      tags: ['Thai language'],
    },
  ]);

  const handleAccept = (id: string) => {
    console.log(`Accepted friend request ${id}`);
    // Filter out the accepted request
    setFriendRequests(prev => prev.filter(req => req.id !== id));
  };

  const handleDecline = (id: string) => {
    console.log(`Declined friend request ${id}`);
    // Filter out the declined request
    setFriendRequests(prev => prev.filter(req => req.id !== id));
  };

  const handlePress = (id: string) => {
    console.log(`Pressed friend request ${id}`);
    // Navigate to profile or other action
  };

  return (
    <FriendRequestsScreen
      requests={friendRequests}
      onAccept={handleAccept}
      onDecline={handleDecline}
      onPress={handlePress}
    />
  );
};

export default FriendRequestsPage;