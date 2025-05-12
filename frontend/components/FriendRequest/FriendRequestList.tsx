"use client"

import type React from "react"
import { ScrollView, StyleSheet, RefreshControl } from "react-native"
import FriendRequestBox from "./FriendRequestBox"
import EmptyRequestsState from "./EmptyRequestsState"
import type { FriendRequestListProps } from "./types"
import { useRouter } from "expo-router"

const FriendRequestList: React.FC<FriendRequestListProps> = ({
  requests,
  onAccept,
  onDecline,
  refreshing = false,
  onRefresh,
}) => {
  const router = useRouter()
  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={[styles.requestsContainer, requests.length === 0 && styles.emptyContainer]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3A63ED" colors={["#3A63ED"]} />
      }
    >
      {requests.length > 0 ? (
        requests.map((request, index) => (
          <FriendRequestBox
            key={request.id}
            request={request}
            onAccept={() => onAccept(request.id)}
            onDecline={() => onDecline(request.id)}
            index={index}
          />
        ))
      ) : (
        <EmptyRequestsState
          title="No Friend Requests"
          message="You don't have any pending friend requests at the moment. When someone sends you a request, it will appear here."
          icon="people-outline"
          action={{
            label: "Find Friends",
            onPress: () => router.push("/(tabs)/newFriend")
          }}
        />
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  requestsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
  },
})

export default FriendRequestList