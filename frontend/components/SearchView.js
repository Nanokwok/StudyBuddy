import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import SearchBar from './SearchBar';
import SearchTag from './SearchTag';

const TAGS = [
  "Mathematics",
  "Nuclear Engineering",
  "Software Design",
  "Computer Programming I",
  "Physics II",
  "Service Design",
  "Mobile Dev",
  "Thai Language"
];

export default function SearchView() {
  const [searchText, setSearchText] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Filter tags by search text
  const filteredTags = searchText
    ? TAGS.filter(tag =>
        tag.toLowerCase().includes(searchText.toLowerCase())
      )
    : TAGS;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Courses</Text>
      <SearchBar
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search Courses"
      />
      <ScrollView
        contentContainerStyle={styles.tagsContainer}
        keyboardShouldPersistTaps="handled"
      >
        {filteredTags.map(tag => (
          <SearchTag
            key={tag}
            text={tag}
            selected={selectedTags.includes(tag)}
            onPress={() => toggleTag(tag)}
          />
        ))}
      </ScrollView>
      {/* You can display selected tags or results below */}
      {selectedTags.length > 0 && (
        <View style={styles.selectedContainer}>
          <Text style={styles.selectedTitle}>Selected:</Text>
          <View style={styles.selectedTagsRow}>
            {selectedTags.map(tag => (
              <SearchTag
                key={tag}
                text={tag}
                selected={true}
                onPress={() => toggleTag(tag)}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    marginBottom: 24,
  },
  selectedContainer: {
    marginTop: 16,
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 8,
  },
  selectedTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});