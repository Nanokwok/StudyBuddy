"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { View, Text, TextInput, StyleSheet, Animated } from "react-native"
import type { UserData } from "@/types"
import { MaterialIcons } from "@expo/vector-icons"
import ProfilePictureEditor from "./ProfilePictureEditor"

interface ProfileHeaderProps {
  userData: UserData
  editData: UserData
  isEditing: boolean
  onEditChange: (field: string, value: string) => void
  onProfilePictureUpdate: (url: string) => void
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  userData, 
  editData, 
  isEditing, 
  onEditChange,
  onProfilePictureUpdate
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.95)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
        <ProfilePictureEditor
          currentImageUrl={userData.profilePictureUrl ?? null}
          onImageUpdated={onProfilePictureUpdate}
          isEditing={isEditing}
          username={userData.username}
        />
        </View>

        <View style={styles.nameContainer}>
          {isEditing ? (
            <View style={styles.editNameContainer}>
              <TextInput
                style={styles.nameInput}
                value={editData.firstName}
                onChangeText={(text) => onEditChange("firstName", text)}
                placeholder="First Name"
                placeholderTextColor="#9CA3AF"
              />
              <TextInput
                style={styles.nameInput}
                value={editData.lastName}
                onChangeText={(text) => onEditChange("lastName", text)}
                placeholder="Last Name"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          ) : (
            <Text style={styles.nameText}>
              {userData.firstName || userData.lastName
                ? `${userData.firstName} ${userData.lastName}`.trim()
                : userData.username}
            </Text>
          )}

          {!isEditing && userData.email && <Text style={styles.emailText}>{userData.email}</Text>}
        </View>
      </View>

      <View style={styles.bioContainer}>
        <View style={styles.bioHeader}>
          <MaterialIcons name="description" size={18} color="#6B7280" />
          <Text style={styles.bioLabel}>Bio</Text>
        </View>
        {isEditing ? (
          <View style={styles.bioInputContainer}>
            <TextInput
              style={styles.bioInput}
              value={editData.bio}
              onChangeText={(text) => onEditChange("bio", text)}
              placeholder="Write a short bio about yourself or your major..."
              placeholderTextColor="#9CA3AF"
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
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
    backgroundColor: "#3A63ED",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingTop: 16,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
  },
  profileImageContainer: {
    marginRight: 16,
  },
  nameContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  editNameContainer: {
    gap: 8,
  },
  nameInput: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    color: "#111827",
  },
  bioContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#F9FAFB",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 0,
  },
  bioHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  bioLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4B5563",
    marginLeft: 8,
  },
  bioInputContainer: {
    backgroundColor: "white",
    borderRadius: 12,
  },
  bioInput: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    minHeight: 80,
    textAlignVertical: "top",
    backgroundColor: "white",
  },
  bioTextContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    minHeight: 60,
  },
  bioText: {
    fontSize: 16,
    color: "#4B5563",
    lineHeight: 22,
  },
  emptyBioText: {
    fontSize: 16,
    color: "#9CA3AF",
    fontStyle: "italic",
    textAlign: "center",
  },
})

export default ProfileHeader