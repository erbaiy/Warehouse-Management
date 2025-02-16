import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { View, StyleSheet, StatusBar, Text } from 'react-native';
import Toast from 'react-native-toast-message';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={styles.container}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#000000' },
            animation: 'fade',
          }}
        >
          <Stack.Screen 
            name="login" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: false,
              gestureEnabled: false,
              animation: 'fade',
            }} 
          />
        </Stack>

        <Toast 
          config={{
            success: (props) => (
              <View style={styles.toastContainer}>
                <Text style={styles.toastText}>{props.text1}</Text>
                {props.text2 && <Text style={styles.toastSubText}>{props.text2}</Text>}
              </View>
            ),
            error: (props) => (
              <View style={[styles.toastContainer, styles.errorToast]}>
                <Text style={styles.toastText}>{props.text1}</Text>
                {props.text2 && <Text style={styles.toastSubText}>{props.text2}</Text>}
              </View>
            ),
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  toastContainer: {
    height: 60,
    width: '90%',
    backgroundColor: '#000000',
    borderRadius: 8,
    padding: 15,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  errorToast: {
    borderColor: '#FFFFFF',
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toastSubText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 4,
  },
});
