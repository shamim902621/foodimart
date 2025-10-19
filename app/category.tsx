import { Feather, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface IconType {
  type: 'Feather' | 'FontAwesome5' | 'Ionicons' | 'MaterialIcons';
  name: string;
}

interface Category {
  title: string;
  items: string[];
  icon: IconType;
  color: string;
  gradient: string[];
}

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 60) / 2;

const Categories: React.FC = () => {
  const router = useRouter();

  const categories: Category[] = [
    {
      title: 'Grocery',
      items: ['Vegetables & Fruits', 'Food & Restaurants'],
      icon: { type: 'Feather', name: 'shopping-cart' },
      color: '#4CAF50',
      gradient: ['#4CAF50', '#45a049'],
    },
    {
      title: 'Medicine',
      items: ['Pet Care', 'Sports & Fitness'],
      icon: { type: 'MaterialIcons', name: 'local-pharmacy' },
      color: '#FF6B6B',
      gradient: ['#FF6B6B', '#ff5252'],
    },
    {
      title: 'Meat',
      items: ['Laundry / Handwash', 'Taller Shop'],
      icon: { type: 'Ionicons', name: 'fast-food-outline' },
      color: '#FF9800',
      gradient: ['#FF9800', '#f57c00'],
    },
    {
      title: 'Beauty & Cosmetic',
      items: ['Jewelry Stores', 'Miscellaneous'],
      icon: { type: 'FontAwesome5', name: 'spa' },
      color: '#9C27B0',
      gradient: ['#9C27B0', '#8e24aa'],
    },
    {
      title: 'Electronics',
      items: ['Mobile Phones', 'Laptops'],
      icon: { type: 'MaterialIcons', name: 'devices' },
      color: '#2196F3',
      gradient: ['#2196F3', '#1e88e5'],
    },
    {
      title: 'Fashion',
      items: ['Clothing', 'Accessories'],
      icon: { type: 'Ionicons', name: 'shirt-outline' },
      color: '#E91E63',
      gradient: ['#E91E63', '#d81b60'],
    },
    {
      title: 'Home',
      items: ['Furniture', 'Decor'],
      icon: { type: 'MaterialIcons', name: 'home' },
      color: '#795548',
      gradient: ['#795548', '#6d4c41'],
    },
    {
      title: 'Sports',
      items: ['Equipment', 'Activewear'],
      icon: { type: 'MaterialIcons', name: 'sports-baseball' },
      color: '#00BCD4',
      gradient: ['#00BCD4', '#00acc1'],
    },
  ];

  const handleCategoryPress = (category: Category) => {
    router.push({
      pathname: '/home',
      params: { category: category.title },
    });
  };

  const renderIcon = (icon: IconType, color = '#fff') => {
    switch (icon.type) {
      case 'Feather':
        return <Feather name={icon.name as any} size={32} color={color} />;
      case 'FontAwesome5':
        return <FontAwesome5 name={icon.name as any} size={28} color={color} />;
      case 'Ionicons':
        return <Ionicons name={icon.name as any} size={32} color={color} />;
      case 'MaterialIcons':
        return <MaterialIcons name={icon.name as any} size={32} color={color} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Categories</Text>
        <Text style={styles.headerSubtitle}>Browse by category</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gridContainer}
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.categoryCard, { backgroundColor: category.color }]}
            activeOpacity={0.8}
            onPress={() => handleCategoryPress(category)}
          >
            <View style={styles.iconContainer}>{renderIcon(category.icon)}</View>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <Text style={styles.itemCount}>{category.items.length} items</Text>

            <View style={[styles.gradientOverlay, { backgroundColor: category.gradient[1] }]} />

            <View style={styles.dotsContainer}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 25,
  },
  categoryCard: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 20,
    marginBottom: 20,
    padding: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    opacity: 0.6,
    zIndex: -1,
  },
  dotsContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginLeft: 3,
  },
});
