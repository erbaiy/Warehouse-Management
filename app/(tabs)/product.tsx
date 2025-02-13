


import apiClient from '@/config/axios';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Switch, useColorScheme } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const ProductList = () => {
  const [products, setProducts] = React.useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const systemColorScheme = useColorScheme();

  // Theme colors
  const theme = {
    light: {
      background: '#f5f5f5',
      cardBackground: 'white',
      text: '#2e2e2e',
      secondaryText: '#666',
      border: '#ddd',
      outOfStockCard: '#f8f8f8',
      outOfStockText: '#999',
      lowStockBg: '#fff3e0',
      stockContainer: '#f0f0f0',
      outOfStockContainer: '#ffebee',
    },
    dark: {
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
    }
  };

  const currentTheme = isDarkMode ? theme.dark : theme.light;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get('products');
        const data = response.data;
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products', error);
      }
    };

    fetchProducts();
  }, []);

  const isOutOfStock = (product) => {
    const totalStock = product.stocks.reduce((acc, stock) => acc + stock.quantity, 0);
    return totalStock <= 0;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.background,
      padding: 10,
    },
    themeToggleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: 10,
      backgroundColor: currentTheme.cardBackground,
    },
    themeToggleText: {
      color: currentTheme.text,
      marginRight: 10,
    },
    productCard: {
      backgroundColor: currentTheme.cardBackground,
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
      flexDirection: 'row',
      shadowColor: isDarkMode ? '#000' : '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: isDarkMode ? 0.4 : 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    outOfStockCard: {
      backgroundColor: currentTheme.outOfStockCard,
    },
    imageContainer: {
      position: 'relative',
    },
    productImage: {
      width: 100,
      height: 100,
      borderRadius: 8,
    },
    outOfStockImage: {
      opacity: 0.7,
    },
    stockStatusContainer: {
      position: 'absolute',
      top: -5,
      right: -5,
      backgroundColor: currentTheme.cardBackground,
      borderRadius: 12,
      padding: 2,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 3,
    },
    productInfo: {
      flex: 1,
      marginLeft: 15,
    },
    productName: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
      color: currentTheme.text,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
      gap: 8,
    },
    productType: {
      fontSize: 14,
      color: currentTheme.secondaryText,
    },
    productSupplier: {
      fontSize: 14,
      color: currentTheme.secondaryText,
    },
    priceContainer: {
      flexDirection: 'row',
      marginTop: 5,
      alignItems: 'center',
      gap: 15,
    },
    price: {
      fontSize: 16,
      fontWeight: 'bold',
      color: currentTheme.text,
    },
    solde: {
      fontSize: 16,
      color: isDarkMode ? '#7CB342' : 'green',
      fontWeight: 'bold',
    },
    outOfStockText: {
      color: currentTheme.outOfStockText,
    },
    outOfStockSolde: {
      color: currentTheme.outOfStockText,
    },
    stockContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      gap: 8,
      backgroundColor: currentTheme.stockContainer,
      padding: 6,
      borderRadius: 6,
      alignSelf: 'flex-start',
    },
    outOfStockContainer: {
      backgroundColor: currentTheme.outOfStockContainer,
    },
    stockInfo: {
      fontSize: 14,
      color: currentTheme.secondaryText,
    },
    outOfStockStockInfo: {
      color: '#ff4444',
      fontWeight: 'bold',
    },
    lowStockInfo: {
      color: isDarkMode ? '#FFB74D' : '#ff9800',
      fontWeight: 'bold',
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.themeToggleContainer}>
        <Text style={styles.themeToggleText}>
          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
        </Text>
        <Switch
          value={isDarkMode}
          onValueChange={setIsDarkMode}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>

      {products.map((product) => {
        const outOfStock = isOutOfStock(product);
        const totalStock = product.stocks.reduce((acc, stock) => acc + stock.quantity, 0);

        return (
          <View key={product.id} style={[styles.productCard, outOfStock && styles.outOfStockCard]}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: product.image }}
                style={[styles.productImage, outOfStock && styles.outOfStockImage]}
                resizeMode="contain"
              />
              {outOfStock && (
                <View style={styles.stockStatusContainer}>
                  <MaterialCommunityIcons 
                    name="package-variant-closed-remove" 
                    size={24} 
                    color="#ff4444" 
                  />
                </View>
              )}
            </View>
            <View style={styles.productInfo}>
              <Text style={[styles.productName, outOfStock && styles.outOfStockText]}>
                {product.name}
              </Text>
              
              <View style={styles.infoRow}>
                <MaterialCommunityIcons 
                  name="shape" 
                  size={16} 
                  color={currentTheme.secondaryText} 
                />
                <Text style={styles.productType}>Type: {product.type}</Text>
              </View>

              <View style={styles.infoRow}>
                <MaterialCommunityIcons 
                  name="truck-delivery" 
                  size={16} 
                  color={currentTheme.secondaryText} 
                />
                <Text style={styles.productSupplier}>Supplier: {product.supplier}</Text>
              </View>

              <View style={styles.priceContainer}>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons 
                    name="cash" 
                    size={18} 
                    color={outOfStock ? currentTheme.outOfStockText : currentTheme.text}
                  />
                  <Text style={[styles.price, outOfStock && styles.outOfStockText]}>
                    ${product.price}
                  </Text>
                </View>
                
                {product.solde && (
                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons 
                      name="sale" 
                      size={18} 
                      color={outOfStock ? currentTheme.outOfStockText : (isDarkMode ? '#7CB342' : 'green')}
                    />
                    <Text style={[styles.solde, outOfStock && styles.outOfStockSolde]}>
                      ${product.solde}
                    </Text>
                  </View>
                )}
              </View>

              <View style={[styles.stockContainer, outOfStock && styles.outOfStockContainer]}>
                <MaterialCommunityIcons 
                  name={outOfStock ? "package-variant-remove" : "package-variant"} 
                  size={18} 
                  color={outOfStock ? "#ff4444" : currentTheme.secondaryText}
                />
                <Text style={[
                  styles.stockInfo,
                  outOfStock ? styles.outOfStockStockInfo : totalStock < 10 ? styles.lowStockInfo : null
                ]}>
                  {outOfStock 
                    ? "Out of Stock" 
                    : totalStock < 10 
                      ? `Low Stock: ${totalStock}`
                      : `In Stock: ${totalStock}`
                  }
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
