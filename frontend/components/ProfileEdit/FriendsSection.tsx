import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

interface FriendsSectionProps {
  friendCount: number;
  onViewFriends: () => void;
}

const FriendsSection = ({ friendCount, onViewFriends }: FriendsSectionProps) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Friends</Text>
        <MaterialIcons name="people" size={20} color={COLORS.textSecondary} />
      </View>
      
      <View style={styles.friendsContent}>
        <View style={styles.friendCountContainer}>
          <LinearGradient
            colors={[COLORS.primaryGradientStart, COLORS.primaryGradientEnd]}
            style={styles.friendCountCircle}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.friendCountNumber}>{friendCount}</Text>
          </LinearGradient>
          <Text style={styles.friendCountLabel}>Friends</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.viewFriendsButton}
          onPress={onViewFriends}
        >
          <LinearGradient
            colors={['rgba(37, 99, 235, 0.1)', 'rgba(37, 99, 235, 0.2)']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.viewFriendsButtonText}>View All Friends</Text>
            <MaterialIcons name="arrow-forward" size={16} color={COLORS.primary} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    margin: SPACING.md,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  friendsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  friendCountContainer: {
    alignItems: 'center',
  },
  friendCountCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    ...SHADOWS.small,
  },
  friendCountNumber: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: 'white',
  },
  friendCountLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  viewFriendsButton: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  viewFriendsButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    marginRight: SPACING.xs,
  },
});

export default FriendsSection;