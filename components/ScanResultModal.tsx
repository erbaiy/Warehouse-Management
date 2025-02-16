import React, { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { updateStatistics } from '../services/productService';
import Toast from 'react-native-toast-message';
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
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '@/config/axios';
import axios from 'axios';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface EditedBy {
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
    editedBy: EditedBy[];
  } | null;
  isLoading?: boolean;
  onUpdateProduct?: (barcode: string, updatedData: any) => void;
  scannedBarcode: string;
}

export default function ScanResultModal({
  isVisible,
  onDismiss,
  productData,
  isLoading,
  onUpdateProduct,
  scannedBarcode,
}: ScanResultModalProps) {
  const [activeTab, setActiveTab] = useState('info');
  const [editedProduct, setEditedProduct] = useState({
    name: '',
    quantity: '',
    price: '',
    type: '',
  });

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingStock, setIsAddingStock] = useState(false);
  const [createdProduct, setCreatedProduct] = useState<any>(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    type: '',
    price: '',
    supplier: '',
    image: '',
  });

  const [newStock, setNewStock] = useState({
    name: '',
    quantity: '',
    city: '',
    latitude: '',
    longitude: '',
  });

  const [showAddProductPrompt, setShowAddProductPrompt] = useState(false);

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
    } else if (!isLoading) {
      setShowAddProductPrompt(true);
    }
  }, [productData, isLoading]);

  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('warehousemanData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    Toast.show({
      type,
      text1: type === 'success' ? 'Success' : 'Error',
      text2: message,
    });
  };

  const handleAddProduct = async () => {
    try {
      const userData = await getUserData();
      if (!userData) {
        showToast('error', 'User data not found');
        return;
      }

      const currentDate = new Date().toISOString().split('T')[0];

      const productToAdd = {
        name: newProduct.name,
        type: newProduct.type,
        barcode: scannedBarcode,
        price: parseFloat(newProduct.price) || 0,
        supplier: newProduct.supplier,
        image: newProduct.image,
        stocks: [],
        editedBy: [
          {
            warehousemanId: userData.id,
            at: currentDate,
          },
        ],
      };

      const statsResponse = await apiClient.get('statistics');
      let currentStats = statsResponse.data;

      const productResponse = await apiClient.post('products', productToAdd);

      if (productResponse.status === 201) {
        const updatedStats = updateStatistics(currentStats, 'add', productResponse.data, 0);
        await apiClient.put('statistics', updatedStats);

        setCreatedProduct(productResponse.data);
        setIsAddingProduct(false);
        setIsAddingStock(true);

        if (onUpdateProduct) {
          onUpdateProduct(scannedBarcode, productResponse.data);
        }

        showToast('success', 'Product added successfully');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      showToast('error', 'Failed to add product');
    }
  };

  const handleAddStock = async () => {
    try {
      const userData = await getUserData();
      if (!userData) {
        showToast('error', 'User data not found');
        return;
      }

      const targetProduct = createdProduct || productData;
      if (!targetProduct?.id) {
        showToast('error', 'Product ID is missing');
        return;
      }

      const stockToAdd = {
        id: Date.now(),
        name: newStock.name,
        quantity: parseInt(newStock.quantity) || 0,
        localisation: {
          city: newStock.city,
          latitude: parseFloat(newStock.latitude) || 0,
          longitude: parseFloat(newStock.longitude) || 0,
        },
      };

      const getCurrentProduct = await apiClient.get(`products/${targetProduct.id}`);
      const currentProduct = getCurrentProduct.data;

      const updatedProduct = {
        ...currentProduct,
        stocks: [...(currentProduct.stocks || []), stockToAdd],
        editedBy: [
          ...(currentProduct.editedBy || []),
          {
            warehousemanId: userData.id,
            at: new Date().toISOString().split('T')[0],
          },
        ],
      };

      const response = await apiClient.put(`products/${targetProduct.id}`, updatedProduct);

      if (response.status === 200) {
        if (onUpdateProduct) {
          onUpdateProduct(updatedProduct.barcode, response.data);
        }

        showToast('success', 'Stock added successfully');
        setNewStock({
          name: '',
          quantity: '',
          city: '',
          latitude: '',
          longitude: '',
        });
        setCreatedProduct(null);
        onDismiss();
      }
    } catch (error) {
      console.error('Error adding stock:', error);
      showToast('error', 'Failed to add stock');
    }
  };

  const handleUpdate = async () => {
    try {
      if (!productData?.id) {
        showToast('error', 'Product ID is missing');
        return;
      }

      const userData = await getUserData();
      if (!userData) {
        showToast('error', 'User data not found');
        return;
      }

      const currentDate = new Date().toISOString().split('T')[0];

      const updatedData = {
        id: productData.id,
        name: editedProduct.name,
        type: editedProduct.type,
        price: parseFloat(editedProduct.price),
        barcode: scannedBarcode,
        stocks: [
          {
            id: productData.stocks?.[0]?.id || 1,
            quantity: parseInt(editedProduct.quantity),
          }
        ],
        editedBy: [
          {
            warehousemanId: userData.id,
            at: currentDate,
          }
        ]
      };

      const updateResponse = await apiClient.put(`products/${productData.id}`, updatedData);

      if (updateResponse.status === 200) {
        showToast('success', 'Product updated successfully');
        if (onUpdateProduct) {
          onUpdateProduct(scannedBarcode, updateResponse.data);
        }
        onDismiss();
      }
    } catch (error) {
      console.error('Error updating product:', error);
      showToast('error', 'Failed to update product');
    }
  };

  const validateStockForm = () => {
    if (!newStock.name || !newStock.quantity || !newStock.city) {
      showToast('error', 'Please fill all required fields');
      return false;
    }
    return true;
  };

  const handleSubmitStock = async () => {
    if (validateStockForm()) {
      await handleAddStock();
    }
  };

  const handleAddProductPrompt = () => {
    setShowAddProductPrompt(false);
    setIsAddingProduct(true);
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide" onRequestClose={onDismiss}>
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
                    <Image source={{ uri: productData.image }} style={styles.productImage} resizeMode="contain" />
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
                      <Text style={styles.infoValue}>{scannedBarcode}</Text>
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
                      onChangeText={(text) => setEditedProduct((prev) => ({ ...prev, name: text }))}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Quantity</Text>
                    <TextInput
                      style={styles.input}
                      value={editedProduct.quantity}
                      onChangeText={(text) => setEditedProduct((prev) => ({ ...prev, quantity: text }))}
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Price</Text>
                    <TextInput
                      style={styles.input}
                      value={editedProduct.price}
                      onChangeText={(text) => setEditedProduct((prev) => ({ ...prev, price: text }))}
                      keyboardType="decimal-pad"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Type</Text>
                    <TextInput
                      style={styles.input}
                      value={editedProduct.type}
                      onChangeText={(text) => setEditedProduct((prev) => ({ ...prev, type: text }))}
                    />
                  </View>

                  <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
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
                  onChangeText={(text) => setNewStock((prev) => ({ ...prev, name: text }))}
                  placeholder="Enter stock name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Quantity</Text>
                <TextInput
                  style={styles.input}
                  value={newStock.quantity}
                  onChangeText={(text) => setNewStock((prev) => ({ ...prev, quantity: text }))}
                  keyboardType="numeric"
                  placeholder="Enter quantity"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>City</Text>
                <TextInput
                  style={styles.input}
                  value={newStock.city}
                  onChangeText={(text) => setNewStock((prev) => ({ ...prev, city: text }))}
                  placeholder="Enter city"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Latitude</Text>
                <TextInput
                  style={styles.input}
                  value={newStock.latitude}
                  onChangeText={(text) => setNewStock((prev) => ({ ...prev, latitude: text }))}
                  keyboardType="decimal-pad"
                  placeholder="Enter latitude"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Longitude</Text>
                <TextInput
                  style={styles.input}
                  value={newStock.longitude}
                  onChangeText={(text) => setNewStock((prev) => ({ ...prev, longitude: text }))}
                  keyboardType="decimal-pad"
                  placeholder="Enter longitude"
                />
              </View>

              <TouchableOpacity
                style={[styles.submitButton, (!newStock.name || !newStock.quantity || !newStock.city) && styles.submitButtonDisabled]}
                onPress={handleSubmitStock}
                disabled={!newStock.name || !newStock.quantity || !newStock.city}
              >
                <Text style={styles.submitButtonText}>Add Stock</Text>
              </TouchableOpacity>
            </ScrollView>
          ) : showAddProductPrompt ? (
            <View style={styles.promptContainer}>
              <Text style={styles.promptText}>Product not found. Would you like to add it?</Text>
              <TouchableOpacity style={styles.promptButton} onPress={handleAddProductPrompt}>
                <Text style={styles.promptButtonText}>Add Product</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView style={styles.formContainer}>
              <Text style={styles.formTitle}>Add New Product</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Barcode</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={scannedBarcode}
                  editable={false}
                  placeholder="Scanned barcode"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={newProduct.name}
                  onChangeText={(text) => setNewProduct((prev) => ({ ...prev, name: text }))}
                  placeholder="Enter product name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Type</Text>
                <TextInput
                  style={styles.input}
                  value={newProduct.type}
                  onChangeText={(text) => setNewProduct((prev) => ({ ...prev, type: text }))}
                  placeholder="Enter product type"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Price</Text>
                <TextInput
                  style={styles.input}
                  value={newProduct.price}
                  onChangeText={(text) => setNewProduct((prev) => ({ ...prev, price: text }))}
                  keyboardType="decimal-pad"
                  placeholder="Enter price"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Supplier</Text>
                <TextInput
                  style={styles.input}
                  value={newProduct.supplier}
                  onChangeText={(text) => setNewProduct((prev) => ({ ...prev, supplier: text }))}
                  placeholder="Enter supplier"
                />
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleAddProduct}>
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
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#666',
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
  formContainer: {
    padding: 20,
    width: '100%',
    maxHeight: SCREEN_HEIGHT * 0.6,
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
  },
  promptContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  promptText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  promptButton: {
    backgroundColor: '#FF9F43',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  promptButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});