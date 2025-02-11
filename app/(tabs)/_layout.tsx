// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          // Add your tab bar styling here
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          // Add your tab options here
        }}
      />
      {/* Add more tab screens as needed */}
    </Tabs>
  );
}