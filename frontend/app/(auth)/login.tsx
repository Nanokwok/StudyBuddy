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
  Animated,
  ActivityIndicator,
  StatusBar,
} from "react-native"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import api from "@/core/api"
import { useAuth } from "@/context/AuthContext"
import { MaterialIcons } from "@expo/vector-icons"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"

const LoginScreen = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [secureTextEntry, setSecureTextEntry] = useState(true)
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

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password.")
      return
    }

    setIsLoading(true)
    try {
      const response = await api.post("token/", {
        username,
        password,
      })

      if (response.status === 200) {
        const { access, refresh, user } = response.data

        if (access && refresh) {
          if (user) {
            try {
              await Promise.all([
                AsyncStorage.setItem("accessToken", access),
                AsyncStorage.setItem("refreshToken", refresh),
                AsyncStorage.setItem("userInfo", JSON.stringify(user)),
              ])
            } catch (storageError) {
              console.error("AsyncStorage Error:", storageError)
              Alert.alert("Error", "Failed to save login data. Please try again.")
              setIsLoading(false)
              return
            }
          } else {
            try {
              await Promise.all([
                AsyncStorage.setItem("accessToken", access),
                AsyncStorage.setItem("refreshToken", refresh),
              ])
            } catch (storageError) {
              console.error("AsyncStorage Error:", storageError)
              Alert.alert("Error", "Failed to save login data. Please try again.")
              setIsLoading(false)
              return
            }
          }
          api.defaults.headers.common["Authorization"] = `Bearer ${access}`
          await login({ access, refresh, user: user || {} })
          router.replace("/(tabs)/home")
        } else {
          console.error("Incomplete data from API:", response.data)
          Alert.alert("Login Error", "Login successful, but required data is missing. Please try again.")
          setIsLoading(false)
          return
        }
      } else {
        let errorMessage = "Login failed. Invalid credentials."
        if (response.data && response.data.detail) {
          errorMessage = response.data.detail
        }
        Alert.alert("Login Failed", errorMessage)
        setIsLoading(false)
      }
    } catch (error: any) {
      console.error("Login error:", error)
      let errorMessage = "An unexpected error occurred. Please check your network connection and try again."
      if (error.response && error.response.data && error.response.data.detail) {
        errorMessage = error.response.data.detail
      }
      Alert.alert("Error", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const goToSignup = () => {
    router.push("/(auth)/signup")
  }

  const toggleSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry)
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
              <Text style={styles.headerTitle}>Welcome Back</Text>
              <Text style={styles.headerSubtitle}>Sign in to continue your learning journey</Text>
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
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    keyboardType="default"
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
                    placeholder="Password"
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

              {/* Login Button */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                  onPress={handleLogin}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <MaterialIcons name="login" size={20} color="white" style={styles.buttonIcon} />
                      <Text style={styles.loginButtonText}>Sign In</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* Don't have an account */}
              <TouchableOpacity style={styles.signupLinkContainer} onPress={goToSignup} disabled={isLoading}>
                <Text style={styles.signupLinkText}>Don't have an account? </Text>
                <Text style={styles.signupLinkTextBold}>Sign up</Text>
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
  buttonContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  loginButton: {
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
  loginButtonDisabled: {
    backgroundColor: "#93C5FD",
    shadowOpacity: 0.1,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  buttonIcon: {
    marginRight: 8,
  },
  signupLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  signupLinkText: {
    color: "#6B7280",
    fontSize: 14,
  },
  signupLinkTextBold: {
    color: "#3A63ED",
    fontSize: 14,
    fontWeight: "700",
  },
})

export default LoginScreen