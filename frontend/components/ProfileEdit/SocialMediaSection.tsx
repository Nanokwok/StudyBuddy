"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { View, Text, TextInput, StyleSheet, Animated } from "react-native"
import { FontAwesome } from "@expo/vector-icons"

interface SocialMediaSectionProps {
  socialData: {
    instagram: string
    facebook: string
  }
  editSocialData: {
    instagram: string
    facebook: string
  }
  isEditing: boolean
  onSocialChange: (platform: "instagram" | "facebook", value: string) => void
}

const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
  socialData,
  editSocialData,
  isEditing,
  onSocialChange,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay: 300,
      useNativeDriver: true,
    }).start()
  }, [])

  return (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerLeft}>
          <FontAwesome name="share-alt" size={18} color="#3A63ED" />
          <Text style={styles.sectionTitle}>Social Media</Text>
        </View>
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
                onChangeText={(text) => onSocialChange("instagram", text)}
                placeholder="Instagram username"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          ) : (
            <View style={styles.socialTextContainer}>
              {socialData.instagram ? (
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
              onChangeText={(text) => onSocialChange("facebook", text)}
              placeholder="Facebook name"
              placeholderTextColor="#9CA3AF"
            />
          ) : (
            <View style={styles.socialTextContainer}>
              {socialData.facebook ? (
                <Text style={styles.socialText}>{socialData.facebook}</Text>
              ) : (
                <Text style={styles.emptySocialText}>Not connected</Text>
              )}
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  section: {
    margin: 16,
    marginBottom: 24,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginLeft: 8,
  },
  socialItemsContainer: {
    gap: 16,
  },
  socialItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  socialIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  instagramIcon: {
    backgroundColor: "#E1306C",
  },
  facebookIcon: {
    backgroundColor: "#4267B2",
  },
  socialTextContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    paddingHorizontal: 16,
    borderLeftWidth: 2,
    borderLeftColor: "#E5E7EB",
  },
  socialText: {
    fontSize: 16,
    color: "#4B5563",
  },
  emptySocialText: {
    fontSize: 16,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  socialInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  socialInputPrefix: {
    paddingLeft: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  socialInput: {
    flex: 1,
    fontSize: 16,
    padding: 12,
  },
  fullWidthInput: {
    flex: 1,
    fontSize: 16,
    padding: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
})

export default SocialMediaSection