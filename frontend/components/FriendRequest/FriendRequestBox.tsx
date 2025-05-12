"use client"

import React from "react"
import { View, Image, StyleSheet, TouchableOpacity, Animated } from "react-native"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import Tag from "@/components/Tag"
import { MaterialIcons } from "@expo/vector-icons"
import type { FriendRequestBoxProps } from "./types"

const FriendRequestBox: React.FC<FriendRequestBoxProps> = ({ request, onAccept, onDecline, index = 0 }) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 400,
      delay: index * 100,
      useNativeDriver: true,
    }).start()
  }, [])

  return (
    <Animated.View
      style={{
        opacity: animatedValue,
        transform: [
          {
            translateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          },
        ],
      }}
    >
      <ThemedView style={styles.container}>
        <View style={styles.leftAccent} />
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <Image
                source={{ uri: request.avatarUrl || "https://placehold.co/100x100/EEF6FF/3A63ED?text=👤" }}
                style={styles.avatar}
              />
              <View style={styles.textContainer}>
                <ThemedText style={styles.name}>{request.name}</ThemedText>
                <ThemedText style={styles.description}>{request.bio}</ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.tagsContainer}>
            {request.tags.map((tag, index) => (
              <Tag
                key={`${request.id}-${index}`}
                label={tag}
                outlineColor="#3A63ED"
                textStyle={{ fontSize: 12, color: "#3A63ED" }}
              />
            ))}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.actionButton, styles.acceptButton]} onPress={onAccept} activeOpacity={0.8}>
              <MaterialIcons name="check" size={20} color="white" />
              <ThemedText style={styles.actionButtonText}>Accept</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.declineButton]}
              onPress={onDecline}
              activeOpacity={0.8}
            >
              <MaterialIcons name="close" size={20} color="#6B7280" />
              <ThemedText style={styles.declineButtonText}>Decline</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    flexDirection: "row",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leftAccent: {
    width: 6,
    backgroundColor: "#3A63ED",
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    color: "#6B7280",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#EEF6FF",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  acceptButton: {
    backgroundColor: "#3A63ED",
  },
  declineButton: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  actionButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  declineButtonText: {
    color: "#6B7280",
    fontWeight: "600",
    fontSize: 14,
  },
})

export default FriendRequestBox