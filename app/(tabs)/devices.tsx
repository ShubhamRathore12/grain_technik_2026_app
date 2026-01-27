import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AnimatedButton from '@/components/ui/animated-button';
import AnimatedCard from '@/components/ui/animated-card';
import AnimatedText from '@/components/ui/animated-text';
import { useMachineStatusFeed } from '@/hooks/use-machinestatus-feed';
import { useI18n } from '@/i18n';
import { useAuth } from '@/providers/auth';
import { useThemeMode, useThemeTokens } from '@/providers/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { useNavigation, useRouter } from 'expo-router';
import {
  Activity,
  Cpu,
  Download,
  Filter,
  MapPin,
  Snowflake,
  Wifi
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type MachineType = 'chiller' | 'dryer' | 'conveyor' | 'silo';

const { width } = Dimensions.get('window');

interface Device {
  id: string;
  name: string;
  location: string;
  image: string;
  type: MachineType;
  status: true | false | 'maintenance';
  internetStatus: boolean;
  coolingStatus: boolean;
  chillerModel?: string;
  plc: string;
  model: string;
}

const allDevices: Device[] = [
  {
    id: '1',
    name: 'GTPL-30-gT-180E-S7-1200',
    type: 'chiller',
    model: 'gT-140E',
    location: 'Germany',
    image: 'https://imgtolinkx.com/i/tyDruPH0',
    plc: 'S7-1200',
    chillerModel: 'gT-140E',
    status: 'active',
    internetStatus: true,
    coolingStatus: true,
  },
  {
    id: '2',
    name: 'GTPL-061-gT-450T-S7-1200',
    type: 'chiller',
    model: 'gT-450T',
    location: 'Turkey',
    image: 'https://imgtolinkx.com/i/tyDruPH0',
    plc: 'S7-1200',
    chillerModel: 'gT-450T',
    status: 'active',
    internetStatus: true,
    coolingStatus: false,
  },
  {
    id: '3',
    name: 'GTPL-108-gT-40E-P-S7-200',
    type: 'chiller',
    model: 'gT-40E-P',
    location: 'Germany',
    image: 'https://imgtolinkx.com/i/tyDruPH0',
    plc: 'S7-200',
    chillerModel: 'gT-40E-P',
    status: 'inactive',
    internetStatus: false,
    coolingStatus: false,
  },
  {
    id: '4',
    name: 'GTPL-109-gT-40E-P-S7-200',
    type: 'chiller',
    model: 'gT-40E-P',
    location: 'Germany',
    image: 'https://imgtolinkx.com/i/tyDruPH0',
    plc: 'S7-200',
    chillerModel: 'gT-40E-P',
    status: 'active',
    internetStatus: true,
    coolingStatus: true,
  },
  {
    id: '5',
    name: 'GTPL-110-gT-40E-P-S7-200',
    type: 'chiller',
    model: 'gT-40E-P',
    location: 'Germany',
    image: 'https://imgtolinkx.com/i/tyDruPH0',
    plc: 'S7-200',
    chillerModel: 'gT-40E-P',
    status: 'active',
    internetStatus: true,
    coolingStatus: true,
  },
  {
    id: '6',
    name: 'GTPL-111-gT-80E-P-S7-200',
    type: 'chiller',
    model: 'gT-80E-P',
    location: 'Germany',
    image: 'https://imgtolinkx.com/i/tyDruPH0',
    plc: 'S7-200',
    chillerModel: 'gT-80E-P',
    status: 'inactive',
    internetStatus: false,
    coolingStatus: false,
  },
  {
    id: '7',
    name: 'GTPL-112-gT-80E-P-S7-200',
    type: 'chiller',
    model: 'gT-80E-P',
    location: 'Germany',
    image: 'https://imgtolinkx.com/i/tyDruPH0',
    plc: 'S7-200',
    chillerModel: 'gT-80E-P',
    status: 'active',
    internetStatus: true,
    coolingStatus: true,
  },
  {
    id: '8',
    name: 'GTPL-113-gT-80E-P-S7-200',
    type: 'chiller',
    model: 'gT-80E-P',
    location: 'Germany',
    image: 'https://imgtolinkx.com/i/tyDruPH0',
    plc: 'S7-200',
    chillerModel: 'gT-80E-P',
    status: 'active',
    internetStatus: true,
    coolingStatus: false,
  },
  {
    id: '9',
    name: 'GTPL-115-gT-180E-S7-1200',
    type: 'chiller',
    model: 'gT-180E',
    location: 'Germany',
    image: 'https://imgtolinkx.com/i/tyDruPH0',
    plc: 'S7-1200',
    chillerModel: 'gT-180E',
    status: 'active',
    internetStatus: true,
    coolingStatus: true,
  },
  {
    id: '10',
    name: 'GTPL-116-gT-240E-S7-1200',
    type: 'chiller',
    model: 'gT-240E',
    location: 'Germany',
    image: 'https://imgtolinkx.com/i/tyDruPH0',
    plc: 'S7-1200',
    chillerModel: 'gT-240E',
    status: 'active',
    internetStatus: true,
    coolingStatus: true,
  },
  {
    id: '11',
    name: 'GTPL-117-gT-320E-S7-1200',
    type: 'chiller',
    model: 'gT-320E',
    location: 'Germany',
    image: 'https://imgtolinkx.com/i/tyDruPH0',
    plc: 'S7-1200',
    chillerModel: 'gT-320E',
    status: 'active',
    internetStatus: true,
    coolingStatus: true,
  },
  {
    id: '12',
    name: 'GTPL-118-gT-80E-P-S7-200',
    type: 'chiller',
    model: 'gT-80E-P',
    location: 'Noida',
    image: 'https://imgtolinkx.com/i/tyDruPH0',
    plc: 'S7-200',
    chillerModel: 'gT-80E-P',
    status: 'active',
    internetStatus: true,
    coolingStatus: false,
  },
  {
    id: '13',
    name: 'GTPL-119-gT-180E-S7-1200',
    type: 'chiller',
    model: 'gT-180E',
    location: 'Germany',
    image: 'https://imgtolinkx.com/i/tyDruPH0',
    plc: 'S7-1200',
    chillerModel: 'gT-180E',
    status: 'active',
    internetStatus: true,
    coolingStatus: true,
  },
  {
    id: '14',
    name: 'GTPL-120-gT-180E-S7-1200',
    type: 'chiller',
    model: 'gT-180E',
    location: 'Germany',
    image: 'https://imgtolinkx.com/i/tyDruPH0',
    plc: 'S7-1200',
    chillerModel: 'gT-180E',
    status: 'active',
    internetStatus: true,
    coolingStatus: true,
  },
  {
    id: '15',
    name: 'GTPL-121-gT-1000T-S7-1200',
    type: 'chiller',
    model: 'gT-1000T',
    location: 'kanpur',
    image: 'https://imgtolinkx.com/i/tyDruPH0',
    plc: 'S7-1200',
    chillerModel: 'gT-1000T',
    status: 'active',
    internetStatus: true,
    coolingStatus: false,
  },
  {
    id: '16',
    name: 'GTPL-122-gT-1000T-S7-1200',
    type: 'chiller',
    model: 'gT-1000T',
    location: 'kanpur',
    image: 'https://imgtolinkx.com/i/tyDruPH0',
    plc: 'S7-1200',
    chillerModel: 'gT-1000T',
    status: 'active',
    internetStatus: true,
    coolingStatus: true,
  },
  {
    id: '17',
    name: 'GTPL-124-GT-450T-S7-1200',
    type: 'chiller',
    model: 'gT-240E',
    location: 'Indonesia',
    image: 'https://imgtolinkx.com/i/tyDruPH0',
    plc: 'S7-1200',
    chillerModel: 'gT-240E',
    status: 'active',
    internetStatus: false,
    coolingStatus: true,
  },
  {
    id: '18',
    name: 'GTPL-131-GT-650T-S7-1200',
    type: 'chiller',
    model: 'gT-240E',
    location: 'Noida',
    image: 'https://imgtolinkx.com/i/tyDruPH0',
    plc: 'S7-1200',
    chillerModel: 'gT-240E',
    status: 'inactive',
    internetStatus: false,
    coolingStatus: false,
  },
  {
    id: '19',
    name: 'GTPL-132-300-AP-S7-1200',
    type: 'chiller',
    model: 'gT-240E',
    location: 'Salem (Tamil Nadu)',
    image: 'https://imgtolinkx.com/i/tyDruPH0',
    plc: 'S7-1200',
    chillerModel: 'gT-240E',
    status: 'active',
    internetStatus: true,
    coolingStatus: true,
  },
  {
    id: '20',
    name: 'GTPL-134-gT-450T-S7-1200',
    type: 'chiller',
    model: 'gT-450T',
    location: 'Kakinda (AP)',
    image: 'https://imgtolinkx.com/i/tyDruPH0',
    plc: 'S7-1200',
    chillerModel: 'gT-450T',
    status: 'active',
    internetStatus: true,
    coolingStatus: false,
  },
  {
    id: '21',
    name: 'GTPL-135-gT-450T-S7-1200',
    type: 'chiller',
    model: 'gT-450T',
    location: 'Noida',
    image: 'https://imgtolinkx.com/i/tyDruPH0',
    plc: 'S7-1200',
    chillerModel: 'gT-450T',
    status: 'active',
    internetStatus: true,
    coolingStatus: true,
  },
  {
    id: '22',
    name: 'GTPL-136-gT-450AP',
    type: 'chiller',
    model: 'gT-450AP',
    location: 'Srilanka',
    image: 'https://imgtolinkx.com/i/tyDruPH0',
    plc: 'S7-1200',
    chillerModel: 'gT-450AP',
    status: 'active',
    internetStatus: true,
    coolingStatus: true,
  },
  {
    id: '23',
    name: 'GTPL-137-GT-450T-S7-1200',
    type: 'chiller',
    model: 'gT-240E',
    location: 'Thailand',
    image: 'https://imgtolinkx.com/i/tyDruPH0',
    plc: 'S7-1200',
    chillerModel: 'gT-240E',
    status: 'active',
    internetStatus: false,
    coolingStatus: false,
  },
  {
    id: '24',
    name: 'GTPL-138-GT-450T-S7-1200',
    type: 'chiller',
    model: 'gT-240E',
    location: 'Thailand',
    image: 'https://imgtolinkx.com/i/tyDruPH0',
    plc: 'S7-1200',
    chillerModel: 'gT-240E',
    status: 'active',
    internetStatus: true,
    coolingStatus: true,
  },
  {
    id: '25',
    name: 'GTPL-139-GT-300AP-S7-1200',
    type: 'chiller',
    model: 'GT-300AP',
    location: 'India',
    image: 'https://imgtolinkx.com/i/tyDruPH0',
    plc: 'S7-1200',
    chillerModel: 'GT-300AP',
    status: 'active',
    internetStatus: true,
    coolingStatus: true,
  },
  {
    id: '26',
    name: 'GTPL-142-gT-450AP-S7-1200',
    type: 'chiller',
    model: 'gT-450AP',
    location: 'India',
    image: 'https://imgtolinkx.com/i/tyDruPH0',
    plc: 'S7-1200',
    chillerModel: 'gT-450AP',
    status: 'inactive',
    internetStatus: false,
    coolingStatus: false,
  },
  {
    id: '27',
    name: 'GTPL-143-gT-450AP-S7-1200',
    type: 'chiller',
    model: 'gT-450AP',
    location: 'India',
    image: 'https://imgtolinkx.com/i/tyDruPH0',
    plc: 'S7-1200',
    chillerModel: 'gT-450AP',
    status: 'active',
    internetStatus: true,
    coolingStatus: true,
  },
];

const locations = ['All', 'Germany', 'Turkey', 'Noida', 'Indonesia', 'Thailand', 'India'];
const companies = ['Grain Technik'];

export default function DevicesScreen() {
  const router = useRouter();
  const { effective } = useThemeMode();
  const tokens = useThemeTokens();
  const { t, locale } = useI18n();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { status: machineStatus, isConnected, error: statusError, refresh: refreshStatus } = useMachineStatusFeed();
  const [statusLoading, setStatusLoading] = useState(true);
  const deviceStatuses = machineStatus?.machines || [];
  
  // Update loading state when machine status is initially loaded
  useEffect(() => {
    if (deviceStatuses.length > 0) {
      setStatusLoading(false);
    }
  }, [deviceStatuses.length]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={tokens.colors.primary} />
        <Text style={[styles.loadingText, { color: tokens.colors.text }]}>Checking authentication...</Text>
      </View>
    );
  }

  // Don't render content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterScale] = useState(new Animated.Value(0));
  const [selectedCompany, setSelectedCompany] = useState<string>('Grain Technik');
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedMachineType, setSelectedMachineType] = useState<MachineType>('chiller');
  const [filters, setFilters] = useState({
    status: 'all',
    location: 'all',
  });


  const deviceNameToStatusKey: Record<string, string> = {
    "GTPL-122-gT-1000T-S7-1200": "GTPL_122_S7_1200",
    "GTPL-118-gT-80E-P-S7-200": "KABO_200",
    "GTPL-108-gT-40E-P-S7-200": "GTPL_108",
    "GTPL-109-gT-40E-P-S7-200": "GTPL_109",
    "GTPL-110-gT-40E-P-S7-200": "GTPL_110",
    "GTPL-111-gT-80E-P-S7-200": "GTPL_111",
    "GTPL-112-gT-80E-P-S7-200": "GTPL_112",
    "GTPL-113-gT-80E-P-S7-200": "GTPL_113",
    "GTPL-30-gT-180E-S7-1200": "GTPL_114",
    "GTPL-115-gT-180E-S7-1200": "GTPL_115",
    "GTPL-116-gT-240E-S7-1200": "GTPL_116",
    "GTPL-117-gT-320E-S7-1200": "GTPL_117",
    "GTPL-119-gT-180E-S7-1200": "GTPL_119",
    "GTPL-120-gT-180E-S7-1200": "GTPL_120",
    "GTPL-121-gT-1000T-S7-1200": "GTPL_121",
    'GTPL-124-GT-450T-S7-1200': "GTPL_124",
    "GTPL-131-GT-650T-S7-1200": "GTPL_131",
    "GTPL-132-300-AP-S7-1200": "GTPL_132",
    "GTPL-136-gT-450AP": "GTPL_136",
    "GTPL-137-GT-450T-S7-1200": "GTPL_137",
    "GTPL-138-GT-450T-S7-1200": "GTPL_138",
    "GTPL-134-gT-450T-S7-1200": "GTPL_134",
    "GTPL-135-gT-450T-S7-1200": "GTPL_135",
    "GTPL-061-gT-450T-S7-1200": "GTPL_061",
    "GTPL-139-GT-300AP-S7-1200": "GTPL_139",
    "GTPL-142-gT-450AP-S7-1200": "GTPL_142",
    "GTPL-143-gT-450AP-S7-1200": "GTPL_143"
  };
  
  // Function to get device status
  const getDeviceStatus = (deviceName: string) => {
    const key = deviceNameToStatusKey[deviceName];
    const deviceStatus = deviceStatuses.find(m => m.machineName === key);
    
    return {
      machineStatus: deviceStatus?.machineStatus ?? false,
      internetStatus: deviceStatus?.internetStatus ?? false,
      coolingStatus: deviceStatus?.coolingStatus ?? false,
      hasNewData: deviceStatus?.hasNewData ?? false,
    };
  };
  
  // Map devices with their status
  const devicesWithStatus = allDevices.map((device: Device) => {
    const deviceStatus = getDeviceStatus(device.name);
    
    const updatedStatus: 'active' | 'inactive' | 'maintenance' = deviceStatus.machineStatus ? 'active' : (device.status === 'maintenance' ? 'maintenance' : 'inactive');
    
    return {
      ...device,
      status: updatedStatus,
      internetStatus: deviceStatus.internetStatus,
      coolingStatus: deviceStatus.coolingStatus,
    };
  });

  const menuTriggerRef = useRef<View>(null);

  const handleDevicePress = (device: Device, event: any) => {
    setSelectedDevice(device);
    setSelectedMachineType(device.type);

    // Get touch position
    const touchX = event.nativeEvent?.pageX ?? 0;
    const touchY = event.nativeEvent?.pageY ?? 0;

    setMenuPosition({ x: touchX, y: touchY });
    setShowContextMenu(true);
  };

  // Animate filter dropdown whenever showFilters changes
  useEffect(() => {
    Animated.spring(filterScale, {
      toValue: showFilters ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  }, [showFilters]);

  const handleMenuClose = () => {
    setShowContextMenu(false);
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setShowFilters(false);
  };

  const filteredDevices = devicesWithStatus.filter((device) => {
    if (selectedLocation === 'All') return true;
    return device.location === selectedLocation;
  });

  const handleViewMore = (deviceName: string) => {
    const deviceStatus = getDeviceStatus(deviceName);
    const machineStatusValue = deviceStatus.machineStatus;
    
    const statusString = encodeURIComponent(JSON.stringify({ 
      machineStatus: machineStatusValue,
      internetStatus: deviceStatus.internetStatus,
      coolingStatus: deviceStatus.coolingStatus,
      hasNewData: deviceStatus.hasNewData
    }));
    
    router.push({
      pathname: '/menu/[device]',
      params: {
        device: deviceName,
        status: statusString,
      },
    });
  };

  const renderDeviceCard = ({ item }: { item: Device }) => (
    <AnimatedCard animated={true} initialScale={0.95} style={{ width: (width - 48) / 2, margin: 0, marginBottom: 16 }}>
      <Pressable
        style={styles.deviceContent}
        onPress={(e) => handleDevicePress(item, e)}
      >
        {/* Status Badge */}
        <View style={styles.statusBadgeContainer}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: item.status === 'active'
                  ? tokens.colors.success + '20' // 20% opacity
                  : tokens.colors.error + '20', // 20% opacity
              },
            ]}
          >
            <Activity
              size={14}
              color={item.status === 'active' ? tokens.colors.success : tokens.colors.error}
            />
            <Text
              style={[
                styles.statusText,
                {
                  color: item.status === 'active' ? tokens.colors.success : tokens.colors.error,
                },
              ]}
            >
              {item.status === 'active' ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>

        {/* Device Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.deviceImage}
            resizeMode="cover"
          />
          <View
            style={[
              styles.imageOverlay,
              {
                backgroundColor: tokens.colors.overlay,
              },
            ]}
          />
        </View>

        <View style={styles.cardContent}>
          {/* Device Name */}
          <AnimatedText style={styles.deviceName} numberOfLines={2} type="body">
            {item.name}
          </AnimatedText>

          {/* Location & Company */}
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <MapPin size={16} color={tokens.colors.accent} />
              <AnimatedText style={styles.infoText} type="caption">{item.location}</AnimatedText>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="office-building"
                size={16}
                color={tokens.colors.accent}
              />
              <AnimatedText style={styles.infoText} type="caption">{selectedCompany}</AnimatedText>
            </View>
          </View>

          {/* Status Grid */}
          <View
            style={[
              styles.statusGrid,
              {
                backgroundColor: tokens.colors.surface,
              },
            ]}
          >
            <View style={styles.statusItem}>
              <Cpu
                size={20}
                color={item.status === 'active' ? tokens.colors.success : tokens.colors.textSecondary}
              />
              <AnimatedText style={styles.statusLabel} type="caption">Machine</AnimatedText>
            </View>
            <View style={styles.statusItem}>
              <Wifi
                size={20}
                color={item.internetStatus ? tokens.colors.success : tokens.colors.textSecondary}
              />
              <AnimatedText style={styles.statusLabel} type="caption">Internet</AnimatedText>
            </View>
            <View style={styles.statusItem}>
              <Snowflake
                size={20}
                color={item.coolingStatus ? tokens.colors.success : tokens.colors.textSecondary}
              />
              <AnimatedText style={styles.statusLabel} type="caption">Cooling</AnimatedText>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <AnimatedButton
              title="View More"
              onPress={() => handleViewMore(item.name)}
              variant="primary"
              size="small"
              style={{ flex: 1 }}
            />
            <AnimatedButton
              title=""
              onPress={() => {}}
              variant="secondary"
              size="small"
            >
              <Download
                size={18}
                color={tokens.colors.text}
              />
            </AnimatedButton>
          </View>
        </View>
      </Pressable>
    </AnimatedCard>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.title}>Devices</ThemedText>
          <ThemedText style={styles.subtitle}>Connected machines and equipment</ThemedText>
        </View>
        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              backgroundColor: effective === 'dark' ? '#1e293b' : '#ffffff',
              borderColor: effective === 'dark' ? '#334155' : '#e2e8f0',
            },
          ]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color={effective === 'dark' ? '#60a5fa' : '#1a73e8'} />
          <ThemedText style={styles.filterText}>Filters</ThemedText>
        </TouchableOpacity>
      </View>

      {showFilters && (
        <Animated.View
          style={[
            styles.filtersContainer,
            {
              backgroundColor: effective === 'dark' ? '#1e293b' : '#ffffff',
              borderColor: effective === 'dark' ? '#334155' : '#e2e8f0',
              opacity: filterScale,
              transform: [{
                scale: filterScale.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.95, 1],
                })
              }]
            }
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContent}
          >
            {locations.map((loc) => (
              <TouchableOpacity
                key={loc}
                style={[
                  styles.filterOption,
                  selectedLocation === loc && {
                    backgroundColor: effective === 'dark' ? '#3b82f6' : '#2563eb',
                    borderColor: effective === 'dark' ? '#3b82f6' : '#2563eb',
                  },
                  {
                    borderColor: effective === 'dark' ? '#334155' : '#e2e8f0',
                  }
                ]}
                onPress={() => handleLocationSelect(loc)}
              >
                <ThemedText
                  style={[
                    styles.filterOptionText,
                    selectedLocation === loc && { color: '#ffffff' }
                  ]}
                >
                  {loc}
                </ThemedText>
                {selectedLocation === loc && (
                  <View style={styles.selectedIndicator} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      )}

      {/* Loading indicator */}
      {statusLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tokens.colors.primary} />
          <Text style={[styles.loadingText, { color: tokens.colors.text }]}>Loading device status...</Text>
        </View>
      )}

      {/* Error message */}
      {statusError && (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: tokens.colors.error }]}>Error: {statusError}</Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: tokens.colors.primary }]}
            onPress={refreshStatus}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filteredDevices}
        renderItem={renderDeviceCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  gridContainer: {
    paddingBottom: 24,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  filtersContainer: {
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filterScrollContent: {
    paddingHorizontal: 4,
    gap: 10,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  selectedIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
    marginLeft: 4,
  },
  deviceCard: {
    width: (width - 48) / 2,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  inactiveDevice: {
    opacity: 0.7,
  },
  statusBadgeContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  imageContainer: {
    height: 140,
    position: 'relative',
  },
  deviceImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardContent: {
    padding: 16,
  },
  deviceName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
    lineHeight: 20,
  },
  infoContainer: {
    gap: 8,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    flex: 1,
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  statusItem: {
    alignItems: 'center',
    gap: 1,
  },
  statusLabel: {
    fontSize: 10,
    opacity: 0.7,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    elevation: 2,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  viewButtonText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  downloadButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  deviceContent: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  dropdownList: {
    maxHeight: 300,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  dropdownImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  dropdownItemText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});