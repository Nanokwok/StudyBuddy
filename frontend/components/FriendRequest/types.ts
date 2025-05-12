export interface FriendRequest {
  id: string
  name: string
  bio: string
  avatarUrl: string
  tags: string[]
}

export interface FriendRequestBoxProps {
  request: FriendRequest
  onAccept?: () => void
  onDecline?: () => void
  index?: number
}

export interface FriendRequestListProps {
  requests: FriendRequest[]
  onAccept: (id: string) => void
  onDecline: (id: string) => void
  refreshing?: boolean
  onRefresh?: () => void
}

export interface FriendRequestsScreenProps {
  requests: FriendRequest[]
  onAccept: (id: string) => void
  onDecline: (id: string) => void
  loading?: boolean
  refreshing?: boolean
  onRefresh?: () => void
  error?: string | null
}