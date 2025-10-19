import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function Payments() {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'credit_card',
      cardType: 'Visa',
      lastFour: '4242',
      expiry: '12/25',
      isDefault: true,
    },
    {
      id: 2,
      type: 'credit_card',
      cardType: 'MasterCard',
      lastFour: '8888',
      expiry: '08/24',
      isDefault: false,
    },
    {
      id: 3,
      type: 'paypal',
      email: 'john.doe@example.com',
      isDefault: false,
    },
  ]);

  const setDefaultPayment = (id) => {
    setPaymentMethods(paymentMethods.map(payment => ({
      ...payment,
      isDefault: payment.id === id
    })));
  };

  const deletePaymentMethod = (id) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to delete this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setPaymentMethods(paymentMethods.filter(payment => payment.id !== id)),
        },
      ]
    );
  };

  const getCardIcon = (cardType) => {
    switch (cardType) {
      case 'Visa':
        return 'cc-visa';
      case 'MasterCard':
        return 'cc-mastercard';
      case 'Amex':
        return 'cc-amex';
      case 'Discover':
        return 'cc-discover';
      default:
        return 'credit-card';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/add-payment')}
        >
          <Ionicons name="add" size={24} color="#FF6B35" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Add New Payment Card */}
        <TouchableOpacity 
          style={styles.addCard}
          onPress={() => router.push('/add-payment')}
        >
          <View style={styles.addIcon}>
            <Ionicons name="add-circle" size={32} color="#FF6B35" />
          </View>
          <Text style={styles.addText}>Add New Payment Method</Text>
        </TouchableOpacity>

        {/* Payment Methods List */}
        {paymentMethods.map((payment) => (
          <View key={payment.id} style={styles.paymentCard}>
            <View style={styles.paymentHeader}>
              <View style={styles.paymentInfo}>
                {payment.type === 'credit_card' ? (
                  <>
                    <FontAwesome name={getCardIcon(payment.cardType)} size={24} color="#333" />
                    <View style={styles.cardDetails}>
                      <Text style={styles.cardType}>{payment.cardType}</Text>
                      <Text style={styles.cardNumber}>
                        •••• {payment.lastFour}
                      </Text>
                      <Text style={styles.cardExpiry}>Expires {payment.expiry}</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <FontAwesome name="paypal" size={24} color="#0070BA" />
                    <View style={styles.cardDetails}>
                      <Text style={styles.cardType}>PayPal</Text>
                      <Text style={styles.cardNumber}>{payment.email}</Text>
                    </View>
                  </>
                )}
              </View>

              <View style={styles.paymentActions}>
                {payment.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => deletePaymentMethod(payment.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            </View>

            {!payment.isDefault && (
              <TouchableOpacity 
                style={styles.setDefaultButton}
                onPress={() => setDefaultPayment(payment.id)}
              >
                <Text style={styles.setDefaultText}>Set as Default</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {/* Security Notice */}
        <View style={styles.securityCard}>
          <Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
          <View style={styles.securityContent}>
            <Text style={styles.securityTitle}>Secure Payment</Text>
            <Text style={styles.securityText}>
              Your payment information is encrypted and secure. We never store your full card details.
            </Text>
          </View>
        </View>

        {/* Transaction History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <View style={styles.transactionList}>
            {[
              { id: 1, description: 'Grocery Order', amount: '-$89.99', date: 'Oct 19, 2023', status: 'Completed' },
              { id: 2, description: 'Electronics Purchase', amount: '-$299.99', date: 'Oct 18, 2023', status: 'Completed' },
              { id: 3, description: 'Wallet Top-up', amount: '+$100.00', date: 'Oct 17, 2023', status: 'Completed' },
            ].map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionDescription}>
                    {transaction.description}
                  </Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>
                <View style={styles.transactionAmount}>
                  <Text style={[
                    styles.amountText,
                    transaction.amount.startsWith('+') ? styles.positiveAmount : styles.negativeAmount
                  ]}>
                    {transaction.amount}
                  </Text>
                  <Text style={styles.transactionStatus}>{transaction.status}</Text>
                </View>
              </View>
            ))}
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
    paddingTop: 50,
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
  addButton: {
    padding: 4,
  },
  addCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FF6B35',
    borderStyle: 'dashed',
  },
  addIcon: {
    marginRight: 12,
  },
  addText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B35',
  },
  paymentCard: {
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
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardDetails: {
    marginLeft: 12,
    flex: 1,
  },
  cardType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  cardNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  cardExpiry: {
    fontSize: 12,
    color: '#999',
  },
  paymentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  defaultBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  actionButton: {
    padding: 4,
  },
  setDefaultButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#FF6B35',
    borderRadius: 6,
  },
  setDefaultText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B35',
  },
  securityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  securityContent: {
    flex: 1,
    marginLeft: 12,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  securityText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  transactionList: {
    paddingHorizontal: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  positiveAmount: {
    color: '#4CAF50',
  },
  negativeAmount: {
    color: '#333',
  },
  transactionStatus: {
    fontSize: 12,
    color: '#666',
  },
});