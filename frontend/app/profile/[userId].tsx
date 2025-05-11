import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome } from '@expo/vector-icons';
import Tag from '@/components/Tag';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '@/core/api';

interface User {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
  tags: string[];
  social: {
    instagram: string;
    facebook: string;
  };
}

export default function Profile() {
  const { userId } = useLocalSearchParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unfriending, setUnfriending] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch user basic info
        const userRes = await api.get(`/users/${userId}/`);
        const userData = userRes.data;
        
        // Fetch user courses
        const coursesRes = await api.get(`/users/${userId}/courses/`);
        const tags = coursesRes.data.map((c: any) => c.course.subject);
        
        // Fetch social links
        const socialRes = await api.get(`/users/${userId}/social_links/`);
        const socialLinks = socialRes.data;
        
        // Extract social media usernames
        const instagramLink = socialLinks.find((link: any) => 
          link.platform.toLowerCase() === 'instagram');
        const facebookLink = socialLinks.find((link: any) => 
          link.platform.toLowerCase() === 'facebook');

        setUser({
          id: userId as string,
          name: `${userData.first_name} ${userData.last_name}`.trim(),
          bio: userData.bio || 'No bio available',
          avatarUrl: userData.profile_picture_url || 'https://placehold.co/120x120',
          tags,
          social: {
            instagram: instagramLink?.name?.replace('@', '') || '',
            facebook: facebookLink?.name || ''
          }
        });
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const openSocialMedia = (platform: string, username: string) => {
    let url = '';
    if (platform === 'instagram' && username) {
      url = `https://instagram.com/${username}`;
    } else if (platform === 'facebook' && username) {
      url = `https://facebook.com/${username}`;
    }

    if (!url) {
      Alert.alert(
        'No Account',
        `This user hasn't connected their ${platform} account`
      );
      return;
    }

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert(
          'Cannot Open Link',
          `Unable to open ${platform}. The app may not be installed.`
        );
      }
    });
  };

  const handleUnfriend = async () => {
    try {
      Alert.alert(
        'Unfriend',
        `Are you sure you want to unfriend ${user?.name}?`,
        [
          { 
            text: 'Cancel', 
            style: 'cancel' 
          },
          { 
            text: 'Unfriend', 
            style: 'destructive',
            onPress: async () => {
              try {
                setUnfriending(true);
                await api.post('/friendships/unfriend/', { friend_id: userId });
                router.back();
                Alert.alert('Success', `You are no longer friends with ${user?.name}`);
              } catch (error) {
                console.error('Unfriend error:', error);
                Alert.alert('Error', 'Failed to unfriend. Please try again.');
              } finally {
                setUnfriending(false);
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error showing alert:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
        <ThemedText style={{ marginTop: 16 }}>Loading profile...</ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <ThemedText style={{ color: 'red' }}>{error}</ThemedText>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, styles.center]}>
        <ThemedText>User not found</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ThemedView style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: user.avatarUrl }} 
            style={styles.avatar} 
            onError={() => setUser({...user, avatarUrl: 'https://placehold.co/120x120'})}
          />
        </View>
        <View style={styles.nameContainer}>
          <ThemedText style={styles.username}>{user.name}</ThemedText>
          <ThemedText style={styles.bio}>{user.bio}</ThemedText>
        </View>
        <View style={styles.tagsContainer}>
          {user.tags.map((tag, index) => (
            <Tag
              key={index}
              label={tag}
              outlineColor="#2563eb"
              textStyle={styles.tagText}
            />
          ))}
        </View>
      </ThemedView>

      <View style={styles.socialContainer}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => openSocialMedia('instagram', user.social.instagram)}
          disabled={!user.social.instagram}
        >
          <FontAwesome name="instagram" size={24} color="#E1306C" />
          <ThemedText style={styles.socialText}>
            {user.social.instagram ? `@${user.social.instagram}` : 'Not connected'}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => openSocialMedia('facebook', user.social.facebook)}
          disabled={!user.social.facebook}
        >
          <FontAwesome name="facebook" size={24} color="#4267B2" />
          <ThemedText style={styles.socialText}>
            {user.social.facebook || 'Not connected'}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={[styles.unfriendButton, unfriending && { opacity: 0.7 }]}
          onPress={handleUnfriend}
          disabled={unfriending}
        >
          {unfriending ? (
            <ActivityIndicator color="white" />
          ) : (
            <ThemedText style={styles.unfriendButtonText}>Unfriend</ThemedText>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: { 
    paddingTop: 16, 
    alignItems: 'center', 
    paddingBottom: 16 
  },
  avatarContainer: { 
    marginBottom: 16 
  },
  avatar: { 
    width: 120, 
    height: 120, 
    borderRadius: 60 
  },
  nameContainer: { 
    alignItems: 'center', 
    marginBottom: 16 
  },
  username: { 
    fontSize: 24, 
    fontWeight: '800', 
    marginBottom: 8 
  },
  bio: { 
    fontSize: 16, 
    color: '#6b7280', 
    textAlign: 'center' 
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  tagText: { 
    fontSize: 12 
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    minWidth: 150,
  },
  socialText: { 
    marginLeft: 8, 
    fontSize: 14 
  },
  actionContainer: {
    padding: 16,
    marginTop: 'auto',
    marginBottom: 24,
  },
  unfriendButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6b7280',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unfriendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});