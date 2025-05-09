import React from 'react';
import { View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import CalendarEvent from '@/components/session/CalendarEvent';
import { Session } from './types';
import { styles } from './styles';

interface SessionListProps {
  sessions: Session[];
  limit?: number;
}

export const SessionList: React.FC<SessionListProps> = ({ 
  sessions, 
  limit = 3 
}) => {
  const displayedSessions = sessions.slice(0, limit);

  return (
    <ThemedView style={styles.sessionsContainer}>
      {displayedSessions.map((session, index) => (
        <ThemedView key={`${session.title}-${index}`} style={styles.sessionCard}>
          <CalendarEvent
            title={session.title}
            date={session.date}
            time={session.time}
          />
        </ThemedView>
      ))}
    </ThemedView>
  );
};