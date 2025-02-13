import apiClient from '@/config/axios';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'inStock', 'outOfStock'
  const [sortOrder, setSortOrder] = useState('none'); // 'none', 'priceAsc', 'priceDesc'

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get('products');
        const data = response.data;
        setProducts(data);
        setFilteredProducts(data); // Initialize filtered products with all products
      } catch (error) {
        console.error('Error fetching products', error);
      }
    };

    fetchProducts();
  }, []);

  // Apply search and filter logic
  useEffect(() => {
    let result = products;

    // Filter by search term
    if (searchTerm) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.price.toString().includes(searchTerm)
      ); // Fixed syntax error here
    }

    // Filter by stock status
    if (filterType === 'inStock') {
      result = result.filter(product => !isOutOfStock(product));
    } else if (filterType === 'outOfStock') {
      result = result.filter(product => isOutOfStock(product));
    }

    // Sort by price
    if (sortOrder === 'priceAsc') {
      result = result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'priceDesc') {
      result = result.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(result);
  }, [searchTerm, filterType, sortOrder, products]);

  // Check if a product is out of stock
  const isOutOfStock = (product) => {
    const totalStock = product.stocks.reduce((acc, stock) => acc + stock.quantity, 0);
    return totalStock <= 0;
  };

  // Theme colors (dark mode only)
  const theme = {
    background: '#121212',
    cardBackground: '#1e1e1e',
    text: '#ffffff',
    secondaryText: '#b0b0b0',
    border: '#333',
    outOfStockCard: '#262626',
    outOfStockText: '#666',
    lowStockBg: '#332d24',
    stockContainer: '#333333',
    outOfStockContainer: '#3d2c2c',
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 10,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    searchBar: {
      backgroundColor: theme.cardBackground,
      borderRadius: 8,
      padding: 10,
      flex: 1,
      marginRight: 10,
      color: theme.text,
    },
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 15,
    },
    filterButton: {
      backgroundColor: theme.cardBackground,
      padding: 10,
      borderRadius: 8,
      flex: 1,
      marginHorizontal: 5,
      alignItems: 'center',
    },
    filterButtonText: {
      color: theme.text,
    },
    productCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
      flexDirection: 'row',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 3.84,
      elevation: 5,
    },
    productImage: {
      width: 100,
      height: 100,
      borderRadius: 8,
    },
    productInfo: {
      flex: 1,
      marginLeft: 15,
    },
    productName: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
      color: theme.text,
    },
    stockContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      gap: 8,
      backgroundColor: theme.stockContainer,
      padding: 6,
      borderRadius: 6,
      alignSelf: 'flex-start',
    },
    stockInfo: {
      fontSize: 14,
      color: theme.secondaryText,
    },
  });

  return (
    <ScrollView style={styles.container}>
      {/* Header with Search Bar and Icons */}
      <View style={styles.header}>
  <TouchableOpacity style={{ marginLeft: 10 }}>
    <Ionicons name="notifications" size={24} color={theme.text} />
  </TouchableOpacity>
  <TouchableOpacity>
    <Ionicons name="person" size={24} color={theme.text} />
  </TouchableOpacity>
</View>

      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <TextInput
            style={[styles.searchBar, {paddingLeft: 40}]}
            placeholder="Search by name, type, supplier, or price" 
            placeholderTextColor={theme.secondaryText}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <MaterialCommunityIcons
            name="magnify"
            size={24}
            color="#fff"
            style={{position: 'absolute', left: 8}}
          />
        </View>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterType('all')}>
          <Text style={styles.filterButtonText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterType('inStock')}>
          <Text style={styles.filterButtonText}>In Stock</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterType('outOfStock')}>
          <Text style={styles.filterButtonText}>Out of Stock</Text>
        </TouchableOpacity>
      </View>

      {/* Sort Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton} onPress={() => setSortOrder('priceAsc')}>
          <Text style={styles.filterButtonText}>Price ↑</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => setSortOrder('priceDesc')}>
          <Text style={styles.filterButtonText}>Price ↓</Text>
        </TouchableOpacity>
      </View>

      {/* Product List */}
      {filteredProducts.map((product) => {
        const outOfStock = isOutOfStock(product);
        const totalStock = product.stocks.reduce((acc, stock) => acc + stock.quantity, 0);

        return (
          <View key={product.id} style={styles.productCard}>
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
              resizeMode="contain"
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={{ color: theme.secondaryText }}>Type: {product.type}</Text>
              <Text style={{ color: theme.secondaryText }}>Supplier: {product.supplier}</Text>
              <Text style={{ color: theme.text }}>Price: ${product.price}</Text>
              <View style={styles.stockContainer}>
                <Text style={styles.stockInfo}>
                  {outOfStock ? 'Out of Stock' : `In Stock: ${totalStock}`}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default ProductList;