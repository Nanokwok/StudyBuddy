"use client"

import React, { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Animated,
} from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import api from "@/core/api"

interface Course {
  code: string
  title: string
}

interface EditCoursesSectionProps {
  courses: Course[]
  isEditing: boolean
  onCoursesUpdated: (courses: Course[]) => void
}

const CoursesSection: React.FC<EditCoursesSectionProps> = ({ courses, isEditing, onCoursesUpdated }) => {
  const [courseCode, setCourseCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentCourses, setCurrentCourses] = useState<Course[]>([])
  const fadeAnim = useRef(new Animated.Value(0)).current
  const itemFadeAnims = useRef<Animated.Value[]>([]).current

  useEffect(() => {
    setCurrentCourses(courses)
  }, [courses])

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay: 100,
      useNativeDriver: true,
    }).start()
  }, [])

  useEffect(() => {
    // Reset animations when courses change
    itemFadeAnims.length = 0
    const newAnims = currentCourses.map(() => new Animated.Value(0))

    newAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: 150 + index * 100,
        useNativeDriver: true,
      }).start()
    })

    newAnims.forEach((anim) => itemFadeAnims.push(anim))
  }, [currentCourses])

  const handleEnrollCourse = async () => {
    if (!courseCode.trim()) {
      Alert.alert("Error", "Please enter a course code")
      return
    }

    if (currentCourses.some((course) => course.code.toLowerCase() === courseCode.trim().toLowerCase())) {
      Alert.alert("Already Enrolled", "You are already enrolled in this course")
      return
    }

    try {
      setIsLoading(true)

      const response = await api.post("enrollments/enroll/", {
        course_code: courseCode.trim().toUpperCase()
      })

      if (response.data) {
        const newCourse = {
          code: response.data.course.course_code,
          title: response.data.course.title
        }

        const updatedCourses = [...currentCourses, newCourse]
        setCurrentCourses(updatedCourses)
        onCoursesUpdated(updatedCourses)
        setCourseCode("")

        const newAnim = new Animated.Value(0)
        itemFadeAnims.push(newAnim)
        Animated.timing(newAnim, {
          toValue: 1,
          duration: 400,
          delay: 100,
          useNativeDriver: true,
        }).start()
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Failed to enroll in course. Please verify the course code."
      Alert.alert("Enrollment Error", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnenrollCourse = async (courseCode: string) => {
    try {
      setIsLoading(true)
      
      await api.post("enrollments/unenroll/", {
        course_code: courseCode
      })

      const updatedCourses = currentCourses.filter((course) => course.code !== courseCode)
      setCurrentCourses(updatedCourses)
      onCoursesUpdated(updatedCourses)
    } catch (error) {
      Alert.alert("Error", "Failed to unenroll from course")
    } finally {
      setIsLoading(false)
    }
  }

  const renderCourseItem = ({ item, index }: { item: Course; index: number }) => {
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
          {isEditing && (
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => {
                Alert.alert(
                  "Unenroll Course",
                  `Are you sure you want to unenroll from ${item.code}?`,
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "Unenroll", onPress: () => handleUnenrollCourse(item.code), style: "destructive" }
                  ]
                )
              }}
            >
              <MaterialIcons name="remove-circle" size={24} color="#EF4444" />
            </TouchableOpacity>
          )}
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
          <Text style={styles.courseCountText}>{currentCourses.length}</Text>
        </View>
      </View>

      {isEditing && (
        <View style={styles.enrollContainer}>
          <TextInput
            style={styles.courseInput}
            placeholder="Enter course code (e.g. 01219344)"
            value={courseCode}
            onChangeText={setCourseCode}
            autoCapitalize="characters"
          />
          <TouchableOpacity 
            style={styles.enrollButton}
            onPress={handleEnrollCourse}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.enrollButtonText}>Add</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {isLoading && !currentCourses.length ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3A63ED" />
          <Text style={styles.loadingText}>Loading courses...</Text>
        </View>
      ) : currentCourses.length > 0 ? (
        <View style={styles.courseList}>
          {currentCourses.map((course, index) => (
          <React.Fragment key={course.code}>
            {renderCourseItem({ item: course, index })}
          </React.Fragment>
        ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="school" size={40} color="#9CA3AF" />
          <Text style={styles.emptySectionText}>No courses enrolled yet</Text>
          {isEditing && (
            <Text style={styles.enrollHintText}>Use the form above to add courses</Text>
          )}
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
  removeButton: {
    padding: 8,
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
  enrollHintText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  enrollContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
  },
  courseInput: {
    flex: 1,
    height: 44,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 8,
  },
  enrollButton: {
    backgroundColor: "#3A63ED",
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  enrollButtonText: {
    color: "white",
    fontWeight: "600",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 8,
  },
})

export default CoursesSection