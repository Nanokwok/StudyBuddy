"use client"

import type React from "react"
import { View, StyleSheet, Animated, Easing } from "react-native"
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

const ProfileSkeletonLoader: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Skeleton width={120} height={120} borderRadius={60} />
        </View>
        <View style={styles.nameContainer}>
          <Skeleton width={180} height={24} style={styles.nameSkeleton} />
          <Skeleton width={240} height={16} style={styles.bioSkeleton} />
          <Skeleton width={200} height={16} style={styles.bioSkeleton} />
        </View>
      </View>

      <View style={styles.section}>
        <Skeleton width={100} height={20} style={styles.sectionTitle} />
        <View style={styles.tagsContainer}>
          <Skeleton width={100} height={32} borderRadius={16} style={styles.tag} />
          <Skeleton width={120} height={32} borderRadius={16} style={styles.tag} />
          <Skeleton width={80} height={32} borderRadius={16} style={styles.tag} />
        </View>
      </View>

      <View style={styles.section}>
        <Skeleton width={120} height={20} style={styles.sectionTitle} />
        <View style={styles.socialContainer}>
          <Skeleton width="100%" height={56} borderRadius={12} style={styles.socialButton} />
          <Skeleton width="100%" height={56} borderRadius={12} style={styles.socialButton} />
        </View>
      </View>

      <View style={styles.actionContainer}>
        <Skeleton width="100%" height={50} borderRadius={12} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#3A63ED",
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatarContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  nameContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  nameSkeleton: {
    marginBottom: 12,
  },
  bioSkeleton: {
    marginBottom: 8,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
  },
  socialContainer: {
    flexDirection: "column",
    gap: 12,
  },
  socialButton: {
    marginBottom: 12,
  },
  actionContainer: {
    padding: 16,
    marginTop: 32,
  },
  skeleton: {
    backgroundColor: "#E5E7EB",
  },
})

export default ProfileSkeletonLoader