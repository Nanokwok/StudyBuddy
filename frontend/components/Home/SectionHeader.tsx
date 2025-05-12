import type React from "react"
import { View, TouchableOpacity, StyleSheet } from "react-native"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { MaterialIcons } from "@expo/vector-icons"
import type { HeaderProps } from "./types"

export const SectionHeader: React.FC<HeaderProps> = ({ title, subtitle, showArrow = false, onPress }) => (
  <ThemedView style={headerStyles.headerContainer}>
    <View style={headerStyles.headerTextContainer}>
      <ThemedText type="title" style={headerStyles.title}>
        {title}
      </ThemedText>
      {subtitle && (
        <ThemedText type="subtitle" style={headerStyles.subtitle}>
          {subtitle}
        </ThemedText>
      )}
    </View>
    {showArrow && (
      <TouchableOpacity onPress={onPress} style={headerStyles.viewAllButton}>
        <ThemedText style={headerStyles.viewAllText}>View all</ThemedText>
        <MaterialIcons name="chevron-right" size={20} color="#3A63ED" />
      </TouchableOpacity>
    )}
  </ThemedView>
)

const headerStyles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    backgroundColor: "#F9FAFB",
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 14,
    color: "#3A63ED",
    fontWeight: "600",
    marginRight: 4,
  },
})