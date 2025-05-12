"use client"

import React, { useState, useEffect, useRef } from "react"
import { View, Image, StyleSheet, TouchableOpacity, Linking, Alert, Animated, RefreshControl } from "react-native"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import { FontAwesome, MaterialIcons } from "@expo/vector-icons"
import Tag from "@/components/Tag"
import { useLocalSearchParams, useRouter } from "expo-router"
import api from "@/core/api"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import ProfileSkeletonLoader from "@/components/Profile/ProfileSkeletonLoader"

interface User {
  id: string
  name: string
  bio: string
  avatarUrl: string
  tags: string[]
  social: {
    instagram: string
    facebook: string
  }
}

export default function Profile() {
  const { userId } = useLocalSearchParams()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [unfriending, setUnfriending] = useState(false)
  const scrollY = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0)).current

  const fetchUserData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      setError(null)

      // Simulate a delay to show loading state (remove in production)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Fetch user basic info
      const userRes = await api.get(`/users/${userId}/`)
      const userData = userRes.data

      // Fetch user courses
      const coursesRes = await api.get(`/users/${userId}/courses/`)
      const tags = coursesRes.data.map((c: any) => c.course.subject)

      // Fetch social links
      const socialRes = await api.get(`/users/${userId}/social_links/`)
      const socialLinks = socialRes.data

      // Extract social media usernames
      const instagramLink = socialLinks.find((link: any) => link.platform.toLowerCase() === "instagram")
      const facebookLink = socialLinks.find((link: any) => link.platform.toLowerCase() === "facebook")

      setUser({
        id: userId as string,
        name: `${userData.first_name} ${userData.last_name}`.trim(),
        bio: userData.bio || "No bio available",
        avatarUrl: userData.profile_picture_url || "https://placehold.co/100x100/EEF6FF/3A63ED?text=👤",
        tags,
        social: {
          instagram: instagramLink?.name?.replace("@", "") || "",
          facebook: facebookLink?.name || "",
        },
      })

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start()
    } catch (err) {
      console.error("Error fetching user data:", err)
      setError("Failed to load profile data")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    fetchUserData(false)
  }, [userId])

  useEffect(() => {
    fetchUserData()
  }, [userId])

  const openSocialMedia = (platform: string, username: string) => {
    let url = ""
    if (platform === "instagram" && username) {
      url = `https://instagram.com/${username}`
    } else if (platform === "facebook" && username) {
      url = `https://facebook.com/${username}`
    }

    if (!url) {
      Alert.alert("No Account", `This user hasn't connected their ${platform} account`)
      return
    }

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url)
      } else {
        Alert.alert("Cannot Open Link", `Unable to open ${platform}. The app may not be installed.`)
      }
    })
  }

  const handleUnfriend = async () => {
    try {
      Alert.alert("Unfriend", `Are you sure you want to unfriend ${user?.name}?`, [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Unfriend",
          style: "destructive",
          onPress: async () => {
            try {
              setUnfriending(true)
              await api.post("/friendships/unfriend/", { friend_id: userId })
              router.back()
              Alert.alert("Success", `You are no longer friends with ${user?.name}`)
            } catch (error) {
              console.error("Unfriend error:", error)
              Alert.alert("Error", "Failed to unfriend. Please try again.")
            } finally {
              setUnfriending(false)
            }
          },
        },
      ])
    } catch (error) {
      console.error("Error showing alert:", error)
    }
  }

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100, 200],
    outputRange: [0, 0.5, 1],
    extrapolate: "clamp",
  })

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 60],
    extrapolate: "clamp",
  })

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#3A63ED" }} edges={["top"]}>
        <ThemedView style={styles.container}>
          {/* Animated Header */}
          <Animated.View
            style={[
              styles.animatedHeader,
              {
                opacity: headerOpacity,
                height: headerHeight,
              },
            ]}
          >
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <ThemedText style={styles.headerTitle}>{user?.name}</ThemedText>
            <View style={{ width: 40 }} />
          </Animated.View>

          {loading && !refreshing ? (
            <ProfileSkeletonLoader />
          ) : error ? (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={64} color="#3A63ED" />
              <ThemedText style={styles.errorText}>{error}</ThemedText>
              <TouchableOpacity style={styles.retryButton} onPress={() => fetchUserData()}>
                <ThemedText style={styles.retryButtonText}>Try Again</ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <Animated.ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
                useNativeDriver: false,
              })}
              scrollEventThrottle={16}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor="#3A63ED"
                  colors={["#3A63ED"]}
                />
              }
            >
              {user && (
                <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                  <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                      <Image
                        source={{ uri: user.avatarUrl }}
                        style={styles.avatar}
                        onError={() =>
                          setUser({ ...user, avatarUrl: "https://placehold.co/100x100/EEF6FF/3A63ED?text=👤" })
                        }
                      />
                    </View>
                    <View style={styles.nameContainer}>
                      <ThemedText style={styles.username}>{user.name}</ThemedText>
                      <ThemedText style={styles.bio}>{user.bio}</ThemedText>
                    </View>
                  </View>

                  <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Subjects</ThemedText>
                    <View style={styles.tagsContainer}>
                      {user.tags.length > 0 ? (
                        user.tags.map((tag, index) => (
                          <Tag
                            key={index}
                            label={tag}
                            outlineColor="#3A63ED"
                            textStyle={{ fontSize: 12, color: "#3A63ED" }}
                          />
                        ))
                      ) : (
                        <ThemedText style={styles.noDataText}>No subjects available</ThemedText>
                      )}
                    </View>
                  </View>

                  <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Social Media</ThemedText>
                    <View style={styles.socialContainer}>
                      <TouchableOpacity
                        style={[styles.socialButton, !user.social.instagram && styles.disabledSocialButton]}
                        onPress={() => openSocialMedia("instagram", user.social.instagram)}
                        disabled={!user.social.instagram}
                      >
                        <FontAwesome name="instagram" size={24} color={user.social.instagram ? "#E1306C" : "#9CA3AF"} />
                        <ThemedText style={styles.socialText}>
                          {user.social.instagram ? `@${user.social.instagram}` : "Not connected"}
                        </ThemedText>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.socialButton, !user.social.facebook && styles.disabledSocialButton]}
                        onPress={() => openSocialMedia("facebook", user.social.facebook)}
                        disabled={!user.social.facebook}
                      >
                        <FontAwesome name="facebook" size={24} color={user.social.facebook ? "#4267B2" : "#9CA3AF"} />
                        <ThemedText style={styles.socialText}>{user.social.facebook || "Not connected"}</ThemedText>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.actionContainer}>
                    <TouchableOpacity
                      style={[styles.unfriendButton, unfriending && styles.disabledButton]}
                      onPress={handleUnfriend}
                      disabled={unfriending}
                    >
                      {unfriending ? (
                        <View style={styles.loadingContainer}>
                          <MaterialIcons name="hourglass-top" size={20} color="white" />
                          <ThemedText style={styles.unfriendButtonText}>Processing...</ThemedText>
                        </View>
                      ) : (
                        <View style={styles.loadingContainer}>
                          <MaterialIcons name="person-remove" size={20} color="white" />
                          <ThemedText style={styles.unfriendButtonText}>Unfriend</ThemedText>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              )}
            </Animated.ScrollView>
          )}
        </ThemedView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  animatedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#3A63ED",
    zIndex: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: "#3A63ED",
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  nameContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
    color: "white",
  },
  bio: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  noDataText: {
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  socialContainer: {
    flexDirection: "column",
    gap: 12,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
    elevation: 2,
  },
  disabledSocialButton: {
    backgroundColor: "#F3F4F6",
  },
  socialText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#4B5563",
  },
  actionContainer: {
    padding: 16,
    marginTop: 32,
  },
  unfriendButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.7,
  },
  unfriendButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#3A63ED",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "600",
  },
})