"use client"

import React from "react"
import { View, Image, StyleSheet, TouchableOpacity, Animated } from "react-native"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import { MaterialIcons } from "@expo/vector-icons"
import Tag from "@/components/Tag"

interface FriendRequest {
  id: string
  name: string
  bio: string
  avatarUrl: string
  tags: string[]
}

interface AddFriendBoxProps {
  request: FriendRequest
  onAdd: () => void
  index?: number
}

const AddFriendBox: React.FC<AddFriendBoxProps> = ({ request, onAdd, index = 0 }) => {
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

            <TouchableOpacity style={styles.addButton} onPress={onAdd} activeOpacity={0.7}>
              <MaterialIcons name="person-add" size={16} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.tagsContainer}>
            {request.tags.map((tag, index) => (
              <Tag
                key={index}
                label={tag}
                outlineColor="#3A63ED"
                textStyle={{ fontSize: 12, color: "#3A63ED" }}
              />
            ))}
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
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: "#3A63ED",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
})

export default AddFriendBox