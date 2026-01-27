import AnimatedButton from "@/components/ui/animated-button";
import { useThemeTokens } from "@/providers/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

// Icon Components (Simple SVG-like shapes)
interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 20, color = "#9ca3af" }) => {
  const iconSize = size;
  return (
    <View
      style={{
        width: iconSize,
        height: iconSize,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: iconSize * 0.8, color }}>
        {getIconSymbol(name)}
      </Text>
    </View>
  );
};

const getIconSymbol = (name: string) => {
  const icons: Record<string, string> = {
    user: "👤",
    mail: "✉️",
    phone: "📱",
    building: "🏢",
    map: "📍",
    shield: "🛡️",
    lock: "🔒",
    eye: "👁️",
    eyeOff: "🔒",
    check: "✓",
    chevron: "▼",
  };
  return icons[name] || "•";
};

interface FormData {
  accountType: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  company: string;
  password: string;
  confirmPassword: string;
}

interface Errors {
  accountType?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  phoneNumber?: string;
  company?: string;
  locations?: string;
  monitorAccess?: string;
  password?: string;
  confirmPassword?: string;
}

export default function ModernRegistrationForm() {
  const router = useRouter();
  const theme = useThemeTokens();
  const styles = createStyles(theme);
  const [selectedTab, setSelectedTab] = useState<string>("manufacturer");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState<boolean>(false);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedMonitorAccess, setSelectedMonitorAccess] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    accountType: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
    company: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const blob1Anim = useRef(new Animated.Value(0)).current;
  const blob2Anim = useRef(new Animated.Value(0)).current;
  const blob3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Blob animations
    const animateBlob = (anim: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 7000,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 7000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    animateBlob(blob1Anim, 0);
    animateBlob(blob2Anim, 2000);
    animateBlob(blob3Anim, 4000);
  }, []);

  const locationOptions = [
    "Germany",
    "Noida - Kanpur",
    "Noida",
    "Indonesia",
    "Salem (Tamil Nadu)",
    "Thailand",
    "Turkey",
  ];

  const monitorOptions = [
    "Devices",
    "Contacts",
    "Reports",
    "Manufacturer",
    "Customer",
    "Registration",
 "GTPL-122-gT-1000T-S7-1200",
    "GTPL-118-gT-80E-P-S7-200",
    "GTPL-108-gT-40E-P-S7-200",
    "GTPL-109-gT-40E-P-S7-200",
    "GTPL-110-gT-40E-P-S7-200",
    "GTPL-111-gT-80E-P-S7-200",
    "GTPL-112-gT-80E-P-S7-200",
    "GTPL-113-gT-80E-P-S7-200",
    "GTPL-30-gT-180E-S7-1200",
    "GTPL-115-gT-180E-S7-1200",
    "GTPL-116-gT-240E-S7-1200",
    "GTPL-117-gT-320E-S7-1200",
    "GTPL-119-gT-180E-S7-1200",
    "GTPL-120-gT-180E-S7-1200",
    "GTPL-121-gT-1000T-S7-1200",
    'GTPL-124-GT-450T-S7-1200',
    "GTPL-131-GT-650T-S7-1200",
    "GTPL-132-300-AP-S7-1200",
    "GTPL-136-gT-450AP",
    "GTPL-137-GT-450T-S7-1200",
    "GTPL-138-GT-450T-S7-1200",
    "GTPL-134-gT-450T-S7-1200",
    "GTPL-135-gT-450T-S7-1200",
    "GTPL-061-gT-450T-S7-1200",
    "GTPL-139-GT-300AP-S7-1200",
    "GTPL-142-gT-450AP-S7-1200",
    "GTPL-143-gT-450AP-S7-1200"
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if ((errors as any)[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const toggleLocation = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((item) => item !== location)
        : [...prev, location],
    );
  };

  const toggleMonitorAccess = (option: string) => {
    setSelectedMonitorAccess((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option],
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (formData.firstName.length < 2)
      newErrors.firstName = "First name must be at least 2 characters";
    if (formData.lastName.length < 2)
      newErrors.lastName = "Last name must be at least 2 characters";
    if (formData.username.length < 3)
      newErrors.username = "Username must be at least 3 characters";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email address";
    if (formData.phoneNumber.length < 10)
      newErrors.phoneNumber = "Phone must be at least 10 digits";
    if (!formData.company) newErrors.company = "Please select a company";
    if (selectedLocations.length === 0)
      newErrors.locations = "Select at least one location";
    if (selectedMonitorAccess.length === 0)
      newErrors.monitorAccess = "Select at least one access option";
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const registrationData = {
        accountType: formData.accountType,
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        company: formData.company,
        locations: selectedLocations,
        monitorAccess: selectedMonitorAccess,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      const response = await fetch('https://grain-backend-1.onrender.com/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "✨ Registration successful!");
        // Reset form after successful registration
        setFormData({
          accountType: "",
          firstName: "",
          lastName: "",
          username: "",
          email: "",
          phoneNumber: "",
          company: "",
          password: "",
          confirmPassword: "",
        });
        setSelectedLocations([]);
        setSelectedMonitorAccess([]);
      } else {
        Alert.alert(
          "Registration Failed",
          result.message || "An error occurred during registration."
        );
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert(
        "Error",
        "Failed to connect to the server. Please check your internet connection."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const blob1Transform = blob1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 30],
  });

  const blob2Transform = blob2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -40],
  });

  const blob3Transform = blob3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* Animated Background Blobs */}
      <Animated.View
        style={[
          styles.blob,
          styles.blob1,
          {
            transform: [
              { translateX: blob1Transform },
              { translateY: blob1Transform },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={["rgba(168, 85, 247, 0.3)", "rgba(168, 85, 247, 0.1)"]}
          style={styles.blobGradient}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.blob,
          styles.blob2,
          {
            transform: [
              { translateX: blob2Transform },
              { translateY: blob2Transform },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={["rgba(59, 130, 246, 0.3)", "rgba(59, 130, 246, 0.1)"]}
          style={styles.blobGradient}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.blob,
          styles.blob3,
          {
            transform: [
              { translateX: blob3Transform },
              { translateY: blob3Transform },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={["rgba(236, 72, 153, 0.3)", "rgba(236, 72, 153, 0.1)"]}
          style={styles.blobGradient}
        />
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <LinearGradient
              colors={[theme.colors.accent, theme.colors.primary]}
              style={styles.iconContainer}
            >
              <Text style={styles.headerIcon}>🛡️</Text>
            </LinearGradient>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Fill in your details to get started
            </Text>
          </View>

          {/* Main Card */}
          <View style={styles.card}>
            <View style={styles.cardOverlay} />
            <View style={styles.cardContent}>
              {/* Account Type Tabs */}
              <View style={styles.tabsWrapper}>
                <View style={styles.tabsContainer}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setSelectedTab("manufacturer");
                      handleInputChange("accountType", "manufacturer");
                    }}
                    style={styles.tabButton}
                  >
                    {selectedTab === "manufacturer" ? (
                      <LinearGradient
                        colors={[theme.colors.accent, theme.colors.primary]}
                        style={styles.activeTab}
                      >
                        <Text style={styles.activeTabText}>Manufacturer</Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.inactiveTab}>
                        <Text style={styles.inactiveTabText}>Manufacturer</Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setSelectedTab("customer");
                      handleInputChange("accountType", "customer");
                    }}
                    style={styles.tabButton}
                  >
                    {selectedTab === "customer" ? (
                      <LinearGradient
                        colors={[theme.colors.accent, theme.colors.primary]}
                        style={styles.activeTab}
                      >
                        <Text style={styles.activeTabText}>Customer</Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.inactiveTab}>
                        <Text style={styles.inactiveTabText}>Customer</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Form Fields */}
              <View style={styles.form}>
                {/* Name Row */}
                <View style={styles.row}>
                  <View style={styles.halfWidth}>
                    <Text style={styles.label}>First Name</Text>
                    <View
                      style={[
                        styles.inputWrapper,
                        errors.firstName && styles.inputError,
                      ]}
                    >
                      <Icon name="user" size={20} color={theme.colors.textSecondary} />
                      <TextInput
                        value={formData.firstName}
                        onChangeText={(val) =>
                          handleInputChange("firstName", val)
                        }
                        style={styles.input}
                        placeholder="John"
                        placeholderTextColor={theme.colors.textSecondary}
                      />
                    </View>
                    {errors.firstName && (
                      <Text style={styles.errorText}>{errors.firstName}</Text>
                    )}
                  </View>

                  <View style={styles.halfWidth}>
                    <Text style={styles.label}>Last Name</Text>
                    <View
                      style={[
                        styles.inputWrapper,
                        errors.lastName && styles.inputError,
                      ]}
                    >
                      <Icon name="user" size={20} color={theme.colors.textSecondary} />
                      <TextInput
                        value={formData.lastName}
                        onChangeText={(val) =>
                          handleInputChange("lastName", val)
                        }
                        style={styles.input}
                        placeholder="Doe"
                        placeholderTextColor={theme.colors.textSecondary}
                      />
                    </View>
                    {errors.lastName && (
                      <Text style={styles.errorText}>{errors.lastName}</Text>
                    )}
                  </View>
                </View>

                {/* Username */}
                <Text style={styles.label}>Username</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.username && styles.inputError,
                  ]}
                >
                  <Icon name="user" size={20} color={theme.colors.textSecondary} />
                  <TextInput
                    value={formData.username}
                    onChangeText={(val) => handleInputChange("username", val)}
                    style={styles.input}
                    placeholder="johndoe123"
                    placeholderTextColor={theme.colors.textSecondary}
                  />
                </View>
                {errors.username && (
                  <Text style={styles.errorText}>{errors.username}</Text>
                )}

                {/* Email */}
                <Text style={styles.label}>Email Address</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.email && styles.inputError,
                  ]}
                >
                  <Icon name="mail" size={20} color={theme.colors.textSecondary} />
                  <TextInput
                    value={formData.email}
                    onChangeText={(val) => handleInputChange("email", val)}
                    style={styles.input}
                    placeholder="john@example.com"
                    placeholderTextColor={theme.colors.textSecondary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                {/* Phone */}
                <Text style={styles.label}>Phone Number</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.phoneNumber && styles.inputError,
                  ]}
                >
                  <Icon name="phone" size={20} color={theme.colors.textSecondary} />
                  <TextInput
                    value={formData.phoneNumber}
                    onChangeText={(val) =>
                      handleInputChange("phoneNumber", val)
                    }
                    style={styles.input}
                    placeholder="+1 (555) 000-0000"
                    placeholderTextColor={theme.colors.textSecondary}
                    keyboardType="phone-pad"
                  />
                </View>
                {errors.phoneNumber && (
                  <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                )}

                {/* Company */}
                <Text style={styles.label}>Company</Text>
                <View style={styles.dropdownWrapper}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setShowCompanyDropdown(!showCompanyDropdown)}
                    style={[
                      styles.inputWrapper,
                      errors.company && styles.inputError,
                    ]}
                  >
                    <Icon name="building" size={20} color={theme.colors.textSecondary} />
                    <Text
                      style={[
                        styles.dropdownText,
                        !formData.company && styles.placeholderColor,
                      ]}
                    >
                      {formData.company || "Select company..."}
                    </Text>
                    <Icon name="chevron" size={16} color={theme.colors.textSecondary} />
                  </TouchableOpacity>

                  {showCompanyDropdown && (
                    <View style={styles.dropdown}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          handleInputChange("company", "Grain Technik");
                          setShowCompanyDropdown(false);
                        }}
                        style={styles.dropdownItem}
                      >
                        <Text style={styles.dropdownItemText}>
                          Grain Technik
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                {errors.company && (
                  <Text style={styles.errorText}>{errors.company}</Text>
                )}

                {/* Locations */}
                <Text style={styles.label}>📍 Locations</Text>
                <View style={styles.chipsContainer}>
                  {locationOptions.map((location) => (
                    <TouchableOpacity
                      key={location}
                      activeOpacity={0.8}
                      onPress={() => toggleLocation(location)}
                    >
                      {selectedLocations.includes(location) ? (
                        <LinearGradient
                          colors={["#a855f7", "#ec4899"]}
                          style={styles.chipSelected}
                        >
                          <Text style={styles.chipTextSelected}>
                            ✓ {location}
                          </Text>
                        </LinearGradient>
                      ) : (
                        <View style={styles.chip}>
                          <Text style={styles.chipText}>{location}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.locations && (
                  <Text style={styles.errorText}>{errors.locations}</Text>
                )}

                {/* Monitor Access */}
                <Text style={styles.label}>🛡️ Monitor Access</Text>
                <ScrollView
                  style={styles.chipsScrollContainer}
                  nestedScrollEnabled
                >
                  <View style={styles.chipsContainer}>
                    {monitorOptions.map((option) => (
                      <TouchableOpacity
                        key={option}
                        activeOpacity={0.8}
                        onPress={() => toggleMonitorAccess(option)}
                      >
                        {selectedMonitorAccess.includes(option) ? (
                          <LinearGradient
                            colors={["#a855f7", "#ec4899"]}
                            style={styles.chipSelected}
                          >
                            <Text style={styles.chipTextSelected}>
                              ✓ {option}
                            </Text>
                          </LinearGradient>
                        ) : (
                          <View style={styles.chip}>
                            <Text style={styles.chipText}>{option}</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
                {errors.monitorAccess && (
                  <Text style={styles.errorText}>{errors.monitorAccess}</Text>
                )}

                {/* Password */}
                <Text style={styles.label}>Password</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.password && styles.inputError,
                  ]}
                >
                  <Icon name="lock" size={20} color={theme.colors.textSecondary} />
                  <TextInput
                    value={formData.password}
                    onChangeText={(val) => handleInputChange("password", val)}
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor={theme.colors.textSecondary}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Icon
                      name={showPassword ? "eye" : "eyeOff"}
                      size={20}
                      color={theme.colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}

                {/* Confirm Password */}
                <Text style={styles.label}>Confirm Password</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.confirmPassword && styles.inputError,
                  ]}
                >
                  <Icon name="lock" size={20} color={theme.colors.textSecondary} />
                  <TextInput
                    value={formData.confirmPassword}
                    onChangeText={(val) =>
                      handleInputChange("confirmPassword", val)
                    }
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor={theme.colors.textSecondary}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Icon
                      name={showConfirmPassword ? "eye" : "eyeOff"}
                      size={20}
                      color={theme.colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}

                {/* Submit Button */}
                <AnimatedButton
                  title={isLoading ? "Creating Account..." : "Create Account"}
                  onPress={handleSubmit}
                  disabled={isLoading}
                  variant="primary"
                  size="large"
                  style={styles.submitButtonWrapper}
                  textStyle={styles.submitButtonText}
                >
                  {isLoading ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                      <ActivityIndicator color="#fff" size="small" />
                      <Text style={[styles.submitButtonText, { marginLeft: 8 }]}>
                        Creating Account...
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.submitButtonText}>
                      Create Account
                    </Text>
                  )}
                </AnimatedButton>
              </View>
            </View>
          </View>

        </Animated.View>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor will be set via inline style
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  blob: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  blob1: {
    top: -100,
    right: -100,
  },
  blob2: {
    bottom: -100,
    left: -100,
  },
  blob3: {
    top: "50%",
    left: "50%",
    marginLeft: -150,
    marginTop: -150,
  },
  blobGradient: {
    flex: 1,
    borderRadius: 150,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  headerIcon: {
    fontSize: 32,
  },
  title: {
    fontSize: 40,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  card: {
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  cardContent: {
    padding: 24,
  },
  tabsWrapper: {
    marginBottom: 24,
  },
  // Tab Button Styles (matching AnimatedButton)
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 16,
    padding: 4,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    borderRadius: 8, // tokens.radius.medium
    overflow: 'hidden',
    ...{
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    }, // tokens.elevation.medium
  },
  activeTab: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: theme.colors.primary, // tokens.colors.primary
  },
  activeTabText: {
    color: theme.colors.text,
    fontWeight: "600",
    fontSize: 15,
  },
  inactiveTab: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  inactiveTabText: {
    color: theme.colors.textSecondary,
    fontWeight: "500",
    fontSize: 15,
  },
  form: {
    gap: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 4,
    marginLeft: 4,
  },
  dropdownWrapper: {
    position: "relative",
    zIndex: 1000,
  },
  dropdownText: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 16,
  },
  placeholderColor: {
    color: "#6b7280",
  },
  // Dropdown Styles (matching AnimatedButton)
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
    zIndex: 2000,
    overflow: 'hidden',
    ...{
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    }, // tokens.elevation.medium
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    overflow: 'hidden',
  },
  dropdownItemText: {
    color: theme.colors.text,
    fontSize: 16,
  },
  // Chip Styles (matching AnimatedButton)
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chipsScrollContainer: {
    maxHeight: 200,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8, // tokens.radius.medium
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    overflow: 'hidden',
    ...{
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    }, // tokens.elevation.low
  },
  chipText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: "500",
  },
  chipSelected: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    overflow: 'hidden',
    ...{
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    }, // tokens.elevation.medium
  },
  chipTextSelected: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  submitButtonWrapper: {
    marginTop: 24,
    alignSelf: 'stretch',
  },
  submitButtonText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "700",
    textAlign: 'center',
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
  },
  footerText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  footerLink: {
    color: theme.colors.accent,
    fontWeight: "600",
  },
});
