import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useDeviceReports } from "@/hooks/use-device-reports";
import { useThemeMode, useThemeTokens } from "@/providers/theme";
import {
  AlertCircle,
  ChevronDown,
  Download,
  FileText,
  X
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Calendar } from 'react-native-calendars';

const BASE_URL = 'https://grain-backend-1.onrender.com';

// Import device data matching your web app
const allDevices = [
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
  "GTPL-124-GT-450T-S7-1200",
  "GTPL-131-GT-650T-S7-1200",
  "GTPL-132-300-AP-S7-1200",
  "GTPL-134-GT-450T-S7-1200",
  "GTPL-135-GT-450T-S7-1200",
  "GTPL-137-GT-450T-S7-1200",
  "GTPL-138-GT-450T-S7-1200",
  "GTPL-139-GT-300AP-S7-1200",
  "GTPL-061-gT-450T-S7-1200",
];

// Device to table mapping
const DEVICE_TO_TABLE_MAP: Record<string, string> = {
  "GTPL-122-gT-1000T-S7-1200": "gtpl_122_s7_1200_01",
  "GTPL-108-gT-40E-P-S7-200": "GTPL_108_gT_40E_P_S7_200_Germany",
  "GTPL-109-gT-40E-P-S7-200": "GTPL_109_gT_40E_P_S7_200_Germany",
  "GTPL-110-gT-40E-P-S7-200": "GTPL_110_gT_40E_P_S7_200_Germany",
  "GTPL-111-gT-80E-P-S7-200": "GTPL_111_gT_80E_P_S7_200_Germany",
  "GTPL-112-gT-80E-P-S7-200": "GTPL_112_gT_80E_P_S7_200_Germany",
  "GTPL-113-gT-80E-P-S7-200": "GTPL_113_gT_80E_P_S7_200_Germany",
  "GTPL-30-gT-180E-S7-1200": "GTPL_114_GT_140E_S7_1200",
  "GTPL-115-gT-180E-S7-1200": "GTPL_115_GT_180E_S7_1200",
  "GTPL-116-gT-240E-S7-1200": "GTPL_116_GT_240E_S7_1200",
  "GTPL-117-gT-320E-S7-1200": "GTPL_117_GT_320E_S7_1200",
  "GTPL-119-gT-180E-S7-1200": "GTPL_119_GT_180E_S7_1200",
  "GTPL-120-gT-180E-S7-1200": "GTPL_120_GT_180E_S7_1200",
  "GTPL-121-gT-1000T-S7-1200": "GTPL_121_GT1000T",
  "GTPL-124-GT-450T-S7-1200": "GTPL_124_GT_450T_S7_1200",
  "GTPL-131-GT-650T-S7-1200": "GTPL_131_GT_650T_S7_1200",
  "GTPL-132-300-AP-S7-1200": "GTPL_132_GT300AP",
  "GTPL-118-gT-80E-P-S7-200": "kabomachinedatasmart200",
  "GTPL-137-GT-450T-S7-1200": "GTPL_137_GT_450T_S7_1200",
  "GTPL-138-GT-450T-S7-1200": "GTPL_138_GT_450T_S7_1200",
  "GTPL-061-gT-450T-S7-1200": "GTPL_061_GT_450T_S7_1200",
  "GTPL-134-GT-450T-S7-1200": "GTPL_134_GT_450T_S7_1200",
  "GTPL-135-GT-450T-S7-1200": "GTPL_135_GT_450T_S7_1200",
  "GTPL-139-GT-300AP-S7-1200": "GTPL_139_GT300AP",
};

const { width } = Dimensions.get("window");

