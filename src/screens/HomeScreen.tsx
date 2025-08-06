import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Animated,
  PanGestureHandler,
  State,
} from 'react-native';
import { useProducts } from '../hooks/useProducts';
import ProductSummaryCard from '../components/ProductSummaryCard';

/**
 * HomeScreen displays a list of products with stacked cards effect on scroll.
 */
const HomeScreen = () => {
  const { products, loading } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products;
    }
    
    const query = searchQuery.toLowerCase().trim();
    return products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.storageLocation.toLowerCase().includes(query) ||
      product.barcode.includes(query)
    );
  }, [products, searchQuery]);

  // Animation values for stacked effect
  const cardAnimations = filteredProducts.map(() => ({
    scale: new Animated.Value(1),
    opacity: new Animated.Value(1),
    translateY: new Animated.Value(0),
  }));

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsScrolling(offsetY > 10);
        
        // Apply stacked effect to each card
        filteredProducts.forEach((_, index) => {
          const cardOffset = index * 8; // Stack offset
          const cardScale = Math.max(0.85, 1 - (index * 0.05));
          const cardOpacity = Math.max(0.6, 1 - (index * 0.1));
          
          Animated.parallel([
            Animated.timing(cardAnimations[index].scale, {
              toValue: isScrolling ? cardScale : 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(cardAnimations[index].opacity, {
              toValue: isScrolling ? cardOpacity : 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(cardAnimations[index].translateY, {
              toValue: isScrolling ? cardOffset : 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start();
        });
      },
    }
  );

  const renderAnimatedCard = (product: any, index: number) => {
    const animation = cardAnimations[index];
    
    return (
      <Animated.View
        key={product.id}
        style={[
          styles.animatedCard,
          {
            transform: [
              { scale: animation.scale },
              { translateY: animation.translateY },
            ],
            opacity: animation.opacity,
            zIndex: filteredProducts.length - index, // Higher cards appear on top
          },
        ]}
      >
        <ProductSummaryCard product={product} />
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Items</Text>
        </View>
        <View style={styles.searchContainer}>
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search items..." 
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" style={styles.loadingIndicator} />
        ) : (
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.listContainer}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => renderAnimatedCard(product, index))
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>
                  {searchQuery.trim() ? `No items found for "${searchQuery}"` : 'No items found'}
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: { fontFamily: 'Manrope-Bold', fontSize: 18, color: '#141414' },
  searchContainer: { paddingHorizontal: 16, paddingBottom: 12 },
  searchInput: {
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Manrope-Regular',
    fontSize: 16,
  },
  loadingIndicator: { marginTop: 50 },
  listContainer: { 
    padding: 16,
    paddingBottom: 100, // Extra padding for stacked effect
  },
  scrollView: {
    flex: 1,
  },
  animatedCard: {
    marginBottom: -8, // Negative margin to create overlap
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  noResultsText: {
    fontFamily: 'Manrope-Regular',
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});