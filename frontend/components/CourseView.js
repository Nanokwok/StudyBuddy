import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, FlatList } from 'react-native';
import CourseTag from './CourseTag';

const COURSES = [
  "Mathematics",
  "Nuclear Engineering",
  "Software Design",
  "Computer Programming I",
  "Physics II",
  "Service Design",
  "Mobile Dev",
  "Thai Language"
];

export default function CourseView() {
  const [searchText, setSearchText] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);

  const filteredCourses = searchText
    ? COURSES.filter(course =>
        course.toLowerCase().includes(searchText.toLowerCase())
      )
    : COURSES;

  const toggleCourse = (course) => {
    setSelectedCourses(prev =>
      prev.includes(course)
        ? prev.filter(c => c !== course)
        : [...prev, course]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Courses</Text>
      <TextInput
        style={styles.input}
        placeholder="Search Courses"
        value={searchText}
        onChangeText={setSearchText}
        placeholderTextColor="#888"
      />
      <ScrollView style={styles.listContainer}>
        {filteredCourses.map(course => (
          <TouchableOpacity
            key={course}
            style={[
              styles.courseRow,
              selectedCourses.includes(course) && styles.selectedRow
            ]}
            onPress={() => toggleCourse(course)}
            activeOpacity={0.7}
          >
            <Text style={styles.courseText}>{course}</Text>
            {selectedCourses.includes(course) && (
              <Text style={styles.checkmark}>✔️</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => {
          // Handle Continue Action
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    paddingTop: 35,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 17,
    marginBottom: 10,
  },
  input: {
    height: 50,
    backgroundColor: '#f1f1f6',
    borderRadius: 23,
    marginHorizontal: 17,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
  },
  listContainer: {
    marginHorizontal: 15,
    marginBottom: 20,
    maxHeight: 350,
  },
  courseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.25)',
    padding: 16,
    marginBottom: 12,
  },
  selectedRow: {
    backgroundColor: 'rgba(37,99,235,0.2)',
  },
  courseText: {
    color: '#000',
    flex: 1,
    fontSize: 16,
  },
  checkmark: {
    color: '#2563eb',
    fontSize: 22,
    marginLeft: 8,
  },
  continueButton: {
    backgroundColor: '#2563eb',
    borderRadius: 23,
    marginHorizontal: 15,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  continueText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});