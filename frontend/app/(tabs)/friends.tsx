"use client"

import React, { useEffect, useState, useRef } from "react"
import { StyleSheet, StatusBar, Animated, RefreshControl, View } from "react-native"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import SearchBarWithSubjects from "@/components/SearchBarWithSubjects"
import FriendBox from "@/components/Friends/FriendBox"
import FriendSkeletonLoader from "@/components/Friends/FriendSkeletonLoader"
import EmptyFriendsState from "@/components/Friends/EmptyFriendsState"
import api from "@/core/api"
import { useLocalSearchParams, useRouter } from "expo-router"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"

interface Friend {
  id: string
  name: string
  bio: string
  avatarUrl: string
  tags: string[]
}

const FriendsPage = () => {
  const router = useRouter()
  const [searchText, setSearchText] = useState("")
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [friends, setFriends] = useState<Friend[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { refresh } = useLocalSearchParams()
  const scrollY = useRef(new Animated.Value(0)).current

  const fetchFriends = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)

      const meRes = await api.get("/users/me/")
      const myId = meRes.data.id

      const friendshipsRes = await api.get(`/users/${myId}/friendships/`)
      const sent = friendshipsRes.data.sent_requests || []
      const received = friendshipsRes.data.received_requests || []

      const acceptedFriends = [...sent, ...received]
        .filter((f) => f.status === "accepted")
        .map((f) => (f.requester.id === myId ? f.addressee : f.requester))

      const friendsWithCourses = await Promise.all(
        acceptedFriends.map(async (friend) => {
          try {
            const enrollRes = await api.get(`/users/${friend.id}/courses/`)
            const tags = enrollRes.data.map((c: any) => c.course.subject)

            return {
              id: friend.id,
              name: `${friend.first_name} ${friend.last_name}`.trim(),
              bio: friend.bio || "No bio available",
              avatarUrl: friend.profile_picture_url || "https://placehold.co/100x100/EEF6FF/3A63ED?text=👤",
              tags,
            }
          } catch (err) {
            console.error(`Error fetching courses for friend ${friend.id}:`, err)
            return null
          }
        }),
      )

      setFriends(friendsWithCourses.filter(Boolean) as Friend[])
    } catch (err) {
      console.error("Error fetching friends", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    fetchFriends(false)
  }, [])

  useEffect(() => {
    fetchFriends()
  }, [refresh])

  const handleViewProfile = (friendId: string) => {
    router.push({
      pathname: "/profile/[userId]",
      params: { userId: friendId },
    })
  }

  const handleSearchChange = (text: string) => {
    setSearchText(text)
    if (selectedSubject && !text.includes(selectedSubject)) {
      setSelectedSubject(null)
    }
  }

  const handleSubjectSelect = (subject: string) => {
    const newSubject = selectedSubject === subject ? null : subject
    setSelectedSubject(newSubject)
    setSearchText(newSubject || "")
  }

  const filteredFriends = friends.filter((friend) => {
    const matchesSearch =
      friend.name.toLowerCase().includes(searchText.toLowerCase()) ||
      friend.bio.toLowerCase().includes(searchText.toLowerCase())

    const matchesSubject = !selectedSubject || friend.tags.includes(selectedSubject)
    return matchesSearch && matchesSubject
  })

  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#3A63ED" barStyle="light-content" />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#3A63ED" }} edges={["top"]}>
        <ThemedView style={styles.container}>
          {/* Header */}
          <Animated.View style={[styles.header]}>
            <ThemedText style={styles.greeting}>Your Friends</ThemedText>
            <ThemedText style={styles.welcomeText}>Connect with classmates</ThemedText>
          </Animated.View>

          {/* Search Bar */}
          <SearchBarWithSubjects
            searchText={searchText}
            onSearchChange={handleSearchChange}
            onSubjectPress={handleSubjectSelect}
            selectedSubject={selectedSubject}
          />

          {/* Friends List */}
          <Animated.ScrollView
            style={styles.friendsList}
            contentContainerStyle={styles.friendsListContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3A63ED" colors={["#3A63ED"]} />
            }
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
              useNativeDriver: false,
            })}
            scrollEventThrottle={16}
          >
            {loading && !refreshing ? (
              <FriendSkeletonLoader />
            ) : filteredFriends.length > 0 ? (
              filteredFriends.map((friend, index) => (
                <FriendBox key={friend.id} friend={friend} onViewProfile={handleViewProfile} index={index} />
              ))
            ) : (
              <EmptyFriendsState
                title="No Friends Found"
                message={
                  searchText
                    ? "Try adjusting your search or filters"
                    : "Connect with classmates to study together and share notes."
                }
                icon="people"
                action={{
                  label: "Find Friends",
                  onPress: () => router.push("/(tabs)/newFriend"),
                }}
              />
            )}

            {/* Suggestions Section */}
            {!loading && filteredFriends.length > 0 && (
              <View style={styles.suggestionsSection}>
                <ThemedText style={styles.sectionTitle}>Get more friends!</ThemedText>
                <ThemedText style={styles.sectionSubtitle}>See friends who share your interests</ThemedText>

                <EmptyFriendsState
                  title="Expand Your Network"
                  message="Connect with classmates to study together."
                  icon="group-add"
                  action={{
                    label: "Browse Suggestions",
                    onPress: () => router.push("/(tabs)/newFriend")
                  }}
                />
              </View>
            )}
          </Animated.ScrollView>
        </ThemedView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingBottom: 50,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: "#3A63ED",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
  friendsList: {
    flex: 1,
  },
  friendsListContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  suggestionsSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
  },
})

export default FriendsPage