// app/modal/add-product.tsx
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function AddProductScreen() {
  const { barcode } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Add Product Screen</Text>
      <Text>Barcode: {barcode}</Text>
    </View>
  );
}
