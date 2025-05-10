import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileEditScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  
  // User data state
  const [userData, setUserData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    profilePic: '',
    bio: 'Software Engineering Student',
    description: 'I love coding and learning new technologies. Currently focused on mobile app development and AI.',
    social: {
      instagram: 'johndoe',
      facebook: 'John Doe',
      twitter: 'johndoe',
      linkedin: 'john-doe'
    }
  });

  // Temporary state for editing
  const [editData, setEditData] = useState({...userData});

  // Request permission for image library
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to change your profile picture.');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setEditData({
        ...editData,
        profilePic: result.assets[0].uri
      });
    }
  };

  const handleSave = () => {
    // Here you would typically send the updated data to your backend
    setUserData(editData);
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditData({...userData});
    setIsEditing(false);
  };

  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
        <TouchableOpacity 
        style={styles.profileImageContainer}
        onPress={isEditing ? pickImage : () => {}}
        disabled={!isEditing}
        >
        {editData.profilePic ? (
          <Image 
            source={{ uri: editData.profilePic }} 
            style={styles.profileImage} 
          />
        ) : (
          <View style={styles.profileImagePlaceholder}>
            <Text style={styles.profileImagePlaceholderText}>
              {editData.firstName.charAt(0)}{editData.lastName.charAt(0)}
            </Text>
          </View>
        )}
        {isEditing && (
          <View style={styles.editProfileImageOverlay}>
            <FontAwesome name="camera" size={20} color="white" />
          </View>
        )}
      </TouchableOpacity>
      
      <View style={styles.nameContainer}>
        {isEditing ? (
          <View style={styles.editNameContainer}>
            <TextInput
              style={styles.nameInput}
              value={editData.firstName}
              onChangeText={(text) => setEditData({...editData, firstName: text})}
              placeholder="First Name"
            />
            <TextInput
              style={styles.nameInput}
              value={editData.lastName}
              onChangeText={(text) => setEditData({...editData, lastName: text})}
              placeholder="Last Name"
            />
          </View>
        ) : (
          <Text style={styles.nameText}>{userData.firstName} {userData.lastName}</Text>
        )}
        
        {isEditing ? (
          <TextInput
            style={styles.bioInput}
            value={editData.bio}
            onChangeText={(text) => setEditData({...editData, bio: text})}
            placeholder="Short bio"
          />
        ) : (
          <Text style={styles.bioText}>{userData.bio}</Text>
        )}
      </View>
    </View>
  );

  const renderDescription = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>About Me</Text>
      {isEditing ? (
        <TextInput
          style={styles.descriptionInput}
          value={editData.description}
          onChangeText={(text) => setEditData({...editData, description: text})}
          placeholder="Tell us about yourself"
          multiline
          numberOfLines={4}
        />
      ) : (
        <Text style={styles.descriptionText}>{userData.description}</Text>
      )}
    </View>
  );

  const renderSocialMedia = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Social Media</Text>
      
      <View style={styles.socialItem}>
        <FontAwesome name="instagram" size={24} color="#E1306C" style={styles.socialIcon} />
        {isEditing ? (
          <TextInput
            style={styles.socialInput}
            value={editData.social.instagram}
            onChangeText={(text) => setEditData({
              ...editData, 
              social: {...editData.social, instagram: text}
            })}
            placeholder="Instagram username"
          />
        ) : (
          <Text style={styles.socialText}>@{userData.social.instagram}</Text>
        )}
      </View>
      
      <View style={styles.socialItem}>
        <FontAwesome name="facebook" size={24} color="#4267B2" style={styles.socialIcon} />
        {isEditing ? (
          <TextInput
            style={styles.socialInput}
            value={editData.social.facebook}
            onChangeText={(text) => setEditData({
              ...editData, 
              social: {...editData.social, facebook: text}
            })}
            placeholder="Facebook name"
          />
        ) : (
          <Text style={styles.socialText}>{userData.social.facebook}</Text>
        )}
      </View>
      
      <View style={styles.socialItem}>
        <FontAwesome name="twitter" size={24} color="#1DA1F2" style={styles.socialIcon} />
        {isEditing ? (
          <TextInput
            style={styles.socialInput}
            value={editData.social.twitter}
            onChangeText={(text) => setEditData({
              ...editData, 
              social: {...editData.social, twitter: text}
            })}
            placeholder="Twitter username"
          />
        ) : (
          <Text style={styles.socialText}>@{userData.social.twitter}</Text>
        )}
      </View>
      
      <View style={styles.socialItem}>
        <FontAwesome name="linkedin" size={24} color="#0077B5" style={styles.socialIcon} />
        {isEditing ? (
          <TextInput
            style={styles.socialInput}
            value={editData.social.linkedin}
            onChangeText={(text) => setEditData({
              ...editData, 
              social: {...editData.social, linkedin: text}
            })}
            placeholder="LinkedIn username"
          />
        ) : (
          <Text style={styles.socialText}>{userData.social.linkedin}</Text>
        )}
      </View>
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtonsContainer}>
      {isEditing ? (
        <>
          <TouchableOpacity 
            style={[styles.actionButton, styles.cancelButton]} 
            onPress={handleCancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.saveButton]} 
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]} 
          onPress={() => setIsEditing(true)}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ 
        headerTitle: "My Profile",
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerLeft: () => (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <FontAwesome name="arrow-left" size={20} color="black" />
          </TouchableOpacity>
        ),
      }} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {renderProfileHeader()}
            {renderDescription()}
            {renderSocialMedia()}
            {renderActionButtons()}
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  backButton: {
    padding: 10,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImagePlaceholderText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  editProfileImageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    alignItems: 'center',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bioText: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.6)',
    textAlign: 'center',
  },
  editNameContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  nameInput: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 4,
    width: 120,
    textAlign: 'center',
  },
  bioInput: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 8,
    width: '100%',
    textAlign: 'center',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(0, 0, 0, 0.8)',
  },
  descriptionInput: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  socialIcon: {
    width: 30,
    marginRight: 12,
  },
  socialText: {
    fontSize: 16,
    flex: 1,
  },
  socialInput: {
    flex: 1,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 8,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    minWidth: 120,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#2563eb',
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#2563eb',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  cancelButtonText: {
    color: 'rgba(0, 0, 0, 0.8)',
    fontSize: 16,
    fontWeight: 'bold',
  },
});