const CalendarDatePicker = ({
  visible,
  onClose,
  onSelect,
  selectedDate,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (date: Date) => void;
  selectedDate?: Date;
}) => {
  const tokens = useThemeTokens();
  const [tempSelectedDate, setTempSelectedDate] = useState(
    selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  );

  const handleConfirm = () => {
    if (tempSelectedDate) {
      onSelect(new Date(tempSelectedDate));
    }
    onClose();
  };

  const handleDayPress = (day: any) => {
    setTempSelectedDate(day.dateString);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.dropdownList, { backgroundColor: tokens.colors.surface }]}> 
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12 }}>
            <Text style={{ color: tokens.colors.text, fontWeight: "600", fontSize: 16 }}>Select Date</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={tokens.colors.text} />
            </TouchableOpacity>
          </View>

          <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
            <Calendar
              onDayPress={handleDayPress}
              markedDates={{
                [tempSelectedDate]: { selected: true, selectedColor: tokens.colors.primary },
              }}
              theme={{
                todayTextColor: tokens.colors.primary,
                selectedDayBackgroundColor: tokens.colors.primary,
                selectedDayTextColor: tokens.colors.background,
                arrowColor: tokens.colors.primary,
                monthTextColor: tokens.colors.text,
                textSectionTitleColor: tokens.colors.textSecondary,
                textDisabledColor: tokens.colors.text,
              }}
            />
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 16 }}>
            <TouchableOpacity
              onPress={onClose}
              style={{ paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: tokens.colors.border, backgroundColor: tokens.colors.surface }}
            >
              <Text style={{ color: tokens.colors.text }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirm}
              style={{ paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, backgroundColor: tokens.colors.primary }}
            >
              <Text style={{ color: tokens.colors.background, fontWeight: "600" }}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};



