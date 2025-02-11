// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FontAwesome } from '@expo/vector-icons';
import { View } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 45, // Reduced height
          paddingBottom: 5,
          position: 'absolute',
          bottom: 20, // Add some space from bottom
          left: 20,
          right: 20,
          borderRadius: 25, // Rounded corners
          paddingHorizontal: 10,
        },
        tabBarItemStyle: {
          padding: 0,
          marginTop: 0,
          height: 45,
        },
        headerShown: false,
        tabBarShowLabel: false, // Hide tab labels
        tabBarBackground: () => (
          <View style={{ 
            backgroundColor: '#000000', 
            flex: 1,
            borderRadius: 25,
          }} />
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              height: '100%',
            }}>
              <FontAwesome
                name="home"
                size={20} // Slightly smaller icons
                color={focused ? '#ffffff' : '#666666'}
              />
              {focused && (
                <View style={{
                  position: 'absolute',
                  bottom: 5,
                  width: 3,
                  height: 3,
                  borderRadius: 1.5,
                  backgroundColor: '#ffffff',
                }} />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="product"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              height: '100%',
            }}>
              <FontAwesome
                name="shopping-cart"
                size={20}
                color={focused ? '#ffffff' : '#666666'}
              />
              {focused && (
                <View style={{
                  position: 'absolute',
                  bottom: 5,
                  width: 3,
                  height: 3,
                  borderRadius: 1.5,
                  backgroundColor: '#ffffff',
                }} />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              height: '100%',
            }}>
              <FontAwesome
                name="user"
                size={20}
                color={focused ? '#ffffff' : '#666666'}
              />
              {focused && (
                <View style={{
                  position: 'absolute',
                  bottom: 5,
                  width: 3,
                  height: 3,
                  borderRadius: 1.5,
                  backgroundColor: '#ffffff',
                }} />
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
