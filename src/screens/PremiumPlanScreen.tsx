import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface PlanCardProps {
  title: string;
  duration: string;
  price: string;
  savings?: string;
  isPopular?: boolean;
  isSelected?: boolean;
  iconName: keyof typeof Feather.glyphMap;
  iconColor: string;
  features: string[];
  onPress: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ 
  title, 
  duration, 
  price, 
  savings, 
  isPopular = false, 
  isSelected = false,
  iconName,
  iconColor,
  features,
  onPress 
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        isSelected ? styles.selectedCard : styles.defaultCard,
        isPopular && styles.popularCard
      ]} 
      onPress={onPress}
    >
      {isPopular && (
        <View style={[
          styles.popularBadge,
          isSelected && styles.popularBadgeSelected
        ]}>
          <Text style={[
            styles.popularText,
            isSelected && styles.popularTextSelected
          ]}>Most Popular</Text>
        </View>
      )}
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[
            styles.cardTitle,
            isSelected && styles.cardTitleSelected
          ]}>{title}</Text>
        </View>
        
        {title === '1 Year' && (
          <Text style={[
            styles.duration,
            isSelected && styles.durationSelected
          ]}>{duration}</Text>
        )}
        
        <View style={styles.savingsContainer}>
          {savings ? (
            <Text style={[
              styles.savings,
              isSelected && styles.savingsSelected
            ]}>{savings}</Text>
          ) : (
            <View style={styles.savingsPlaceholder} />
          )}
        </View>
        
        {/* Features */}
        <View style={[
          styles.featuresContainer,
          title === '1 Year' && styles.featuresContainerWithDuration
        ]}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Feather 
                name="check" 
                size={12} 
                color={isSelected ? '#CCCCCC' : '#757575'} 
                style={styles.checkIcon}
              />
              <Text style={[
                styles.featureText,
                isSelected && styles.featureTextSelected
              ]}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={[
        styles.priceContainer, 
        isSelected ? styles.priceContainerSelected : styles.priceContainerDefault
      ]}>
        <Text style={[
          styles.price,
          isSelected && styles.priceSelected
        ]}>{price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const PremiumPlanScreen = () => {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: '1year',
      title: '1 Year',
      duration: '12 months',
      price: '$39.99/year',
      isPopular: true,
      iconName: 'star' as keyof typeof Feather.glyphMap,
      iconColor: '#FF6B6B',
      features: ['Unlimited scans', 'Health Tips and Badges', 'Ad free']
    },
    {
      id: '6months',
      title: '6 Months',
      duration: '6 months',
      price: '$21.99/6mo',
      iconName: 'music' as keyof typeof Feather.glyphMap,
      iconColor: '#FF6B6B',
      features: ['Unlimited scans', 'Health Tips and Badges', 'Ad free']
    },
    {
      id: '3months',
      title: '3 Months',
      duration: '3 months',
      price: '$11.99/3mo',
      iconName: 'calendar' as keyof typeof Feather.glyphMap,
      iconColor: '#FFD93D',
      features: ['Unlimited scans', 'Health Tips and Badges', 'Ad free']
    },
    {
      id: '1month',
      title: '1 Month',
      duration: '1 month',
      price: '$3.99/mo',
      iconName: 'shopping-bag' as keyof typeof Feather.glyphMap,
      iconColor: '#FF6B6B',
      features: ['Unlimited scans', 'Health Tips and Badges', 'Ad free']
    }
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = () => {
    if (selectedPlan) {
      console.log(`Subscribing to ${selectedPlan} plan`);
      // Add subscription logic here
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color="#141414" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Premium Plan</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Choose Your Plan</Text>
          <Text style={styles.descriptionText}>
            Unlock premium features and enjoy an ad-free experience with our flexible subscription options.
          </Text>
        </View>

        {/* Plan Cards */}
        <View style={styles.cardsContainer}>
          {/* First Row: 1 Year and 6 Months */}
          <View style={styles.cardRow}>
            <View style={styles.cardWrapper}>
              <PlanCard
                title={plans[0].title}
                duration={plans[0].duration}
                price={plans[0].price}
                isPopular={plans[0].isPopular}
                isSelected={selectedPlan === plans[0].id}
                iconName={plans[0].iconName}
                iconColor={plans[0].iconColor}
                features={plans[0].features}
                onPress={() => handlePlanSelect(plans[0].id)}
              />
            </View>
            <View style={styles.cardWrapper}>
              <PlanCard
                title={plans[1].title}
                duration={plans[1].duration}
                price={plans[1].price}
                isPopular={plans[1].isPopular}
                isSelected={selectedPlan === plans[1].id}
                iconName={plans[1].iconName}
                iconColor={plans[1].iconColor}
                features={plans[1].features}
                onPress={() => handlePlanSelect(plans[1].id)}
              />
            </View>
          </View>
          
          {/* Second Row: 3 Months and 1 Month */}
          <View style={styles.cardRow}>
            <View style={styles.cardWrapper}>
              <PlanCard
                title={plans[2].title}
                duration={plans[2].duration}
                price={plans[2].price}
                isPopular={plans[2].isPopular}
                isSelected={selectedPlan === plans[2].id}
                iconName={plans[2].iconName}
                iconColor={plans[2].iconColor}
                features={plans[2].features}
                onPress={() => handlePlanSelect(plans[2].id)}
              />
            </View>
            <View style={styles.cardWrapper}>
              <PlanCard
                title={plans[3].title}
                duration={plans[3].duration}
                price={plans[3].price}
                isPopular={plans[3].isPopular}
                isSelected={selectedPlan === plans[3].id}
                iconName={plans[3].iconName}
                iconColor={plans[3].iconColor}
                features={plans[3].features}
                onPress={() => handlePlanSelect(plans[3].id)}
              />
            </View>
          </View>
        </View>

        {/* Subscribe Button */}
        <TouchableOpacity 
          style={[
            styles.subscribeButton,
            !selectedPlan && styles.subscribeButtonDisabled
          ]}
          onPress={handleSubscribe}
          disabled={!selectedPlan}
        >
          <Text style={styles.subscribeButtonText}>
            {selectedPlan ? 'Subscribe Now' : 'Select a Plan'}
          </Text>
        </TouchableOpacity>

        {/* Terms */}
        <Text style={styles.termsText}>
          By subscribing, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#141414',
  },
  placeholder: {
    width: 40,
  },
  descriptionContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#141414',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: '#757575',
    lineHeight: 24,
  },
  cardsContainer: {
    paddingHorizontal: 16,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  cardWrapper: {
    width: 190,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
    height: 240,
    justifyContent: 'space-between',
  },
  defaultCard: {
    backgroundColor: '#FFFFFF',
  },
  selectedCard: {
    backgroundColor: '#000000',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  popularCard: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  popularBadgeSelected: {
    backgroundColor: '#FFD700',
  },
  popularText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
  },
  popularTextSelected: {
    color: '#000000',
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    marginBottom: 12,
    marginTop: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  cardTitleSelected: {
    color: '#FFFFFF',
  },
  duration: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 8,
  },
  durationSelected: {
    color: '#CCCCCC',
  },
  savingsContainer: {
    height: 22,
    justifyContent: 'center',
  },
  savings: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  savingsSelected: {
    color: '#4CAF50',
  },
  savingsPlaceholder: {
    height: 22,
  },
  priceContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  priceContainerDefault: {
    backgroundColor: '#F0F0F0',
  },
  priceContainerSelected: {
    backgroundColor: '#333333',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  priceSelected: {
    color: '#FFFFFF',
  },
  subscribeButton: {
    backgroundColor: '#000000',
    marginHorizontal: 16,
    marginTop: 32,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  subscribeButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  termsText: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
    marginTop: 16,
    marginHorizontal: 16,
    lineHeight: 18,
  },
  featuresContainer: {
    marginTop: 8,
  },
  featuresContainerWithDuration: {
    marginTop: 0.5,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  checkIcon: {
    marginRight: 6,
  },
  featureText: {
    fontSize: 12,
    color: '#757575',
    flex: 1,
  },
  featureTextSelected: {
    color: '#CCCCCC',
  },
});

export default PremiumPlanScreen; 