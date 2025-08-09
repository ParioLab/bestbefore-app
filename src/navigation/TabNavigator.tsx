import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import AddItemScreen from '../screens/AddItemScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HomeIcon from '../../assets/images/home-icon.svg';
import PlusIcon from '../../assets/images/plus-icon.svg';
import SettingsIcon from '../../assets/images/settings-icon.svg';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View, StyleSheet, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './AppNavigator';

const Tab = createBottomTabNavigator();

const CustomTabBar = (props: any) => {
  // Inject testID for AddItem tab
  const { state, descriptors, ...rest } = props;
  const newDescriptors = { ...descriptors };
  state.routes.forEach((route: any, idx: number) => {
    if (route.name === 'AddItem') {
      newDescriptors[route.key] = {
        ...descriptors[route.key],
        options: {
          ...descriptors[route.key].options,
          tabBarButtonTestID: 'add-product-tab',
        },
      };
    }
  });
  
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBarWrapper}>
        <BottomTabBar {...props} descriptors={newDescriptors} />
      </View>
    </View>
  );
};

const TabNavigator = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  return (
    <Tab.Navigator
      tabBar={CustomTabBar}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let IconComponent;

          if (route.name === 'Home') {
            IconComponent = HomeIcon;
          } else if (route.name === 'AddItem') {
            IconComponent = PlusIcon;
          } else if (route.name === 'Settings') {
            IconComponent = SettingsIcon;
          }

          return IconComponent ? (
            <IconComponent 
              width={size} 
              height={size} 
              fill="#FFFFFF" 
              color="#FFFFFF"
              style={{ color: '#FFFFFF' }}
            />
          ) : null;
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#FFFFFF',
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarStyle,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="AddItem"
        component={AddItemScreen}
        options={{
          tabBarButton: ({ accessibilityState }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate({ name: 'ScanBarcode', params: undefined })}
              style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
              accessibilityLabel="Scan Barcode"
              testID="scan-barcode-tab"
            >
              <PlusIcon 
                width={28} 
                height={28} 
                fill='#FFFFFF' 
                color='#FFFFFF'
                style={{ color: '#FFFFFF' }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 80,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20, // Account for safe area
  },
  tabBarWrapper: {
    backgroundColor: '#1C1C1E',
    borderRadius: 25,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  tabBarStyle: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    elevation: 0,
    borderRadius: 25,
    height: 50,
    paddingBottom: 6,
    paddingTop: 6,
  },
});

export default TabNavigator; 