export default function ReportsScreen() {
  const { effective } = useThemeMode();
  const tokens = useThemeTokens();
  const {
    reports = [],
    loading,
    error,
    fetchReports,
    clearReports,
  } = useDeviceReports();
  
  // Separate function to fetch data with date range
  const fetchDataWithDateRange = async (tableName: string, startDate: Date, endDate: Date) => {
    try {
      setDownloading(true); // Using downloading state to show loading
      
      const fromDate = startDate.toISOString().split("T")[0];
      const toDate = endDate.toISOString().split("T")[0];
      
      console.log(`Fetching data from ${fromDate} to ${toDate} for table ${tableName}`);
      
      const url = `https://grain-backend-1.onrender.com/api/getAllDataSmart200?table=${encodeURIComponent(tableName)}&fromDate=${fromDate}&toDate=${toDate}`;
      
      // Direct API call since the hook doesn't support custom URLs
      const response = await fetch(`${BASE_URL}${url}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const arrayData = Array.isArray(data) ? data : [];
      setData(arrayData);
      
      console.log(`Loaded ${arrayData.length} records`);
      
      return arrayData;
    } catch (err: any) {
      console.error('Error fetching data with date range:', err);
      Alert.alert("Error", "Failed to fetch data: " + err.message);
      return [];
    } finally {
      setDownloading(false);
    }
  };

  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Initialize with first device and load data
  useEffect(() => {
    if (allDevices.length > 0 && !selectedDevice) {
      handleDeviceSelect(allDevices[0]);
    }
  }, []);

  const handleDeviceSelect = async (deviceName: string) => {
    setSelectedDevice(deviceName);
    setShowDropdown(false);

    try {
      const tableName = DEVICE_TO_TABLE_MAP[deviceName];
      if (!tableName) {
        Alert.alert("Error", "No table mapping found for this device");
        return;
      }

      if (startDate && endDate) {
        // Fetch data with date range using the new function
        await fetchDataWithDateRange(tableName, startDate, endDate);
      } else {
        // Fetch without date filter using existing hook
        const response = await fetchReports(tableName);
        if (Array.isArray(response)) {
          setData(response);
        } else {
          setData([]);
        }
      }
    } catch (err) {
      Alert.alert("Error", "Failed to load reports for this device");
    }
  };

  const validateDateRange = (): boolean => {
    if (!startDate || !endDate) return true;

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 3) {
      Alert.alert(
        "Date Range Error",
        "Please select a date range of maximum 3 days. Higher date ranges may result in large amounts of data.",
      );
      return false;
    }

    return true;
  };

  const handleStartDateSelect = (date: Date) => {
    setStartDate(date);
    console.log('Start date selected:', date);
  };

  const handleEndDateSelect = (date: Date) => {
    setEndDate(date);
    console.log('End date selected:', date);
  };

  const handleDateFilter = async () => {
    if (!selectedDevice) {
      Alert.alert("Error", "Please select a device first");
      return;
    }

    if (!validateDateRange()) return;

    try {
      const tableName = DEVICE_TO_TABLE_MAP[selectedDevice];
      if (!tableName) {
        Alert.alert("Error", "No table mapping found for this device");
        return;
      }

      if (startDate && endDate) {
        // Fetch data with date range using the new function
        await fetchDataWithDateRange(tableName, startDate, endDate);
      } else {
        // Fetch without date filter using existing hook
        console.log(`Fetching data without date filter for ${tableName}`);
        const response = await fetchReports(tableName);
        if (Array.isArray(response)) {
          setData(response);
        } else {
          setData([]);
        }
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      Alert.alert("Error", "Failed to fetch data with date filter: " + (err as Error).message);
    }
  };

  const downloadAllData = async () => {
    if (!startDate || !endDate || !selectedDevice) {
      Alert.alert("Error", "Please select both date range and device");
      return;
    }

    if (!validateDateRange()) return;

    setDownloading(true);
    setDownloadProgress(0);

    try {
      const tableName = DEVICE_TO_TABLE_MAP[selectedDevice];
      if (!tableName) {
        Alert.alert("Error", "No table mapping found for this device");
        return;
      }

      const fromDate = startDate.toISOString().split("T")[0];
      const toDate = endDate.toISOString().split("T")[0];
      const url = `/api/getAllDataSmart200?table=${encodeURIComponent(tableName)}&fromDate=${fromDate}&toDate=${toDate}&downloadAll=true`;

      // In React Native, you might need to use a different approach for file downloads
      // This is a simplified version - you might need to use RNFS or other file system libraries
      const response = await fetch(url);
      const blob = await response.blob();

      // For mobile, you might want to save to device storage
      // This requires additional setup with React Native FS
      Alert.alert(
        "Download Complete",
        "Data has been prepared for download. Check your device downloads.",
        [{ text: "OK" }],
      );
    } catch (err) {
      Alert.alert("Download Error", "Failed to download data");
    } finally {
      setDownloading(false);
      setDownloadProgress(0);
    }
  };

  const renderTable = () => {
    if (loading || downloading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tokens.colors.primary} />
          <Text style={[styles.loadingText, { color: tokens.colors.text }]}>
            Loading reports...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <AlertCircle size={24} color={tokens.colors.error} />
          <Text style={[styles.errorText, { color: tokens.colors.error }]}>
            {error}
          </Text>
        </View>
      );
    }

    if (!Array.isArray(data) || data.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <FileText size={48} color={tokens.colors.textSecondary} />
          <Text
            style={[styles.emptyText, { color: tokens.colors.textSecondary }]}
          >
            {selectedDevice ? `No data available for ${selectedDevice}` : 'Please select a device'}
          </Text>
        </View>
      );
    }

    // Get table headers from first data item, excluding created_at and Spare fields
    const safeData = Array.isArray(data) ? data : [];
    const allHeaders = safeData.length > 0 ? Object.keys(safeData[0]) : [];
    const headers = allHeaders.filter(header => 
      header !== 'created_at' && 
      !header.startsWith('Spare_')
    );

    return (
      <View
        style={[
          styles.tableContainer,
          { backgroundColor: tokens.colors.surface },
        ]}
      >
        {/* Table Header */}
        <View style={styles.tableHeaderContainer}>
          <ScrollView 
             horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.tableHeaderRow}>
              {headers.map((header, index) => (
                <View
                  key={index}
                  style={[styles.tableHeaderCell, { width: Math.max(width * 0.3, 150) }]}
                >
                  <Text
                    style={[
                      styles.tableHeaderText,
                      { color: tokens.colors.text },
                    ]}
                    numberOfLines={2}
                    adjustsFontSizeToFit
                  >
                    {header}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
    
        {/* Table Body - using a single scroll view for both directions */}
        <ScrollView 
          style={styles.tableBody}
          horizontal={true}
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={true}
        >
          <View style={styles.tableRowsContainer}>
            {safeData.map((row, rowIndex) => (
              <View
                key={rowIndex}
                style={[
                  styles.tableRow,
                  {
                    backgroundColor:
                      rowIndex % 2 === 0
                        ? tokens.colors.background
                        : tokens.colors.surface,
                  },
                ]}
              >
                {headers.map((header, colIndex) => (
                  <View
                    style={[styles.tableCell, { width: Math.max(width * 0.3, 150) }]}
                    key={colIndex}
                  >
                    <Text
                      style={[
                        styles.tableCellText,
                        { color: tokens.colors.text },
                      ]}
                      numberOfLines={2}
                      adjustsFontSizeToFit
                    >
                      {typeof row[header] === "boolean"
                        ? row[header]
                          ? "True"
                          : "False"
                      : String(row[header] || "")}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Device Reports
      </ThemedText>

      {/* Device Selection */}
      <View style={styles.dropdownSection}>
        <Text style={[styles.label, { color: tokens.colors.text }]}>
          Select Device:
        </Text>
        <TouchableOpacity
          style={[
            styles.dropdown,
            {
              backgroundColor: tokens.colors.surface,
              borderColor: tokens.colors.border,
            },
          ]}
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Text
            style={[
              styles.dropdownText,
              {
                color: selectedDevice
                  ? tokens.colors.text
                  : tokens.colors.textSecondary,
              },
            ]}
            numberOfLines={1}
          >
            {selectedDevice || "Choose a device..."}
          </Text>
          <ChevronDown
            size={20}
            color={tokens.colors.textSecondary}
            style={[
              styles.dropdownIcon,
              { transform: [{ rotate: showDropdown ? "180deg" : "0deg" }] },
            ]}
          />
        </TouchableOpacity>
      </View>

      {/* Date Range Selection */}
      <View style={styles.dateSection}>
        <Text style={[styles.label, { color: tokens.colors.text }]}>
          Date Range:
        </Text>
        <View style={styles.dateRow}>
          <TouchableOpacity
            style={[
              styles.dateButton,
              {
                backgroundColor: tokens.colors.surface,
                borderColor: tokens.colors.border,
              },
            ]}
            onPress={() => setShowStartDatePicker(true)}
          >
          
            <Text
              style={[styles.dateButtonText, { color: tokens.colors.text }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {startDate ? startDate.toLocaleDateString() : "Start Date"}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.dateSeparator, { color: tokens.colors.text }]}>
            to
          </Text>

          <TouchableOpacity
            style={[
              styles.dateButton,
              {
                backgroundColor: tokens.colors.surface,
                borderColor: tokens.colors.border,
              },
            ]}
            onPress={() => setShowEndDatePicker(true)}
          >
          
            <Text
              style={[styles.dateButtonText, { color: tokens.colors.text }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {endDate ? endDate.toLocaleDateString() : "End Date"}
            </Text>
          </TouchableOpacity>
        </View>

        {startDate && endDate && (
          <View
            style={[
              styles.dateInfo,
              { backgroundColor: tokens.colors.primary + "10" },
            ]}
          >
            <Text
              style={[styles.dateInfoText, { color: tokens.colors.primary }]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              Selected: {startDate.toLocaleDateString()} to{" "}
              {endDate.toLocaleDateString()}
              {` (${Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1} days)`}
            </Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: tokens.colors.primary },
          ]}
          onPress={handleDateFilter}
          disabled={downloading}
        >
          {downloading ? (
            <ActivityIndicator size="small" color={tokens.colors.background} />
          ) : (
            <Text
              style={[
                styles.actionButtonText,
                { color: tokens.colors.background },
              ]}
            >
              Apply Filter
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor:
                startDate && endDate
                  ? tokens.colors.primary
                  : tokens.colors.textSecondary,
              opacity: startDate && endDate ? 1 : 0.5,
            },
          ]}
          onPress={downloadAllData}
          disabled={!startDate || !endDate || downloading}
        >
          {downloading ? (
            <ActivityIndicator size="small" color={tokens.colors.background} />
          ) : (
            <>
              <Download
                size={16}
                color={tokens.colors.background}
                style={styles.downloadIcon}
              />
              <Text
                style={[
                  styles.actionButtonText,
                  { color: tokens.colors.background },
                ]}
              >
                Download All
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Download Progress */}
      {downloading && (
        <View
          style={[
            styles.progressContainer,
            { backgroundColor: tokens.colors.surface },
          ]}
        >
          <Text style={[styles.progressText, { color: tokens.colors.text }]}>
            Downloading {selectedDevice} data... {downloadProgress}%
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${downloadProgress}%`,
                  backgroundColor: tokens.colors.primary,
                },
              ]}
            />
          </View>
        </View>
      )}

      {/* Device Dropdown Modal */}
      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowDropdown(false)}
        >
          <View
            style={[
              styles.dropdownList,
              { backgroundColor: tokens.colors.surface },
            ]}
          >
            <ScrollView>
              {allDevices.map((deviceName) => (
                <TouchableOpacity
                  key={deviceName}
                  style={styles.dropdownItem}
                  onPress={() => handleDeviceSelect(deviceName)}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      { color: tokens.colors.text },
                    ]}
                    numberOfLines={1}
                  >
                    {deviceName}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Date Pickers */}
      <CalendarDatePicker
        visible={showStartDatePicker}
        onClose={() => setShowStartDatePicker(false)}
        onSelect={handleStartDateSelect}
        selectedDate={startDate || new Date()}
      />

      <CalendarDatePicker
        visible={showEndDatePicker}
        onClose={() => setShowEndDatePicker(false)}
        onSelect={handleEndDateSelect}
        selectedDate={endDate || new Date()}
      />

      {/* Reports Table */}
      <View style={styles.reportsSection}>
        {selectedDevice && (
          <>
            <Text style={[styles.sectionTitle, { color: tokens.colors.text }]}>
              Reports for: {selectedDevice}
            </Text>
            {renderTable()}
          </>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 24,
    textAlign: "center",
  },
  dropdownSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 48,
  },
  dropdownText: {
    flex: 1,
    fontSize: 16,
    marginRight: 8,
  },
  dropdownIcon: {
    // transform transitions handled in component
  },
  dateSection: {
    marginBottom: 16,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dateButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  dateIcon: {
    marginRight: 8,
  },
  dateButtonText: {
    fontSize: 14,
  },
  dateSeparator: {
    fontSize: 14,
    fontWeight: "600",
    marginHorizontal: 8,
  },
  dateInfo: {
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  dateInfoText: {
    fontSize: 12,
    textAlign: "center",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  downloadIcon: {
    marginRight: 8,
  },
  progressContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  progressText: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
  },
  progressBar: {
    height: 4,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownList: {
    width: width * 0.9,
    maxHeight: 400,
    borderRadius: 12,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  dropdownItemText: {
    fontSize: 16,
  },
  reportsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
  },
  tableContainer: {
    flex: 1,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tableHeaderContainer: {
    maxHeight: 80,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    paddingHorizontal: 8,
    justifyContent: "center",
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "left",
  },
  tableBody: {
    flex: 1,
  },
  tableRowContainer: {
    marginVertical: 1,
  },
  tableRowsContainer: {
    flexDirection: "column",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  tableRowInner: {
    flexDirection: "row",
  },
  tableCell: {
    paddingHorizontal: 8,
    justifyContent: "center",
  },
  tableCellText: {
    fontSize: 12,
    textAlign: "left",
  },
  datePickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  datePickerContainer: {
    width: width * 0.8,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  datePickerContent: {
    flex: 1,
    flexDirection: "row",
  },
  pickerColumn: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#666",
  },
  pickerScroll: {
    maxHeight: 150,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 2,
    borderRadius: 8,
  },
  pickerItemText: {
    fontSize: 16,
    textAlign: "center",
  },
  datePickerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  datePickerButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  datePickerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
