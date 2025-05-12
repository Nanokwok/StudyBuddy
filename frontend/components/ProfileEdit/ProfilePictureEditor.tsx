"use client"

import React, { useState } from "react"
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ActivityIndicator, 
  Platform, 
  Alert 
} from "react-native"
import * as ImagePicker from "expo-image-picker"
import { MaterialIcons } from "@expo/vector-icons"
import api from "@/core/api"

interface ProfilePictureEditorProps {
  currentImageUrl: string | null
  onImageUpdated: (url: string) => void
  isEditing: boolean
  username: string
}

const ProfilePictureEditor: React.FC<ProfilePictureEditorProps> = ({
  currentImageUrl,
  onImageUpdated,
  isEditing,
  username,
}) => {
  const [uploading, setUploading] = useState(false)

  const getInitials = () => {
    if (!username) return "U"
    return username.charAt(0).toUpperCase()
  }

  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Sorry, we need camera roll permissions to upload images."
        )
        return false
      }
    }
    return true
  }

  const pickImage = async () => {
    const hasPermission = await requestPermissions()
    if (!hasPermission) return

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await uploadImage(result.assets[0].uri)
      }
    } catch (error) {
      console.error("Error picking image:", error)
      Alert.alert("Error", "Failed to pick image")
    }
  }

  const uploadImage = async (uri: string) => {
    setUploading(true)

    try {
      // Create a FormData object
      const formData = new FormData()
      
      // Determine file name and type
      const uriParts = uri.split(".")
      const fileType = uriParts[uriParts.length - 1]
      
      // @ts-ignore - FormData expects a specific type but React Native's implementation works
      formData.append("profile_picture", {
        uri,
        name: `profile-photo.${fileType}`,
        type: `image/${fileType}`,
      })

      // Upload to the server
      const response = await api.post("users/me/upload_profile_picture/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      // Check if the response has the profile picture URL
      if (response.data && response.data.profile_picture_url) {
        onImageUpdated(response.data.profile_picture_url)
        Alert.alert("Success", "Profile picture updated successfully!")
      } else {
        throw new Error("Invalid response from server")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      Alert.alert("Error", "Failed to upload profile picture")
    } finally {
      setUploading(false)
    }
  }

  return (
    <View style={styles.container}>
      {currentImageUrl ? (
        <Image source={{ uri: currentImageUrl }} style={styles.profileImage} resizeMode="cover" />
      ) : (
        <View style={styles.profileImagePlaceholder}>
          <Text style={styles.profileImagePlaceholderText}>{getInitials()}</Text>
        </View>
      )}

      {isEditing && (
        <View style={styles.editOverlay}>
          {uploading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <TouchableOpacity style={styles.editButton} onPress={pickImage}>
              <MaterialIcons name="photo-camera" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: "relative",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2A53DD",
  },
  profileImagePlaceholderText: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
  },
  editOverlay: {
    position: "absolute",
    bottom: -6,
    right: -6,
    backgroundColor: "#3A63ED",
    borderRadius: 20,
    padding: 6,
    borderWidth: 2, 
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  editButton: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default ProfilePictureEditor