import React, { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ActivityIndicator, 
  Dimensions,
  Image,
  TextInput,
  Alert,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface editedBy {
  warehousemanId: number;
  at: string;
}

interface Stock {
  id: number;
  name: string;
  quantity: number;
  localisation: {
    city: string;
    latitude: number;
    longitude: number;
  };
}

interface ScanResultModalProps {
    isVisible: boolean;
    onDismiss: () => void;
    productData?: {
      id: number;
      name: string;
      barcode: string;
      stocks: Stock[];
      type: string;
      image: string;
      price: number;
      supplier: string;
      editedBy: editedBy[];
    } | null;
    isLoading?: boolean;
    onUpdateProduct?: (barcode: string, updatedData: any) => void;
}

export default function ScanResultModal({ 
  isVisible, 
  onDismiss, 
  productData, 
  isLoading,
  onUpdateProduct 
}: ScanResultModalProps) {
  const [activeTab, setActiveTab] = useState('info');
  const [editedProduct, setEditedProduct] = useState({
    name: '',
    quantity: '',
    price: '',
    type: '',
  });

  const [isAddingProduct, setIsAddingProduct] = useState(true);
  const [isAddingStock, setIsAddingStock] = useState(false);
  const [createdProduct, setCreatedProduct] = useState<any>(null);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    type: '',
    price: '',
    barcode: '',
    supplier: '',
    image: ''
  });
  
  const [newStock, setNewStock] = useState({
    name: '',
    quantity: '',
    city: '',
    latitude: '',
    longitude: ''
  });

  useEffect(() => {
    if (productData) {
      setIsAddingProduct(false);
      setIsAddingStock(false);
      setEditedProduct({
        name: productData.name || '',
        quantity: productData.stocks?.[0]?.quantity?.toString() || '',     
        type: productData.type || '',
        price: productData.price?.toString() || '',
      });
    } else {
      setIsAddingProduct(true);
      setIsAddingStock(false);
    }
  }, [productData]);

  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('warehousemanData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  };

  const handleAddProduct = async () => {
    try {
      const userData = await getUserData();
      if (!userData) {
        Alert.alert('Error', 'User data not found');
        return;
      }

      const currentDate = new Date().toISOString().split('T')[0];

      const productToAdd = {
        name: newProduct.name,
        type: newProduct.type,
        barcode: newProduct.barcode || "temp-" + Date.now(),
        price: parseFloat(newProduct.price) || 0,
        supplier: newProduct.supplier,
        image: newProduct.image,
        stocks: [],
        editedBy: [{
          warehousemanId: userData.id,
          at: currentDate
        }]
      };

      console.log('Creating new product:', productToAdd);

      const response = await axios.post('http://172.16.9.4:3000/products', productToAdd);

      if (response.status === 201) {
        console.log('Product created successfully:', response.data);
        setCreatedProduct(response.data);
        setIsAddingProduct(false);
        setIsAddingStock(true);
        
        if (onUpdateProduct) {
          onUpdateProduct(productToAdd.barcode, response.data);
        }
      }
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Error', 'Failed to add product');
    }
  };

  const handleAddStock = async () => {
    try {
      const userData = await getUserData();
      if (!userData) {
        Alert.alert('Error', 'User data not found');
        return;
      }

      const targetProduct = createdProduct || productData;
      console.log('Target product for adding stock:', targetProduct);

      if (!targetProduct?.id) {
        console.error('Product ID missing. Available data:', { createdProduct, productData });
        Alert.alert('Error', 'Product ID is missing');
        return;
      }

      const stockToAdd = {
        id: Date.now(),
        name: newStock.name,
        quantity: parseInt(newStock.quantity) || 0,
        localisation: {
          city: newStock.city,
          latitude: parseFloat(newStock.latitude) || 0,
          longitude: parseFloat(newStock.longitude) || 0
        }
      };

      const getCurrentProduct = await axios.get(`http://172.16.9.4:3000/products/${targetProduct.id}`);
      const currentProduct = getCurrentProduct.data;

      const updatedProduct = {
        ...currentProduct,
        stocks: [...(currentProduct.stocks || []), stockToAdd],
        editedBy: [
          ...(currentProduct.editedBy || []),
          {
            warehousemanId: userData.id,
            at: new Date().toISOString().split('T')[0]
          }
        ]
      };

      console.log('Updating product with new stock:', updatedProduct);

      const response = await axios.put(
        `http://172.16.9.4:3000/products/${targetProduct.id}`,
        updatedProduct
      );

      if (response.status === 200) {
        console.log('Stock added successfully:', response.data);
        
        if (onUpdateProduct) {
          onUpdateProduct(updatedProduct.barcode, response.data);
        }

        Alert.alert(
          'Success',
          'Stock added successfully',
          [{
            text: 'OK',
            onPress: () => {
              setNewStock({
                name: '',
                quantity: '',
                city: '',
                latitude: '',
                longitude: ''
              });
              setCreatedProduct(null);
              onDismiss();
            }
          }]
        );
      }
    } catch (error) {
      console.error('Error adding stock:', error);
      Alert.alert('Error', 'Failed to add stock. Please try again.');
    }
  };

  const handleUpdate = async () => {
    try {
      if (!productData?.id) {
        Alert.alert('Error', 'Product ID is missing');
        return;
      }

      const userData = await getUserData();
      if (!userData) {
        Alert.alert('Error', 'User data not found');
        return;
      }

      const response = await axios.get(`http://172.16.9.4:3000/products/${productData.id}`);
      const currentProduct = response.data;

      if (!currentProduct) {
        Alert.alert('Error', 'Product not found in database');
        return;
      }

      const currentDate = new Date().toISOString().split('T')[0];

      const updatedData = {
        ...currentProduct,
        name: editedProduct.name || currentProduct.name,
        type: editedProduct.type || currentProduct.type,
        price: parseFloat(editedProduct.price) || currentProduct.price,
        stocks: currentProduct.stocks.map((stock: Stock) => {
          if (stock.id === currentProduct.stocks[0].id) {
            return {
              ...stock,
              quantity: parseInt(editedProduct.quantity) || stock.quantity
            };
          }
          return stock;
        }),
        editedBy: [
          ...(currentProduct.editedBy || []),
          {
            warehousemanId: userData.id,
            at: currentDate
          }
        ]
      };

      const updateResponse = await axios.put(
        `http://172.16.9.4:3000/products/${productData.id}`,
        updatedData
      );

      if (updateResponse.status === 200) {
        Alert.alert(
          'Success',
          'Product updated successfully',
          [{
            text: 'OK',
            onPress: () => {
              if (onUpdateProduct) {
                onUpdateProduct(productData.barcode, updateResponse.data);
              }
              onDismiss();
            }
          }]
        );
      }
    } catch (error: any) {
      console.error('Error updating product:', error);
      Alert.alert('Error', 'Failed to update product');
    }
  };

  const validateStockForm = () => {
    const targetProduct = createdProduct || productData;
    
    if (!targetProduct?.id) {
      console.error('Product ID missing in validation. Available data:', { createdProduct, productData });
      Alert.alert('Error', 'Product ID is missing');
      return false;
    }
    if (!newStock.name) {
      Alert.alert('Error', 'Stock name is required');
      return false;
    }
    if (!newStock.quantity) {
      Alert.alert('Error', 'Quantity is required');
      return false;
    }
    if (!newStock.city) {
      Alert.alert('Error', 'City is required');
      return false;
    }
    return true;
  };

  const handleSubmitStock = async () => {
    if (validateStockForm()) {
      await handleAddStock();
    }
  };


return (
  <Modal
    visible={isVisible}
    transparent={true}
    animationType="slide"
    onRequestClose={onDismiss}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <TouchableOpacity style={styles.closeButton} onPress={onDismiss}>
          <MaterialCommunityIcons name="close" size={24} color="#666" />
        </TouchableOpacity>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF9F43" />
            <Text style={styles.loadingText}>Searching for product...</Text>
          </View>
        ) : productData ? (
          <>
            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'info' && styles.activeTab]}
                onPress={() => setActiveTab('info')}
              >
                <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>Info</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'edit' && styles.activeTab]}
                onPress={() => setActiveTab('edit')}
              >
                <Text style={[styles.tabText, activeTab === 'edit' && styles.activeTabText]}>Edit</Text>
              </TouchableOpacity>
            </View>

            {activeTab === 'info' ? (
              <View style={styles.detailsContainer}>
                {productData.image ? (
                  <Image 
                    source={{ uri: productData.image }} 
                    style={styles.productImage}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.noImageContainer}>
                    <MaterialCommunityIcons name="image-off" size={50} color="#ccc" />
                    <Text style={styles.noImageText}>No image available</Text>
                  </View>
                )}

                <Text style={styles.productName}>{productData.name}</Text>
                
                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <MaterialCommunityIcons name="barcode" size={24} color="#FF9F43" />
                    <Text style={styles.infoLabel}>Barcode</Text>
                    <Text style={styles.infoValue}>{productData.barcode}</Text>
                  </View>

                  <View style={styles.infoItem}>
                    <MaterialCommunityIcons name="shape" size={24} color="#FF9F43" />
                    <Text style={styles.infoLabel}>Type</Text>
                    <Text style={styles.infoValue}>{productData.type}</Text>
                  </View>

                  <View style={styles.infoItem}>
                    <MaterialCommunityIcons name="package-variant" size={24} color="#FF9F43" />
                    <Text style={styles.infoLabel}>Current Stock</Text>
                    <Text style={styles.infoValue}>{productData.stocks?.[0]?.quantity || 0}</Text>
                  </View>

                  {productData.price && (
                    <View style={styles.infoItem}>
                      <MaterialCommunityIcons name="cash" size={24} color="#FF9F43" />
                      <Text style={styles.infoLabel}>Price</Text>
                      <Text style={styles.infoValue}>${productData.price}</Text>
                    </View>
                  )}
                </View>
              </View>
            ) : (
              <View style={styles.editContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Name</Text>
                  <TextInput
                    style={styles.input}
                    value={editedProduct.name}
                    onChangeText={(text) => setEditedProduct(prev => ({ ...prev, name: text }))}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Quantity</Text>
                  <TextInput
                    style={styles.input}
                    value={editedProduct.quantity}
                    onChangeText={(text) => setEditedProduct(prev => ({ ...prev, quantity: text }))}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Price</Text>
                  <TextInput
                    style={styles.input}
                    value={editedProduct.price}
                    onChangeText={(text) => setEditedProduct(prev => ({ ...prev, price: text }))}
                    keyboardType="decimal-pad"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Type</Text>
                  <TextInput
                    style={styles.input}
                    value={editedProduct.type}
                    onChangeText={(text) => setEditedProduct(prev => ({ ...prev, type: text }))}
                  />
                </View>

                <TouchableOpacity 
                  style={styles.updateButton}
                  onPress={handleUpdate}
                >
                  <MaterialCommunityIcons name="check" size={24} color="white" />
                  <Text style={styles.updateButtonText}>Update Product</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : isAddingStock ? (
          <ScrollView style={styles.formContainer}>
            <Text style={styles.formTitle}>Add New Stock</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Stock Name</Text>
              <TextInput
                style={styles.input}
                value={newStock.name}
                onChangeText={(text) => setNewStock(prev => ({ ...prev, name: text }))}
                placeholder="Enter stock name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Quantity</Text>
              <TextInput
                style={styles.input}
                value={newStock.quantity}
                onChangeText={(text) => setNewStock(prev => ({ ...prev, quantity: text }))}
                keyboardType="numeric"
                placeholder="Enter quantity"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>City</Text>
              <TextInput
                style={styles.input}
                value={newStock.city}
                onChangeText={(text) => setNewStock(prev => ({ ...prev, city: text }))}
                placeholder="Enter city"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Latitude</Text>
              <TextInput
                style={styles.input}
                value={newStock.latitude}
                onChangeText={(text) => setNewStock(prev => ({ ...prev, latitude: text }))}
                keyboardType="decimal-pad"
                placeholder="Enter latitude"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Longitude</Text>
              <TextInput
                style={styles.input}
                value={newStock.longitude}
                onChangeText={(text) => setNewStock(prev => ({ ...prev, longitude: text }))}
                keyboardType="decimal-pad"
                placeholder="Enter longitude"
              />
            </View>

            <TouchableOpacity 
  style={[
    styles.submitButton,
    (!newStock.name || !newStock.quantity || !newStock.city) && styles.submitButtonDisabled
  ]}
  onPress={handleSubmitStock}
  disabled={!newStock.name || !newStock.quantity || !newStock.city}
>
  <Text style={styles.submitButtonText}>Add Stock</Text>
</TouchableOpacity>
          </ScrollView>
        ) : (
          <ScrollView style={styles.formContainer}>
            <Text style={styles.formTitle}>Add New Product</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Barcode</Text>
              <TextInput
                style={styles.input}
                value={newProduct.barcode || productData?.barcode}
                onChangeText={(text) => setNewProduct(prev => ({ ...prev, barcode: text }))}
                placeholder="Enter or scan barcode"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={newProduct.name}
                onChangeText={(text) => setNewProduct(prev => ({ ...prev, name: text }))}
                placeholder="Enter product name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Type</Text>
              <TextInput
                style={styles.input}
                value={newProduct.type}
                onChangeText={(text) => setNewProduct(prev => ({ ...prev, type: text }))}
                placeholder="Enter product type"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Price</Text>
              <TextInput
                style={styles.input}
                value={newProduct.price}
                onChangeText={(text) => setNewProduct(prev => ({ ...prev, price: text }))}
                keyboardType="decimal-pad"
                placeholder="Enter price"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Supplier</Text>
              <TextInput
                style={styles.input}
                value={newProduct.supplier}
                onChangeText={(text) => setNewProduct(prev => ({ ...prev, supplier: text }))}
                placeholder="Enter supplier"
              />
            </View>

           <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleAddProduct}
            >
              <Text style={styles.submitButtonText}>Next: Add Stock</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </View>
  </Modal>
);


}


const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 20,
    width: '90%',
    maxHeight: SCREEN_HEIGHT * 0.8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF9F43',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#FF9F43',
    fontWeight: 'bold',
  },
  detailsContainer: {
    padding: 15,
  },
  productImage: {
    width: '100%',
    height: 200,
    marginBottom: 15,
    borderRadius: 10,
  },
  noImageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
  },
  noImageText: {
    color: '#999',
    marginTop: 10,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#11181C',
    marginBottom: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#11181C',
    marginTop: 5,
  },
  editContainer: {
    padding: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9F43',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 20,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  notFoundContainer: {
    padding: 20,
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginTop: 10,
  },
  notFoundSubText: {
    color: '#666',
    marginTop: 5,
  },
  addProductContainer: {
    padding: 20,
    alignItems: 'center',
  },
  addProductTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  addProductSubTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  formContainer: {
    padding: 20,
    width: '100%',
    maxHeight: SCREEN_HEIGHT * 0.6,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9F43',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#FF9F43',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
