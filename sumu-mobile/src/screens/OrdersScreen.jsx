import React, { useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
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

function OrderCard({ order, isAr, t }) {
  const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const dateStr = new Date(order.created_at || order.createdAt).toLocaleDateString(
    isAr ? 'ar-AE' : 'en-AE',
    { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  );

  // تطبيع البيانات من Supabase أو المحلية
  const items = Array.isArray(order.items) ? order.items : [];
  const storeName = isAr
    ? (order.store_name_ar || order.store?.nameAr || '')
    : (order.store_name_en || order.store?.nameEn || '');
  const storeEmoji = order.store_emoji || order.store?.emoji || '🏪';
  const total = order.total || 0;
  const eta = order.eta || 30;

  return (
    <View style={[styles.orderCard, SHADOWS.sm]}>
      <View style={styles.orderHeader}>
        <View style={styles.storeInfo}>
          <Text style={styles.storeEmoji}>{storeEmoji}</Text>
          <View>
            <Text style={styles.storeName}>{storeName}</Text>
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

      <View style={styles.orderItems}>
        {items.slice(0, 3).map((item, i) => (
          <Text key={i} style={styles.itemText} numberOfLines={1}>
            {item.emoji || '•'} {isAr ? (item.name_ar || item.nameAr) : (item.name_en || item.nameEn)} × {item.qty}
          </Text>
        ))}
        {items.length > 3 && (
          <Text style={styles.moreItems}>+{items.length - 3} {t('منتجات أخرى', 'more items')}</Text>
        )}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.orderTotal}>{total} AED</Text>
        {order.status === 'on_the_way' && (
          <View style={styles.etaBadge}>
            <Ionicons name="time" size={12} color={COLORS.primary} />
            <Text style={styles.etaText}>{t(`${eta} دقيقة`, `${eta} min`)}</Text>
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
  const { isAr, orders, loadOrders, isLoggedIn } = useApp();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const t = (ar, en) => isAr ? ar : en;

  useEffect(() => {
    if (isLoggedIn) {
      setLoading(true);
      loadOrders().finally(() => setLoading(false));
    }
  }, [isLoggedIn]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  }, [loadOrders]);

  const active = orders.filter(o => ['pending', 'preparing', 'on_the_way'].includes(o.status));
  const past = orders.filter(o => ['delivered', 'cancelled'].includes(o.status));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('طلباتي', 'My Orders')}</Text>
        {orders.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{orders.length}</Text>
          </View>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>{t('جاري تحميل الطلبات...', 'Loading orders...')}</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        >
          {/* الطلبات النشطة */}
          {active.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>{t('الطلبات النشطة', 'Active Orders')}</Text>
                <View style={styles.activeDot} />
              </View>
              {active.map(order => (
                <OrderCard key={order.id} order={order} isAr={isAr} t={t} />
              ))}
            </View>
          )}

          {/* الطلبات السابقة */}
          {past.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('الطلبات السابقة', 'Past Orders')}</Text>
              {past.map(order => (
                <OrderCard key={order.id} order={order} isAr={isAr} t={t} />
              ))}
            </View>
          )}

          {orders.length === 0 && !loading && (
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
      )}
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
    gap: SPACING.sm,
  },
  headerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.primary },
  countBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    minWidth: 24, height: 24,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 8,
  },
  countText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: COLORS.textSecondary, fontSize: 14 },
  section: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: SPACING.md },
  sectionTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textSecondary },
  activeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' },
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
