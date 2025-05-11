import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import Tag from '../Tag';
import { MaterialIcons } from '@expo/vector-icons';
import { FriendRequestBoxProps } from './types';

const FriendRequestBox: React.FC<FriendRequestBoxProps> = ({
  request,
  onAccept,
  onDecline,
}) => {
  return (
    <ThemedView style={styles.section}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.userInfo}>
            <Image 
              source={{ uri: request.avatarUrl }} 
              style={styles.avatar} 
            />
            <View style={styles.headerTextContainer}>
              <ThemedText type="default" style={styles.name}>
                {request.name}
              </ThemedText>
              <ThemedText type="subtitle" style={styles.description}>
                {request.description}
              </ThemedText>
            </View>
          </View>
          
          <View style={styles.actions}>
            <TouchableOpacity onPress={onAccept} style={styles.actionButton}>
              <MaterialIcons name="thumb-up" size={30} color="#2563eb" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDecline} style={styles.actionButton}>
              <MaterialIcons name="thumb-down" size={30} color="#2563eb" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tagsContainer}>
          {request.tags.map((tag, index) => (
            <Tag key={`${request.id}-${index}`} label={tag} />
          ))}
        </View>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  section: {
    width: '100%',
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerContainer: {
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
  headerTextContainer: {
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  name: {
    marginBottom: 2,
  },
  description: {
    opacity: 0.8,
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});

export default FriendRequestBox;