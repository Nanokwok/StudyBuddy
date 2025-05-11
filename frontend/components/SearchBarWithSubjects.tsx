import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

interface SearchBarWithSubjectsProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  onSubjectPress: (subject: string) => void;
  selectedSubject: string | null;
}

const SearchBarWithSubjects: React.FC<SearchBarWithSubjectsProps> = ({
  searchText,
  onSearchChange,
  onSubjectPress,
  selectedSubject,
}) => {
  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'Economics',
    'History'
  ];

  return (
    <ThemedView style={styles.container}>
      {/* Search Bar */}
      <ThemedView style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <MaterialIcons name="search" size={20} color="rgba(0, 0, 0, 0.5)" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by course or name"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            value={searchText}
            onChangeText={onSearchChange}
          />
        </View>
      </ThemedView>

      {/* Subjects Scroll */}
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.subjectsContainer}
      >
        {subjects.map((subject) => (
          <TouchableOpacity
            key={subject}
            style={[
              styles.subjectChip,
              selectedSubject === subject && styles.selectedSubjectChip
            ]}
            onPress={() => onSubjectPress(subject)}
          >
            <ThemedText 
              style={[
                styles.subjectText,
                selectedSubject === subject && styles.selectedSubjectText
              ]}
            >
              {subject}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
    backgroundColor: 'white',
  },
  searchContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  subjectsContainer: {
    gap: 8,
    paddingVertical: 4,
  },
  subjectChip: {
    minHeight: 28,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderRadius: 32,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedSubjectChip: {
    borderColor: '#2563eb',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
  subjectText: {
    fontSize: 16,
  },
  selectedSubjectText: {
    color: '#2563eb',
  },
});

export default SearchBarWithSubjects;