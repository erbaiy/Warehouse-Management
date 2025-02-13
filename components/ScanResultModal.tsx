
// // components/ScanResultModal.tsx
// import React, { useState, useEffect } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   Modal, 
//   TouchableOpacity, 
//   ActivityIndicator, 
//   Dimensions,
//   Image,
//   TextInput 
// } from 'react-native';

// const SCREEN_HEIGHT = Dimensions.get('window').height;

// interface ScanResultModalProps {
//     isVisible: boolean;
//     onDismiss: () => void;
//     productData?: {
//       name?: string;
//       barcode?: string;
//       quantity?: number;
//       type?: string;
//       image?: string;
//       price?: number;
//       description?: string;
//     } | null;
//     isLoading?: boolean;
//     onUpdateProduct?: (barcode: string, updatedData: any) => void;
//   }

//   export default function ScanResultModal({ 
//   isVisible, 
//   onDismiss, 
//   productData, 
//   isLoading,
//   onUpdateProduct 
// }: ScanResultModalProps) {
//   const [activeTab, setActiveTab] = useState('info');
//   const [editedProduct, setEditedProduct] = useState({
//     name: '',
//     quantity: '',
//     price: '',
//     type: '',
//     description: ''
//   });

//   useEffect(() => {
//     if (productData) {
//       setEditedProduct({
//         name: productData.name || '',
//         quantity: productData.quantity?.toString() || '',
//         price: productData.price?.toString() || '',
//         category: productData.category || '',
//         description: productData.description || ''
//       });
//     }
//   }, [productData]);

//   const handleUpdate = () => {
//     if (productData?.barcode && onUpdateProduct) {
//       const updatedData = {
//         ...editedProduct,
//         quantity: parseInt(editedProduct.quantity) || 0,
//         price: parseFloat(editedProduct.price) || 0
//       };
//       onUpdateProduct(productData.barcode, updatedData);
//       onDismiss();
//     }
//   };

//   return (
//     <Modal
//       visible={isVisible}
//       transparent={true}
//       animationType="slide"
//       onRequestClose={onDismiss}
//       >
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContent}>
//           <TouchableOpacity style={styles.closeButton} onPress={onDismiss}>
//             <MaterialCommunityIcons name="close" size={24} color="#666" />
//           </TouchableOpacity>

//           {isLoading ? (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="large" color="#FF9F43" />
//               <Text style={styles.loadingText}>Searching for product...</Text>
//             </View>
//           ) : productData ? (
//             <>
//               <View style={styles.tabContainer}>
//                 <TouchableOpacity 
//                   style={[styles.tab, activeTab === 'info' && styles.activeTab]}
//                   onPress={() => setActiveTab('info')}
//                 >
//                   <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>Info</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity 
//                   style={[styles.tab, activeTab === 'edit' && styles.activeTab]}
//                   onPress={() => setActiveTab('edit')}
//                   >
//                   <Text style={[styles.tabText, activeTab === 'edit' && styles.activeTabText]}>Edit</Text>
//                 </TouchableOpacity>
//               </View>

//               {activeTab === 'info' ? (
//                 <View style={styles.detailsContainer}>
//                   {productData.image ? (
//                     <Image 
//                       source={{ uri: productData.image }} 
//                       style={styles.productImage}
//                       resizeMode="contain"
//                     />
//                   ) : (
//                     <View style={styles.noImageContainer}>
//                       <MaterialCommunityIcons name="image-off" size={50} color="#ccc" />
//                       <Text style={styles.noImageText}>No image available</Text>
//                     </View>
//                   )}

//                   <Text style={styles.productName}>{productData.name}</Text>
                  
//                   <View style={styles.infoGrid}>
//                     <View style={styles.infoItem}>
//                       <MaterialCommunityIcons name="barcode" size={24} color="#FF9F43" />
//                       <Text style={styles.infoLabel}>Barcode</Text>
//                       <Text style={styles.infoValue}>{productData.barcode}</Text>
//                     </View>

//                     <View style={styles.infoItem}>
//                       <MaterialCommunityIcons name="shape" size={24} color="#FF9F43" />
//                       <Text style={styles.infoLabel}>Category</Text>
//                       <Text style={styles.infoValue}>{productData.category}</Text>
//                     </View>

//                     <View style={styles.infoItem}>
//                       <MaterialCommunityIcons name="package-variant" size={24} color="#FF9F43" />
//                       <Text style={styles.infoLabel}>Current Stock</Text>
//                       <Text style={styles.infoValue}>{productData.quantity || 0}</Text>
//                     </View>

