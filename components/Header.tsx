import React from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              // Clear AsyncStorage items
              await AsyncStorage.multiRemove([
                'warehousemanData',
                'isLoggedIn'
              ]);
              
              // Show success message
              Toast.show({
                type: 'success',
                position: 'top',
                text1: 'Success',
                text2: 'Logged out successfully'
              });

              // Navigate to login screen
              router.replace('/login');
            } catch (error) {
              console.error('Error during logout:', error);
              Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Error',
                text2: 'Failed to logout. Please try again.'
              });
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.header}>
      <View style={styles.rightContainer}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => router.push('/profile')}
        >
          <FontAwesome name="user-circle" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={handleLogout}
        >
          <FontAwesome name="sign-out" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 10,
    height: 40,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 5,
    marginLeft: 8,
  },
});
