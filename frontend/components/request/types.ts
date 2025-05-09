export interface FriendRequest {
    id: string;
    name: string;
    description: string;
    avatarUrl: string;
    tags: string[];
  }
  
  export interface FriendRequestBoxProps {
    request: FriendRequest;
    onAccept?: () => void;
    onDecline?: () => void;
    onPress?: () => void;
  }
  
  export interface FriendRequestListProps {
    requests: FriendRequest[];
    onAccept: (id: string) => void;
    onDecline: (id: string) => void;
    onPress: (id: string) => void;
  }