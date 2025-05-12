"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { Animated, StyleSheet } from "react-native"
import { ThemedView } from "@/components/ThemedView"
import CalendarEvent from "./CalendarEvent"
import type { Session } from "./types"

interface SessionListProps {
  sessions: Session[]
  limit?: number
  onSessionPress?: (session: Session) => void
}

export const SessionList: React.FC<SessionListProps> = ({ sessions, limit = 3, onSessionPress }) => {
  const displayedSessions = sessions.slice(0, limit)
  const fadeInAnimations = useRef(displayedSessions.map(() => new Animated.Value(0))).current

  useEffect(() => {
    const animations = fadeInAnimations.map((anim, i) => {
      return Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: i * 100,
        useNativeDriver: true,
      })
    })

    Animated.stagger(100, animations).start()
  }, [sessions])

  return (
    <ThemedView style={listStyles.sessionsContainer}>
      {displayedSessions.map((session, index) => (
        <Animated.View
          key={`${session.title}-${index}`}
          style={{
            opacity: fadeInAnimations[index] || 1,
            transform: [
              {
                translateY: (fadeInAnimations[index] || new Animated.Value(1)).interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}
        >
          <CalendarEvent
            title={session.title}
            date={session.date}
            time={session.time}
            onPress={() => onSessionPress && onSessionPress(session)}
          />
        </Animated.View>
      ))}
    </ThemedView>
  )
}

const listStyles = StyleSheet.create({
  sessionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F9FAFB",
  },
})