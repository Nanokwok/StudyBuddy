"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, Animated } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"

interface CoursesSectionProps {
  courses: Array<{
    code: string
    title: string
  }>
}

const CoursesSection: React.FC<CoursesSectionProps> = ({ courses }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const itemFadeAnims = useRef<Animated.Value[]>([]).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay: 100,
      useNativeDriver: true,
    }).start()
  }, [])

  useEffect(() => {
    itemFadeAnims.length = 0

    const newAnims = courses.map(() => new Animated.Value(0))

    newAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: 150 + index * 100,
        useNativeDriver: true,
      }).start()
    })

    newAnims.forEach((anim) => itemFadeAnims.push(anim))
  }, [courses])

  const renderCourseItem = ({ item, index }: { item: { code: string; title: string }; index: number }) => {
    const itemFadeAnim = itemFadeAnims[index] ?? new Animated.Value(1)

    return (
      <Animated.View
        style={{
          opacity: itemFadeAnim,
          transform: [
            {
              translateY: itemFadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        }}
      >
        <View style={styles.courseItem}>
          <View style={styles.courseIconContainer}>
            <MaterialIcons name="book" size={20} color="#3A63ED" />
          </View>
          <View style={styles.courseContent}>
            <Text style={styles.courseCode}>{item.code}</Text>
            <Text style={styles.courseTitle} numberOfLines={1} ellipsizeMode="tail">
              {item.title}
            </Text>
          </View>
        </View>
      </Animated.View>
    )
  }

  return (
    <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="school" size={20} color="#3A63ED" />
          <Text style={styles.sectionTitle}>My Courses</Text>
        </View>
        <View style={styles.courseCountBadge}>
          <Text style={styles.courseCountText}>{courses.length}</Text>
        </View>
      </View>

      {courses && courses.length > 0 ? (
        <FlatList
          data={courses}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item.code}
          scrollEnabled={false}
          contentContainerStyle={styles.courseList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="school" size={40} color="#9CA3AF" />
          <Text style={styles.emptySectionText}>No courses enrolled yet</Text>
        </View>
      )}
    </Animated.View>
  )
}

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
  courseCountBadge: {
    backgroundColor: "#3A63ED",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  courseCountText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  courseList: {
    gap: 8,
  },
  courseItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderLeftWidth: 5,
    borderLeftColor: "#3A63ED",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  courseIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EEF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  courseContent: {
    flex: 1,
  },
  courseCode: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3A63ED",
  },
  courseTitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  emptySectionText: {
    fontSize: 16,
    color: "#9CA3AF",
    fontStyle: "italic",
    marginTop: 8,
  },
})

export default CoursesSection