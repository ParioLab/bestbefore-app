import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { BlurView } from 'expo-blur';
import BackArrowIcon from '../../assets/images/back-arrow-icon.svg';

type ScanBarcodeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ScanBarcode'>;

export default function ScanBarcodeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation<ScanBarcodeScreenNavigationProp>();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
            <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderCamera = () => {
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackArrowIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan barcode</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.container}>
        {renderCamera()}
        <BlurView intensity={40} tint="dark" style={styles.viewfinder}>
          <View style={styles.viewfinderBorder} />
        </BlurView>
        <Text style={styles.instructions}>Align the barcode within the viewfinder</Text>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraContainer: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  button: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
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
    color: 'white',
    fontFamily: 'Manrope-Regular',
    fontSize: 16,
    textAlign: 'center',
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
}); 