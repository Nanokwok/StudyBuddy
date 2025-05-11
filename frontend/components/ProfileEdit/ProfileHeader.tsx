import React from 'react';
import { View, Text, TextInput, StyleSheet, Animated, Platform, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { UserData } from '@/types';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

interface ProfileHeaderProps {
  userData: UserData;
  editData: UserData;
  isEditing: boolean;
  onEditChange: (field: string, value: string) => void;
}

const ProfileHeader = ({ userData, editData, isEditing, onEditChange }: ProfileHeaderProps) => {
  const getInitials = () => {
    const first = userData.firstName ? userData.firstName.charAt(0) : '';
    const last = userData.lastName ? userData.lastName.charAt(0) : 
                userData.username ? userData.username.charAt(0).toUpperCase() : 'U';
    return first + last;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.primaryGradientStart, COLORS.primaryGradientEnd]}
        style={styles.headerBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Animated.View style={[styles.profileImageWrapper, SHADOWS.large]}>
            {userData.profilePictureUrl ? (
              <Image
                source={{ uri: userData.profilePictureUrl }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <LinearGradient
                colors={[COLORS.primaryLight, COLORS.primaryDark]}
                style={styles.profileImagePlaceholder}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.profileImagePlaceholderText}>
                  {getInitials()}
                </Text>
              </LinearGradient>
            )}
          </Animated.View>
        </View>
    
        {/* Rest of the component remains the same */}
        <View style={styles.nameContainer}>
          {isEditing ? (
            <View style={styles.editNameContainer}>
              <TextInput
                style={styles.nameInput}
                value={editData.firstName}
                onChangeText={(text) => onEditChange('firstName', text)}
                placeholder="First Name"
                placeholderTextColor={COLORS.textPlaceholder}
              />
              <TextInput
                style={styles.nameInput}
                value={editData.lastName}
                onChangeText={(text) => onEditChange('lastName', text)}
                placeholder="Last Name"
                placeholderTextColor={COLORS.textPlaceholder}
              />
            </View>
          ) : (
            <Text style={styles.nameText}>
              {userData.firstName || userData.lastName 
                ? `${userData.firstName} ${userData.lastName}`.trim()
                : userData.username}
            </Text>
          )}
          
          {!isEditing && userData.email && (
            <Text style={styles.emailText}>{userData.email}</Text>
          )}
        </View>
      </View>

      {/* Rest of the component remains the same */}
      <View style={styles.bioContainer}>
        {isEditing ? (
          <View style={styles.bioInputContainer}>
            <TextInput
              style={styles.bioInput}
              value={editData.bio}
              onChangeText={(text) => onEditChange('bio', text)}
              placeholder="Write a short bio about yourself or your major..."
              placeholderTextColor={COLORS.textPlaceholder}
              multiline
              numberOfLines={3}
            />
          </View>
        ) : (
          <View style={styles.bioTextContainer}>
            {userData.bio ? (
              <Text style={styles.bioText}>{userData.bio}</Text>
            ) : (
              <Text style={styles.emptyBioText}>No bio added yet</Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    borderBottomLeftRadius: BORDER_RADIUS.xl,
    borderBottomRightRadius: BORDER_RADIUS.xl,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SPACING.xl,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  profileImageContainer: {
    marginRight: SPACING.md,
  },
  profileImageWrapper: {
    width: BORDER_RADIUS.circle * 2,
    height: BORDER_RADIUS.circle * 2,
    borderRadius: BORDER_RADIUS.circle,
    padding: 3,
    backgroundColor: COLORS.background,
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS.circle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImagePlaceholderText: {
    color: 'white',
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
  },
  nameContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: SPACING.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  emailText: {
    fontSize: FONT_SIZE.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  editNameContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
    gap: SPACING.xs,
  },
  nameInput: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    borderWidth: 1,
    borderColor: COLORS.borderInput,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    ...SHADOWS.small,
  },
  bioContainer: {
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  bioInputContainer: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.small,
  },
  bioInput: {
    fontSize: FONT_SIZE.md,
    borderWidth: 1,
    borderColor: COLORS.borderInput,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  bioTextContainer: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    minHeight: 60,
    ...SHADOWS.small,
  },
  bioText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  emptyBioText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textPlaceholder,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS.circle,
  },
});

export default ProfileHeader;