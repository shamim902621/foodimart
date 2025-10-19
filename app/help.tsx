import BackButton from '@/components/back-button';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState(null);

  const faqSections = [
    {
      id: 1,
      title: 'Order & Delivery',
      icon: 'cube-outline',
      questions: [
        {
          q: 'How can I track my order?',
          a: 'You can track your order from the "My Orders" section in your profile. We\'ll also send you regular updates via email and SMS.',
        },
        {
          q: 'What is the delivery time?',
          a: 'Delivery times vary by location and restaurant. Typically, orders are delivered within 30-45 minutes.',
        },
        {
          q: 'Can I modify my order after placing it?',
          a: 'You can modify your order within 5 minutes of placing it. After that, please contact customer support.',
        },
      ],
    },
    {
      id: 2,
      title: 'Payments & Refunds',
      icon: 'card-outline',
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept credit/debit cards, PayPal, and various digital wallets. Cash on delivery is also available in some areas.',
        },
        {
          q: 'How do I get a refund?',
          a: 'Refunds are processed within 5-7 business days. Contact our support team for refund requests.',
        },
        {
          q: 'Is my payment information secure?',
          a: 'Yes, we use industry-standard encryption to protect your payment information.',
        },
      ],
    },
    {
      id: 3,
      title: 'Account & Profile',
      icon: 'person-outline',
      questions: [
        {
          q: 'How do I reset my password?',
          a: 'Go to "Forgot Password" on the login screen or visit your profile settings to change your password.',
        },
        {
          q: 'Can I have multiple addresses?',
          a: 'Yes, you can save multiple delivery addresses in your profile.',
        },
        {
          q: 'How do I update my email?',
          a: 'You can update your email address from the "Personal Details" section in your profile.',
        },
      ],
    },
  ];

  const contactMethods = [
    {
      icon: 'chatbubble-outline',
      title: 'Live Chat',
      description: '24/7 customer support',
      action: () => Alert.alert('Live Chat', 'Connecting you to support...'),
    },
    {
      icon: 'call-outline',
      title: 'Phone Support',
      description: '+1 (555) 123-4567',
      action: () => Linking.openURL('tel:+15551234567'),
    },
    {
      icon: 'mail-outline',
      title: 'Email Support',
      description: 'support@example.com',
      action: () => Linking.openURL('mailto:support@example.com'),
    },
  ];

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
       <BackButton/>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for help..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>

        {/* Quick Help Cards */}
        <View style={styles.quickHelpSection}>
          <Text style={styles.sectionTitle}>Quick Help</Text>
          <View style={styles.quickHelpGrid}>
            {contactMethods.map((method, index) => (
              <TouchableOpacity
                key={index}
                style={styles.helpCard}
                onPress={method.action}
              >
                <View style={styles.helpIcon}>
                  <Ionicons name={method.icon} size={24} color="#FF6B35" />
                </View>
                <Text style={styles.helpTitle}>{method.title}</Text>
                <Text style={styles.helpDescription}>{method.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FAQ Sections */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqSections.map((section) => (
            <View key={section.id} style={styles.faqCategory}>
              <TouchableOpacity
                style={styles.categoryHeader}
                onPress={() => toggleSection(section.id)}
              >
                <View style={styles.categoryTitle}>
                  <Ionicons name={section.icon} size={20} color="#FF6B35" />
                  <Text style={styles.categoryName}>{section.title}</Text>
                </View>
                <Ionicons
                  name={expandedSection === section.id ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>

              {expandedSection === section.id && (
                <View style={styles.questionsList}>
                  {section.questions.map((item, index) => (
                    <View key={index} style={styles.questionItem}>
                      <Text style={styles.question}>{item.q}</Text>
                      <Text style={styles.answer}>{item.a}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Support Resources */}
        <View style={styles.resourcesSection}>
          <Text style={styles.sectionTitle}>Support Resources</Text>
          <View style={styles.resourcesGrid}>
            <TouchableOpacity style={styles.resourceCard}>
              <Ionicons name="document-text-outline" size={24} color="#FF6B35" />
              <Text style={styles.resourceTitle}>User Guide</Text>
              <Text style={styles.resourceDescription}>
                Complete app usage guide
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resourceCard}>
              <Ionicons name="videocam-outline" size={24} color="#FF6B35" />
              <Text style={styles.resourceTitle}>Video Tutorials</Text>
              <Text style={styles.resourceDescription}>
                Step-by-step videos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resourceCard}>
              <Ionicons name="megaphone-outline" size={24} color="#FF6B35" />
              <Text style={styles.resourceTitle}>Community</Text>
              <Text style={styles.resourceDescription}>
                Join user community
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resourceCard}>
              <Ionicons name="bug-outline" size={24} color="#FF6B35" />
              <Text style={styles.resourceTitle}>Report Issue</Text>
              <Text style={styles.resourceDescription}>
                Report bugs & issues
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Emergency Contact */}
        <View style={styles.emergencySection}>
          <View style={styles.emergencyCard}>
            <View style={styles.emergencyIcon}>
              <Ionicons name="warning" size={24} color="#fff" />
            </View>
            <View style={styles.emergencyContent}>
              <Text style={styles.emergencyTitle}>Emergency Support</Text>
              <Text style={styles.emergencyText}>
                For urgent order issues or safety concerns
              </Text>
            </View>
            <TouchableOpacity style={styles.emergencyButton}>
              <Text style={styles.emergencyButtonText}>Call Now</Text>
            </TouchableOpacity>
          </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  quickHelpSection: {
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
  quickHelpGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  helpCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  helpIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF5F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  helpDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  faqSection: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    marginBottom: 16,
  },
  faqCategory: {
    marginBottom: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  questionsList: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  questionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  question: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  answer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  resourcesSection: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    marginBottom: 16,
  },
  resourcesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  resourceCard: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    margin: '1%',
    marginBottom: 12,
  },
  resourceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  resourceDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  emergencySection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  emergencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    padding: 20,
    borderRadius: 16,
  },
  emergencyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emergencyContent: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  emergencyText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  emergencyButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  emergencyButtonText: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '600',
  },
});