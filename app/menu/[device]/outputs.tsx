import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAutoData } from '@/hooks/use-auto-data';
import { useI18n } from '@/i18n';
import { useThemeMode } from '@/providers/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    Activity,
    AlertTriangle,
    CheckCircle,
    ChevronLeft,
    Cpu,
    Power,
    Settings,
    XCircle,
    Zap
} from 'lucide-react-native';
import React from 'react';
import {
    Dimensions,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const getOutputsConfig = (deviceType: string) => {
    if (deviceType === "GTPL-122-gT-1000T-S7-1200" || deviceType === "GTPL-121-gT-1000T-S7-1200") {
      return [
        { id: "Q0.0", description: "Compressor Start", dataKey: "Compressor_start_Q0_0" },
        { id: "Q0.1", description: "Compressor Module Reset", dataKey: "Compressor_module_reset_Q0_1" },
        { id: "Q0.2", description: "CR Valve 25% ON", dataKey: "CR_valve_25_percent_ON_Q0_2" },
        { id: "Q0.3", description: "CR Valve 50% ON", dataKey: "CR_valve_50_percent_ON_Q0_3" },
        { id: "Q0.4", description: "Solenoid Valve ON", dataKey: "Solenoid_valve_ON_Q0_4" },
        { id: "Q0.5", description: "Hot Gas Valve ON", dataKey: "Hot_gas_valve_ON_Q0_5" },
        { id: "Q0.6", description: "AHT Valve ON", dataKey: "AHT_valve_ON_Q0_6" },
        { id: "Q0.7", description: "Blower Drive Start", dataKey: "Blower_drive_start_Q0_7" },
        { id: "Q1.0", description: "System Warning", dataKey: "System_warning_Q1_0" },
        { id: "Q1.1", description: "Chiller Healthy", dataKey: "Chiller_healthy_Q1_1" },
        { id: "Q2.1", description: "Cond Fan 1 ON", dataKey: "Cond_fan_1_ON_Q2_1" },
        { id: "Q2.2", description: "CR Valve 75% ON", dataKey: "CR_valve_75_percent_ON_Q2_2" },
        { id: "Q2.3", description: "Chiller Fault", dataKey: "Chiller_fault_Q2_3" },
        { id: "Q2.4", description: "Cond Fan 2 ON", dataKey: "Cond_fan_2_ON_Q2_4" },
        { id: "Q2.5", description: "Cond Fan 3 ON", dataKey: "Cond_fan_3_ON_Q2_5" },
        { id: "Q2.6", description: "Cond Fan 4 ON", dataKey: "Cond_fan_4_ON_Q2_6" },
        { id: "Q2.7", description: "CR Valve 100% ON", dataKey: "CR_valve_100_percent_ON_Q2_7" },
        { id: "Q3.0", description: "Cond Fan 5 ON", dataKey: "Cond_fan_5_ON_Q3_0" },
        { id: "Q3.1", description: "Cond Fan 6 ON", dataKey: "Cond_fan_6_ON_Q3_1" },
      ];
    }
    else if (deviceType === "GTPL-118-gT-80E-P-S7-200" || deviceType === "GTPL-108-gT-40E-P-S7-200" || deviceType === "GTPL-109-gT-40E-P-S7-200" || deviceType === "GTPL-110-gT-40E-P-S7-200" || deviceType === "GTPL-111-gT-80E-P-S7-200" || deviceType === "GTPL-112-gT-80E-P-S7-200" || deviceType === "GTPL-113-gT-80E-P-S7-200") {
      return [
        { id: "1", description: "Blower Drive", dataKey: "BLOWER_DRIVE_ENABLE" },
        { id: "2", description: "Heater Drive", dataKey: "heater_on" },
        { id: "3", description: "Condensor", dataKey: "cond_fan_on" },
        { id: "4", description: "Compressor", dataKey: "COMPRESSOR_ON" },
        { id: "5", description: "Hot Gas Valve", dataKey: "HOT_GAS_VALVE_ON" },
        { id: "6", description: "After Heat Valve", dataKey: "AFTER_HEAT_VALVE_ON" },
        { id: "7", description: "Chiller Healthy", dataKey: "GREEN_LIGHT" },
        { id: "8", description: "Chiller Warning", dataKey: "YELLOW_LIGHT" },
        { id: "9", description: "Chiller Fault", dataKey: "RED_LIGHT" },
        { id: "10", description: "Buzzer on", dataKey: "BUZZER_ON" },
      ];
    }
    else if (deviceType === "GTPL-116-gT-240E-S7-1200" || deviceType === "GTPL-117-gT-320E-S7-1200") {
      return [
        { id: "1", description: "Blower drive on", dataKey: "Blower_drive_on_Q0_0" },
        { id: "2", description: "Condenser fan1 on", dataKey: "Condenser_fan1_on_Q0_1" },
        { id: "3", description: "Heater drive on", dataKey: "Heater_drive_on_Q0_2" },
        { id: "4", description: "Condenser fan drive on", dataKey: "Condenser_fan_drive_on_Q0_3" },
        { id: "5", description: "Compressor on", dataKey: "Compressor_on_Q0_4" },
        { id: "6", description: "Compressor reset on", dataKey: "Compressor_reset_on_Q0_5" },
        { id: "7", description: "Solenoid valve on", dataKey: "Solenoid_valve_on_Q0_6" },
        { id: "8", description: "Hot gas valve on", dataKey: "Hot_gas_valve_on_Q0_7" },
        { id: "9", description: "After heat motor valve on", dataKey: "After_heat_motor_valve_on_Q1_0" },
        { id: "10", description: "Chiller healthy on", dataKey: "Chiller_healthy_on_Q1_1" },
        { id: "11", description: "Chiller Fault on", dataKey: "Chiller_Fault_on_Q2_0" },
        { id: "12", description: "Collective Trouble Signal on", dataKey: "Collective_Trouble_Signal_on_Q2_1" },
        { id: "13", description: "Buzzer on", dataKey: "Buzzer_on_Q2_2" },
        { id: "14", description: "Condenser fan2 on", dataKey: "Condenser_fan2_on_Q2_3" },
      ];
    }
    else if (deviceType === "GTPL-115-gT-180E-S7-1200" || deviceType === 'GTPL-30-gT-180E-S7-1200') {
      return [
        { id: "1", description: "Blower drive", dataKey: "Blower_drive_on_Q0_0" },
        { id: "2", description: "Heater drive", dataKey: "Heater_drive_on_Q0_2" },
        { id: "3", description: "Condenser fan drive", dataKey: "Condenser_fan_drive_on_Q0_3" },
        { id: "4", description: "Compressor", dataKey: "Compressor_on_Q0_4" },
        { id: "5", description: "Compressor reset", dataKey: "Compressor_reset_on_Q0_5" },
        { id: "6", description: "Solenoid valve", dataKey: "Solenoid_valve_on_Q0_6" },
        { id: "7", description: "Hot gas valve", dataKey: "Hot_gas_valve_on_Q0_7" },
        { id: "8", description: "After heat motor valve", dataKey: "After_heat_motor_valve_on_Q1_0" },
        { id: "9", description: "Chiller healthy", dataKey: "Chiller_healthy_on_Q1_1" },
        { id: "10", description: "Chiller Fault", dataKey: "Chiller_Fault_on_Q2_0" },
        { id: "11", description: "Collective Trouble Signal", dataKey: "Collective_Trouble_Signal_on_Q2_1" },
        { id: "12", description: "Buzzer on", dataKey: "Buzzer_on_Q2_2" },
      ];
    }
    else if (deviceType === "GTPL-132-300-AP-S7-1200") {
      return [
        { id: "Q0.0", description: "Compressor_on", dataKey: "Compressor_on_Q0_0" },
        { id: "Q0.1", description: "Compressor_motor_reset", dataKey: "Compressor_motor_reset_Q0_1" },
        { id: "Q0.2", description: "CR_valve_25%_on", dataKey: "CR_valve_25%_on_Q0_2" },
        { id: "Q0.3", description: "CR_valve_50%_on", dataKey: "CR_valve_50%_on_Q0_3" },
        { id: "Q0.4", description: "Solenoid_valve_on", dataKey: "Solenoid_valve_on_Q0_4" },
        { id: "Q0.5", description: "Hot_gas_valve_on", dataKey: "Hot_gas_valve_on_Q0_5" },
        { id: "Q0.6", description: "After_heat_valve_on", dataKey: "After_heat_valve_on_Q0_6" },
        { id: "Q0.7", description: "Blower_drive_on", dataKey: "Blower_drive_on_Q0_7" },
        { id: "Q1.0", description: "Collective_trouble_signal", dataKey: "Collective_trouble_signal_Q1_0" },
        { id: "Q1.1", description: "Chiller_healthy_on", dataKey: "Chiller_healthy_on_Q1_1" },
        { id: "Q2.0", description: "Spare", dataKey: "Spare_Q2_0" },
        { id: "Q2.1", description: "Condenser_fan1_on", dataKey: "Condenser_fan1_on_Q2_1" },
        { id: "Q2.2", description: "CR valve 75% on", dataKey: "CR valve 75% on_Q2_2" },
        { id: "Q2.3", description: "Chiller_fault", dataKey: "Chiller_Fault_Q2_3" },
        { id: "Q2.4", description: "Condenser_fan2_on", dataKey: "Condenser_fan2_on_Q2_4" },
        { id: "Q2.5", description: "CR_valve_100%_on", dataKey: "CR_valve_100%_on_Q2_5" },
        { id: "Q2.6", description: "Spare", dataKey: "Spare_Q2_6" },
      ];
    }
    else if (deviceType === "GTPL-124-GT-450T-S7-1200") {
      return [
        { id: "1", description: "Compressor", dataKey: "Compressor_on_Q0_0" },
        { id: "2", description: "Compressor motor reset", dataKey: "Compressor_motor_reset_Q0_1" },
        { id: "3", description: "Spare", dataKey: "Spare_Q0_2" },
        { id: "4", description: "Spare", dataKey: "Spare_Q0_3" },
        { id: "5", description: "Solenoid valve", dataKey: "Solenoid_valve_on_Q0_4" },
        { id: "6", description: "Hot gas valve", dataKey: "Hot_gas_valve_on_Q0_5" },
        { id: "7", description: "After heat valve", dataKey: "After_heat_valve_on_Q0_6" },
        { id: "8", description: "Blower drive", dataKey: "Blower_drive_on_Q0_7" },
        { id: "9", description: "Collective trouble signal", dataKey: "Collective_trouble_signal_Q1_0" },
        { id: "10", description: "Chiller healthy", dataKey: "Chiller_healthy_on_Q1_1" },
        { id: "11", description: "Spare", dataKey: "Spare_Q2_0" },
        { id: "12", description: "Condenser fan 1", dataKey: "Condenser_fan1_on_Q2_1" },
        { id: "13", description: "Spare", dataKey: "Spare_Q2_2" },
        { id: "14", description: "Chiller fault", dataKey: "Chiller_fault_Q2_3" },
        { id: "15", description: "Condenser fan 2", dataKey: "Condenser_fan2_on_Q2_4" },
        { id: "16", description: "Condenser fan 3", dataKey: "Condenser_fan3_on_Q2_5" },
        { id: "17", description: "Condenser fan 4", dataKey: "Condenser_fan4_on_Q2_6" },
      ];
    }
    else if (deviceType === "GTPL-136-gT-450AP") {
      return [
        { id: "Q0.0", description: "Compressor on", dataKey: "Compressor_on_Q0_0" },
        { id: "Q0.1", description: "Compressor motor reset", dataKey: "Compressor_motor_reset_Q0_1" },
        { id: "Q0.2", description: "CR valve 25% on", dataKey: "CR_valve_25_on_Q0_2" },
        { id: "Q0.3", description: "CR valve 50% on", dataKey: "CR_valve_50_on_Q0_3" },
        { id: "Q0.4", description: "Solenoid valve on", dataKey: "Solenoid_valve_on_Q0_4" },
        { id: "Q0.5", description: "Hot gas valve on", dataKey: "Hot_gas_valve_on_Q0_5" },
        { id: "Q0.6", description: "After heat valve on", dataKey: "After_heat_valve_on_Q0_6" },
        { id: "Q0.7", description: "Blower drive on", dataKey: "Blower_drive_on_Q0_7" },
        { id: "Q1.0", description: "Collective Trouble Signal", dataKey: "Collective_Trouble_Signal_Q1_0" },
        { id: "Q1.1", description: "Chiller healthy on", dataKey: "Chiller_healthy_on_Q1_1" },
        { id: "Q2.0", description: "Spare", dataKey: "Spare_Q2_0" },
        { id: "Q2.1", description: "Condenser fan1 on", dataKey: "Condenser_fan1_on_Q2_1" },
        { id: "Q2.2", description: "CR valve 75% on", dataKey: "CR_valve_75_on_Q2_2" },
        { id: "Q2.3", description: "Chiller Fault", dataKey: "Chiller_Fault_Q2_3" },
        { id: "Q2.4", description: "Condenser fan2 on", dataKey: "Condenser_fan2_on_Q2_4" },
        { id: "Q2.5", description: "Condenser fan3 on", dataKey: "Condenser_fan3_on_Q2_5" },
        { id: "Q2.6", description: "Condenser fan4 on", dataKey: "Condenser_fan4_on_Q2_6" },
        { id: "Q2.7", description: "CR valve 100% on", dataKey: "CR_valve_100_on_Q2_7" },
      ];
    }
    else if (deviceType === "GTPL-137-GT-450T-S7-1200" || deviceType === "GTPL-138-GT-450T-S7-1200") {
      return [
        { id: "1", description: "Compressor", dataKey: "Compressor_on_Q0_0" },
        { id: "2", description: "Compressor motor reset", dataKey: "Compressor_motor_reset_Q0_1" },
        { id: "3", description: "Spare", dataKey: "Spare_Q0_2" },
        { id: "4", description: "Spare", dataKey: "Spare_Q0_3" },
        { id: "5", description: "Solenoid valve", dataKey: "Solenoid_valve_on_Q0_4" },
        { id: "6", description: "Hot gas valve", dataKey: "Hot_gas_valve_on_Q0_5" },
        { id: "7", description: "After heat valve", dataKey: "After_heat_valve_on_Q0_6" },
        { id: "8", description: "Blower drive", dataKey: "Blower_drive_on_Q0_7" },
        { id: "9", description: "Collective trouble signal", dataKey: "Collective_trouble_signal_Q1_0" },
        { id: "10", description: "Chiller healthy", dataKey: "Chiller_healthy_on_Q1_1" },
        { id: "11", description: "Spare", dataKey: "Spare_Q2_0" },
        { id: "12", description: "Condenser fan 1", dataKey: "Condenser_fan1_on_Q2_1" },
        { id: "13", description: "CR valve 75% on", dataKey: "CR valve 75% on_Q2_2" },
        { id: "14", description: "Chiller fault", dataKey: "Chiller_fault_Q2_3" },
        { id: "15", description: "Condenser fan 2", dataKey: "Condenser_fan2_on_Q2_4" },
        { id: "16", description: "Condenser fan 3", dataKey: "Condenser_fan3_on_Q2_5" },
        { id: "17", description: "Condenser fan 4", dataKey: "Condenser_fan4_on_Q2_6" },
      ];
    }
    else if (deviceType === "GTPL-061-gT-450T-S7-1200") {
      return [
        { id: "Q0.0", description: "Compressor on", dataKey: "Compressor_on_Q0_0" },
        { id: "Q0.1", description: "Compressor motor reset", dataKey: "Compressor_motor_reset_Q0_1" },
        { id: "Q0.2", description: "CR 25% ON", dataKey: "CR_25%_ON_Q0_2" },
        { id: "Q0.3", description: "CR 50% ON", dataKey: "CR_50%_ON_Q0_3" },
        { id: "Q0.4", description: "Solenoid valve on", dataKey: "Solenoid_valve_on_Q0_4" },
        { id: "Q0.5", description: "Hot gas valve on", dataKey: "Hot_gas_valve_on_Q0_5" },
        { id: "Q0.6", description: "After heat valve on", dataKey: "After_heat_valve_on_Q0_6" },
        { id: "Q0.7", description: "Blower drive on", dataKey: "Blower_drive_on_Q0_7" },
        { id: "Q1.0", description: "Collective trouble signal", dataKey: "Collective_trouble_signal_Q1_0" },
        { id: "Q1.1", description: "Chiller healthy on", dataKey: "Chiller_healthy_on_Q1_1" },
        { id: "Q2.0", description: "Spare", dataKey: "Spare_Q2_0" },
        { id: "Q2.1", description: "Condenser fan1 on", dataKey: "Condenser_fan1_on_Q2_1" },
        { id: "Q2.2", description: "CR valve 75% on", dataKey: "CR valve 75% on_Q2_2" },
        { id: "Q2.3", description: "Chiller fault", dataKey: "Chiller_fault_Q2_3" },
        { id: "Q2.4", description: "Condenser fan2 on", dataKey: "Condenser_fan2_on_Q2_4" },
        { id: "Q2.5", description: "Condenser fan3 on", dataKey: "Condenser_fan3_on_Q2_5" },
        { id: "Q2.6", description: "Condenser fan4 on", dataKey: "Condenser_fan4_on_Q2_6" },
        { id: "Q2.7", description: "CR 100% ON", dataKey: "CR_100%_ON_Q2_7" },
      ];
    }
    else if (deviceType === "GTPL-139-GT-300AP-S7-1200") {
      return [
        { id: "Q0.0", description: "Compressor on", dataKey: "Compressor_on_Q0_0" },
        { id: "Q0.1", description: "Compressor motor reset", dataKey: "Compressor_motor_reset_Q0_1" },
        { id: "Q0.2", description: "CR valve 25% on", dataKey: "CR_valve_25_on_Q0_2" },
        { id: "Q0.3", description: "CR valve 50% on", dataKey: "CR_valve_50_on_Q0_3" },
        { id: "Q0.4", description: "Solenoid valve on", dataKey: "Solenoid_valve_on_Q0_4" },
        { id: "Q0.5", description: "Hot gas valve on", dataKey: "Hot_gas_valve_on_Q0_5" },
        { id: "Q0.6", description: "After heat valve on", dataKey: "After_heat_valve_on_Q0_6" },
        { id: "Q0.7", description: "Blower drive on", dataKey: "Blower_drive_on_Q0_7" },
        { id: "Q1.0", description: "Collective Trouble Signal", dataKey: "Collective_Trouble_Signal_Q1_0" },
        { id: "Q1.1", description: "Chiller healthy on", dataKey: "Chiller_healthy_on_Q1_1" },
        { id: "Q2.0", description: "Spare", dataKey: "Spare_Q2_0" },
        { id: "Q2.1", description: "Condenser fan1 on", dataKey: "Condenser_fan1_on_Q2_1" },
        { id: "Q2.2", description: "CR valve 75% on", dataKey: "CR_valve_75_on_Q2_2" },
        { id: "Q2.3", description: "Chiller Fault", dataKey: "Chiller_Fault_Q2_3" },
        { id: "Q2.4", description: "Condenser fan2 on", dataKey: "Condenser_fan2_on_Q2_4" },
        { id: "Q2.5", description: "Spare", dataKey: "Spare_Q2_5" },
        { id: "Q2.6", description: "Spare", dataKey: "Spare_Q2_6" },
        { id: "Q2.7", description: "CR valve 100% on", dataKey: "CR_valve_100_on_Q2_7" },
      ];
    }

    return [];
};

export default function OutputsScreen() {
    const router = useRouter();
    const { effective } = useThemeMode();
    const { t } = useI18n();
    const insets = useSafeAreaInsets();
    const { device } = useLocalSearchParams<{ device: string }>();

    const { data, isConnected, error } = useAutoData(device || '');
    const outputs = getOutputsConfig(device || '');

    const handleBack = () => router.back();

    const getStatus = (dataKey: string) => {
        if (!data) return false;
        const value = data?.[0]?.[dataKey];

        if (device === "GTPL-118-gT-80E-P-S7-200") {
            return value === "tr";
        }

        if (device === "GTPL-122-gT-1000T-S7-1200" || device === "GTPL-121-gT-1000T-S7-1200") {
            return value === "true" || value === 1 || value === "1" || value === true || value === "True";
        }

        if (device === "GTPL-115-gT-180E-S7-1200") {
            return value === true || value === 1 || value === "1" || value === "True" || value === "true";
        }

        if (device === "GTPL-116-gT-240E-S7-1200" || device === "GTPL-117-gT-320E-S7-1200") {
            return value === true || value === 1 || value === "1" || value === "True" || value === "true";
        }
        
        if (device === "GTPL-136-gT-450AP") {
            return value === true || value === 1 || value === "1" || value === "True" || value === "true";
        }

        if (device === "GTPL-139-GT-300AP-S7-1200") {
            return value === true || value === 1 || value === "1" || value === "True" || value === "true";
        }

        return value === true || value === 1 || value === "1" || value === "tr" || value === "True" || value === "true";
    };

    const getStatusIcon = (key: string, status: boolean) => {
        if (key.includes("healthy") || key.includes("Healthy") || key.includes("GREEN_LIGHT")) {
            return status ? 
                <CheckCircle size={16} color="#10b981" /> : 
                <XCircle size={16} color="#ef4444" />;
        }
        if (key.includes("fault") || key.includes("Fault") || key.includes("RED_LIGHT")) {
            return status ? 
                <XCircle size={16} color="#ef4444" /> : 
                <CheckCircle size={16} color="#10b981" />;
        }
        if (key.includes("warning") || key.includes("Warning") || key.includes("YELLOW_LIGHT")) {
            return status ? 
                <AlertTriangle size={16} color="#f59e0b" /> : 
                <CheckCircle size={16} color="#10b981" />;
        }
        return status ? 
            <Power size={16} color="#10b981" /> : 
            <Power size={16} color="#64748b" />;
    };

    const getOutputIcon = (description: string) => {
        if (description.toLowerCase().includes('compressor')) return <Zap size={16} color="#3b82f6" />;
        if (description.toLowerCase().includes('fan')) return <Activity size={16} color="#06b6d4" />;
        if (description.toLowerCase().includes('valve')) return <Settings size={16} color="#8b5cf6" />;
        if (description.toLowerCase().includes('blower')) return <Activity size={16} color="#10b981" />;
        if (description.toLowerCase().includes('heater')) return <Zap size={16} color="#f97316" />;
        return <Power size={16} color="#64748b" />;
    };

    const renderItem = ({ item }: any) => {
        const isActive = getStatus(item.dataKey);

        return (
            <View
                style={[
                    styles.outputCard,
                    {
                        backgroundColor: effective === 'dark' ? '#1e293b' : '#ffffff',
                        borderColor: isActive ? '#10b98130' : 'rgba(0,0,0,0.05)'
                    }
                ]}
            >
                <View style={styles.outputHeader}>
                    <View style={[styles.idBadge, { backgroundColor: isActive ? '#10b98110' : '#64748b10' }]}>
                        <ThemedText style={[styles.idText, { color: isActive ? '#10b981' : '#64748b' }]}>
                            {item.id}
                        </ThemedText>
                    </View>
                    
                    <View style={styles.iconRow}>
                        {getOutputIcon(item.description)}
                        {getStatusIcon(item.dataKey, isActive)}
                    </View>
                </View>

                <View style={styles.outputInfo}>
                    <ThemedText style={styles.outputDescription}>{item.description}</ThemedText>
                    <ThemedText style={styles.dataKeyText}>{item.dataKey}</ThemedText>
                </View>

                <View style={styles.statusContainer}>
                    <View style={[styles.statusToggle, { backgroundColor: isActive ? '#10b981' : '#cbd5e1' }]}>
                        <View style={[styles.toggleCircle, { transform: [{ translateX: isActive ? 20 : 0 }] }]} />
                    </View>
                    <ThemedText style={[styles.statusLabel, { color: isActive ? '#10b981' : '#64748b' }]}>
                        {isActive ? 'ON' : 'OFF'}
                    </ThemedText>
                </View>
            </View>
        );
    };

    return (
        <ThemedView style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <ChevronLeft size={24} color={effective === 'dark' ? '#ffffff' : '#000000'} />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <ThemedText style={styles.headerTitle}>OUTPUT CONTROL</ThemedText>
                    <ThemedText style={styles.headerSubtitle}>{device} • Real-time Monitoring</ThemedText>
                </View>
                <View style={styles.iconContainer}>
                    <Cpu size={24} color={effective === 'dark' ? '#3b82f6' : '#2563eb'} />
                </View>
            </View>

            <FlatList
                data={outputs}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={styles.listHeader}>
                        <View style={[styles.connectionStatus, { backgroundColor: isConnected ? '#10b98115' : '#ef444415' }]}>
                            <View style={[styles.statusDot, { backgroundColor: isConnected ? '#10b981' : '#ef4444' }]} />
                            <ThemedText style={[styles.connectionText, { color: isConnected ? '#10b981' : '#ef4444' }]}>
                                {isConnected ? 'System Connected' : 'System Offline'}
                            </ThemedText>
                        </View>
                    </View>
                }
            />

            <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
                <View style={styles.footerButtons}>
                    <TouchableOpacity
                        style={[styles.footerButton, { backgroundColor: '#3b82f6' }]}
                        onPress={() => router.push(`/menu/${device}/inputs`)}
                    >
                        <Settings size={20} color="#ffffff" />
                        <ThemedText style={styles.footerButtonText}>Inputs</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.footerButton, { backgroundColor: '#f59e0b' }]}
                        onPress={() => router.push(`/menu/${device}/inputs/analog`)}
                    >
                        <Activity size={20} color="#ffffff" />
                        <ThemedText style={styles.footerButtonText}>Analog</ThemedText>
                    </TouchableOpacity>
                </View>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
    },
    headerSubtitle: {
        fontSize: 12,
        opacity: 0.6,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContent: {
        padding: 20,
    },
    listHeader: {
        marginBottom: 20,
    },
    connectionStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 8,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    connectionText: {
        fontSize: 13,
        fontWeight: '700',
    },
    outputCard: {
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    outputHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    idBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    idText: {
        fontSize: 12,
        fontWeight: '900',
        fontFamily: 'monospace',
    },
    iconRow: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    outputInfo: {
        marginBottom: 16,
    },
    outputDescription: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 4,
    },
    dataKeyText: {
        fontSize: 10,
        opacity: 0.5,
        fontFamily: 'monospace',
    },
    statusContainer: {
        alignItems: 'center',
        gap: 8,
    },
    statusToggle: {
        width: 44,
        height: 24,
        borderRadius: 12,
        padding: 2,
    },
    toggleCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#ffffff',
    },
    statusLabel: {
        fontSize: 12,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: 'transparent',
    },
    footerButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    footerButton: {
        flex: 1,
        height: 56,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        elevation: 4,
    },
    footerButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '700',
    },
});