"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Animated } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"

interface ActionButtonsProps {
  isEditing: boolean
  isSaving: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ isEditing, isSaving, onEdit, onSave, onCancel }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.9)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 400,
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
        styles.actionButtonsContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {isEditing ? (
        <>
          <TouchableOpacity style={styles.actionButtonWrapper} onPress={onCancel} disabled={isSaving}>
            <View style={[styles.actionButton, styles.cancelButton]}>
              <MaterialIcons name="close" size={20} color="#6B7280" />
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButtonWrapper} onPress={onSave} disabled={isSaving}>
            <View style={[styles.actionButton, styles.saveButton]}>
              {isSaving ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <MaterialIcons name="check" size={20} color="white" />
                  <Text style={styles.saveButtonText}>Save</Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.actionButtonWrapper} onPress={onEdit}>
          <View style={[styles.actionButton, styles.editButton]}>
            <MaterialIcons name="edit" size={20} color="white" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </View>
        </TouchableOpacity>
      )}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 16,
  },
  actionButtonWrapper: {
    borderRadius: 12,
    overflow: "hidden",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 150,
  },
  editButton: {
    backgroundColor: "#3A63ED",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(58, 99, 237, 0.2)",
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: "#3A63ED",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(58, 99, 237, 0.2)",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cancelButtonText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
})

export default ActionButtons