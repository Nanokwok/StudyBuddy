"use client"

import type React from "react"
import { useRef } from "react"
import { StatusBar, StyleSheet, Animated } from "react-native"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import FriendRequestList from "./FriendRequestList"
import FriendRequestSkeletonLoader from "./FriendRequestSkeletonLoader"
import type { FriendRequestsScreenProps } from "./types"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"

const FriendRequestsScreen: React.FC<FriendRequestsScreenProps> = ({
  requests,
  onAccept,
  onDecline,
  loading,
  refreshing,
  onRefresh,
}) => {
  const scrollY = useRef(new Animated.Value(0)).current

  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#3A63ED" barStyle="light-content" />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#3A63ED" }} edges={["top"]}>
        <ThemedView style={styles.container}>
          {/* Header */}
          <Animated.View style={[styles.header]}>
            <ThemedText style={styles.greeting}>Friend Requests</ThemedText>
            <ThemedText style={styles.welcomeText}>Manage your connection requests</ThemedText>
          </Animated.View>

          {loading && !refreshing ? (
            <FriendRequestSkeletonLoader />
          ) : (
            <FriendRequestList
              requests={requests}
              onAccept={onAccept}
              onDecline={onDecline}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
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
    paddingBottom: 50,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: "#3A63ED",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
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
})

export default FriendRequestsScreen