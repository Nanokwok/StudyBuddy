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
  ActivityIndicator,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import api from '../../core/api';

interface UserData {
  firstName: string;
  lastName: string;
  profilePic: string | null;
  bio: string;
  social: {
    instagram: string;
    facebook: string;
  };
  courses: string[];
  email: string;
  username: string;
  id?: number;
}

export default function ProfileEditScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // User data state
  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
    profilePic: null,
    bio: '',
    social: {
      instagram: '',
      facebook: ''
    },
    courses: [],
    email: '',
    username: ''
  });

  // Temporary state for editing
  const [editData, setEditData] = useState<UserData>({...userData});

  // Add new course state
  const [newCourse, setNewCourse] = useState('');
  const [showAddCourse, setShowAddCourse] = useState(false);

  // Fetch user data
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const [userResponse, coursesResponse, socialResponse] = await Promise.all([
        api.get('users/me/'),
        api.get('enrollments/'),
        api.get('social-links/')
      ]);

      const user = userResponse.data;
      
      // Handle possibly empty courses array
      const courses = Array.isArray(coursesResponse.data) 
        ? coursesResponse.data.map((enrollment) => 
            enrollment.course?.course_code || ''
          ).filter(code => code)
        : [];
      
      // Handle possibly empty social links array
      const socialLinks = Array.isArray(socialResponse.data) ? socialResponse.data : [];

      const instagramLink = socialLinks.find(
        (link) => link?.platform === 'instagram'
      );
      const facebookLink = socialLinks.find(
        (link) => link?.platform === 'facebook'
      );

      const newUserData = {
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        profilePic: user.profile_picture_url,
        bio: user.bio || '',
        social: {
          instagram: (instagramLink?.url || '').replace('@', ''),
          facebook: facebookLink?.url || ''
        },
        courses: courses,
        email: user.email || '',
        username: user.username || '',
        id: user.id
      };

      setUserData(newUserData);
      setEditData(newUserData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile data');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

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

  const uploadProfilePicture = async (uri: string) => {
    try {
      const uploadResponse = await FileSystem.uploadAsync(
        `${api.defaults.baseURL}/users/me/upload_profile_picture/`,
        uri,
        {
          fieldName: 'profile_picture',
          httpMethod: 'POST',
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          headers: {
            'Authorization': `Bearer ${api.defaults.headers.common['Authorization']?.toString().split(' ')[1]}`,
          },
        }
      );

      if (uploadResponse.status >= 200 && uploadResponse.status < 300) {
        const responseData = JSON.parse(uploadResponse.body);
        return responseData.profile_picture_url;
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const updateUserProfile = async () => {
    try {
      const response = await api.patch('users/me/', {
        first_name: editData.firstName,
        last_name: editData.lastName,
        bio: editData.bio
      });
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const updateSocialLinks = async () => {
    try {
      // Get current social links to check what needs to be updated
      const currentLinks = await api.get('social-links/');
      
      // Handle Instagram
      const instagramLink = currentLinks.data.find((link: any) => link.platform === 'instagram');
      if (instagramLink) {
        if (editData.social.instagram) {
          await api.patch(`social-links/${instagramLink.link_id}/`, {
            url: `@${editData.social.instagram}`
          });
        } else {
          await api.delete(`social-links/${instagramLink.link_id}/`);
        }
      } else if (editData.social.instagram) {
        await api.post('social-links/', {
          platform: 'instagram',
          url: `@${editData.social.instagram}`
        });
      }

      // Handle Facebook
      const facebookLink = currentLinks.data.find((link: any) => link.platform === 'facebook');
      if (facebookLink) {
        if (editData.social.facebook) {
          await api.patch(`social-links/${facebookLink.link_id}/`, {
            url: editData.social.facebook
          });
        } else {
          await api.delete(`social-links/${facebookLink.link_id}/`);
        }
      } else if (editData.social.facebook) {
        await api.post('social-links/', {
          platform: 'facebook',
          url: editData.social.facebook
        });
      }
    } catch (error) {
      console.error('Error updating social links:', error);
      throw error;
    }
  };

  const updateCourses = async () => {
    try {
      // Get current enrollments
      const currentEnrollments = await api.get('enrollments/');
      const currentCourseCodes = currentEnrollments.data.map(
        (enrollment: any) => enrollment.course?.course_code || ''
      ).filter((code: string) => code);

      // Courses to add (exist in editData but not in current)
      const coursesToAdd = editData.courses.filter(
        code => !currentCourseCodes.includes(code)
      );

      // Courses to remove (exist in current but not in editData)
      const coursesToRemove = currentCourseCodes.filter(
        (code: string) => !editData.courses.includes(code)
      );

      // Add new courses
      for (const courseCode of coursesToAdd) {
        // First find the course ID by code
        const coursesResponse = await api.get('courses/', {
          params: { search: courseCode }
        });
        
        if (coursesResponse.data.length > 0) {
          const course = coursesResponse.data.find(
            (c: any) => c.course_code === courseCode
          );
          if (course) {
            await api.post('enrollments/enroll/', { course_id: course.course_id });
          }
        }
      }

      // Remove courses
      for (const courseCode of coursesToRemove) {
        const enrollment = currentEnrollments.data.find(
          (e: any) => e.course?.course_code === courseCode
        );
        if (enrollment) {
          await api.post('enrollments/unenroll/', { course_id: enrollment.course.course_id });
        }
      }
    } catch (error) {
      console.error('Error updating courses:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // 1. Upload profile picture if changed
      let profilePicUrl = editData.profilePic;
      if (editData.profilePic && editData.profilePic !== userData.profilePic && 
          !editData.profilePic.startsWith('http')) {
        profilePicUrl = await uploadProfilePicture(editData.profilePic);
      }

      // 2. Update user profile
      await updateUserProfile();

      // 3. Update social links
      await updateSocialLinks();

      // 4. Update courses
      await updateCourses();

      // Refresh data
      await fetchUserData();
      
      setIsEditing(false);
      setShowAddCourse(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({...userData});
    setIsEditing(false);
    setShowAddCourse(false);
    setNewCourse('');
  };

  const handleAddCourse = () => {
    const courseCode = newCourse.trim().toUpperCase();
    if (courseCode) {
      if (editData.courses.includes(courseCode)) {
        Alert.alert('Duplicate Course', 'This course is already in your list.');
        return;
      }
  
      setEditData({
        ...editData,
        courses: [...editData.courses, courseCode]
      });
  
      setNewCourse('');
      setShowAddCourse(false);
    } else {
      Alert.alert('Invalid Input', 'Please enter a course code.');
    }
  };

  const handleRemoveCourse = (courseCode: string) => {
    setEditData({
      ...editData,
      courses: editData.courses.filter(code => code !== courseCode)
    });
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
              {editData.firstName ? editData.firstName.charAt(0) : ''}
              {editData.lastName ? editData.lastName.charAt(0) : 
               editData.username ? editData.username.charAt(0).toUpperCase() : 'U'}
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
          <Text style={styles.nameText}>
            {userData.firstName || userData.lastName 
              ? `${userData.firstName} ${userData.lastName}`.trim()
              : userData.username}
          </Text>
        )}
        
        {/* Show email when not editing */}
        {!isEditing && userData.email && (
          <Text style={styles.emailText}>{userData.email}</Text>
        )}
    
        {isEditing ? (
          <TextInput
            style={styles.bioInput}
            value={editData.bio}
            onChangeText={(text) => setEditData({...editData, bio: text})}
            placeholder="Short bio"
            multiline
            numberOfLines={3}
          />
        ) : (
          userData.bio ? (
            <Text style={styles.bioText}>{userData.bio}</Text>
          ) : (
            <Text style={styles.emptyBioText}>No bio added yet</Text>
          )
        )}
      </View>
    </View>
  );

  const renderCourses = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Courses</Text>
        {isEditing && (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddCourse(true)}
          >
            <FontAwesome name="plus" size={20} color="#2563eb" />
          </TouchableOpacity>
        )}
      </View>

      {showAddCourse && isEditing && (
        <View style={styles.addCourseContainer}>
          <TextInput
            style={styles.courseInput}
            value={newCourse}
            onChangeText={setNewCourse}
            placeholder="Enter Course Code (e.g., CS101)"
            autoCapitalize="characters"
            maxLength={10}
          />
          <View style={styles.addCourseButtons}>
            <TouchableOpacity 
              style={[styles.courseButton, styles.cancelCourseButton]}
              onPress={() => {
                setShowAddCourse(false);
                setNewCourse('');
              }}
            >
              <Text style={styles.cancelCourseButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.courseButton, styles.addCourseButton]}
              onPress={handleAddCourse}
            >
              <Text style={styles.addCourseButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.courseList}>
        {editData.courses && editData.courses.length > 0 ? (
          editData.courses.map((courseCode) => (
            <View key={courseCode} style={styles.courseItem}>
              <Text style={styles.courseCode}>{courseCode}</Text>
              {isEditing && (
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => handleRemoveCourse(courseCode)}
                >
                  <FontAwesome name="times" size={20} color="#ef4444" />
                </TouchableOpacity>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.emptySectionText}>No courses added yet</Text>
        )}
      </View>
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
              social: {...editData.social, instagram: text.replace('@', '')}
            })}
            placeholder="Instagram username"
          />
        ) : (
          editData.social.instagram ? (
            <Text style={styles.socialText}>@{userData.social.instagram}</Text>
          ) : (
            <Text style={styles.emptySocialText}>Not connected</Text>
          )
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
          editData.social.facebook ? (
            <Text style={styles.socialText}>{userData.social.facebook}</Text>
          ) : (
            <Text style={styles.emptySocialText}>Not connected</Text>
          )
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
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2563eb" />
              <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              {renderProfileHeader()}
              {renderCourses()}
              {renderSocialMedia()}
              {renderActionButtons()}
            </ScrollView>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4b5563',
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
    width: '100%',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  bioText: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.6)',
    textAlign: 'center',
  },
  emptyBioText: {
    fontSize: 16,
    color: '#9ca3af',
    fontStyle: 'italic',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptySectionText: {
    fontSize: 16,
    color: '#9ca3af',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 8,
  },
  addButton: {
    padding: 8,
  },
  courseList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 8,
  },
  courseCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
    marginRight: 8,
  },
  removeButton: {
    padding: 4,
  },
  addCourseContainer: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  courseInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
    fontSize: 16,
  },
  addCourseButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  courseButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  addCourseButton: {
    backgroundColor: '#2563eb',
  },
  cancelCourseButton: {
    backgroundColor: '#e5e7eb',
  },
  addCourseButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelCourseButtonText: {
    color: '#4b5563',
    fontSize: 14,
    fontWeight: '600',
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
  emptySocialText: {
    fontSize: 16,
    color: '#9ca3af',
    fontStyle: 'italic',
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