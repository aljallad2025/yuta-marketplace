import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
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
  const { isAr, toggleLang, user, setIsLoggedIn } = useApp();
  const insets = useSafeAreaInsets();
  const t = (ar, en) => isAr ? ar : en;

  const handleLogout = () => {
    setIsLoggedIn(false);
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
        {/* Profile Card */}
        <View style={[styles.profileCard, SHADOWS.md]}>
          <View style={styles.avatar}>
            <Text style={{ fontSize: 40 }}>{user.avatar}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{isAr ? user.name : user.nameEn}</Text>
            <Text style={styles.userPhone}>{user.phone}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="pencil" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Wallet */}
        <View style={[styles.walletCard, SHADOWS.md]}>
          <View style={styles.walletLeft}>
            <Text style={styles.walletEmoji}>💰</Text>
            <View>
              <Text style={styles.walletLabel}>{t('رصيد المحفظة', 'Wallet Balance')}</Text>
              <Text style={styles.walletAmount}>{user.wallet} AED</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.topUpBtn}>
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={styles.topUpText}>{t('شحن', 'Top Up')}</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          {[
            { value: '12', labelAr: 'طلب', labelEn: 'Orders', emoji: '📦' },
            { value: '3', labelAr: 'رحلة', labelEn: 'Rides', emoji: '🚕' },
            { value: '4.8', labelAr: 'تقييم', labelEn: 'Rating', emoji: '⭐' },
          ].map((stat, i) => (
            <View key={i} style={[styles.statBox, SHADOWS.sm]}>
              <Text style={styles.statEmoji}>{stat.emoji}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{isAr ? stat.labelAr : stat.labelEn}</Text>
            </View>
          ))}
        </View>

        {/* Account Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>{t('الحساب', 'Account')}</Text>
          <View style={[styles.menuCard, SHADOWS.sm]}>
            <MenuItem icon="person-outline" label={t('معلوماتي الشخصية', 'Personal Info')} onPress={() => {}} />
            <MenuItem icon="location-outline" label={t('عناويني', 'My Addresses')} onPress={() => {}} />
            <MenuItem icon="card-outline" label={t('طرق الدفع', 'Payment Methods')} onPress={() => {}} />
            <MenuItem icon="receipt-outline" label={t('سجل المعاملات', 'Transaction History')} onPress={() => {}} />
          </View>
        </View>

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

        <View style={styles.menuSection}>
          <View style={[styles.menuCard, SHADOWS.sm]}>
            <MenuItem
              icon="log-out-outline"
              label={t('تسجيل الخروج', 'Log Out')}
              danger
              onPress={handleLogout}
            />
          </View>
        </View>

        {/* Version */}
        <Text style={styles.version}>سومو v1.0.0 · Sumu App</Text>
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
  version: { textAlign: 'center', fontSize: 12, color: COLORS.textMuted, marginTop: SPACING.lg, marginBottom: SPACING.xl },
});
