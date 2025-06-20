import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

import WelcomeIcon1 from '../../assets/images/welcome-icon-1.svg';
import WelcomeIcon2 from '../../assets/images/welcome-icon-2.svg';
import WelcomeIcon3 from '../../assets/images/welcome-icon-3.svg';

// TODO: The figma design uses 'Manrope' font. It should be added to the project assets.

type Props = StackScreenProps<RootStackParamList, 'Welcome'>;

const WelcomeScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topSection}>
            <View style={styles.iconsHeader}>
                <WelcomeIcon1 width={24} height={24} />
                <WelcomeIcon2 width={24} height={24} />
                <WelcomeIcon3 width={24} height={24} />
            </View>
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.title}>Get Started</Text>
          <Text style={styles.subtitle}>
            Track your products' expiration dates and reduce waste.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate('Main');
            }}
          >
            <Text style={styles.buttonText}>Add Products</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 30
  },
  topSection: {
    width: '100%',
    alignItems: 'center'
  },
  iconsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 16,
    paddingBottom: 8
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    // fontFamily: 'Manrope-Bold', // TODO: Add Manrope font
    fontWeight: '700',
    fontSize: 28,
    lineHeight: 35,
    textAlign: 'center',
    color: '#121712',
    paddingTop: 20,
    paddingBottom: 4
  },
  subtitle: {
    // fontFamily: 'Manrope-Regular', // TODO: Add Manrope font
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#121712',
    paddingBottom: 12
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.07)',
    borderRadius: 24,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  buttonText: {
    // fontFamily: 'Manrope-Bold', // TODO: Add Manrope font
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 24,
    color: '#000000',
  },
});

export default WelcomeScreen; 