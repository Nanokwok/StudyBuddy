import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

interface CoursesSectionProps {
  courses: Array<{
    code: string;
    title: string;
  }>;
}

const CoursesSection = ({ courses }: CoursesSectionProps) => {
  const renderCourseItem = ({ item }: { item: { code: string; title: string } }) => (
    <View style={styles.courseItem}>
      <View style={styles.courseIconContainer}>
        <MaterialIcons name="book" size={20} color={COLORS.primary} />
      </View>
      <View style={styles.courseContent}>
        <Text style={styles.courseCode}>{item.code}</Text>
        <Text style={styles.courseTitle} numberOfLines={1} ellipsizeMode="tail">
          {item.title}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Courses</Text>
        <View style={styles.courseCountBadge}>
          <Text style={styles.courseCountText}>{courses.length}</Text>
        </View>
      </View>

      {courses && courses.length > 0 ? (
        <FlatList
          data={courses}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item.code}
          scrollEnabled={false}
          contentContainerStyle={styles.courseList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="school" size={40} color={COLORS.textPlaceholder} />
          <Text style={styles.emptySectionText}>No courses enrolled yet</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    margin: SPACING.md,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  courseCountBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.circle,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseCountText: {
    color: 'white',
    fontSize: FONT_SIZE.xs,
    fontWeight: 'bold',
  },
  courseList: {
    gap: SPACING.sm,
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.small,
  },
  courseIconContainer: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.circle,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  courseContent: {
    flex: 1,
  },
  courseCode: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.primary,
  },
  courseTitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  emptySectionText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textPlaceholder,
    fontStyle: 'italic',
    marginTop: SPACING.sm,
  },
});

export default CoursesSection;