"use client"

import { useEffect, useState, useCallback } from "react"
import { FriendRequestsScreen } from "@/components/FriendRequest"
import api from "@/core/api"
import type { FriendRequest } from "@/components/FriendRequest/types"

const FriendRequestsPage = () => {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchFriendRequests = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      const res = await api.get("users/pending_friend_requests/")
      const data = res.data

      const formatted = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        bio: item.bio || "",
        avatarUrl: item.profile_picture_url || "https://placehold.co/100x100/EEF6FF/3A63ED?text=👤",
        tags: item.tags || [],
      }))

      setFriendRequests(formatted)
      setError(null)
    } catch (err) {
      console.error("Failed to fetch friend requests", err)
      setError("Failed to load friend requests")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchFriendRequests(false)
  }, [])

  useEffect(() => {
    fetchFriendRequests()
  }, [])

  const handleAccept = async (id: string) => {
    try {
      await api.post(`friendships/${id}/accept/`)
      setFriendRequests((prev) => prev.filter((req) => req.id !== id))
    } catch (err) {
      console.error("Failed to accept", err)
      setError("Failed to accept friend request")
    }
  }

  const handleDecline = async (id: string) => {
    try {
      await api.post(`friendships/${id}/reject/`)
      setFriendRequests((prev) => prev.filter((req) => req.id !== id))
    } catch (err) {
      console.error("Failed to decline", err)
      setError("Failed to decline friend request")
    }
  }

  return (
    <FriendRequestsScreen
      requests={friendRequests}
      onAccept={handleAccept}
      onDecline={handleDecline}
      loading={loading}
      refreshing={refreshing}
      onRefresh={onRefresh}
      error={error}
    />
  )
}

export default FriendRequestsPage