import BackButton from '@/components/back-button';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
    Linking,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function About() {
  const appInfo = {
    version: '1.0.0',
    build: '2023.10.1',
    releaseDate: 'October 2023',
  };

  const companyInfo = {
    name: 'Zanate',
    description: 'Your trusted food delivery partner, connecting you with the best restaurants in your area. We believe in delivering not just food, but experiences.',
    founded: '2020',
    employees: '500+',
    deliveries: '1M+',
  };

  const features = [
    {
      icon: 'restaurant',
      title: 'Wide Selection',
      description: 'Choose from hundreds of restaurants',
    },
    {
      icon: 'rocket',
      title: 'Fast Delivery',
      description: 'Get your food in 30 minutes or less',
    },
    {
      icon: 'shield-checkmark',
      title: 'Safe & Secure',
      description: 'Your safety and privacy are our priority',
    },
    {
      icon: 'leaf',
      title: 'Eco-Friendly',
      description: 'Committed to reducing carbon footprint',
    },
  ];

  const socialLinks = [
    {
      name: 'Website',
      icon: 'globe',
      url: 'https://example.com',
    },
    {
      name: 'Twitter',
      icon: 'logo-twitter',
      url: 'https://twitter.com/example',
    },
    {
      name: 'Instagram',
      icon: 'logo-instagram',
      url: 'https://instagram.com/example',
    },
    {
      name: 'Facebook',
      icon: 'logo-facebook',
      url: 'https://facebook.com/example',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
       <BackButton/>
        <Text style={styles.headerTitle}>About</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>Z</Text>
          </View>
          <Text style={styles.companyName}>{companyInfo.name}</Text>
          <Text style={styles.tagline}>Delivering Happiness</Text>
        </View>

        {/* App Info */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>App Information</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>{appInfo.version}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Build</Text>
              <Text style={styles.infoValue}>{appInfo.build}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Release Date</Text>
              <Text style={styles.infoValue}>{appInfo.releaseDate}</Text>
            </View>
          </View>
        </View>

        {/* Company Story */}
        <View style={styles.storySection}>
          <Text style={styles.sectionTitle}>Our Story</Text>
          <Text style={styles.storyText}>
            {companyInfo.description}
          </Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{companyInfo.founded}</Text>
              <Text style={styles.statLabel}>Founded</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{companyInfo.employees}</Text>
              <Text style={styles.statLabel}>Employees</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{companyInfo.deliveries}</Text>
              <Text style={styles.statLabel}>Deliveries</Text>
            </View>
          </View>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Why Choose Us</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureIcon}>
                  <Ionicons name={feature.icon} size={24} color="#FF6B35" />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Social Links */}
        <View style={styles.socialSection}>
          <Text style={styles.sectionTitle}>Connect With Us</Text>
          <View style={styles.socialGrid}>
            {socialLinks.map((social, index) => (
              <TouchableOpacity
                key={index}
                style={styles.socialCard}
                onPress={() => Linking.openURL(social.url)}
              >
                <Ionicons name={social.icon} size={24} color="#FF6B35" />
                <Text style={styles.socialName}>{social.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Legal Links */}
        <View style={styles.legalSection}>
          <TouchableOpacity style={styles.legalLink}>
            <Text style={styles.legalText}>Privacy Policy</Text>
            <MaterialIcons name="keyboard-arrow-right" size={20} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.legalLink}>
            <Text style={styles.legalText}>Terms of Service</Text>
            <MaterialIcons name="keyboard-arrow-right" size={20} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.legalLink}>
            <Text style={styles.legalText}>Cookie Policy</Text>
            <MaterialIcons name="keyboard-arrow-right" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ by {companyInfo.name} Team
          </Text>
          <Text style={styles.copyright}>
            © 2023 {companyInfo.name}. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    width: 32,
  },
  heroSection: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 40,
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  companyName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
  },
  infoCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  storySection: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  storyText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  featuresSection: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  featureCard: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: '1%',
    marginBottom: 12,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF5F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  socialSection: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    marginBottom: 16,
  },
  socialGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  socialCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  socialName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  legalSection: {
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  legalLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  legalText: {
    fontSize: 16,
    color: '#333',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  copyright: {
    fontSize: 12,
    color: '#999',
  },
});