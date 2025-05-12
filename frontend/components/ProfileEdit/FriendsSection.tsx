"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"

interface FriendsSectionProps {
  friendCount: number
  onViewFriends: () => void
}

const FriendsSection: React.FC<FriendsSectionProps> = ({ friendCount, onViewFriends }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.95)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay: 200,
      useNativeDriver: true,
    }).start()

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start()
  }, [])

  return (
    <Animated.View
      style={[
        styles.section,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="people" size={20} color="#3A63ED" />
          <Text style={styles.sectionTitle}>Friends</Text>
        </View>
      </View>

      <View style={styles.friendsContent}>
        <View style={styles.friendCountContainer}>
          <View style={styles.friendCountCircle}>
            <Text style={styles.friendCountNumber}>{friendCount}</Text>
          </View>
          <Text style={styles.friendCountLabel}>Friends</Text>
        </View>

        <TouchableOpacity style={styles.viewFriendsButton} onPress={onViewFriends} activeOpacity={0.8}>
          <View style={styles.buttonContent}>
            <Text style={styles.viewFriendsButtonText}>View All Friends</Text>
            <MaterialIcons name="arrow-forward" size={16} color="#3A63ED" />
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}

// Update the styles object with improved styling
const styles = StyleSheet.create({
  section: {
    margin: 16,
    marginBottom: 24,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginLeft: 8,
  },
  friendsContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  friendCountContainer: {
    alignItems: "center",
  },
  friendCountCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#3A63ED",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 3,
    borderColor: "rgba(58, 99, 237, 0.2)",
  },
  friendCountNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  friendCountLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  viewFriendsButton: {
    backgroundColor: "#EEF6FF",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(58, 99, 237, 0.1)",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  viewFriendsButtonText: {
    color: "#3A63ED",
    fontWeight: "600",
    marginRight: 4,
  },
})

export default FriendsSection