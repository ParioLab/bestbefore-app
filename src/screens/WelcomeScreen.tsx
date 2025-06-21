import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

type Props = {
  navigation: WelcomeScreenNavigationProp;
};

const WelcomeScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Get Started</Text>
          <Text style={styles.subtitle}>
            Track your products' expiration dates and reduce waste.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Main')}
        >
          <BlurView intensity={50} tint="dark" style={styles.blurContainer}>
            <Text style={styles.buttonText}>Add Products</Text>
          </BlurView>
        </TouchableOpacity>
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
    paddingBottom: 40, // For bottom button
    paddingTop: 100, // To push content down a bit
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Manrope-Bold',
    fontSize: 28,
    fontWeight: '700',
    color: '#121712',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'Manrope-Regular',
    fontSize: 16,
    color: '#121712',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  button: {
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: -3, height: 9 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 10,
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible', // Fix for Android shadow
  },
  blurContainer: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    overflow: 'hidden', // This is important for the blur effect to be contained
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  buttonText: {
    fontFamily: 'Manrope-Bold',
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default WelcomeScreen; 