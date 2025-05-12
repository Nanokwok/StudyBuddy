import React from "react"
import { View, StyleSheet, Animated, Easing } from "react-native"
import { ThemedView } from "@/components/ThemedView"
import { useEffect, useRef } from "react"

interface SkeletonProps {
  width?: number | string
  height?: number | string
  borderRadius?: number
  style?: any
}

const Skeleton: React.FC<SkeletonProps> = ({ width = "100%", height = 20, borderRadius = 4, style }) => {
  const animatedValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: false,
      }),
    ).start()
  }, [])

  const interpolatedColor = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["#E5E7EB", "#F3F4F6", "#E5E7EB"],
  })

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          backgroundColor: interpolatedColor,
        },
        style,
      ]}
    />
  )
}

export const FriendSkeletonLoader = () => {
  return (
    <View style={styles.container}>
      {[1, 2, 3].map((_, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.leftAccent} />
          <View style={styles.contentContainer}>
            <View style={styles.header}>
              <View style={styles.userInfo}>
                <Skeleton width={48} height={48} borderRadius={24} />
                <View style={styles.textContainer}>
                  <Skeleton width="70%" height={18} style={styles.nameSkeletion} />
                  <Skeleton width="90%" height={14} />
                </View>
              </View>
              <Skeleton width={40} height={40} borderRadius={10} />
            </View>
            <View style={styles.tagsContainer}>
              <Skeleton width={80} height={24} borderRadius={12} style={styles.tag} />
              <Skeleton width={100} height={24} borderRadius={12} style={styles.tag} />
              <Skeleton width={70} height={24} borderRadius={12} style={styles.tag} />
            </View>
          </View>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  card: {
    borderRadius: 12,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
    flexDirection: "row",
    overflow: "hidden",
    marginBottom: 16,
  },
  leftAccent: {
    width: 6,
    backgroundColor: "#E5E7EB",
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
    gap: 8,
  },
  nameSkeletion: {
    marginBottom: 4,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    marginRight: 8,
  },
  skeleton: {
    backgroundColor: "#E5E7EB",
  },
})

export default FriendSkeletonLoader