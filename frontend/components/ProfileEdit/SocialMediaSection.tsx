import React from 'react';
import { View, Text, TextInput, StyleSheet, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

interface SocialMediaSectionProps {
  socialData: {
    instagram: string;
    facebook: string;
  };
  editSocialData: {
    instagram: string;
    facebook: string;
  };
  isEditing: boolean;
  onSocialChange: (platform: 'instagram' | 'facebook', value: string) => void;
}

const SocialMediaSection = ({ 
  socialData, 
  editSocialData, 
  isEditing, 
  onSocialChange 
}: SocialMediaSectionProps) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Social Media</Text>
        <FontAwesome name="share-alt" size={18} color={COLORS.textSecondary} />
      </View>
  
      <View style={styles.socialItemsContainer}>
        <View style={styles.socialItem}>
          <View style={[styles.socialIconContainer, styles.instagramIcon]}>
            <FontAwesome name="instagram" size={20} color="white" />
          </View>
          
          {isEditing ? (
            <View style={styles.socialInputContainer}>
              <Text style={styles.socialInputPrefix}>@</Text>
              <TextInput
                style={styles.socialInput}
                value={editSocialData.instagram}
                onChangeText={(text) => onSocialChange('instagram', text)}
                placeholder="Instagram username"
                placeholderTextColor={COLORS.textPlaceholder}
              />
            </View>
          ) : (
            <View style={styles.socialTextContainer}>
              {editSocialData.instagram ? (
                <Text style={styles.socialText}>@{socialData.instagram}</Text>
              ) : (
                <Text style={styles.emptySocialText}>Not connected</Text>
              )}
            </View>
          )}
        </View>
    
        <View style={styles.socialItem}>
          <View style={[styles.socialIconContainer, styles.facebookIcon]}>
            <FontAwesome name="facebook" size={20} color="white" />
          </View>
          
          {isEditing ? (
            <TextInput
              style={[styles.socialInput, styles.fullWidthInput]}
              value={editSocialData.facebook}
              onChangeText={(text) => onSocialChange('facebook', text)}
              placeholder="Facebook name"
              placeholderTextColor={COLORS.textPlaceholder}
            />
          ) : (
            <View style={styles.socialTextContainer}>
              {editSocialData.facebook ? (
                <Text style={styles.socialText}>{socialData.facebook}</Text>
              ) : (
                <Text style={styles.emptySocialText}>Not connected</Text>
              )}
            </View>
          )}
        </View>
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
  socialItemsContainer: {
    gap: SPACING.md,
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.circle,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    ...SHADOWS.small,
  },
  instagramIcon: {
    backgroundColor: COLORS.instagram,
  },
  facebookIcon: {
    backgroundColor: COLORS.facebook,
  },
  socialTextContainer: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  socialText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  emptySocialText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textPlaceholder,
    fontStyle: 'italic',
  },
  socialInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderInput,
    overflow: 'hidden',
  },
  socialInputPrefix: {
    paddingLeft: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  socialInput: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    padding: SPACING.sm,
  },
  fullWidthInput: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    padding: SPACING.sm,
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderInput,
  },
});

export default SocialMediaSection;