//                     {productData.price && (
//                       <View style={styles.infoItem}>
//                         <MaterialCommunityIcons name="cash" size={24} color="#FF9F43" />
//                         <Text style={styles.infoLabel}>Price</Text>
//                         <Text style={styles.infoValue}>${productData.price}</Text>
//                       </View>
//                     )}
//                   </View>
//                 </View>
//               ) : (
//                 <View style={styles.editContainer}>
//                   <View style={styles.inputGroup}>
//                     <Text style={styles.inputLabel}>Name</Text>
//                     <TextInput
//                       style={styles.input}
//                       value={editedProduct.name}
//                       onChangeText={(text) => setEditedProduct(prev => ({ ...prev, name: text }))}
//                     />
//                   </View>

//                   <View style={styles.inputGroup}>
//                     <Text style={styles.inputLabel}>Quantity</Text>
//                     <TextInput
//                       style={styles.input}
//                       value={editedProduct.quantity}
//                       onChangeText={(text) => setEditedProduct(prev => ({ ...prev, quantity: text }))}
//                       keyboardType="numeric"
//                     />
//                   </View>

//                   <View style={styles.inputGroup}>
//                     <Text style={styles.inputLabel}>Price</Text>
//                     <TextInput
//                       style={styles.input}
//                       value={editedProduct.price}
//                       onChangeText={(text) => setEditedProduct(prev => ({ ...prev, price: text }))}
//                       keyboardType="decimal-pad"
//                     />
//                   </View>

//                   <View style={styles.inputGroup}>
//                     <Text style={styles.inputLabel}>Category</Text>
//                     <TextInput
//                       style={styles.input}
//                       value={editedProduct.category}
//                       onChangeText={(text) => setEditedProduct(prev => ({ ...prev, category: text }))}
//                     />
//                   </View>

//                   <TouchableOpacity 
//                     style={styles.updateButton}
//                     onPress={handleUpdate}
//                   >
//                     <MaterialCommunityIcons name="check" size={24} color="white" />
//                     <Text style={styles.updateButtonText}>Update Product</Text>
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </>
//           ) : (
//             <View style={styles.notFoundContainer}>
//               <MaterialCommunityIcons name="alert-circle" size={60} color="#FF6B6B" />
//               <Text style={styles.notFoundText}>Product not found</Text>
//               <Text style={styles.notFoundSubText}>This product is not in the database</Text>
//             </View>
//           )}
//         </View>
//       </View>
//     </Modal>
//   );
// }


// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     borderRadius: 25,
//     padding: 20,
//     width: '90%',
//     maxHeight: SCREEN_HEIGHT * 0.8,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   closeButton: {
//     position: 'absolute',
//     right: 15,
//     top: 15,
//     zIndex: 1,
//   },
//   productImage: {
//     width: '100%',
//     height: 200,
//     marginBottom: 15,
//     borderRadius: 10,
//   },
//   noImageContainer: {
//     width: '100%',
//     height: 200,
//     backgroundColor: '#f5f5f5',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 10,
//     marginBottom: 15,
//   },
//   noImageText: {
//     color: '#999',
//     marginTop: 10,
//   },
//   productName: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     color: '#11181C',
//     marginBottom: 20,
//   },
//   infoGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   infoItem: {
//     width: '48%',
//     backgroundColor: '#f5f5f5',
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 10,
//     alignItems: 'center',
//   },
//   infoLabel: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 5,
//   },
//   infoValue: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#11181C',
//     marginTop: 5,
//   },
//   quantityContainer: {
//     alignItems: 'center',
//     padding: 15,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 15,
//   },
//   quantityLabel: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 10,
//   },
//   quantityControls: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   quantityButton: {
//     backgroundColor: '#fff',
//     padding: 10,
//     borderRadius: 10,
//     marginHorizontal: 15,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 1.41,
//   },
//   quantityValue: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     minWidth: 40,
//     textAlign: 'center',
//   },
//   updateButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FF9F43',
//     paddingHorizontal: 25,
//     paddingVertical: 15,
//     borderRadius: 30,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   updateButtonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginLeft: 10,
//   },
//   loadingContainer: {
//     padding: 20,
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 10,
//     color: '#666',
//   },
//   notFoundContainer: {
//     padding: 20,
//     alignItems: 'center',
//   },
//   notFoundText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#FF6B6B',
//     marginTop: 10,
//   },
//   notFoundSubText: {
//     color: '#666',
//     marginTop: 5,
//   },

//   tabContainer: {
//     flexDirection: 'row',
//     marginBottom: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   tab: {
//     flex: 1,
//     paddingVertical: 15,
//     alignItems: 'center',
//   },
//   activeTab: {
//     borderBottomWidth: 2,
//     borderBottomColor: '#FF9F43',
//   },
//   tabText: {
//     fontSize: 16,
//     color: '#666',
//   },
//   activeTabText: {
//     color: '#FF9F43',
//     fontWeight: 'bold',
//   },
//   editContainer: {
//     padding: 15,
//   },
//   inputGroup: {
//     marginBottom: 15,
//   },
//   inputLabel: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 5,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 10,
//     fontSize: 16,
//   },
// });

