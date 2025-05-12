import type React from "react"
import { View, StyleSheet, TouchableOpacity } from "react-native"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { MaterialIcons } from "@expo/vector-icons"

interface CalendarEventProps {
  title: string
  date: string
  time: string
  onPress?: () => void
}

const CalendarEvent: React.FC<CalendarEventProps> = ({ title, date, time, onPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <ThemedView style={styles.cardContainer}>
        <View style={styles.leftAccent} />
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <ThemedText type="subtitle" style={styles.title}>
              {title}
            </ThemedText>
            <View style={styles.detailsContainer}>
              <View style={styles.row}>
                <MaterialIcons name="calendar-today" size={16} color="#3A63ED" />
                <ThemedText type="default" style={styles.text}>
                  {date}
                </ThemedText>
              </View>
              <View style={styles.row}>
                <MaterialIcons name="access-time" size={16} color="#3A63ED" />
                <ThemedText type="default" style={styles.text}>
                  {time}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>
      </ThemedView>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
    flexDirection: "row",
    overflow: "hidden",
    backgroundColor: "white",
  },
  leftAccent: {
    width: 6,
    backgroundColor: "#3A63ED",
  },
  container: {
    flex: 1,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  innerContainer: {
    flex: 1,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  detailsContainer: {
    gap: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    color: "#4B5563",
    fontSize: 14,
  },
  chevron: {
    marginLeft: 8,
  },
})

export default CalendarEvent