import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
// You will create this screen in a later step
// import ScanScreen from '../screens/ScanScreen'; 

import HomeIcon from '../../assets/images/home-icon.svg';
import ScanIcon from '../../assets/images/scan-icon.svg';
import SettingsIcon from '../../assets/images/settings-icon.svg';
import { View } from 'react-native';

const Tab = createBottomTabNavigator();

const EmptyScreen = () => <View />;

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => {
          let IconComponent: React.FC<any> = HomeIcon;
          if (route.name === 'Home') {
            IconComponent = HomeIcon;
          } else if (route.name === 'Scan') {
            IconComponent = ScanIcon;
          } else if (route.name === 'Settings') {
            IconComponent = SettingsIcon;
          }
          return <IconComponent width={size} height={size} fill={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen as any} />
      <Tab.Screen name="Scan" component={EmptyScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen as any} />
    </Tab.Navigator>
  );
};

export default TabNavigator; 