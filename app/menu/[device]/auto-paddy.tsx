import LoadingScreen from '@/components/loading-screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAutoData } from '@/hooks/use-auto-data';
import { useThemeMode } from '@/providers/theme';
import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';

import {
    Activity,
    ChevronLeft,
    Fan,
    Gauge,
    Thermometer,
    Zap
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Your configuration with object structure
const machineConfig = {
    "GTPL-132-300-AP-S7-1200": {
        serialNumber: "GTPL_132_PADDY",
        temperatureSensors: {
            T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
            T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
            T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        },
        controls: {
            AHT: { key: "AHT_valve_speed", label: "After Heat(AHT)" },
            HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
            BLOWER: { key: "Blower_speed", label: "Blower" },
            CONDENSORFANSPEED: { key: 'Condenser_fan_speed', label: 'Cond. Fan' }
        },
        compressor: {
            time: "Compressor_timer",
            hp: "HP_value",
            lp: "LP_value",
        },
    },
    "GTPL-136-gT-450AP": {
        serialNumber: "GTPL_136_GRAIN",
        temperatureSensors: {
            T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
            T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
            T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        },
        controls: {
            AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
            HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
            BLOWER: { key: "Blower_speed", label: "Blower" },
            CONDENSORFANSPEED: { key: 'Condenser_fan_speed', label: 'Cond. Fan' }
        },
        compressor: {
            time: "Compressor_timer",
            hp: "HP_value",
            lp: "LP_value",
        },
    },
    "GTPL-139-GT-300AP-S7-1200": {
        serialNumber: "GTPL_139_PADDY",
        temperatureSensors: {
            T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
            T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
            T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        },
        controls: {
            AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
            HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
            BLOWER: { key: "Blower_speed", label: "Blower" },
            CONDENSORFANSPEED: { key: "Condenser_fan_speed", label: "Cond. Fan" }
        },
        compressor: {
            time: "Compressor_timer",
            hp: "HP_value",
            lp: "LP_value",
        },
    },
};

// Color mapping for different sensor types
const colorMap = {
    temperature: {
        T0: "#ef4444",  // Red for After Heat
        T1: "#3b82f6",  // Blue for Cold Air
        T2: "#10b981",  // Green for Ambient
        DEFAULT: "#6b7280"
    },
    controls: {
        AHT: "#8b5cf6",     // Purple
        HGS: "#ec4899",     // Pink
        BLOWER: "#f59e0b",  // Amber
        CONDENSORFANSPEED: "#06b6d4",  // Cyan
        DEFAULT: "#8b5cf6"
    },
    compressor: {
        time: "#8b5cf6", // Purple
        hp: "#f43f5e",   // Rose
        lp: "#6366f1",   // Indigo
        DEFAULT: "#6b7280"
    }
};

// Icon mapping
const getIconForType = (type: string, controlKey?: string) => {
    switch (type) {
        case 'temperature':
            return Thermometer;
        case 'control':
            if (controlKey === 'BLOWER' || controlKey === 'CONDENSORFANSPEED') {
                return Fan;
            }
            return Zap;
        case 'compressor':
            return Gauge;
        default:
            return Activity;
    }
};

// Icon mapping for different data types
const iconMap = {
    temperature: Thermometer,
    speed: Fan,
    frequency: Zap,
    power: Activity,
    pressure: Gauge,
    default: Activity
};

const DataCard = ({ label, value, icon: Icon, color, delay = 0, fullWidth = false }: any) => {
    const { effective } = useThemeMode();
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            delay,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.dataCard,
                {
                    opacity: fadeAnim,
                    width: fullWidth ? width - 40 : (width - 56) / 2,
                    backgroundColor: effective === 'dark' ? '#1e293b' : '#ffffff',
                    borderColor: effective === 'dark' ? '#334155' : '#e2e8f0',
                },
            ]}
        >
            <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
                <Icon size={20} color={color} />
            </View>
            <View style={styles.cardInfo}>
                <ThemedText style={styles.cardLabel}>{label}</ThemedText>
                <ThemedText style={[styles.cardValue, { color }]}>{value}</ThemedText>
            </View>
        </Animated.View>
    );
};

