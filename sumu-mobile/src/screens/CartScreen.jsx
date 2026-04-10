import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS } from '../constants/theme';

export default function CartScreen({ navigation }) {
  const { isAr, cart, addToCart, removeFromCart, clearCart, cartTotal, cartCount, currentStore } = useApp();
  const insets = useSafeAreaInsets();

  const t = (ar, en) => isAr ? ar : en;

  const deliveryFee = currentStore?.deliveryFee || 0;
  const total = cartTotal + deliveryFee;

  if (cartCount === 0) {
    return (
      <View style={[styles.empty, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.emptyEmoji}>🛒</Text>
        <Text style={styles.emptyTitle}>{t('السلة فارغة', 'Cart is Empty')}</Text>
        <Text style={styles.emptyDesc}>{t('أضف منتجات من المتاجر', 'Add products from stores')}</Text>
        <TouchableOpacity style={styles.browseBtn} onPress={() => navigation.navigate('Stores')}>
          <Text style={styles.browseBtnText}>{t('تصفح المتاجر', 'Browse Stores')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('السلة', 'Cart')}</Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearText}>{t('مسح الكل', 'Clear')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 160 }}>
        {/* Store Info */}
        {currentStore && (
          <View style={[styles.storeInfo, SHADOWS.sm]}>
            <Text style={styles.storeEmoji}>{currentStore.emoji}</Text>
            <View>
              <Text style={styles.storeName}>{isAr ? currentStore.nameAr : currentStore.nameEn}</Text>
              <Text style={styles.storeMeta}>
                {t(`وقت التوصيل: ${currentStore.deliveryTime} دقيقة`, `Delivery: ${currentStore.deliveryTime} min`)}
              </Text>
            </View>
          </View>
        )}

        {/* Cart Items */}
        <View style={styles.section}>
          {cart.map(item => (
            <View key={item.id} style={[styles.cartItem, SHADOWS.sm]}>
              <View style={styles.itemEmoji}>
                <Text style={{ fontSize: 28 }}>{item.emoji}</Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{isAr ? item.nameAr : item.nameEn}</Text>
                <Text style={styles.itemPrice}>{item.price} AED</Text>
              </View>
              <View style={styles.qtyRow}>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => removeFromCart(item.id)}>
                  <Ionicons name="remove" size={16} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.qty}</Text>
                <TouchableOpacity
                  style={styles.qtyBtnFill}
                  onPress={() => addToCart(item, currentStore)}
                >
                  <Ionicons name="add" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
              <Text style={styles.itemTotal}>{(item.price * item.qty).toFixed(0)} AED</Text>
            </View>
          ))}
        </View>

        {/* Order Summary */}
        <View style={[styles.summary, SHADOWS.sm]}>
          <Text style={styles.summaryTitle}>{t('ملخص الطلب', 'Order Summary')}</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('المجموع الفرعي', 'Subtotal')}</Text>
            <Text style={styles.summaryValue}>{cartTotal.toFixed(2)} AED</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('رسوم التوصيل', 'Delivery Fee')}</Text>
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

      {/* Checkout Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + SPACING.md }]}>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate('Checkout')}
        >
          <Text style={styles.checkoutText}>{t('المتابعة للدفع', 'Proceed to Checkout')}</Text>
          <Text style={styles.checkoutTotal}>{total.toFixed(2)} AED</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  empty: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
  backBtn: { position: 'absolute', top: 60, left: SPACING.lg },
  emptyEmoji: { fontSize: 72, marginBottom: SPACING.lg },
  emptyTitle: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.primary, marginBottom: 8 },
  emptyDesc: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginBottom: SPACING.xl, textAlign: 'center' },
  browseBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: 14,
    borderRadius: RADIUS.xl,
  },
  browseBtnText: { color: '#fff', fontSize: FONTS.sizes.md, fontWeight: '700' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backIcon: { marginEnd: SPACING.md },
  headerTitle: { flex: 1, fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.primary },
  clearText: { fontSize: FONTS.sizes.sm, color: COLORS.danger, fontWeight: '600' },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    margin: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  storeEmoji: { fontSize: 32 },
  storeName: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.primary },
  storeMeta: { fontSize: 12, color: COLORS.textSecondary },
  section: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
  cartItem: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  itemEmoji: {
    width: 52, height: 52,
    backgroundColor: '#F0EDE6',
    borderRadius: RADIUS.md,
    alignItems: 'center', justifyContent: 'center',
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.text },
  itemPrice: { fontSize: 13, color: COLORS.gold, fontWeight: '600', marginTop: 2 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  qtyBtn: {
    width: 26, height: 26, borderRadius: 13,
    borderWidth: 1.5, borderColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  qtyBtnFill: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  qtyText: { fontSize: 14, fontWeight: '800', color: COLORS.primary, minWidth: 18, textAlign: 'center' },
  itemTotal: { fontSize: 14, fontWeight: '800', color: COLORS.primary, minWidth: 50, textAlign: 'right' },
  summary: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  summaryTitle: { fontSize: FONTS.sizes.md, fontWeight: '800', color: COLORS.primary, marginBottom: SPACING.md },
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
  checkoutBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: 16,
  },
  checkoutText: { color: '#fff', fontSize: FONTS.sizes.md, fontWeight: '700' },
  checkoutTotal: { color: COLORS.gold, fontSize: FONTS.sizes.md, fontWeight: '800' },
});