// import { MaterialCommunityIcons } from '@expo/vector-icons';import { type } from './ui/IconSymbol';







// components/ScanResultModal.tsx
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
  Alert
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

  useEffect(() => {
    checkProducts();
}, []);
  useEffect(() => {
    if (productData) {
      setEditedProduct({
        name: productData.name || '',
        quantity: productData.stocks?.[0]?.quantity?.toString() || '',     
        type: productData.type || '',
        price: productData.price?.toString() || '',
      });
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
  
  const checkProducts = async () => {
    try {
        const response = await axios.get('http://172.16.9.4:3000/products');
        console.log('Available products:', response.data.map((p: any) => ({
            id: p.id,
            name: p.name
        })));
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

// Modified handleUpdate function
const handleUpdate = async () => {
    try {
        // First, let's check what products are available
        await checkProducts();
        
        console.log('Attempting to update product with ID:', productData?.id);
        console.log('Full product data:', productData);

        if (!productData?.id) {
            console.error('No product ID found');
            Alert.alert('Error', 'Product ID is missing');
            return;
        }

        const userData = await getUserData();
        if (!userData) {
            console.error('No user data found');
            Alert.alert('Error', 'User data not found');
            return;
        }

        // Get all products first
        const getAllProducts = await axios.get('http://172.16.9.4:3000/products');
        
        // Find the product we want to update
        const currentProduct = getAllProducts.data.find(
            (p: any) => p.id === productData.id
        );

        if (!currentProduct) {
            console.error('Product not found in database');
            Alert.alert('Error', 'Product not found in database');
            return;
        }

        const currentDate = new Date().toISOString().split('T')[0];

        const updatedData = {
            ...currentProduct,
            name: editedProduct.name || currentProduct.name,
            type: editedProduct.type || currentProduct.type,
            barcode: productData.barcode,
            price: parseFloat(editedProduct.price) || currentProduct.price,
            supplier: currentProduct.supplier,
            image: currentProduct.image,
            stocks: currentProduct.stocks.map((stock: Stock) => {
                if (stock.id === productData.stocks[0].id) {
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

        console.log('Sending update with data:', updatedData);

        const response = await axios.put(
            `http://172.16.9.4:3000/products/${productData.id}`,
            updatedData
        );

        console.log('Update response:', response.data);

        if (response.status === 200) {
            Alert.alert(
                'Success',
                'Product updated successfully',
                [{
                    text: 'OK',
                    onPress: () => {
                        if (onUpdateProduct) {
                            onUpdateProduct(productData.barcode, response.data);
                        }
                        onDismiss();
                    }
                }]
            );
        }

    } catch (error: any) {
        console.error('Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        
        Alert.alert(
            'Error',
            `Failed to update product: ${error.message}`
        );
    }
};



//   const getUserData = async () => {
//     try {
//       const userData = await AsyncStorage.getItem('warehousemanData');
//       return userData ? JSON.parse(userData) : null;
//     } catch (error) {
//       console.error('Error getting user data:', error);
//       return null;
//     }
//   };
//   console.log('Product Data:', getUserData());
  
//   const handleUpdate = async () => {
//     if (productData?.barcode) {
//       try {
//         const updatedData = {
//           barcode: productData.barcode,
//           name: editedProduct.name,
//           quantity: parseInt(editedProduct.quantity) || 0,
//           price: parseFloat(editedProduct.price) || 0,
//           type: editedProduct.type,
//           image: productData.image
//         };

//         console.log('Attempting to update product with barcode:', productData.barcode);
//         console.log('Update data:', updatedData);

//         const url = `http://172.16.9.4:3000/products/${productData.id}`;
//         console.log('Request URL:', url);
      

//         const response = await axios.patch(url, updatedData);

        
//         console.log('Server response:', response.data);

//         if (response.status === 200) {
          
//           console.log('Update successful');
//           Alert.alert(
//             'Success',
//             'Product updated successfully',
//             [
//               {
//                 text: 'OK',
//                 onPress: () => {
//                   if (onUpdateProduct) {
//                     onUpdateProduct(productData.barcode, response.data);
//                   }
//                   onDismiss();
//                 }
//               }
//             ]
//           );
//         }
//       } catch (error) {
//         console.error('Error details:', error.response?.data || error.message);
//         Alert.alert(
//           'Error',
//           'Failed to update product. Check console for details.'
//         );
//       }
//     }
// };


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
                      <Text style={styles.infoValue}>{productData.quantity || 0}</Text>
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
          ) : (
            <View style={styles.notFoundContainer}>
              <MaterialCommunityIcons name="alert-circle" size={60} color="#FF6B6B" />
              <Text style={styles.notFoundText}>Product not found</Text>
              <Text style={styles.notFoundSubText}>This product is not in the database</Text>
            </View>
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
    padding: 20,
    alignItems: 'center',
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
});
