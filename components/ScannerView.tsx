// components/ScannerView.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScanResultModal from './ScanResultModal';
import apiClient from '@/config/axios';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ScannerView() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [scannedProduct, setScannedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [isManualInputVisible, setIsManualInputVisible] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const fetchProductData = async (barcode: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`products`);
      const data = response.data;
      
      const foundProduct = data.find(item => item.barcode === barcode);
      if (foundProduct) {
        setScannedProduct(foundProduct);
        return foundProduct;
      } else {
        setScannedProduct(null);
        return null;
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setScannedProduct(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    try {
      await fetchProductData(data);
      setIsModalVisible(true);
      setScannedBarcode(data);
    } catch (error) {
      console.error('Error in handleBarCodeScanned:', error);
      setScannedProduct(null);
      setIsModalVisible(true);
    }
  };

  const handleDismissModal = () => {
    setIsModalVisible(false);
    setScanned(false);
    setScannedProduct(null);
  };

  const handleManualInput = () => {
    setIsManualInputVisible(true);
  };

  const handleManualBarcodeSubmit = async () => {
    if (!manualBarcode) {
      Alert.alert('Error', 'Please enter a barcode');
      return;
    }

    setScanned(true);
    try {
      await fetchProductData(manualBarcode);
      setIsModalVisible(true);
      setScannedBarcode(manualBarcode);
      setIsManualInputVisible(false);
      setManualBarcode('');
    } catch (error) {
      console.error('Error in handleManualBarcodeSubmit:', error);
      setScannedProduct(null);
      setIsModalVisible(true);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <MaterialCommunityIcons name="camera" size={50} color="#FF9F43" />
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <MaterialCommunityIcons name="camera-off" size={50} color="#FF6B6B" />
        <Text style={styles.permissionText}>No access to camera</Text>
        <Text style={styles.permissionSubText}>Please enable camera access in your device settings</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          <View style={styles.overlay}>
            <View style={styles.overlayRow} />
            <View style={styles.scannerRow}>
              <View style={styles.overlayColumn} />
              <View style={styles.scanner}>
                <View style={styles.scannerCorner} />
                <View style={[styles.scannerCorner, styles.topRight]} />
                <View style={[styles.scannerCorner, styles.bottomRight]} />
                <View style={[styles.scannerCorner, styles.bottomLeft]} />
              </View>
              <View style={styles.overlayColumn} />
            </View>
            <View style={styles.overlayRow} />
          </View>

          <View style={styles.instructionsContainer}>
            <Text style={styles.instructions}>
              Position barcode within the frame
            </Text>
          </View>

          {scanned && (
            <TouchableOpacity 
              style={styles.scanAgainButton} 
              onPress={() => setScanned(false)}
            >
              <MaterialCommunityIcons name="barcode-scan" size={24} color="white" />
              <Text style={styles.scanAgainText}>Tap to Scan Again</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.manualInputButton} 
            onPress={handleManualInput}
          >
            <MaterialCommunityIcons name="keyboard-outline" size={24} color="white" />
            <Text style={styles.manualInputText}>Enter Barcode Manually</Text>
          </TouchableOpacity>
        </CameraView>
      </View>

      <ScanResultModal
        isVisible={isModalVisible}
        onDismiss={handleDismissModal}
        productData={scannedProduct}
        isLoading={isLoading}
        scannedBarcode={scannedBarcode}
      />

      {isManualInputVisible && (
        <View style={styles.manualInputModal}>
          <View style={styles.manualInputContainer}>
            <Text style={styles.manualInputTitle}>Enter Barcode Manually</Text>
            <TextInput
              style={styles.manualInputField}
              placeholder="Barcode"
              value={manualBarcode}
              onChangeText={setManualBarcode}
              keyboardType="numeric"
            />
            <TouchableOpacity 
              style={styles.manualInputSubmitButton} 
              onPress={handleManualBarcodeSubmit}
            >
              <Text style={styles.manualInputSubmitText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.manualInputCancelButton} 
              onPress={() => setIsManualInputVisible(false)}
            >
              <Text style={styles.manualInputCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  permissionText: {
    fontSize: 18,
    marginTop: 20,
    color: '#11181C',
    textAlign: 'center',
  },
  permissionSubText: {
    fontSize: 14,
    marginTop: 10,
    color: '#687076',
    textAlign: 'center',
  },
  overlay: {
    flex: 1,
  },
  overlayRow: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  scannerRow: {
    flexDirection: 'row',
    height: SCREEN_WIDTH * 0.7,
  },
  overlayColumn: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  scanner: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_WIDTH * 0.7,
    borderColor: '#FF9F43',
    borderWidth: 2,
  },
  scannerCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#FF9F43',
    borderWidth: 3,
  },
  topRight: {
    top: -3,
    right: -3,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomRight: {
    bottom: -3,
    right: -3,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  bottomLeft: {
    bottom: -3,
    left: -3,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.2,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructions: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  scanAgainButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#FF9F43',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  scanAgainText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  manualInputButton: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: '#FF9F43',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  manualInputText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  manualInputModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  manualInputContainer: {
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  manualInputTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  manualInputField: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  manualInputSubmitButton: {
    backgroundColor: '#FF9F43',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  manualInputSubmitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  manualInputCancelButton: {
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
  },
  manualInputCancelText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});