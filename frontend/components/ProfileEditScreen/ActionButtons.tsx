import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

interface ActionButtonsProps {
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const ActionButtons = ({ isEditing, isSaving, onEdit, onSave, onCancel }: ActionButtonsProps) => {
  return (
    <View style={styles.actionButtonsContainer}>
      {isEditing ? (
        <>
          <TouchableOpacity 
            style={styles.actionButtonWrapper} 
            onPress={onCancel}
            disabled={isSaving}
          >
            <View style={[styles.actionButton, styles.cancelButton]}>
              <MaterialIcons name="close" size={20} color="rgba(0, 0, 0, 0.7)" />
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButtonWrapper} 
            onPress={onSave}
            disabled={isSaving}
          >
            <LinearGradient
              colors={[COLORS.primaryGradientStart, COLORS.primaryGradientEnd]}
              style={[styles.actionButton, styles.saveButton]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <MaterialIcons name="check" size={20} color="white" />
                  <Text style={styles.saveButtonText}>Save</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity 
          style={styles.actionButtonWrapper} 
          onPress={onEdit}
        >
          <LinearGradient
            colors={[COLORS.primaryGradientStart, COLORS.primaryGradientEnd]}
            style={[styles.actionButton, styles.editButton]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialIcons name="edit" size={20} color="white" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  actionButtonWrapper: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    minWidth: 140,
  },
  editButton: {
    backgroundColor: COLORS.primary,
  },
  editButtonText: {
    color: 'white',
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    marginLeft: SPACING.xs,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    color: 'white',
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    marginLeft: SPACING.xs,
  },
  cancelButton: {
    backgroundColor: COLORS.secondary,
  },
  cancelButtonText: {
    color: 'rgba(0, 0, 0, 0.7)',
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    marginLeft: SPACING.xs,
  },
});

export default ActionButtons;