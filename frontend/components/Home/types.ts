export interface Session {
  id?: string
  title: string
  date: string
  time: string
}

export interface HeaderProps {
  title: string
  subtitle?: string
  showArrow?: boolean
  onPress?: () => void
}

export interface SessionsProps {
  sessions?: Session[]
  onSeeAllPress?: () => void
  onMorePress?: () => void
  loading?: boolean
  error?: string | null
  refreshing?: boolean
  onRefresh?: () => void
}
