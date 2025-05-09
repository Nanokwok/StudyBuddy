import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import Tag from '../Tag';

interface Friend {
  id: string;
  name: string;
  description: string;
  avatarUrl: string;
  tags: string[];
}

interface FriendBoxProps {
  friend: Friend;
  onViewProfile: () => void;
}

const FriendBox: React.FC<FriendBoxProps> = ({ friend, onViewProfile }) => {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: friend.avatarUrl }} 
            style={styles.avatar} 
          />
          <View style={styles.textContainer}>
            <ThemedText style={styles.name}>{friend.name}</ThemedText>
            <ThemedText style={styles.description}>{friend.description}</ThemedText>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={onViewProfile}
        >
          <MaterialIcons name="person" size={16} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.tagsContainer}>
        {friend.tags.map((tag, index) => (
          <Tag 
            key={index} 
            label={tag} 
            outlineColor="#2563eb"
            textStyle={{ fontSize: 12 }}
          />
        ))}
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    opacity: 0.5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileButton: {
    width: 40,
    height: 40,
    backgroundColor: '#2563eb',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});

export default FriendBox;