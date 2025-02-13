// app/modal/_layout.tsx
import { Stack } from 'expo-router';

export default function ModalLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="add-product"
        options={{
          presentation: 'modal',
          title: 'Add Product',
        }}
      />
    </Stack>
  );
}
