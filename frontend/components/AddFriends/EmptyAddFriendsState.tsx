"use client"

import type React from "react"
import { StyleSheet, Animated, TouchableOpacity } from "react-native"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { MaterialIcons } from "@expo/vector-icons"
import { useEffect, useRef } from "react"

interface EmptyAddFriendsStateProps {
  title?: string
  message?: string
  icon?: string
  action?: {
    label: string
    onPress: () => void
  }
}

export const EmptyAddFriendsState: React.FC<EmptyAddFriendsStateProps> = ({
  title = "No Users Found",
  message = "We couldn't find any users matching your search criteria.",
  action,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.9)).current

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
      <ThemedView style={styles.iconContainer}>
        <MaterialIcons name={"search-off"} size={48} color="#3A63ED" />
      </ThemedView>
      <ThemedText type="title" style={styles.title}>
        {title}
      </ThemedText>
      <ThemedText type="default" style={styles.message}>
        {message}
      </ThemedText>
      {action && (
        <TouchableOpacity style={styles.actionButton} onPress={action.onPress} activeOpacity={0.8}>
          <ThemedText style={styles.actionText}>{action.label}</ThemedText>
        </TouchableOpacity>
      )}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    height: 250,
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "white",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EEF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#3A63ED",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  message: {
    marginTop: 8,
    textAlign: "center",
    color: "#6B7280",
    maxWidth: "90%",
    lineHeight: 22,
  },
  actionButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#3A63ED",
    borderRadius: 8,
  },
  actionText: {
    color: "white",
    fontWeight: "600",
  },
})

export default EmptyAddFriendsState