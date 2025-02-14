import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import apiClient from '@/config/axios';

const HomeScreen = () => {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalWarehouses: 0,
    outOfStockProducts: 0,
    totalStockValue: 0,
    recentlyAdded: [], // Initialize as empty array
    recentlyRemoved: [], // Initialize as empty array
  });
  const [loading, setLoading] = useState(true); // Add loading state

  // Fetch statistics from the API
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await apiClient.get('/statistics'); // Replace with your API endpoint
        const data = response.data;
        setStats({
          totalProducts: data.totalProducts,
          totalWarehouses: data.totalWarehouses,
          outOfStockProducts: data.outOfStockProducts,
          totalStockValue: data.totalStockValue,
          recentlyAdded: data.recentlyAdded || [], // Fallback to empty array if undefined
          recentlyRemoved: data.recentlyRemoved || [], // Fallback to empty array if undefined
        });
      } catch (error) {
        console.error('Error fetching statistics', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9F43" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Warehouse Management</Text>
        <Text style={styles.subtitle}>Optimize your inventory management</Text>
      </View>

      {/* Quick Actions */}
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

      {/* Statistics Section */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalProducts}</Text>
            <Text style={styles.statLabel}>Total Products</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalWarehouses}</Text>
            <Text style={styles.statLabel}>Total Warehouses</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.outOfStockProducts}</Text>
            <Text style={styles.statLabel}>Out of Stock</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>${stats.totalStockValue.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Stock Value</Text>
          </View>
        </View>
      </View>

      {/* Recently Added/Removed Products */}
      <View style={styles.recentActivityContainer}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityGrid}>
          <View style={styles.activityCard}>
            <Text style={styles.activityTitle}>Recently Added</Text>
            {stats.recentlyAdded.length > 0 ? (
              stats.recentlyAdded.map((product, index) => (
                <Text key={index} style={styles.activityText}>
                  {product.name} - {product.quantity} units
                </Text>
              ))
            ) : (
              <Text style={styles.activityText}>No recently added products</Text>
            )}
          </View>
          <View style={styles.activityCard}>
            <Text style={styles.activityTitle}>Recently Removed</Text>
            {stats.recentlyRemoved.length > 0 ? (
              stats.recentlyRemoved.map((product, index) => (
                <Text key={index} style={styles.activityText}>
                  {product.name} - {product.quantity} units
                </Text>
              ))
            ) : (
              <Text style={styles.activityText}>No recently removed products</Text>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A', // Dark theme background
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
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
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#2D2D2D', // Dark theme card
    padding: 20,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
    marginBottom: 15,
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
  recentActivityContainer: {
    marginBottom: 30,
  },
  activityGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  activityCard: {
    backgroundColor: '#2D2D2D', // Dark theme card
    padding: 15,
    borderRadius: 12,
    width: '48%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  activityText: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 5,
  },
});

export default HomeScreen;