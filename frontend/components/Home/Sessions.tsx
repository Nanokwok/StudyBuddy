import React from 'react';
import { useWindowDimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { SectionHeader } from './SectionHeader';
import { SessionList } from './SessionList';
import { SessionsProps } from './types';
import { styles } from './styles';
import { ThemedText } from '@/components/ThemedText';

export const Sessions: React.FC<SessionsProps> = ({ 
  sessions = [],
  onMorePress,
  loading,
  error
}) => {
  const { width } = useWindowDimensions();
  const hasMoreSessions = sessions.length > 3;

  if (loading) return <LoadingSessions />;

  return (
    <ThemedView style={[styles.container, { width }]}>
      {/* First Section - Overview */}
      <ThemedView style={styles.section}>
        <SectionHeader 
          title="Upcoming Sessions"
          subtitle="Plan your study times"
        />
      </ThemedView>

      {/* Second Section - Sessions List */}
      <ThemedView style={styles.section}>
        <SessionList sessions={sessions} />
      </ThemedView>

      {/* Third Section - Friends */}
      <ThemedView style={styles.section}>
        <SectionHeader 
          title="Friends"
          subtitle="Connect with classmates"
        />
      </ThemedView>
    </ThemedView>
  );
};

const LoadingSessions = () => (
  <ThemedView style={styles.container}>
    <ThemedText>Loading sessions...</ThemedText>
  </ThemedView>
);