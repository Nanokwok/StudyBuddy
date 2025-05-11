import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

interface LogoutButtonProps {
  onLogout: () => Promise<void>;
}

const LogoutButton = ({ onLogout }: LogoutButtonProps) => {
  const handleLogoutPress = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          onPress: onLogout,
          style: "destructive"
        }
      ]
    );
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handleLogoutPress}
    >
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogoutPress}
      >
        <MaterialIcons name="logout" size={20} color="white" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.error,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
    minWidth: 200,
    ...SHADOWS.medium,
  },
  logoutText: {
    color: 'white',
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    marginLeft: SPACING.xs,
  },
});

export default LogoutButton;