"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { View, StyleSheet, Animated } from "react-native"

interface SkeletonProps {
  width?: number | string
  height?: number | string
  borderRadius?: number
  style?: any
  color?: string
}

const opacity = new Animated.Value(0);

const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = 20,
  borderRadius = 4,
  style,
  color = "#E5E7EB",
}) => {
  const [isHighlighted, setIsHighlighted] = useState(false)

  useEffect(() => {
    let mounted = true
    let intervalId: NodeJS.Timeout

    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    return () => {
      mounted = false
    }
  }, [])

  const backgroundColor = isHighlighted ? (color === "#E5E7EB" ? "#F3F4F6" : "rgba(255, 255, 255, 0.3)") : color

  return (
    <View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          backgroundColor,
          // Add a transition effect with opacity
          opacity: isHighlighted ? 0.7 : 1,
        },
        style,
      ]}
    />
  )
}

const ProfileSkeletonLoader: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerBackground}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Skeleton width={100} height={100} borderRadius={50} color="rgba(255, 255, 255, 0.2)" />
          </View>
          <View style={styles.nameContainer}>
            <Skeleton width={180} height={24} style={styles.nameSkeleton} color="rgba(255, 255, 255, 0.2)" />
            <Skeleton width={150} height={16} style={styles.emailSkeleton} color="rgba(255, 255, 255, 0.2)" />
          </View>
        </View>

        <View style={styles.bioContainer}>
          <Skeleton width={120} height={20} style={styles.bioTitle} />
          <Skeleton width="100%" height={80} borderRadius={12} style={styles.bioContent} />
        </View>
      </View>

      <View style={styles.section}>
        <Skeleton width={120} height={20} style={styles.sectionTitle} />
        <View style={styles.courseContainer}>
          <Skeleton width="100%" height={50} borderRadius={12} style={styles.courseItem} />
          <Skeleton width="100%" height={50} borderRadius={12} style={styles.courseItem} />
        </View>
      </View>

      <View style={styles.section}>
        <Skeleton width={100} height={20} style={styles.sectionTitle} />
        <View style={styles.friendsContainer}>
          <Skeleton width={70} height={70} borderRadius={35} style={styles.friendCount} color="#E5E7EB" />
          <Skeleton width={150} height={40} borderRadius={20} style={styles.friendsButton} />
        </View>
      </View>

      <View style={styles.section}>
        <Skeleton width={140} height={20} style={styles.sectionTitle} />
        <View style={styles.socialContainer}>
          <Skeleton width="100%" height={50} borderRadius={12} style={styles.socialItem} />
          <Skeleton width="100%" height={50} borderRadius={12} style={styles.socialItem} />
        </View>
      </View>

      <View style={styles.actionContainer}>
        <Skeleton width={200} height={50} borderRadius={25} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBackground: {
    backgroundColor: "#3A63ED",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingTop: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  avatarContainer: {
    marginRight: 16,
  },
  nameContainer: {
    flex: 1,
  },
  nameSkeleton: {
    marginBottom: 8,
  },
  emailSkeleton: {
    marginBottom: 4,
  },
  bioContainer: {
    backgroundColor: "#F9FAFB",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    paddingTop: 20,
  },
  bioTitle: {
    marginBottom: 12,
  },
  bioContent: {
    backgroundColor: "white",
  },
  section: {
    margin: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  courseContainer: {
    gap: 12,
  },
  courseItem: {
    marginBottom: 8,
  },
  friendsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  friendCount: {
    marginRight: 16,
  },
  friendsButton: {},
  socialContainer: {
    gap: 12,
  },
  socialItem: {
    marginBottom: 8,
  },
  actionContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  skeleton: {
    backgroundColor: "#E5E7EB",
    opacity: opacity,
  },
})

export default ProfileSkeletonLoader