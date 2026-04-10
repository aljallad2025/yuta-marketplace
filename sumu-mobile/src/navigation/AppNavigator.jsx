import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { useApp } from '../context/AppContext';
import { COLORS, FONTS } from '../constants/theme';

import HomeScreen from '../screens/HomeScreen';
import StoresScreen from '../screens/StoresScreen';
import StoreScreen from '../screens/StoreScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderPlacedScreen from '../screens/OrderPlacedScreen';
import OrdersScreen from '../screens/OrdersScreen';
import TaxiScreen from '../screens/TaxiScreen';
import AccountScreen from '../screens/AccountScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Store" component={StoreScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderPlaced" component={OrderPlacedScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}

function StoresStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StoresMain" component={StoresScreen} />
      <Stack.Screen name="Store" component={StoreScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderPlaced" component={OrderPlacedScreen} />
    </Stack.Navigator>
  );
}

function AccountStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AccountMain" component={AccountScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { isAr, cartCount, activeOrders } = useApp();

  const t = (ar, en) => isAr ? ar : en;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main">
          {() => (
            <Tab.Navigator
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: '#BBB',
                tabBarLabelStyle: styles.tabLabel,
                tabBarIcon: ({ focused, color, size }) => {
                  const icons = {
                    Home:    focused ? 'home' : 'home-outline',
                    Stores:  focused ? 'grid' : 'grid-outline',
                    Orders:  focused ? 'bag' : 'bag-outline',
                    Taxi:    focused ? 'car' : 'car-outline',
                    Account: focused ? 'person' : 'person-outline',
                  };
                  return <Ionicons name={icons[route.name] || 'ellipse'} size={22} color={color} />;
                },
              })}
            >
              <Tab.Screen
                name="Home"
                component={HomeStack}
                options={{
                  tabBarLabel: t('الرئيسية', 'Home'),
                }}
              />
              <Tab.Screen
                name="Stores"
                component={StoresStack}
                options={{
                  tabBarLabel: t('المتاجر', 'Stores'),
                  tabBarBadge: cartCount > 0 ? cartCount : undefined,
                  tabBarBadgeStyle: styles.badge,
                }}
              />
              <Tab.Screen
                name="Orders"
                component={OrdersScreen}
                options={{
                  tabBarLabel: t('طلباتي', 'Orders'),
                  tabBarBadge: activeOrders.length > 0 ? activeOrders.length : undefined,
                  tabBarBadgeStyle: styles.badge,
                }}
              />
              <Tab.Screen
                name="Taxi"
                component={TaxiScreen}
                options={{ tabBarLabel: t('تاكسي', 'Taxi') }}
              />
              <Tab.Screen
                name="Account"
                component={AccountStack}
                options={{ tabBarLabel: t('حسابي', 'Account') }}
              />
            </Tab.Navigator>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E8E4DC',
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 6,
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: COLORS.gold,
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
  },
});
