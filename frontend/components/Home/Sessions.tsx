"use client"

import type React from "react"
import { useRef } from "react"
import { useWindowDimensions, RefreshControl, Animated, StyleSheet, View } from "react-native"
import { ThemedView } from "@/components/ThemedView"
import { SectionHeader } from "./SectionHeader"
import { SessionList } from "./SessionList"
import { EmptyState } from "./EmptyState"
import { SessionSkeletonLoader } from "./SkeletonLoader"
import type { SessionsProps } from "./types"
import { styles } from "./styles"
import { ThemedText } from "@/components/ThemedText"
import { MaterialIcons } from "@expo/vector-icons"
import { router } from "expo-router"

export const Sessions: React.FC<SessionsProps> = ({
  sessions = [],
  loading,
  refreshing = false,
  onRefresh,
}) => {
  const { width } = useWindowDimensions()
  const scrollY = useRef(new Animated.Value(0)).current
  const hasSessions = sessions.length > 0

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* Header moved out of ScrollView */}
      <Animated.View style={[customStyles.header]}>
        <ThemedText style={customStyles.greeting}>Hello student!</ThemedText>
        <ThemedText style={customStyles.welcomeText}>Welcome back to your learning journey</ThemedText>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3A63ED" colors={["#3A63ED"]} />
        }
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={16}
      >
        <ThemedView style={[customStyles.container, { width }]}>
          {/* Sessions Section */}
          <ThemedView style={customStyles.section}>
            <SectionHeader title="Upcoming Sessions" subtitle="Plan your study times" />
            {loading && !refreshing ? (
              <SessionSkeletonLoader />
            ) : hasSessions ? (
              <SessionList sessions={sessions} />
            ) : (
              <EmptyState
                title="No Upcoming Sessions"
                message="You don't have any scheduled sessions yet. Join a class to get started."
                icon="event-note"
                action={{
                  label: "Browse Classes",
                  onPress: () => router.push("/(tabs)/profileEdit")
                }}
              />
            )}
          </ThemedView>

          {/* Friends Section */}
          <ThemedView style={customStyles.section}>
            <SectionHeader title="Study Buddies" subtitle="Connect with classmates" />
            <EmptyState
              title="Find Study Partners"
              message="Connect with classmates to study together and share notes."
              icon="people"
              action={{
                label: "Find Friends",
                onPress: () => router.push("/(tabs)/friends")
              }}
            />
          </ThemedView>
        </ThemedView>
      </Animated.ScrollView>
    </View>
  )
}

const customStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 50,
    backgroundColor: "#F9FAFB",
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
  section: {
    width: "100%",
    marginBottom: 24,
    backgroundColor: "transparent",
  },
})