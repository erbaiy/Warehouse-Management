import { View, Text, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { useCameraPermissions } from "expo-camera";
import ScannerView from '@/components/ScannerView';

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  const isPermissionGranted = Boolean(permission?.granted);

  if (isPermissionGranted) {
    return <ScannerView />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>QR Code Scanner</Text>
      <View style={styles.buttonContainer}>
        <Pressable 
          style={styles.button} 
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>Request Camera Access</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "black",
    justifyContent: "space-around",
    paddingVertical: 80,
  },
  title: {
    color: "white",
    fontSize: 40,
  },
  buttonContainer: {
    gap: 20,
    width: '80%',
  },
  button: {
    backgroundColor: '#0E7AFE',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
});
