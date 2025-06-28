/**
 * @file src/screens/ScanBarcodeScreen.tsx
 * @description
 * Screen for scanning barcodes using the device camera.
 * Integrates with Open Food Facts lookup to retrieve product information.
 *
 * Key features:
 * - Requests camera permission
 * - Scans barcodes and fetches product info
 * - Navigates to AddItem screen with barcode for manual completion or autofill
 *
 * @dependencies
 * - expo-camera: Camera component and permissions
 * - useBarcodeLookup: hook for API lookup
 *
 * @notes
 * - Supports EAN/UPC barcode types
 * - Handles permission states and lookup errors
 */

import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { BlurView } from 'expo-blur';
import BackArrowIcon from '../../assets/images/back-arrow-icon.svg';
import ItemNotFoundAlert from '../alerts/ItemNotFoundAlert';
import { useBarcodeLookup } from '../hooks/useBarcodeLookup';

type ScanBarcodeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ScanBarcode'>;

export default function ScanBarcodeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation<ScanBarcodeScreenNavigationProp>();
  const [alertVisible, setAlertVisible] = useState(false);
  const [scanned, setScanned] = useState(false);
  const { lookupBarcode, loading: lookupLoading } = useBarcodeLookup();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    // Waiting for permission resolution
    return <View />;
  }

  if (!permission.granted) {
    // Ask the user to grant camera permissions
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          We need your permission to access the camera
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /**
   * Handler for when a barcode is scanned.
   * Fetches product info and navigates to AddItem or shows alert.
   */
  const handleBarCodeScanned = async ({ data }: { type: string; data: string }) => {
    if (scanned) return;
    setScanned(true);

    const result = await lookupBarcode(data);

    if (result.success) {
      // Navigate to AddItem with the scanned barcode
      navigation.navigate('AddItem', { barcode: data });
    } else {
      // Show not-found alert
      setAlertVisible(true);
    }
  };

  /**
   * Reset scanning state after closing the alert.
   */
  const handleAlertClose = () => {
    setAlertVisible(false);
    setScanned(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackArrowIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Barcode</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: [
              'ean13',
              'ean8',
              'upc_a',
              'upc_e',
            ],
          }}
        />
        <BlurView intensity={40} tint="dark" style={styles.viewfinder}>
          <View style={styles.viewfinderBorder} />
        </BlurView>
        <Text style={styles.instructions}>
          Align the barcode within the viewfinder
        </Text>
        {lookupLoading && (
          <ActivityIndicator
            size="large"
            style={styles.loadingIndicator}
            color="#FFFFFF"
          />
        )}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <ItemNotFoundAlert
          visible={alertVisible}
          onClose={handleAlertClose}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F5F0',
  },
  headerTitle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 18,
    color: '#141414',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  viewfinder: {
    position: 'absolute',
    width: '80%',
    height: '60%',
    borderRadius: 12,
  },
  viewfinderBorder: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  instructions: {
    position: 'absolute',
    top: '10%',
    color: '#FFFFFF',
    fontFamily: 'Manrope-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
  },
  cancelButton: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 50,
  },
  cancelButtonText: {
    color: '#141414',
    fontFamily: 'Manrope-Bold',
    fontSize: 14,
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  permissionText: {
    fontFamily: 'Manrope-Regular',
    fontSize: 16,
    color: '#141414',
    textAlign: 'center',
    marginBottom: 12,
  },
  permissionButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Manrope-Bold',
    fontSize: 16,
  },
});