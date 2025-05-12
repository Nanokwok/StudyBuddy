"use client"

import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Animated,
  StatusBar,
} from "react-native"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import api from "@/core/api"
import { useAuth } from "@/context/AuthContext"
import { MaterialIcons } from "@expo/vector-icons"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"

export default function SignupScreen() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [secureTextEntry, setSecureTextEntry] = useState(true)
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true)
  const router = useRouter()
  const { login } = useAuth()

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const headerFadeAnim = useRef(new Animated.Value(0)).current
  const headerSlideAnim = useRef(new Animated.Value(-30)).current

  useEffect(() => {
    // Animate header
    Animated.timing(headerFadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()

    Animated.timing(headerSlideAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start()

    // Animate form
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      delay: 300,
      useNativeDriver: true,
    }).start()

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 800,
      delay: 300,
      useNativeDriver: true,
    }).start()
  }, [])

  const handleCreateAccount = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match")
      return
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long")
      return
    }

    setIsLoading(true)
    console.log("Signup data being sent:", { username, email, password })

    try {
      const signupResponse = await api.post("/register/", {
        username: username,
        email: email,
        password: password,
      })

      console.log("Signup successful:", signupResponse.data)

      const loginResponse = await api.post("/token/", {
        username: username,
        password: password,
      })

      console.log("Login successful:", loginResponse.data)

      const { access, refresh } = loginResponse.data
      const user = {
        id: signupResponse.data.id,
        username: signupResponse.data.username,
        email: signupResponse.data.email,
      }

      try {
        await Promise.all([
          AsyncStorage.setItem("accessToken", access),
          AsyncStorage.setItem("refreshToken", refresh),
          AsyncStorage.setItem("userInfo", JSON.stringify(user)),
        ])
        console.log("Login data saved to AsyncStorage")
      } catch (storageError) {
        console.error("AsyncStorage Error:", storageError)
        Alert.alert("Error", "Failed to save login data. Please try again.")
        setIsLoading(false)
        return
      }

      api.defaults.headers.common["Authorization"] = `Bearer ${access}`

      await login({
        access: access,
        refresh: refresh,
        user: user,
      })

      router.replace("/(tabs)/home")
    } catch (error: any) {
      console.error("Signup error:", error)
      if (error.response) {
        console.error("Signup error details:", error.response.data)
      }
      let errorMessage = "An error occurred during signup"

      if (error.response) {
        if (error.response.status === 400) {
          if (error.response.data?.email) {
            errorMessage = error.response.data.email[0]
          } else if (error.response.data?.username) {
            errorMessage = error.response.data.username[0]
          } else if (error.response.data?.password) {
            errorMessage = error.response.data.password[0]
          } else {
            errorMessage = "Invalid data provided"
          }
        } else if (error.response.status === 500) {
          errorMessage = "Server error - please try again later"
        }
      } else if (error.isNetworkError) {
        errorMessage = "Network error - please check your connection"
      }

      Alert.alert("Error", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const goToLogin = () => {
    router.push("/(auth)/login")
  }

  const toggleSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry)
  }

  const toggleSecureConfirmTextEntry = () => {
    setSecureConfirmTextEntry(!secureConfirmTextEntry)
  }

  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#3A63ED" barStyle="light-content" />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#3A63ED" }} edges={["top"]}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.headerBackground}>
            <Animated.View
              style={[
                styles.headerContent,
                {
                  opacity: headerFadeAnim,
                  transform: [{ translateY: headerSlideAnim }],
                },
              ]}
            >
              <Text style={styles.headerTitle}>Create Account</Text>
              <Text style={styles.headerSubtitle}>Join our learning community</Text>
            </Animated.View>
          </View>

          {/* Form Container */}
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              style={[
                styles.formContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {/* Username Field */}
              <View style={styles.fieldContainer}>
                <View style={styles.inputIconContainer}>
                  <MaterialIcons name="person" size={20} color="#6B7280" />
                  <TextInput
                    style={styles.input}
                    placeholder="Username *"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    placeholderTextColor="#9CA3AF"
                    editable={!isLoading}
                  />
                </View>
              </View>

              {/* Email Field */}
              <View style={styles.fieldContainer}>
                <View style={styles.inputIconContainer}>
                  <MaterialIcons name="email" size={20} color="#6B7280" />
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address *"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#9CA3AF"
                    editable={!isLoading}
                  />
                </View>
              </View>

              {/* Password Field */}
              <View style={styles.fieldContainer}>
                <View style={styles.inputIconContainer}>
                  <MaterialIcons name="lock" size={20} color="#6B7280" />
                  <TextInput
                    style={styles.input}
                    placeholder="Password *"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={secureTextEntry}
                    placeholderTextColor="#9CA3AF"
                    editable={!isLoading}
                  />
                  <TouchableOpacity onPress={toggleSecureTextEntry} style={styles.eyeIcon}>
                    <MaterialIcons name={secureTextEntry ? "visibility" : "visibility-off"} size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password Field */}
              <View style={styles.fieldContainer}>
                <View style={styles.inputIconContainer}>
                  <MaterialIcons name="lock" size={20} color="#6B7280" />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password *"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={secureConfirmTextEntry}
                    placeholderTextColor="#9CA3AF"
                    editable={!isLoading}
                  />
                  <TouchableOpacity onPress={toggleSecureConfirmTextEntry} style={styles.eyeIcon}>
                    <MaterialIcons
                      name={secureConfirmTextEntry ? "visibility" : "visibility-off"}
                      size={20}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Password requirements hint */}
              <View style={styles.hintContainer}>
                <MaterialIcons name="info-outline" size={16} color="#6B7280" />
                <Text style={styles.hintText}>Password must be at least 8 characters long</Text>
              </View>

              {/* Create Account Button */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.createAccountButton, isLoading && styles.createAccountButtonDisabled]}
                  onPress={handleCreateAccount}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <MaterialIcons name="person-add" size={20} color="white" style={styles.buttonIcon} />
                      <Text style={styles.createAccountButtonText}>Create Account</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* Already have an account */}
              <TouchableOpacity style={styles.loginLinkContainer} onPress={goToLogin} disabled={isLoading}>
                <Text style={styles.loginLinkText}>Already have an account? </Text>
                <Text style={styles.loginLinkTextBold}>Sign in</Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  headerBackground: {
    backgroundColor: "#3A63ED",
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 3,
  },
  headerContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "white",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  formContainer: {
    backgroundColor: "transparent",
    borderRadius: 16,
    shadowColor: "#000",
    elevation: 3,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  inputIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    marginLeft: 12,
  },
  eyeIcon: {
    padding: 8,
  },
  hintContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  hintText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 8,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  createAccountButton: {
    backgroundColor: "#3A63ED",
    borderRadius: 12,
    height: 56,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#3A63ED",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  createAccountButtonDisabled: {
    backgroundColor: "#93C5FD",
    shadowOpacity: 0.1,
  },
  createAccountButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  buttonIcon: {
    marginRight: 8,
  },
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  loginLinkText: {
    color: "#6B7280",
    fontSize: 14,
  },
  loginLinkTextBold: {
    color: "#3A63ED",
    fontSize: 14,
    fontWeight: "700",
  },
})