import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS } from '../constants/theme';

const STATUS_CONFIG = {
  pending:    { color: '#F59E0B', bg: '#FFFBEB', ar: 'في الانتظار',    en: 'Pending',     icon: 'time' },
  preparing:  { color: '#3B82F6', bg: '#EFF6FF', ar: 'يتم التحضير',   en: 'Preparing',   icon: 'restaurant' },
  on_the_way: { color: '#8B5CF6', bg: '#F5F3FF', ar: 'في الطريق',     en: 'On the Way',  icon: 'bicycle' },
  delivered:  { color: '#10B981', bg: '#ECFDF5', ar: 'تم التوصيل',    en: 'Delivered',   icon: 'checkmark-circle' },
  cancelled:  { color: '#EF4444', bg: '#FEF2F2', ar: 'ملغي',          en: 'Cancelled',   icon: 'close-circle' },
};

// Sample orders for demo
const DEMO_ORDERS = [
  {
    id: 'ORD-001',
    items: [
      { nameAr: 'دجاج بالبهارات', nameEn: 'Spiced Chicken', qty: 2, price: 38, emoji: '🍗' },
      { nameAr: 'شاي هندي', nameEn: 'Masala Tea', qty: 1, price: 10, emoji: '🍵' },
    ],
    store: { nameAr: 'بهارات المطبخ', nameEn: 'Baharat Kitchen', emoji: '🍛' },
    total: 91,
    deliveryFee: 5,
    status: 'on_the_way',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    eta: 15,
  },
  {
    id: 'ORD-002',
    items: [
      { nameAr: 'برغر كلاسيك', nameEn: 'Classic Burger', qty: 1, price: 32, emoji: '🍔' },
      { nameAr: 'بطاطس مقلية', nameEn: 'French Fries', qty: 1, price: 15, emoji: '🍟' },
    ],
    store: { nameAr: 'برجرتينو', nameEn: 'Burgetino', emoji: '🍔' },
    total: 54,
    deliveryFee: 7,
    status: 'delivered',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

function OrderCard({ order, isAr, t }) {
  const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const date = new Date(order.createdAt);
  const dateStr = date.toLocaleDateString(isAr ? 'ar-AE' : 'en-AE', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <View style={[styles.orderCard, SHADOWS.sm]}>
      {/* Order Header */}
      <View style={styles.orderHeader}>
        <View style={styles.storeInfo}>
          <Text style={styles.storeEmoji}>{order.store?.emoji || '🏪'}</Text>
          <View>
            <Text style={styles.storeName}>{isAr ? order.store?.nameAr : order.store?.nameEn}</Text>
            <Text style={styles.orderDate}>{dateStr}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
          <Ionicons name={config.icon} size={12} color={config.color} />
          <Text style={[styles.statusText, { color: config.color }]}>
            {isAr ? config.ar : config.en}
          </Text>
        </View>
      </View>

      {/* Items */}
      <View style={styles.orderItems}>
        {order.items.slice(0, 3).map((item, i) => (
          <Text key={i} style={styles.itemText} numberOfLines={1}>
            {item.emoji} {isAr ? item.nameAr : item.nameEn} × {item.qty}
          </Text>
        ))}
        {order.items.length > 3 && (
          <Text style={styles.moreItems}>+{order.items.length - 3} {t('منتجات أخرى', 'more items')}</Text>
        )}
      </View>

      {/* Footer */}
      <View style={styles.orderFooter}>
        <Text style={styles.orderTotal}>{order.total} AED</Text>
        {order.status === 'on_the_way' && (
          <View style={styles.etaBadge}>
            <Ionicons name="time" size={12} color={COLORS.primary} />
            <Text style={styles.etaText}>{t(`${order.eta} دقيقة`, `${order.eta} min`)}</Text>
          </View>
        )}
        {order.status === 'delivered' && (
          <TouchableOpacity style={styles.reorderBtn}>
            <Text style={styles.reorderText}>{t('إعادة الطلب', 'Reorder')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function OrdersScreen({ navigation }) {
  const { isAr, orders } = useApp();
  const insets = useSafeAreaInsets();
  const t = (ar, en) => isAr ? ar : en;

  const allOrders = [...orders, ...DEMO_ORDERS];
  const active = allOrders.filter(o => ['pending', 'preparing', 'on_the_way'].includes(o.status));
  const past = allOrders.filter(o => ['delivered', 'cancelled'].includes(o.status));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('طلباتي', 'My Orders')}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Active Orders */}
        {active.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('الطلبات النشطة', 'Active Orders')}</Text>
            {active.map(order => (
              <OrderCard key={order.id} order={order} isAr={isAr} t={t} />
            ))}
          </View>
        )}

        {/* Past Orders */}
        {past.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('الطلبات السابقة', 'Past Orders')}</Text>
            {past.map(order => (
              <OrderCard key={order.id} order={order} isAr={isAr} t={t} />
            ))}
          </View>
        )}

        {allOrders.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📦</Text>
            <Text style={styles.emptyTitle}>{t('لا توجد طلبات', 'No Orders Yet')}</Text>
            <Text style={styles.emptyDesc}>{t('ابدأ بطلب شيء لذيذ!', 'Start by ordering something delicious!')}</Text>
            <TouchableOpacity style={styles.orderNowBtn} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.orderNowText}>{t('اطلب الآن', 'Order Now')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.primary },
  section: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg },
  sectionTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textSecondary, marginBottom: SPACING.md },
  orderCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  storeInfo: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  storeEmoji: { fontSize: 28 },
  storeName: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.text },
  orderDate: { fontSize: 11, color: COLORS.textMuted },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  statusText: { fontSize: 11, fontWeight: '700' },
  orderItems: {
    borderTopWidth: 1, borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  itemText: { fontSize: 13, color: COLORS.text, marginBottom: 3 },
  moreItems: { fontSize: 12, color: COLORS.textMuted, fontStyle: 'italic' },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1, borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
  },
  orderTotal: { fontSize: FONTS.sizes.md, fontWeight: '800', color: COLORS.primary },
  etaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EBF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  etaText: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  reorderBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  reorderText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  empty: { alignItems: 'center', padding: SPACING.xxxl, marginTop: 60 },
  emptyEmoji: { fontSize: 64, marginBottom: SPACING.lg },
  emptyTitle: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.primary, marginBottom: 8 },
  emptyDesc: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginBottom: SPACING.xl, textAlign: 'center' },
  orderNowBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: 14,
    borderRadius: RADIUS.xl,
  },
  orderNowText: { color: '#fff', fontSize: FONTS.sizes.md, fontWeight: '700' },
});
