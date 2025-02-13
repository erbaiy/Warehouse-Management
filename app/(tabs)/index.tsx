// // app/(tabs)/index.tsx
// import React from 'react';
// import { View, StyleSheet, StatusBar } from 'react-native';

// const HomeScreen = () => {
//   return (
//     <View style={styles.container}>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
// });

// export default HomeScreen;&


import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const HomeScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Warehouse Management</Text>
        <Text style={styles.subtitle}>Scan and manage your inventory</Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={() => router.push('/scanner')}
        >
          <MaterialCommunityIcons name="barcode-scan" size={32} color="white" />
          <Text style={styles.buttonText}>Scan Product</Text>
        </TouchableOpacity>

        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/inventory')}
          >
            <MaterialCommunityIcons name="package-variant" size={24} color="#FF9F43" />
            <Text style={styles.actionText}>Inventory</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/add-product')}
          >
            <MaterialCommunityIcons name="plus-circle" size={24} color="#FF9F43" />
            <Text style={styles.actionText}>Add Product</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/history')}
          >
            <MaterialCommunityIcons name="history" size={24} color="#FF9F43" />
            <Text style={styles.actionText}>History</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>150</Text>
          <Text style={styles.statLabel}>Total Products</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Low Stock</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A', // Dark theme background
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  actionsContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9F43',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  actionCard: {
    backgroundColor: '#2D2D2D', // Dark theme card
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: '30%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  actionText: {
    marginTop: 8,
    color: '#FFFFFF',
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  statCard: {
    backgroundColor: '#2D2D2D', // Dark theme card
    padding: 20,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9F43',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#CCCCCC',
  },
});

export default HomeScreen;