export default function AutoPaddyScreen() {
    const router = useRouter();
    const { effective } = useThemeMode();
    const insets = useSafeAreaInsets();
    const { device } = useLocalSearchParams<{ device: string }>();
    const pathname = usePathname();

    const { data, isConnected, error, formatValue } = useAutoData(device || '');
     // Paddy mode is always active for this screen
  const isPaddyChilling = true;
  const isGrainChilling = false;
   const isSpecialMachine = device?.includes("GTPL-061-gT-450T-S7-1200") || device?.includes('GTPL-121-gT-1000T-S7-1200') || device?.includes('GTPL-122-gT-1000T-S7-1200') || device?.includes('GTPL-139-GT-300AP-S7-1200') || device?.includes('GTPL-142-gT-450AP-S7-1200') || device?.includes('GTPL-143-gT-450AP-S7-1200') || device?.includes('GTPL-124-GT-450T-S7-1200') || device?.includes('GTPL-131-GT-650T-S7-1200') || device?.includes('GTPL-132-300-AP-S7-1200') || device?.includes('GTPL-136-gT-450AP') || false;

  // Get configuration for the current device
  const currentConfig = device ? 
    machineConfig[device as keyof typeof machineConfig] || 
    machineConfig["GTPL-132-300-AP-S7-1200"] : 
    machineConfig["GTPL-132-300-AP-S7-1200"];

  const handleBack = () => router.back();

  // Helper function to get value from data object using key path
  const getValueByKey = (key: string) => {
    if (!data) return '--';
    return data[key] !== undefined ? data[key] : '--';
  };

  // Helper function to format heater value based on machine type
  const formatHeaterValue = (value: any) => {
    const s7_200_machines = ['GTPL-118-gT-80E-P-S7-200', 'GTPL-108-gT-40E-P-S7-200', 'GTPL-109-gT-40E-P-S7-200', 'GTPL-110-gT-40E-P-S7-200', 'GTPL-111-gT-80E-P-S7-200', 'GTPL-112-gT-80E-P-S7-200', 'GTPL-113-gT-80E-P-S7-200'];
    const isS7_200 = s7_200_machines.includes(device || '');
    
    if (isS7_200) {
      // For S7-200 machines, show ON/OFF based on value
      if (value === undefined || value === null || value === '' || value === 0 || value === '0') {
        return 'OFF';
      } else {
        return 'ON';
      }
    } else {
      // For other machines, show percentage
      return value;
    }
  };

  // Get T1/T0 value for paddy mode
  const getT1T0Value = () => {
    if (!data) return '--';
    
    if (device?.includes("GTPL-061-gT-450T-S7-1200")) {
      return data?.T1_set_point ||
        data?.T1_temp_mean ||
        data?.COLD_AIR_TEMP_T1 ||
        data?.T1_SET_POINT || '--';
    } else {
      // Paddy mode - use paddy-specific setpoints
      return data?.T0_set_point ||
        data?.AIR_OUTLET_TEMP ||
        data?.T1_set_point_in_paddy_aeging_mode || 
        data?.T0_set_point_in_paddy_aeging_mode || 
        data?.T0_temp_mean || '--';
    }
  };

  // Get T Delta value for paddy mode
  const getTDeltaValue = () => {
    if (!data) return '--';
    
    if (device?.includes("GTPL-061-gT-450T-S7-1200")) {
      return data?.T0_T1_set_point || 
        data?.AIR_OUTLET_TEMP || 
        data?.COLD_AIR_TEMP_T1 || 
        data?.T1_temp_mean || '--';
    } else {
      // Paddy mode - use paddy-specific delta values
      return data?.Delta_T_set_point ||
        data?.Th_T1 ||
        data?.Delta_T_set_point_paddy_aeging_mode || '--';
    }
  };

  // Get label for T1/T0 card (paddy mode)
  const getT1T0Label = () => {
    if (device?.includes("GTPL-061-gT-450T-S7-1200")) {
      return "T1 Set Point";
    } else {
      return "T0";
    }
  };

  // Get label for T Delta card (paddy mode)
  const getTDeltaLabel = () => {
    if (device?.includes("GTPL-061-gT-450T-S7-1200")) {
      return "T0 - T1";
    } else {
      return "T Delta";
    }
  };

  // Get temperature cards including T1/T0 and T Delta
  const getTemperatureCards = () => {
    const sensors = currentConfig.temperatureSensors;
    const cards = [];
    
    // Add T1/T0 card as first card
    cards.push({
      key: 't1-t0',
      sensorKey: 'T1T0',
      label: getT1T0Label(),
      value: getT1T0Value(),
      icon: iconMap.temperature,
      color: colorMap.temperature.T0 || colorMap.temperature.DEFAULT,
    });

    // Add T Delta card as second card
    cards.push({
      key: 't-delta',
      sensorKey: 'TDELTA',
      label: getTDeltaLabel(),
      value: getTDeltaValue(),
      icon: iconMap.temperature,
      color: colorMap.temperature.T1 || colorMap.temperature.DEFAULT,
    });

    // Add other temperature sensors
    Object.entries(sensors).forEach(([sensorKey, sensorConfig]: [string, any], index) => {
      const value = getValueByKey(sensorConfig.key);
      cards.push({
        key: `temp-${sensorKey}`,
        sensorKey,
        label: sensorConfig.label,
        value,
        icon: iconMap.temperature,
        color: colorMap.temperature[sensorKey as keyof typeof colorMap.temperature] || 
               colorMap.temperature.DEFAULT,
      });
    });

    return cards.map((card, index) => (
      <DataCard
        key={card.key}
        label={card.label}
        value={formatValue(card.value, "°C")}
        icon={card.icon}
        color={card.color}
        delay={index * 100}
      />
    ));
  };

    if (!data) {
        return <LoadingScreen />;
    }

 // Convert temperature sensors object to array for rendering
    const temperatureSensorsArray = Object.entries(currentConfig.temperatureSensors).map(([key, sensor]: [string, any]) => ({
        ...sensor,
        originalKey: key,
        color: colorMap.temperature[key as keyof typeof colorMap.temperature] || colorMap.temperature.DEFAULT
    }));

    // Convert controls object to array for rendering
    const controlsArray = Object.entries(currentConfig.controls).map(([key, control]: [string, any]) => ({
        ...control,
        originalKey: key,
        color: colorMap.controls[key as keyof typeof colorMap.controls] || colorMap.controls.DEFAULT
    }));

    return (
        <ThemedView style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <ChevronLeft size={24} color={effective === 'dark' ? '#ffffff' : '#000000'} />
                </TouchableOpacity>
                <View>
                    <ThemedText style={styles.headerTitle}>PADDY AGEING</ThemedText>
                    <ThemedText style={styles.headerSubtitle}>{device}</ThemedText>
              
                </View>
                <View style={[styles.statusBadge, { backgroundColor: isConnected ? '#10b981' : '#ef4444' }]}>
                    <View style={styles.statusDot} />
                    <ThemedText style={styles.statusText}>{isConnected ? 'LIVE' : 'OFFLINE'}</ThemedText>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.sectionHeader}>
                    <ThemedText style={styles.sectionTitle}>Temperatures</ThemedText>
                </View>
                <View style={styles.grid}>
                   {getTemperatureCards()}
                </View>

                <View style={styles.sectionHeader}>
                    <ThemedText style={styles.sectionTitle}>Controls</ThemedText>
                </View>
                <View style={styles.grid}>
                    {controlsArray.map((control, index) => (
                        <DataCard
                            key={control.key}
                            label={control.label}
                            value={formatValue(data?.[control.key], "%")}
                            icon={getIconForType('control', control.originalKey)}
                            color={control.color}
                            delay={300 + index * 100}
                        />
                    ))}
                </View>

                <View style={styles.sectionHeader}>
                    <ThemedText style={styles.sectionTitle}>Compressor Status</ThemedText>
                </View>
                <View style={styles.grid}>
                    {currentConfig.compressor.time && (
                        <DataCard
                            label="Compressor Time"
                            value={formatValue(data?.[currentConfig.compressor.time], " Hrs")}
                            icon={Activity}
                            color={colorMap.compressor.time}
                            delay={700}
                        />
                    )}
                    <DataCard
                        label="LP Value"
                        value={formatValue(data?.[currentConfig.compressor.lp], " bar")}
                        icon={getIconForType('compressor')}
                        color={colorMap.compressor.lp}
                        delay={750}
                    />
                    <DataCard
                        label="HP Value"
                        value={formatValue(data?.[currentConfig.compressor.hp], " bar")}
                        icon={getIconForType('compressor')}
                        color={colorMap.compressor.hp}
                        delay={800}
                    />
                </View>

                {/* <View style={styles.actionSection}>
                    <TouchableOpacity
                        style={[
                            styles.controlButton,
                            { backgroundColor: data?.PADDY_PROCESS_PB ? '#ef4444' : '#f59e0b' }
                        ]}
                    >
                        <Power size={24} color="#ffffff" />
                        <ThemedText style={styles.controlButtonText}>
                            {data?.PADDY_PROCESS_PB ? 'STOP PROCESS' : 'START PROCESS'}
                        </ThemedText>
                    </TouchableOpacity>
                </View> */}

                {error && (
                    <View style={styles.errorContainer}>
                        <Activity color="#ef4444" size={20} />
                        <ThemedText style={styles.errorText}>{error}</ThemedText>
                    </View>
                )}
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        opacity: 0.7,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    backButton: {
        padding: 8,
        marginRight: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
    },
    headerSubtitle: {
        fontSize: 12,
        opacity: 0.6,
    },
    configInfo: {
        fontSize: 10,
        opacity: 0.5,
        marginTop: 2,
    },
    statusBadge: {
        marginLeft: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#ffffff',
        marginRight: 6,
    },
    statusText: {
        color: '#ffffff',
        fontSize: 10,
        fontWeight: '800',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    sectionHeader: {
        marginBottom: 12,
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        opacity: 0.5,
        textTransform: 'uppercase',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    dataCard: {
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cardInfo: {
        flex: 1,
    },
    cardLabel: {
        fontSize: 10,
        opacity: 0.6,
        marginBottom: 2,
    },
    cardValue: {
        fontSize: 16,
        fontWeight: '700',
    },
    actionSection: {
        marginTop: 8,
    },
    controlButton: {
        height: 60,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    controlButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '800',
    },
    errorContainer: {
        marginTop: 20,
        padding: 16,
        borderRadius: 16,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    errorText: {
        color: '#ef4444',
        fontSize: 12,
        flex: 1,
    },
});