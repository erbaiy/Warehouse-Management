






import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Keyboard 
} from 'react-native';
import { useRouter } from 'expo-router';
import apiClient from '../config/axios';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [authKey, setAuthKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  // const handleLogin = async() => {   
  //   try {
  //     setLoading(true);
  //     const { data: users } = await apiClient.get('warehousemans');
  //     const userExist = users.find((user: any) => user.secretKey === authKey);
      
  //     if (userExist) {
  //       router.replace('/(tabs)');
  //     } else {
  //       Toast.show({
  //         type: 'error',
  //         position: 'top',
  //         text1: 'Invalid input',
  //         text2: 'Please try again'
  //       });
  //     }
  //   } catch (error) {
  //     Toast.show({
  //       type: 'error',
  //       position: 'top',
  //       text1: 'Error',
  //       text2: 'Something went wrong. Please try again.'
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogin = async() => {   
    try {
      setLoading(true);
      const { data: users } = await apiClient.get('warehousemans');
      const userExist = users.find((user: any) => user.secretKey === authKey);
      
      if (userExist) {
        // Save user data to AsyncStorage
        try {
          await AsyncStorage.setItem('warehousemanData', JSON.stringify(userExist));
          await AsyncStorage.setItem('isLoggedIn', 'true');
          console.log('User data saved successfully');
          router.replace('/(tabs)');
        } catch (storageError) {
          console.error('Error saving to AsyncStorage:', storageError);
          Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Error',
            text2: 'Failed to save login information'
          });
        }
      } else {
        console.log('User not found');
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Invalid input',
          text2: 'Please try again'
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'Something went wrong. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.imageWrapper}>
        <Image 
          source={require('@/assets/images/login.png')} 
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
      </View>

      <View style={[
        styles.content,
        isKeyboardVisible && styles.contentKeyboardVisible
      ]}>
        <View style={styles.indicator} />
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Authentication Key"
            value={authKey}
            onChangeText={setAuthKey}
            secureTextEntry={!showPassword}
            placeholderTextColor="#999"
            autoCapitalize="none"
            editable={!loading}
          />
          <TouchableOpacity 
  style={styles.eyeIcon}
  onPress={() => setShowPassword(!showPassword)}
  testID="eye-icon"
>
            <Ionicons 
              name={showPassword ? "eye-off" : "eye"} 
              size={24} 
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={!authKey.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Text style={styles.buttonText}>Login</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  imageWrapper: {
    position: 'absolute',
    width: width,
    height: height,
    top: 0,
    left: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Darkens the image slightly
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    paddingTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 1000, // Ensures content stays above image
  },
  contentKeyboardVisible: {
    height: '70%', // Increases height when keyboard is visible
  },
  indicator: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    position: 'relative',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    color: '#333',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  button: {
    width: '60%',
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
