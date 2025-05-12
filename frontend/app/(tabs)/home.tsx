"use client"

import { useState, useEffect, useCallback } from "react"
import { StatusBar, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Sessions } from "@/components/Home"
import type { Session } from "@/components/Home"
import { ProtectedRoute } from "../../components/ProtectedRoute"
import api from "../../core/api"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"

const HomeScreen = () => {
  const navigation = useNavigation()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSessions = async (showLoading = true) => {
    if (showLoading) setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const res = await api.get("enrollments/upcoming_sessions/")
      setSessions(res.data)
      setError(null)
    } catch (err) {
      console.error("Failed to fetch sessions", err)
      setError("Failed to load sessions")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchSessions(false)
  }, [])

  useEffect(() => {
    fetchSessions()
  }, [])

  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#3A63ED" barStyle="light-content" />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#3A63ED" }} edges={["top"]}>
        <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
          <ProtectedRoute>
            <Sessions
              sessions={sessions}
              loading={loading}
              error={error}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          </ProtectedRoute>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default HomeScreen