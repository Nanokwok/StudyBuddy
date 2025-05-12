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

export const SessionSkeletonLoader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Skeleton width="70%" height={24} style={styles.title} />
        <View style={styles.row}>
          <Skeleton width={20} height={20} borderRadius={10} />
          <Skeleton width="40%" height={18} style={styles.detail} />
        </View>
        <View style={styles.row}>
          <Skeleton width={20} height={20} borderRadius={10} />
          <Skeleton width="30%" height={18} style={styles.detail} />
        </View>
      </View>
      <View style={styles.card}>
        <Skeleton width="60%" height={24} style={styles.title} />
        <View style={styles.row}>
          <Skeleton width={20} height={20} borderRadius={10} />
          <Skeleton width="45%" height={18} style={styles.detail} />
        </View>
        <View style={styles.row}>
          <Skeleton width={20} height={20} borderRadius={10} />
          <Skeleton width="35%" height={18} style={styles.detail} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  card: {
    padding: 16,
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
  },
  title: {
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  detail: {
    marginLeft: 4,
  },
  skeleton: {
    backgroundColor: "#E5E7EB",
  },
})
