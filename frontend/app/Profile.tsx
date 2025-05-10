import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import { FontAwesome } from '@expo/vector-icons';
import Tag from '../components/Tag';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { JSX } from 'react';

interface User {
  id: string | string[] | undefined;
  name: string;
  bio: string;
  avatarUrl: string;
  tags: string[];
  social: {
    instagram: string;
    facebook: string;
  };
}

export default function Profile(): JSX.Element {
  const { userId } = useLocalSearchParams();
  const router = useRouter();

  const [user, setUser] = useState<User>({
    id: userId,
    name: '',
    bio: '',
    avatarUrl: '',
    tags: [],
    social: {
      instagram: '',
      facebook: '',
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // const response = await fetch(http://127.0.0.1:5000/api/users/${userId});
        // const userData = await response.json();
        // setUser(userData);
        if (userId === '1') {
          setUser({
            id: userId,
            name: 'Amy Worawalan',
            bio: 'Engineering, Software and Knowledge Engineering',
            avatarUrl: 'https://placehold.co/120x120',
            tags: ['Mathematics', 'Software Design', 'Mobile Dev'],
            social: {
              instagram: 'amy.wora',
              facebook: 'Amy Worawalan',
            },
          });
        } else if (userId === '2') {
          setUser({
            id: userId,
            name: 'Nat Peanut',
            bio: 'Engineering, Aerospace Engineering',
            avatarUrl: 'https://placehold.co/120x120',
            tags: ['Mathematics'],
            social: {
              instagram: 'nana.nut',
              facebook: 'Nat Peanut',
            },
          });
        } else if (userId === '3') {
          setUser({
            id: userId,
            name: 'Tonnam Napasorn',
            bio: 'Engineering, Computer Science and Engineering',
            avatarUrl: 'https://placehold.co/120x120',
            tags: ['Mathematics', 'Mobile Dev'],
            social: {
              instagram: 'tonnam.cs',
              facebook: 'Napasorn Tonnam',
            },
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const openSocialMedia = (platform: string, username: string) => {
    let url = '';
    if (platform === 'instagram') {
      url = `https://instagram.com/${username}`;
    } else if (platform === 'facebook') {
      url = `https://facebook.com`;
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

  return (
    <View style={styles.container}>
      <ThemedView style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
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
          onPress={() =>
            openSocialMedia('instagram', user.social.instagram)
          }
        >
          <FontAwesome name="instagram" size={24} color="#E1306C" />
          <ThemedText style={styles.socialText}>
            {user.social.instagram}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => openSocialMedia('facebook', user.social.facebook)}
        >
          <FontAwesome name="facebook" size={24} color="#4267B2" />
          <ThemedText style={styles.socialText}>
            {user.social.facebook}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.unfriendButton}>
          <ThemedText style={styles.unfriendButtonText}>Unfriend</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  profileHeader: { paddingTop: 16, alignItems: 'center', paddingBottom: 16 },
  avatarContainer: { marginBottom: 16 },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  nameContainer: { alignItems: 'center', marginBottom: 16 },
  username: { fontSize: 24, fontWeight: '800', marginBottom: 8 },
  bio: { fontSize: 16, color: '#6b7280', textAlign: 'center' },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  tagText: { fontSize: 12 },
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
  socialText: { marginLeft: 8, fontSize: 14 },
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
