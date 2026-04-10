import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS } from '../constants/theme';

const STATUSES = [
  { key: 'pending', ar: 'تم استلام طلبك', en: 'Order Received', icon: 'checkmark-circle' },
  { key: 'preparing', ar: 'يتم تحضير طلبك', en: 'Preparing Order', icon: 'restaurant' },
  { key: 'on_the_way', ar: 'الطلب في الطريق إليك', en: 'On the Way', icon: 'bicycle' },
  { key: 'delivered', ar: 'تم التوصيل!', en: 'Delivered!', icon: 'home' },
];

export default function OrderPlacedScreen({ navigation, route }) {
  const { order } = route.params;
  const { isAr } = useApp();
  const insets = useSafeAreaInsets();
  const scale = useRef(new Animated.Value(0)).current;
  const [currentStep, setCurrentStep] = useState(0);
  const [eta, setEta] = useState(order?.eta || 30);

  const t = (ar, en) => isAr ? ar : en;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: 60,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Simulate order progress
    const intervals = [3000, 8000, 20000];
    const timers = intervals.map((delay, i) =>
      setTimeout(() => setCurrentStep(i + 1), delay)
    );
    const etaTimer = setInterval(() => setEta(e => Math.max(0, e - 1)), 60000);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(etaTimer);
    };
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.inner}>
        {/* Success Animation */}
        <Animated.View style={[styles.successCircle, { transform: [{ scale }] }]}>
          <Text style={styles.successEmoji}>🎉</Text>
        </Animated.View>

        <Text style={styles.title}>{t('تم تأكيد طلبك!', 'Order Confirmed!')}</Text>
        <Text style={styles.orderId}>{order?.id || 'ORD-000'}</Text>

        {/* ETA */}
        <View style={styles.etaCard}>
          <Ionicons name="time" size={24} color={COLORS.gold} />
          <View style={{ marginStart: 12 }}>
            <Text style={styles.etaLabel}>{t('الوقت المتوقع للتوصيل', 'Estimated Delivery')}</Text>
            <Text style={styles.etaValue}>{t(`${eta} دقيقة`, `${eta} minutes`)}</Text>
          </View>
        </View>

        {/* Status Steps */}
        <View style={styles.stepsContainer}>
          {STATUSES.map((status, index) => {
            const isDone = index <= currentStep;
            const isActive = index === currentStep;
            return (
              <View key={status.key} style={styles.step}>
                <View style={[styles.stepDot, isDone && styles.stepDotActive, isActive && styles.stepDotCurrent]}>
                  <Ionicons
                    name={isDone ? 'checkmark' : status.icon}
                    size={14}
                    color={isDone ? '#fff' : COLORS.textMuted}
                  />
                </View>
                {index < STATUSES.length - 1 && (
                  <View style={[styles.stepLine, isDone && index < currentStep && styles.stepLineDone]} />
                )}
                <Text style={[styles.stepText, isDone && styles.stepTextActive, isActive && styles.stepTextCurrent]}>
                  {t(status.ar, status.en)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Buttons */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + SPACING.md }]}>
        <TouchableOpacity
          style={styles.trackBtn}
          onPress={() => navigation.navigate('Orders')}
        >
          <Ionicons name="location" size={20} color="#fff" />
          <Text style={styles.trackBtnText}>{t('تتبع الطلب', 'Track Order')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })}
        >
          <Text style={styles.homeBtnText}>{t('العودة للرئيسية', 'Back to Home')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.xl },
  successCircle: {
    width: 120, height: 120,
    backgroundColor: '#ECFDF5',
    borderRadius: 60,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.xl,
    borderWidth: 3,
    borderColor: COLORS.success,
  },
  successEmoji: { fontSize: 56 },
  title: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.primary, marginBottom: 6, textAlign: 'center' },
  orderId: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginBottom: SPACING.xl },
  etaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    width: '100%',
    marginBottom: SPACING.xl,
    ...SHADOWS.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.gold,
  },
  etaLabel: { fontSize: 13, color: COLORS.textSecondary },
  etaValue: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: COLORS.primary },
  stepsContainer: { width: '100%', gap: 0 },
  step: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  stepDot: {
    width: 28, height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
    marginEnd: SPACING.md,
    zIndex: 1,
  },
  stepDotActive: { backgroundColor: COLORS.success },
  stepDotCurrent: { backgroundColor: COLORS.primary },
  stepLine: {
    position: 'absolute',
    start: 13,
    top: 28,
    width: 2,
    height: 28,
    backgroundColor: COLORS.border,
  },
  stepLineDone: { backgroundColor: COLORS.success },
  stepText: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, paddingTop: 4, flex: 1 },
  stepTextActive: { color: COLORS.text, fontWeight: '600' },
  stepTextCurrent: { color: COLORS.primary, fontWeight: '700' },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    gap: SPACING.sm,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  trackBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  trackBtnText: { color: '#fff', fontSize: FONTS.sizes.md, fontWeight: '700' },
  homeBtn: {
    borderRadius: RADIUS.xl,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  homeBtnText: { color: COLORS.text, fontSize: FONTS.sizes.sm, fontWeight: '600' },
});
