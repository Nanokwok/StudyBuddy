"use client"

import { useState, useEffect } from "react"
import {
  View,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native"
import { useRouter, Stack } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons"
import api from "@/core/api"
import { useAuth } from "@/context/AuthContext"
import type { UserData } from "@/types"
import ProfileHeader from "@/components/ProfileEdit/ProfileHeader"
import CoursesSection from "@/components/ProfileEdit/CoursesSection"
import FriendsSection from "@/components/ProfileEdit/FriendsSection"
import SocialMediaSection from "@/components/ProfileEdit/SocialMediaSection"
import ActionButtons from "@/components/ProfileEdit/ActionButtons"
import LogoutButton from "@/components/ProfileEdit/LogoutButton"
import ProfileSkeletonLoader from "@/components/ProfileEdit/ProfileSkeletonLoader"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"

export default function ProfileEditScreen() {
  const router = useRouter()
  const { logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // User data state
  const [userData, setUserData] = useState<UserData>({
    id: "",
    firstName: "",
    lastName: "",
    bio: "",
    social: {
      instagram: "",
      facebook: "",
    },
    courses: [],
    email: "",
    username: "",
    profilePictureUrl: "",
    friendships: {
      count: 0,
    },
  })

  const [editData, setEditData] = useState<UserData>({ ...userData })

  const handleLogout = async () => {
    try {
      await logout()
      router.replace("/(auth)/login")
    } catch (error) {
      console.error("Logout error:", error)
      Alert.alert("Error", "Failed to logout")
    }
  }

  const fetchUserData = async () => {
    try {
      setIsLoading(true)
      const userResponse = await api.get("users/me/")
      const user = userResponse.data
      const enrollmentsResponse = await api.get("enrollments/")
      const socialResponse = await api.get("social-links/")
      const friendshipResponse = await api.get(`users/${user.id}/friendship_count/`)
      const friendshipCount = friendshipResponse.data.friendship_count

      const courses = enrollmentsResponse.data.map((enrollment: any) => ({
        code: enrollment.course?.course_code || "",
        title: enrollment.course?.title || "",
      }))

      const socialLinks = Array.isArray(socialResponse.data) ? socialResponse.data : []
      const instagramLink = socialLinks.find((link) => link?.platform?.toLowerCase() === "instagram")
      const facebookLink = socialLinks.find((link) => link?.platform?.toLowerCase() === "facebook")

      const newUserData = {
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        bio: user.bio || "",
        social: {
          instagram: (instagramLink?.name || "").replace("@", ""),
          facebook: facebookLink?.name || "",
        },
        courses: courses,
        email: user.email || "",
        username: user.username || "",
        id: user.id,
        friendships: {
          count: friendshipCount,
        },
        profilePictureUrl: user.profile_picture_url || "",
      }

      setUserData(newUserData)
      setEditData(newUserData)
    } catch (error) {
      Alert.alert("Error", "Failed to load profile data")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  const updateUserProfile = async () => {
    try {
      const response = await api.patch("users/me/", {
        first_name: editData.firstName,
        last_name: editData.lastName,
        bio: editData.bio,
      })
      return response.data
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
    }
  }

  const updateSocialLinks = async () => {
    try {
      const currentLinks = await api.get("social-links/")
      const instagramLink = currentLinks.data.find((link: any) => link.platform.toLowerCase() === "instagram")
      if (instagramLink) {
        if (editData.social.instagram) {
          await api.patch(`social-links/${instagramLink.link_id}/`, {
            name: `@${editData.social.instagram}`,
          })
        } else {
          await api.delete(`social-links/${instagramLink.link_id}/`)
        }
      } else if (editData.social.instagram) {
        await api.post("social-links/", {
          platform: "Instagram",
          name: `@${editData.social.instagram}`,
        })
      }
      const facebookLink = currentLinks.data.find((link: any) => link.platform.toLowerCase() === "facebook")
      if (facebookLink) {
        if (editData.social.facebook) {
          await api.patch(`social-links/${facebookLink.link_id}/`, {
            name: editData.social.facebook,
          })
        } else {
          await api.delete(`social-links/${facebookLink.link_id}/`)
        }
      } else if (editData.social.facebook) {
        await api.post("social-links/", {
          platform: "Facebook",
          name: editData.social.facebook,
        })
      }
    } catch (error) {
      console.error("Error updating social links:", error)
      throw error
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await updateUserProfile()
      await updateSocialLinks()
      await fetchUserData()
      setIsEditing(false)
      Alert.alert("Success", "Profile updated successfully!")
    } catch (error) {
      Alert.alert("Error", "Failed to update profile")
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditData({ ...userData })
    setIsEditing(false)
  }

  const handleEditChange = (field: string, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSocialChange = (platform: "instagram" | "facebook", value: string) => {
    setEditData((prev) => ({
      ...prev,
      social: {
        ...prev.social,
        [platform]: platform === "instagram" ? value.replace("@", "") : value,
      },
    }))
  }

  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#3A63ED" barStyle="light-content" />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#3A63ED" }} edges={["top"]}>
        <Stack.Screen
          options={{
            headerTitle: "My Profile",
            headerTitleStyle: {
              fontWeight: "bold",
              color: "white",
            },
            headerStyle: {
              backgroundColor: "#3A63ED",
            },
            headerTintColor: "white",
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
                <MaterialIcons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            ),
            headerRight: () =>
              !isEditing && (
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={() =>
                    Alert.alert("Logout", "Are you sure you want to logout?", [
                      { text: "Cancel", style: "cancel" },
                      { text: "Logout", onPress: handleLogout, style: "destructive" },
                    ])
                  }
                >
                  <MaterialIcons name="logout" size={24} color="white" />
                </TouchableOpacity>
              ),
          }}
        />

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
          <View style={styles.container}>
            {isLoading ? (
              <ProfileSkeletonLoader />
            ) : (
              <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <ProfileHeader
                  userData={userData}
                  editData={editData}
                  isEditing={isEditing}
                  onEditChange={handleEditChange}
                />
                <CoursesSection courses={userData.courses} />
                <FriendsSection
                  friendCount={userData.friendships.count}
                  onViewFriends={() => router.push("/friends")}
                />
                <SocialMediaSection
                  socialData={userData.social}
                  editSocialData={editData.social}
                  isEditing={isEditing}
                  onSocialChange={handleSocialChange}
                />
                <ActionButtons
                  isEditing={isEditing}
                  isSaving={isSaving}
                  onEdit={() => setIsEditing(true)}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />

                {!isEditing && (
                  <>
                    <View style={styles.divider} />
                    <LogoutButton onLogout={handleLogout} />
                  </>
                )}
              </ScrollView>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
  },
  scrollContainer: {
    paddingBottom: 32,
  },
  headerButton: {
    padding: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
    marginHorizontal: 20,
  },  
})