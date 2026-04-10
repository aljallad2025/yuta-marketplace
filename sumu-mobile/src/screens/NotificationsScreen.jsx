import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS } from '../constants/theme';

const NOTIFICATIONS = [
  { id: 1, type: 'order', icon: '📦', titleAr: 'طلبك في الطريق!', titleEn: 'Your order is on the way!', bodyAr: 'السائق أحمد في طريقه إليك، وقت الوصول المتوقع 15 دقيقة', bodyEn: 'Driver Ahmed is heading to you, ETA 15 minutes', time: '5 دقائق', timeEn: '5 min', unread: true },
  { id: 2, type: 'offer', icon: '🎁', titleAr: 'عرض خاص لك!', titleEn: 'Special offer for you!', bodyAr: 'خصم 25% على طلبك القادم من برجرتينو', bodyEn: '25% off your next order from Burgetino', time: '1 ساعة', timeEn: '1h', unread: true },
  { id: 3, type: 'order', icon: '✅', titleAr: 'تم تسليم طلبك', titleEn: 'Order Delivered', bodyAr: 'تم توصيل طلبك من بهارات المطبخ بنجاح', bodyEn: 'Your order from Baharat Kitchen has been delivered', time: 'أمس', timeEn: 'Yesterday', unread: false },
  { id: 4, type: 'promo', icon: '💰', titleAr: 'شحن مجاني اليوم فقط!', titleEn: 'Free delivery today only!', bodyAr: 'استمتع بتوصيل مجاني على جميع الطلبات فوق 30 درهم', bodyEn: 'Enjoy free delivery on all orders above 30 AED', time: 'يومان', timeEn: '2 days', unread: false },
  { id: 5, type: 'account', icon: '🔒', titleAr: 'تحديث الأمان', titleEn: 'Security Update', bodyAr: 'تم تسجيل الدخول من جهاز جديد', bodyEn: 'New device login detected', time: '3 أيام', timeEn: '3 days', unread: false },
];

export default function NotificationsScreen({ navigation }) {
  const { isAr } = useApp();
  const insets = useSafeAreaInsets();
  const t = (ar, en) => isAr ? ar : en;
  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginStart: 12 }}>
          <Text style={styles.headerTitle}>{t('الإشعارات', 'Notifications')}</Text>
          {unreadCount > 0 && (
            <Text style={styles.unreadCount}>
              {t(`${unreadCount} غير مقروء`, `${unreadCount} unread`)}
            </Text>
          )}
        </View>
        <TouchableOpacity>
          <Text style={styles.markAll}>{t('قراءة الكل', 'Mark all read')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {NOTIFICATIONS.map(notif => (
          <TouchableOpacity
            key={notif.id}
            style={[styles.notifCard, notif.unread && styles.unreadCard]}
            activeOpacity={0.8}
          >
            <View style={[styles.notifIcon, notif.unread && styles.unreadIcon]}>
              <Text style={{ fontSize: 22 }}>{notif.icon}</Text>
            </View>
            <View style={styles.notifContent}>
              <Text style={[styles.notifTitle, notif.unread && styles.unreadTitle]}>
                {isAr ? notif.titleAr : notif.titleEn}
              </Text>
              <Text style={styles.notifBody} numberOfLines={2}>
                {isAr ? notif.bodyAr : notif.bodyEn}
              </Text>
              <Text style={styles.notifTime}>{isAr ? notif.time : notif.timeEn}</Text>
            </View>
            {notif.unread && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  headerTitle: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.primary },
  unreadCount: { fontSize: 12, color: COLORS.textSecondary },
  markAll: { fontSize: 13, color: COLORS.gold, fontWeight: '700' },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.card,
    gap: SPACING.md,
  },
  unreadCard: { backgroundColor: '#F0F7FF' },
  notifIcon: {
    width: 50, height: 50,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    alignItems: 'center', justifyContent: 'center',
  },
  unreadIcon: { backgroundColor: '#DBEAFE' },
  notifContent: { flex: 1 },
  notifTitle: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.text, marginBottom: 4 },
  unreadTitle: { fontWeight: '800', color: COLORS.primary },
  notifBody: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18, marginBottom: 6 },
  notifTime: { fontSize: 12, color: COLORS.textMuted },
  unreadDot: {
    width: 10, height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    marginTop: 4,
  },
});
