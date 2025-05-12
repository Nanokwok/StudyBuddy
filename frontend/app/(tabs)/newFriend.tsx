"use client"

import React, { useEffect, useState, useRef } from "react"
import { StyleSheet, StatusBar, Animated, RefreshControl } from "react-native"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import SearchBarWithSubjects from "@/components/SearchBarWithSubjects"
import AddFriendBox from "@/components/AddFriends/AddFriendBox"
import AddFriendSkeletonLoader from "@/components/AddFriends/AddFriendSkeletonLoader"
import EmptyAddFriendsState from "@/components/AddFriends/EmptyAddFriendsState"
import api from "@/core/api"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"

type AddableUser = {
  id: string
  name: string
  bio: string | null
  avatarUrl: string
  tags: string[]
}

const AddFriendsPage = () => {
  const [searchText, setSearchText] = useState("")
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [users, setUsers] = useState<AddableUser[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState("")
  const scrollY = useRef(new Animated.Value(0)).current

  const fetchAddableUsers = async (showLoading = true) => {
    if (showLoading) setLoading(true)
    try {
      const response = await api.get("friendships/addable-users/")
      const safeUsers = response.data.map((user: any) => ({
        id: user.id || "",
        name: user.name || "Unknown User",
        bio: user.bio || "No major info",
        avatarUrl: user.profile_picture_url || "https://placehold.co/100x100/EEF6FF/3A63ED?text=👤",
        tags: Array.isArray(user.tags) ? user.tags : [],
      }))
      setUsers(safeUsers)
      setError("")
    } catch (err) {
      console.error("Failed to fetch addable users", err)
      setError("Failed to load users")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    fetchAddableUsers(false)
  }, [])

  useEffect(() => {
    fetchAddableUsers()
  }, [])

  const handleAddFriend = async (id: string) => {
    try {
      await api.post(`friendships/request_friendship/`, { addressee_id: id });
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Failed to send request", err);
    }
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

  const filteredUsers = users.filter((user) => {
    const name = user.name || ""
    const bio = user.bio || ""
    const tags = user.tags || []

    const matchText =
      name.toLowerCase().includes(searchText.toLowerCase()) || bio.toLowerCase().includes(searchText.toLowerCase())

    const matchTag = !selectedSubject || tags.includes(selectedSubject)

    return matchText && matchTag
  })

  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#3A63ED" barStyle="light-content" />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#3A63ED" }} edges={["top"]}>
        <ThemedView style={styles.container}>
          {/* Header */}
          <Animated.View style={[styles.header]}>
            <ThemedText style={styles.greeting}>Find New Friends</ThemedText>
            <ThemedText style={styles.welcomeText}>Connect with classmates</ThemedText>
          </Animated.View>

          {/* Search Bar */}
          <SearchBarWithSubjects
            searchText={searchText}
            onSearchChange={handleSearchChange}
            onSubjectPress={handleSubjectSelect}
            selectedSubject={selectedSubject}
          />

          {/* Users List */}
          <Animated.ScrollView
            style={styles.usersList}
            contentContainerStyle={styles.usersListContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3A63ED" colors={["#3A63ED"]} />
            }
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
              useNativeDriver: false,
            })}
            scrollEventThrottle={16}
          >
            {loading && !refreshing ? (
              <AddFriendSkeletonLoader />
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <AddFriendBox
                  key={user.id}
                  request={{
                    ...user,
                    bio: user.bio || "",
                  }}
                  onAdd={() => handleAddFriend(user.id)}
                  index={index}
                />
              ))
            ) : (
              <EmptyAddFriendsState
                title={error ? "Couldn't Load Users" : "No Users Found"}
                message={
                  error
                    ? "There was a problem loading users. Pull down to try again."
                    : searchText
                      ? "Try adjusting your search or filters"
                      : "We couldn't find any users to add as friends."
                }
                icon={error ? "error-outline" : "search-off"}
                action={
                  error
                    ? {
                        label: "Try Again",
                        onPress: () => fetchAddableUsers(),
                      }
                    : undefined
                }
              />
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
  usersList: {
    flex: 1,
  },
  usersListContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
})

export default AddFriendsPage