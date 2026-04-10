import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS } from '../constants/theme';

const PAYMENT_METHODS = [
  { id: 'card', icon: 'card', labelAr: 'بطاقة بنكية', labelEn: 'Credit Card' },
  { id: 'cash', icon: 'cash', labelAr: 'دفع عند الاستلام', labelEn: 'Cash on Delivery' },
  { id: 'wallet', icon: 'wallet', labelAr: 'المحفظة', labelEn: 'Wallet' },
  { id: 'applepay', icon: 'logo-apple', labelAr: 'Apple Pay', labelEn: 'Apple Pay' },
];

export default function CheckoutScreen({ navigation }) {
  const { isAr, cart, cartTotal, currentStore, placeOrder, user } = useApp();
  const insets = useSafeAreaInsets();
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [notes, setNotes] = useState('');

  const t = (ar, en) => isAr ? ar : en;
  const deliveryFee = currentStore?.deliveryFee || 0;
  const total = cartTotal + deliveryFee;

  const handleOrder = () => {
    if (!address.trim()) {
      alert(t('يرجى إدخال عنوان التوصيل', 'Please enter delivery address'));
      return;
    }
    const order = placeOrder(address, paymentMethod);
    navigation.reset({
      index: 0,
      routes: [{ name: 'OrderPlaced', params: { order } }],
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('إتمام الطلب', 'Checkout')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Delivery Address */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="location" size={20} color={COLORS.primary} />
            <Text style={styles.cardTitle}>{t('عنوان التوصيل', 'Delivery Address')}</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder={t('أدخل عنوانك الكامل...', 'Enter your full address...')}
            placeholderTextColor={COLORS.textMuted}
            value={address}
            onChangeText={setAddress}
            multiline
            textAlign={isAr ? 'right' : 'left'}
          />
        </View>

        {/* Order Items */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="bag" size={20} color={COLORS.primary} />
            <Text style={styles.cardTitle}>{t('طلبك', 'Your Order')}</Text>
          </View>
          {cart.map(item => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={styles.orderItemEmoji}>{item.emoji}</Text>
              <Text style={styles.orderItemName} numberOfLines={1}>
                {isAr ? item.nameAr : item.nameEn}
              </Text>
              <Text style={styles.orderItemQty}>× {item.qty}</Text>
              <Text style={styles.orderItemPrice}>{(item.price * item.qty).toFixed(0)} AED</Text>
            </View>
          ))}
        </View>

        {/* Payment Method */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="card" size={20} color={COLORS.primary} />
            <Text style={styles.cardTitle}>{t('طريقة الدفع', 'Payment Method')}</Text>
          </View>
          {PAYMENT_METHODS.map(pm => (
            <TouchableOpacity
              key={pm.id}
              style={[styles.paymentOption, paymentMethod === pm.id && styles.activePayment]}
              onPress={() => setPaymentMethod(pm.id)}
            >
              <Ionicons
                name={pm.icon}
                size={22}
                color={paymentMethod === pm.id ? COLORS.primary : COLORS.textSecondary}
              />
              <Text style={[styles.paymentLabel, paymentMethod === pm.id && styles.activePaymentLabel]}>
                {isAr ? pm.labelAr : pm.labelEn}
              </Text>
              {paymentMethod === pm.id && (
                <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} style={{ marginStart: 'auto' }} />
              )}
            </TouchableOpacity>
          ))}
          {paymentMethod === 'wallet' && (
            <View style={styles.walletBalance}>
              <Ionicons name="wallet" size={16} color={COLORS.success} />
              <Text style={styles.walletText}>
                {t(`رصيد المحفظة: ${user.wallet} AED`, `Wallet balance: ${user.wallet} AED`)}
              </Text>
            </View>
          )}
        </View>

        {/* Notes */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="document-text" size={20} color={COLORS.primary} />
            <Text style={styles.cardTitle}>{t('ملاحظات', 'Notes')}</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder={t('أي ملاحظات للمطعم؟ (اختياري)', 'Any notes for the store? (optional)')}
            placeholderTextColor={COLORS.textMuted}
            value={notes}
            onChangeText={setNotes}
            textAlign={isAr ? 'right' : 'left'}
          />
        </View>

        {/* Summary */}
        <View style={styles.card}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('المجموع الفرعي', 'Subtotal')}</Text>
            <Text style={styles.summaryValue}>{cartTotal.toFixed(2)} AED</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('رسوم التوصيل', 'Delivery')}</Text>
            <Text style={[styles.summaryValue, deliveryFee === 0 && { color: COLORS.success }]}>
              {deliveryFee === 0 ? t('مجاني', 'Free') : `${deliveryFee} AED`}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>{t('الإجمالي', 'Total')}</Text>
            <Text style={styles.totalValue}>{total.toFixed(2)} AED</Text>
          </View>
        </View>
      </ScrollView>

      {/* Place Order */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + SPACING.md }]}>
        <TouchableOpacity style={styles.placeBtn} onPress={handleOrder}>
          <Text style={styles.placeBtnText}>{t('تأكيد الطلب', 'Place Order')}</Text>
          <Text style={styles.placeBtnTotal}>{total.toFixed(2)} AED</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backIcon: { marginEnd: SPACING.md, width: 40 },
  headerTitle: { flex: 1, fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.primary, textAlign: 'center' },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    margin: SPACING.lg,
    marginBottom: 0,
    ...SHADOWS.sm,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: SPACING.md },
  cardTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.primary },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 50,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 8,
  },
  orderItemEmoji: { fontSize: 20 },
  orderItemName: { flex: 1, fontSize: 13, color: COLORS.text },
  orderItemQty: { fontSize: 13, color: COLORS.textSecondary },
  orderItemPrice: { fontSize: 13, fontWeight: '700', color: COLORS.primary, minWidth: 55, textAlign: 'right' },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  activePayment: { borderColor: COLORS.primary, backgroundColor: '#EBF2FF' },
  paymentLabel: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, fontWeight: '600' },
  activePaymentLabel: { color: COLORS.primary },
  walletBalance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    marginTop: 4,
  },
  walletText: { fontSize: 13, color: COLORS.success, fontWeight: '600' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: COLORS.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  totalRow: {
    borderTopWidth: 1, borderTopColor: COLORS.border,
    paddingTop: SPACING.sm, marginTop: 4, marginBottom: 0,
  },
  totalLabel: { fontSize: FONTS.sizes.md, fontWeight: '800', color: COLORS.primary },
  totalValue: { fontSize: FONTS.sizes.md, fontWeight: '800', color: COLORS.primary },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    backgroundColor: COLORS.background,
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  placeBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: 16,
  },
  placeBtnText: { color: '#fff', fontSize: FONTS.sizes.md, fontWeight: '700' },
  placeBtnTotal: { color: COLORS.gold, fontSize: FONTS.sizes.md, fontWeight: '800' },
});
