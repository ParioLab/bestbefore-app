import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import AddItemScreen from '../screens/AddItemScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HomeIcon from '../../assets/images/home-icon.svg';
import PlusIcon from '../../assets/images/plus-icon.svg';
import SettingsIcon from '../../assets/images/settings-icon.svg';
import { BottomTabBar } from '@react-navigation/bottom-tabs';

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
  return <BottomTabBar {...props} descriptors={newDescriptors} />;
};

const TabNavigator = () => {
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

          return IconComponent ? <IconComponent width={size} height={size} fill={color} /> : null;
        },
        tabBarActiveTintColor: '#121712',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F0F5F0',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="AddItem" component={AddItemScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator; 