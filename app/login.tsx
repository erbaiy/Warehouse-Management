import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import apiClient from '../config/axios';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
  const [authKey, setAuthKey] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async() => {   
    try {
      setLoading(true);
      const { data: users } = await apiClient.get('warehousemans');
      const userExist = users.find((user: any) => user.secretKey === authKey);
      
      if (userExist) {
        router.replace('/(tabs)');
      } else {
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
      <View style={styles.background} />
      <View style={styles.content}>
        <Image 
          source={require('@/assets/images/login.png')} 
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Authentication Key"
          value={authKey}
          onChangeText={setAuthKey}
          secureTextEntry
          placeholderTextColor="#999"
          autoCapitalize="none"
          editable={!loading}
        />
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={!authKey.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Log In</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFD700', // Golden yellow background
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFD700', // Golden yellow background
  },
  content: {
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: 150,
    height: 150,
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
  input: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    color: '#333',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  button: {
    width: '100%',
    backgroundColor: 'black',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    opacity: 1,
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


// // app/login.tsx
// import { useState } from 'react';
// import { 
//   View, 
//   Text, 
//   TextInput, 
//   TouchableOpacity, 
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
//   Alert,
//   ActivityIndicator 
// } from 'react-native';
// import { router } from 'expo-router';

// export default function LoginScreen() {
//   const [secretCode, setSecretCode] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch('http://172.16.9.4:3000/users');
//       const users = await response.json();
      
//       const validUser = users.find(user => user.secretCode === secretCode);
//       console.log("authenficated user",validUser);      
//       if (validUser) {
//         router.replace('/(tabs)');
//       } else {
//         Alert.alert('Erreur', 'Code secret invalide');
//       }
//     } catch (error) {
//       Alert.alert('Erreur', 'Erreur de connexion au serveur');
//       console.error('Login error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView 
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.container}
//     >
//       <View style={styles.innerContainer}>
//         <Text style={styles.title}>Gestion de Stock</Text>
        
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Code Secret</Text>
//           <TextInput
//             style={styles.input}
//             value={secretCode}
//             onChangeText={setSecretCode}
//             placeholder="Entrez votre code secret"
//             keyboardType="number-pad"
//             secureTextEntry
//             maxLength={6}
//             editable={!loading}
//           />
//         </View>

//         <TouchableOpacity 
//           style={[
//             styles.button,
//             (!secretCode || loading) && styles.buttonDisabled
//           ]}
//           onPress={handleLogin}
//           disabled={!secretCode || loading}
//         >
//           {loading ? (
//             <ActivityIndicator color="white" />
//           ) : (
//             <Text style={styles.buttonText}>Se Connecter</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   innerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 40,
//     color: '#333',
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 8,
//     color: '#666',
//   },
//   input: {
//     backgroundColor: 'white',
//     padding: 15,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     fontSize: 16,
//   },
//   button: {
//     backgroundColor: '#007AFF',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   buttonDisabled: {
//     backgroundColor: '#ccc',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });