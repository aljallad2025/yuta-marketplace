import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS } from '../constants/theme';

function MenuItem({ icon, label, value, onPress, danger, rightElement }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.menuIcon, danger && { backgroundColor: '#FEE2E2' }]}>
        <Ionicons name={icon} size={20} color={danger ? COLORS.danger : COLORS.primary} />
      </View>
      <Text style={[styles.menuLabel, danger && { color: COLORS.danger }]}>{label}</Text>
      {value && <Text style={styles.menuValue}>{value}</Text>}
      {rightElement || (
        <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} style={{ marginStart: 'auto' }} />
      )}
    </TouchableOpacity>
  );
}

export default function AccountScreen({ navigation }) {
  const { isAr, toggleLang, user, profile, orders, logout } = useApp();
  const insets = useSafeAreaInsets();
  const [loggingOut, setLoggingOut] = useState(false);
  const t = (ar, en) => isAr ? ar : en;

  // بيانات المستخدم الحقيقية
  const displayName = profile?.name || user?.user_metadata?.name || t('مستخدم', 'User');
  const displayPhone = profile?.phone || user?.phone || user?.user_metadata?.phone || t('غير محدد', 'Not set');
  const displayEmail = user?.email || '';
  const walletBalance = profile?.wallet || 0;
  const totalOrders = orders.length || profile?.total_orders || 0;
  const totalRides = profile?.total_rides || 0;
  const userRating = profile?.rating || 5.0;

  const handleLogout = () => {
    Alert.alert(
      t('تسجيل الخروج', 'Log Out'),
      t('هل تريد تسجيل الخروج؟', 'Are you sure you want to log out?'),
      [
        { text: t('إلغاء', 'Cancel'), style: 'cancel' },
        {
          text: t('خروج', 'Log Out'),
          style: 'destructive',
          onPress: async () => {
            setLoggingOut(true);
            try {
              await logout();
            } catch (e) {
              Alert.alert(t('خطأ', 'Error'), e.message);
            } finally {
              setLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('حسابي', 'My Account')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.notifBtn}>
          <Ionicons name="notifications-outline" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* بطاقة الملف الشخصي */}
        <View style={[styles.profileCard, SHADOWS.md]}>
          <View style={styles.avatar}>
            <Text style={{ fontSize: 40 }}>{profile?.avatar || '👤'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{displayName}</Text>
            {displayPhone !== t('غير محدد', 'Not set') && (
              <Text style={styles.userPhone}>{displayPhone}</Text>
            )}
            <Text style={styles.userEmail} numberOfLines={1}>{displayEmail}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="pencil" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* المحفظة */}
        <View style={[styles.walletCard, SHADOWS.md]}>
          <View style={styles.walletLeft}>
            <Text style={styles.walletEmoji}>💰</Text>
            <View>
              <Text style={styles.walletLabel}>{t('رصيد المحفظة', 'Wallet Balance')}</Text>
              <Text style={styles.walletAmount}>{walletBalance.toFixed(2)} AED</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.topUpBtn}>
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={styles.topUpText}>{t('شحن', 'Top Up')}</Text>
          </TouchableOpacity>
        </View>

        {/* إحصائيات حقيقية */}
        <View style={styles.statsRow}>
          {[
            { value: String(totalOrders), labelAr: 'طلب', labelEn: 'Orders', emoji: '📦' },
            { value: String(totalRides), labelAr: 'رحلة', labelEn: 'Rides', emoji: '🚕' },
            { value: userRating.toFixed(1), labelAr: 'تقييم', labelEn: 'Rating', emoji: '⭐' },
          ].map((stat, i) => (
            <View key={i} style={[styles.statBox, SHADOWS.sm]}>
              <Text style={styles.statEmoji}>{stat.emoji}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{isAr ? stat.labelAr : stat.labelEn}</Text>
            </View>
          ))}
        </View>

        {/* الحساب */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>{t('الحساب', 'Account')}</Text>
          <View style={[styles.menuCard, SHADOWS.sm]}>
            <MenuItem icon="person-outline" label={t('معلوماتي الشخصية', 'Personal Info')} onPress={() => {}} />
            <MenuItem icon="location-outline" label={t('عناويني', 'My Addresses')} onPress={() => {}} />
            <MenuItem icon="card-outline" label={t('طرق الدفع', 'Payment Methods')} onPress={() => {}} />
            <MenuItem icon="receipt-outline" label={t('سجل المعاملات', 'Transaction History')} onPress={() => {}} />
          </View>
        </View>

        {/* الإعدادات */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>{t('الإعدادات', 'Settings')}</Text>
          <View style={[styles.menuCard, SHADOWS.sm]}>
            <MenuItem
              icon="language-outline"
              label={t('اللغة', 'Language')}
              value={isAr ? 'العربية' : 'English'}
              onPress={toggleLang}
            />
            <MenuItem icon="notifications-outline" label={t('الإشعارات', 'Notifications')} onPress={() => {}} />
            <MenuItem icon="shield-checkmark-outline" label={t('الأمان والخصوصية', 'Privacy & Security')} onPress={() => {}} />
            <MenuItem icon="help-circle-outline" label={t('المساعدة والدعم', 'Help & Support')} onPress={() => {}} />
            <MenuItem icon="star-outline" label={t('قيّم التطبيق', 'Rate the App')} onPress={() => {}} />
          </View>
        </View>

        {/* تسجيل الخروج */}
        <View style={styles.menuSection}>
          <View style={[styles.menuCard, SHADOWS.sm]}>
            <MenuItem
              icon="log-out-outline"
              label={loggingOut ? t('جاري الخروج...', 'Logging out...') : t('تسجيل الخروج', 'Log Out')}
              danger
              onPress={loggingOut ? undefined : handleLogout}
              rightElement={loggingOut ? <ActivityIndicator size="small" color={COLORS.danger} /> : undefined}
            />
          </View>
        </View>

        {/* الإصدار */}
        <Text style={styles.version}>سومو v1.0.0 · Sumu App</Text>
        {user?.id && (
          <Text style={styles.userId}>ID: {user.id.slice(0, 8)}...</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.primary },
  notifBtn: { padding: 4 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    margin: SPACING.lg,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  avatar: {
    width: 70, height: 70, borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  userName: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: '#fff' },
  userPhone: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  userEmail: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 1 },
  editBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  walletCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
  },
  walletLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  walletEmoji: { fontSize: 32 },
  walletLabel: { fontSize: 12, color: COLORS.textSecondary },
  walletAmount: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.primary },
  topUpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
  },
  topUpText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
  },
  statEmoji: { fontSize: 22, marginBottom: 4 },
  statValue: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: COLORS.primary },
  statLabel: { fontSize: 11, color: COLORS.textSecondary },
  menuSection: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
  menuSectionTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 8 },
  menuCard: { backgroundColor: COLORS.card, borderRadius: RADIUS.lg, overflow: 'hidden' },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#EBF2FF',
    alignItems: 'center', justifyContent: 'center',
    marginEnd: 12,
  },
  menuLabel: { flex: 1, fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.text },
  menuValue: { fontSize: 13, color: COLORS.textSecondary, marginEnd: 8 },
  version: { textAlign: 'center', fontSize: 12, color: COLORS.textMuted, marginTop: SPACING.lg },
  userId: { textAlign: 'center', fontSize: 10, color: COLORS.textMuted, marginTop: 4, marginBottom: SPACING.xl },
});
