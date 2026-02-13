import LoadingScreen from '@/components/loading-screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAutoData } from '@/hooks/use-auto-data';
import { useI18n } from '@/i18n';
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

interface DataCardProps {
    label: string;
    value: string;
    icon: React.ComponentType<{ size: number; color: string }>;
    color: string;
    delay?: number;
}

const DataCard = ({ label, value, icon: Icon, color, delay = 0 }: DataCardProps) => {
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

// Configuration object
const commonS7_200Config = {
    temperatureSensors: {
        TH: { key: "AFTER_HEATER_TEMP_Th", label: "Supply Air(TH)" },
        T0: { key: "AIR_OUTLET_TEMP", label: "After Heat(T0)" },
        T1: { key: "COLD_AIR_TEMP_T1", label: "Cold Air(T1)" },
        T2: { key: "AMBIENT_AIR_TEMP_T2", label: "Ambient(T2)" },
    },
    controls: {
        HTR: { key: "AFTER_HEAT_VALVE_RPM", label: "Heater" },
        AHT: { key: "AFTER_HEAT_VALVE_RPM", label: "After Heat(AHT)" },
        HGS: { key: "HOT_GAS_VALVE_RPM", label: "Hot Gas(HGS)" },
        BLOWER: { key: "BLOWER_RPM", label: "Blower" },
        COND: { key: "CONDENSER_RPM", label: "Condenser" },
    },
    compressor: {
        time: "COMPRESSOR_TIME",
        hp: "HP",
        lp: "LP",
    },
};

const machineConfig = {
    "GTPL-122-gT-1000T-S7-1200": {
        serialNumber: "GTPL_122_S7_1200",
        temperatureSensors: {
            T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
            T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
            T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        },
        controls: {
            AHT: { key: "AHT_valve_speed", label: "After Heat(AHT)" },
            HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
            BLOWER: { key: "Blower_speed", label: "Blower" },
        },
        compressor: {
            time: "Compressor_timer",
            hp: "HP_value",
            lp: "LP_value",
        },
    },
    "GTPL-30-gT-180E-S7-1200": {
        serialNumber: "GTPL_114",
        temperatureSensors: {
            T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
            T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
            T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
            TH: { key: "TH_temp_mean", label: "Supply Air(TH)" },
        },
        controls: {
            AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
            HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
            BLOWER: { key: "Blower_speed", label: "Blower" },
            COND: { key: "Fan_speed", label: "Condenser Fan" },
            HTR: { key: "Heater_speed", label: "Heater" },
        },
        compressor: {
            time: "Compressor_timer",
            hp: "HP_value",
            lp: "LP_value",
        },
    },
    "GTPL-115-gT-180E-S7-1200": {
        serialNumber: "GTPL_115",
        temperatureSensors: {
            T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
            T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
            T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
            TH: { key: "TH_temp_mean", label: "Supply Air(TH)" },
        },
        controls: {
            AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
            HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
            BLOWER: { key: "Blower_speed", label: "Blower" },
            COND: { key: "Fan_speed", label: "Condensor Fan" },
            HTR: { key: "Heater_speed", label: "Heater" },
        },
        compressor: {
            time: "Compressor_timer",
            hp: "HP_value",
            lp: "LP_value",
        },
    },
    "GTPL-116-gT-240E-S7-1200": {
        serialNumber: "GTPL_116",
        temperatureSensors: {
            T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
            T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
            T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
            TH: { key: "TH_temp_mean", label: "Supply Air(TH)" },
        },
        controls: {
            AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
            HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
            BLOWER: { key: "Blower_speed", label: "Blower" },
            COND: { key: "Fan_speed", label: "Condensor Fan" },
            HTR: { key: "Heater_speed", label: "Heater" },
        },
        compressor: {
            time: "Compressor_timer",
            hp: "HP_value",
            lp: "LP_value",
        },
    },
    "GTPL-117-gT-320E-S7-1200": {
        serialNumber: "GTPL_117",
        temperatureSensors: {
            T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
            T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
            T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
            TH: { key: "TH_temp_mean", label: "Supply Air(TH)" },
        },
        controls: {
            AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
            HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
            BLOWER: { key: "Blower_speed", label: "Blower" },
            COND: { key: "Fan_speed", label: "Condensor Fan" },
            HTR: { key: "Heater_speed", label: "Heater" },
        },
        compressor: {
            time: "Compressor_timer",
            hp: "HP_value",
            lp: "LP_value",
        },
    },
    "GTPL-119-gT-180E-S7-1200": {
        serialNumber: "GTPL_119",
        temperatureSensors: {
            T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
            T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
            T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
            TH: { key: "TH_temp_mean", label: "Supply Air(TH)" },
        },
        controls: {
            AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
            HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
            BLOWER: { key: "Blower_speed", label: "Blower" },
            COND: { key: "Fan_speed", label: "Condensor Fan" },
            HTR: { key: "Heater_speed", label: "Heater" },
        },
        compressor: {
            time: "Compressor_timer",
            hp: "HP_value",
            lp: "LP_value",
        },
    },
    "GTPL-120-gT-180E-S7-1200": {
        serialNumber: "GTPL_120",
        temperatureSensors: {
            T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
            T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
            T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
            TH: { key: "TH_temp_mean", label: "Supply Air(TH)" },
        },
        controls: {
            AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
            HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
            BLOWER: { key: "Blower_speed", label: "Blower" },
            COND: { key: "Fan_speed", label: "Condensor Fan" },
            HTR: { key: "Heater_speed", label: "Heater" },
        },
        compressor: {
            time: "Compressor_timer",
            hp: "HP_value",
            lp: "LP_value",
        },
    },
    "GTPL-121-gT-1000T-S7-1200": {
        serialNumber: "GTPL_121",
        temperatureSensors: {
            T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
            T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
            T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        },
        controls: {
            HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
            BLOWER: { key: "Blower_speed", label: "Blower" },

            AHT: { key: "AHT_valve_speed", label: "After Heat(AHT)" },
        },
        compressor: {
            time: "Compressor_timer",
            hp: "HP_value",
            lp: "LP_value",
        },
    },
    "GTPL-118-gT-80E-P-S7-200": {
        serialNumber: "GTPL-109",
        ...commonS7_200Config,
    },
    "GTPL-108-gT-40E-P-S7-200": {
        serialNumber: "GTPL_108",
        ...commonS7_200Config,
        controls: {
            ...commonS7_200Config.controls,
            COND: { key: "Fan_speed", label: "Condensor Fan" },
        },
    },
    "GTPL-109-gT-40E-P-S7-200": {
        serialNumber: "GTPL_109",
        ...commonS7_200Config,
        controls: {
            ...commonS7_200Config.controls,
            COND: { key: "Fan_speed", label: "Condensor Fan" },
        },
    },
    "GTPL-110-gT-40E-P-S7-200": {
        serialNumber: "GTPL_110",
        ...commonS7_200Config,
        controls: {
            ...commonS7_200Config.controls,
            COND: { key: "Fan_speed", label: "Condensor Fan" },
        },
    },
    "GTPL-111-gT-80E-P-S7-200": {
        serialNumber: "GTPL_111",
        ...commonS7_200Config,
        controls: {
            ...commonS7_200Config.controls,
            COND: { key: "Fan_speed", label: "Condensor Fan" },
        },
    },
    "GTPL-112-gT-80E-P-S7-200": {
        serialNumber: "GTPL_112",
        ...commonS7_200Config,
        controls: {
            ...commonS7_200Config.controls,
            COND: { key: "Fan_speed", label: "Condensor Fan" },
        },
    },
    "GTPL-113-gT-80E-P-S7-200": {
        serialNumber: "GTPL_113",
        ...commonS7_200Config,
        controls: {
            ...commonS7_200Config.controls,
            COND: { key: "Fan_speed", label: "Condensor Fan" },
        },
    },
    "GTPL-132-300-AP-S7-1200": {
        serialNumber: "GTPL_132",
        temperatureSensors: {
            T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
            T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
            T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        },
        controls: {
            AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
            HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
            BLOWER: { key: "Blower_speed", label: "Blower" },
            COND: { key: "Fan_speed", label: "Condensor Fan" },
        },
        compressor: {
            time: "Compressor_timer",
            hp: "HP_value",
            lp: "LP_value",
        },
    },
    "GTPL-137-GT-450T-S7-1200": {
        serialNumber: "GTPL_137",
        temperatureSensors: {
            T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
            T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
            T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        },
        controls: {
            HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
            BLOWER: { key: "Blower_speed", label: "Blower" },
            COND: { key: "Cond_fan_speed", label: "Condenser Fan" },
            AHT: { key: "AHT_valve_speed", label: "After Heat(AHT)" },
        },
        compressor: {
            time: "Compressor_timer",
            hp: "HP_value",
            lp: "LP_value",
        },
    },
    "GTPL-138-GT-450T-S7-1200": {
        serialNumber: "GTPL_138",
        temperatureSensors: {
            T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
            T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
            T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        },
        controls: {
            AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
            HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
            BLOWER: { key: "Blower_speed", label: "Blower" },
            COND: { key: "Cond_fan_speed", label: "Condenser Fan" },

        },
        compressor: {
            time: "Compressor_timer",
            hp: "HP_value",
            lp: "LP_value",
        },
    },
    "GTPL-136-gT-450AP": {
        serialNumber: "GTPL_136",
        temperatureSensors: {
            T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
            T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
            T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        },
        controls: {
            AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
            HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
            BLOWER: { key: "Blower_speed", label: "Blower" },
        },
        compressor: {
            time: "Compressor_timer",
            hp: "HP_value",
            lp: "LP_value",
        },
    },
    "GTPL-139-GT-300AP-S7-1200": {
        serialNumber: "GTPL_139",
        temperatureSensors: {
            T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
            T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
            T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        },
        controls: {
            AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
            HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
            BLOWER: { key: "Blower_speed", label: "Blower" },
            COND: { key: "Condenser_fan_speed", label: "Condenser Fan" },
        },
        compressor: {
            time: "Compressor_timer",
            hp: "HP_value",
            lp: "LP_value",
        },
    },
    "Gtpl-S7-1200-02": {
        serialNumber: "GTOL-1023",
        temperatureSensors: {
            TH: { key: "AI_TH_Act", label: "Supply Air" },
            T0: { key: "AI_AIR_OUTLET_TEMP", label: "After Heat" },
            T1: { key: "AI_COLD_AIR_TEMP", label: "Cold Air" },
            T2: { key: "AI_AMBIANT_TEMP", label: "Ambient" },
        },
        controls: {
            HTR: { key: "Value_to_Display_HEATER", label: "Heater" },
            AHT: { key: "Value_to_Display_AHT_VALE_OPEN", label: "After Heat" },
            HGS: { key: "Value_to_Display_HOT_GAS_VALVE_OPEN", label: "Hot Gas" },
            BLOWER: { key: "Value_to_Display_EVAP_ACT_SPEED", label: "Blower" },
            COND: { key: "Value_to_Display_COND_ACT_SPEED", label: "Condenser" },
        },
        compressor: {
            time: "COMPRESSOR_TIME",
            hp: "AI_COND_PRESSURE",
            lp: "AI_SUC_PRESSURE",
        },
    },
    "GTPL-142-gT-XXX-S7-1200": {
        serialNumber: "GTPL_142",
        temperatureSensors: {
            T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
            T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
            T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        },
        controls: {
            AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
            HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
            BLOWER: { key: "Blower_speed", label: "Blower" },
            COND: { key: "Fan_speed", label: "Condensor Fan" },
        },
        compressor: {
            time: "Compressor_timer",
            hp: "HP_value",
            lp: "LP_value",
        },
    },
    "GTPL-143-gT-XXX-S7-1200": {
        serialNumber: "GTPL_143",
        temperatureSensors: {
            T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
            T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
            T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        },
        controls: {
            AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
            HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
            BLOWER: { key: "Blower_speed", label: "Blower" },
            COND: { key: "Fan_speed", label: "Condensor Fan" },
        },
        compressor: {
            time: "Compressor_timer",
            hp: "HP_value",
            lp: "LP_value",
        },
    },
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

// Color mapping for different data types
const colorMap = {
    temperature: {
        T1: "#3b82f6", // Blue
        T2: "#10b981", // Green
        T3: "#f59e0b", // Amber
        T4: "#ef4444", // Red
        T0: "#8b5cf6", // Purple
        TH: "#ec4899", // Pink
        DEFAULT: "#6b7280" // Gray
    },
    speed: "#f97316", // Orange
    frequency: "#8b5cf6", // Purple
    power: "#10b981", // Green
    pressure: "#3b82f6", // Blue
    default: "#6b7280" // Gray
};

export default function AutoScreen() {
    const router = useRouter();
    const pathname = usePathname();
    const { effective } = useThemeMode();
    const { t } = useI18n();
    const insets = useSafeAreaInsets();
    const { device } = useLocalSearchParams<{ device: string }>();

    const { data, isConnected, error, formatValue } = useAutoData(device || '');


      // Check for special modes
  const isGrainChilling = pathname.includes("auto-grain");
  const isPaddyChilling = pathname.includes("auto-paddy");
  const isSpecialMachine = device?.includes('GTPL-137-GT-450T-S7-1200') || device?.includes('GTPL-138-GT-450T-S7-1200') || device?.includes('GTPL-134-gT-450T-S7-1200') || device?.includes("GTPL-061-gT-450T-S7-1200") || device?.includes('GTPL-121-gT-1000T-S7-1200') || device?.includes('GTPL-122-gT-1000T-S7-1200') || device?.includes('GTPL-124-GT-450T-S7-1200') || device?.includes('GTPL-131-GT-650T-S7-1200') || false;

  // Get configuration for the current device
  const currentConfig = device ? 
    machineConfig[device as keyof typeof machineConfig] || 
    machineConfig["GTPL-122-gT-1000T-S7-1200"] : 
    machineConfig["GTPL-122-gT-1000T-S7-1200"];

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

  // Get T1/T0 value based on machine type and mode
  const getT1T0Value = () => {
    if (!data) return '--';
    
    if (device?.includes("GTPL-061-gT-450T-S7-1200")) {
      return data?.T1_set_point ||
        data?.T1_temp_mean ||
        data?.COLD_AIR_TEMP_T1 ||
        data?.T1_SET_POINT || '--';
    } else if (isSpecialMachine) {
      if (isGrainChilling) {
        return data?.T0_set_point ||
          data?.AIR_OUTLET_TEMP ||
          data?.T1_set_point_in_grain_chilling_mode || 
          data?.T0_set_point_in_grain_chilling_mode || '--';
      } else if (isPaddyChilling) {
        return data?.T0_set_point ||
          data?.AIR_OUTLET_TEMP ||
          data?.T1_set_point_in_paddy_aeging_mode || 
          data?.T0_set_point_in_paddy_aeging_mode || '--';
      } else {
        return data?.T0_set_point ||
          data?.AIR_OUTLET_TEMP ||
          data?.T1_set_point_in_paddy_aeging_mode || 
          data?.T0_temp_mean || '--';
      }
    } else {
      return data?.T1_set_point ||
        data?.T1_temp_mean ||
        data?.T1_SET_POINT ||
        data?.Delta_T_set_point_paddy_aeging_mode || '--';
    }
  };

  // Get T Delta value based on machine type and mode
  const getTDeltaValue = () => {
    if (!data) return '--';
    
    if (isSpecialMachine) {
      if (isGrainChilling) {
        return data?.Delta_T_set_point ||
          data?.Th_T1 ||
          data?.Delta_T_set_point_in_grain_chilling_mode || '--';
      } else if (isPaddyChilling) {
        return data?.Delta_T_set_point ||
          data?.Th_T1 ||
          data?.Delta_T_set_point_paddy_aeging_mode || '--';
      } else {
        return data?.Delta_T_set_point ||
          data?.Th_T1 ||
          data?.Delta_T_set_point_in_grain_chilling_mode ||
          data?.Delta_T_set_point_paddy_aeging_mode || '--';
      }
    } else if (device?.includes("GTPL-061-gT-450T-S7-1200")) {
      return data?.T0_T1_set_point || 
        data?.AIR_OUTLET_TEMP || 
        data?.COLD_AIR_TEMP_T1 || 
        data?.T1_temp_mean || '--';
    } else {
      return data?.AI_TH_Act || 
        data?.Th_T1 || 
        data?.TH_T1_set_point || '--';
    }
  };

  // Get label for T1/T0 card
  const getT1T0Label = () => {
    if (device?.includes("GTPL-061-gT-450T-S7-1200")) {
      return "T1 Set Point";
    } else if (isSpecialMachine) {
      return "T0";
    } else {
      return "T1";
    }
  };

  // Get label for T Delta card
  const getTDeltaLabel = () => {
    if (device?.includes("GTPL-061-gT-450T-S7-1200")) {
      return "T0 - T1";
    } else if (isSpecialMachine) {
      return "T Delta";
    } else {
      return "TH - T1";
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
    Object.entries(sensors).forEach(([sensorKey, sensorConfig], index) => {
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



    // Get control cards based on configuration
    const getControlCards = () => {
        const controls = currentConfig.controls;
        const heaterDevices = ['GTPL-120-gT-180E-S7-1200', 'GTPL-116-gT-240E-S7-1200', 'GTPL-115-gT-180E-S7-1200', 'GTPL-30-gT-180E-S7-1200', 'GTPL-117-gT-320E-S7-1200', 'GTPL-119-gT-180E-S7-1200', 'GTPL-121-gT-1000T-S7-1200'];
        const s7_200_machines = ['GTPL-118-gT-80E-P-S7-200', 'GTPL-108-gT-40E-P-S7-200', 'GTPL-109-gT-40E-P-S7-200', 'GTPL-110-gT-40E-P-S7-200', 'GTPL-111-gT-80E-P-S7-200', 'GTPL-112-gT-80E-P-S7-200', 'GTPL-113-gT-80E-P-S7-200'];
        
        // Check if current device is in the heater devices list
        const hasSpecialHeater = heaterDevices.includes(device || '');
        // Check if current device is S7-200 (should not show heater)
        const isS7_200 = s7_200_machines.includes(device || '');
        
        return Object.entries(controls).map(([controlKey, controlConfig], index) => {
            // Skip heater for devices that have special heater handling or are S7-200
            if (controlKey === 'HTR' && (hasSpecialHeater || isS7_200)) {
                return null; // Skip heater control
            }
            
            const rawValue = getValueByKey(controlConfig.key);
            const value = controlKey === 'HTR' ? formatHeaterValue(rawValue) : rawValue;
            const icon = controlKey === 'BLOWER' || controlKey === 'COND' ? 
                        iconMap.speed : iconMap.default;
            const color = colorMap.speed;
            const unit = controlKey === 'BLOWER' || controlKey === 'COND' ? '%' : (controlKey === 'HTR' ? '' : '%');
            
            return (
                <DataCard
                    key={`control-${controlKey}`}
                    label={controlConfig.label}
                    value={formatValue(value, unit)}
                    icon={icon}
                    color={color}
                    delay={(Object.keys(currentConfig.temperatureSensors).length + index) * 100}
                />
            );
        }).filter(Boolean); // Filter out null values
    };
    
    // Get compressor cards based on configuration
    const getCompressorCards = () => {
        const compressor = currentConfig.compressor;
        const cards = [];
        
        // Determine pressure unit based on device model
        const pressureUnit = device && (device.includes('GTPL-137') || device.includes('GTPL-138')) ? 'bar' : 'psi';
        
        // High Pressure
        if (compressor.hp) {
            cards.push({
                key: 'comp-hp',
                label: 'High Pressure',
                value: getValueByKey(compressor.hp),
                icon: iconMap.pressure,
                color: colorMap.pressure,
                unit: pressureUnit
            });
        }
        
        // Low Pressure
        if (compressor.lp) {
            cards.push({
                key: 'comp-lp',
                label: 'Low Pressure',
                value: getValueByKey(compressor.lp),
                icon: iconMap.pressure,
                color: colorMap.pressure,
                unit: pressureUnit
            });
        }
        
        // Special heater component for specific devices after LP
        const heaterDevices = ['GTPL-120-gT-180E-S7-1200', 'GTPL-116-gT-240E-S7-1200', 'GTPL-115-gT-180E-S7-1200', 'GTPL-30-gT-180E-S7-1200', 'GTPL-117-gT-320E-S7-1200', 'GTPL-119-gT-180E-S7-1200', 'GTPL-121-gT-1000T-S7-1200'];
        const s7_200_machines = ['GTPL-118-gT-80E-P-S7-200', 'GTPL-108-gT-40E-P-S7-200', 'GTPL-109-gT-40E-P-S7-200', 'GTPL-110-gT-40E-P-S7-200', 'GTPL-111-gT-80E-P-S7-200', 'GTPL-112-gT-80E-P-S7-200', 'GTPL-113-gT-80E-P-S7-200'];
        
        if (heaterDevices.includes(device || '') && !s7_200_machines.includes(device || '') && 'HTR' in currentConfig.controls && currentConfig.controls.HTR) {
            const heaterControl = currentConfig.controls.HTR;
            const rawHeaterValue = getValueByKey(heaterControl.key);
            const heaterValue = formatHeaterValue(rawHeaterValue);
            cards.push({
                key: 'heater-after-lp',
                label: 'Heater',
                value: heaterValue,
                icon: iconMap.power,
                color: colorMap.power,
                unit: ''
            });
        }
        
        return cards.map((card, index) => {
            const totalItems = Object.keys(currentConfig.temperatureSensors).length + 
                              Object.keys(currentConfig.controls).length;
            return (
                <DataCard
                    key={card.key}
                    label={card.label}
                    value={formatValue(card.value, card.unit)}
                    icon={card.icon}
                    color={card.color}
                    delay={(totalItems + index) * 100}
                />
            );
        });
    };

    if (!data) {
        return <LoadingScreen />;
    }

    return (
        <ThemedView style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <ChevronLeft size={24} color={effective === 'dark' ? '#ffffff' : '#000000'} />
                </TouchableOpacity>
                <View>
                    <ThemedText style={styles.headerTitle}>AUTO MODE</ThemedText>
                    <ThemedText style={styles.headerSubtitle}>{device}</ThemedText>
                    {/* <ThemedText style={styles.configInfo}>
                        Config: {currentConfig.serialNumber}
                    </ThemedText> */}
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
                <View style={styles.grid}>
                    {/* Temperature Sensors */}
                    {getTemperatureCards()}
                    
                    {/* Controls */}
                    {getControlCards()}
                    
                    {/* Compressor Info - includes HP, LP, and Heater */}
                    {getCompressorCards()}
                </View>

                {/* <View style={styles.actionSection}>
                    <TouchableOpacity
                        style={[
                            styles.controlButton,
                            { backgroundColor: data?.AUTO_START ? '#ef4444' : '#10b981' }
                        ]}
                    >
                        <Power size={24} color="#ffffff" />
                        <ThemedText style={styles.controlButtonText}>
                            {data?.AUTO_START ? 'STOP MACHINE' : 'START MACHINE'}
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
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    dataCard: {
        width: (width - 56) / 2,
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