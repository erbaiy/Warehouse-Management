import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { View } from 'react-native';
import Header from '@/components/Header';

export default function TabLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#000000',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            height: 45,
            paddingBottom: 5,
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            borderRadius: 25,
            paddingHorizontal: 10,
          },
          tabBarItemStyle: {
            padding: 0,
            marginTop: 0,
            height: 45,
          },
          header: ({ route }) => {
            let title = '';
            switch (route.name) {
              case 'index':
                title = 'Dashboard';
                break;
              case 'product':
                title = 'Products';
                break;
              case 'scanner':
                title = 'Scanner';
                break;
              case 'profile':
                title = 'Profile';
                break;
              default:
                title = 'Warehouse';
            }
            return <Header title={title} />;
          },
          tabBarShowLabel: false,
          tabBarBackground: () => (
            <View style={{ 
              backgroundColor: '#000000', 
              flex: 1,
              borderRadius: 25,
            }} />
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} name="home" />
            ),
          }}
        />
        <Tabs.Screen
          name="product"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} name="shopping-cart" />
            ),
          }}
        />
        <Tabs.Screen
          name="scanner"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} name="qrcode" />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} name="user" />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

function TabBarIcon({ focused, name }: { 
  focused: boolean, 
  name: React.ComponentProps<typeof FontAwesome>['name'] 
}) {
  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      height: '100%',
    }}>
      <FontAwesome
        name={name}
        size={20}
        color={focused ? '#FFFFFF' : '#666666'}
      />
      {focused && (
        <View style={{
          position: 'absolute',
          bottom: 5,
          width: 3,
          height: 3,
          borderRadius: 1.5,
          backgroundColor: '#FFFFFF',
        }} />
      )}
    </View>
  );
}
