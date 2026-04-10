import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS } from '../constants/theme';
import { TAXI_TYPES } from '../constants/data';

export default function TaxiScreen({ navigation }) {
  const { isAr } = useApp();
  const insets = useSafeAreaInsets();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedType, setSelectedType] = useState('economy');
  const [isBooked, setIsBooked] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const t = (ar, en) => isAr ? ar : en;
  const selected = TAXI_TYPES.find(t => t.id === selectedType);
  const estimatedFare = selected ? (selected.baseFare + 5 * selected.pricePerKm).toFixed(0) : 0;

  const handleBook = () => {
    if (!pickup.trim() || !destination.trim()) {
      Alert.alert(t('خطأ', 'Error'), t('يرجى إدخال نقطة الانطلاق والوجهة', 'Please enter pickup and destination'));
      return;
    }
    setIsBooked(true);
    setCountdown(selected.eta);
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(interval); return 0; }
        return c - 1;
      });
    }, 60000);
  };

  if (isBooked) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setIsBooked(false)}>
            <Ionicons name="close" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('تتبع الرحلة', 'Track Ride')}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={{ padding: SPACING.lg }}>
          {/* Map placeholder */}
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapText}>🗺️</Text>
            <Text style={styles.mapSubText}>{t('الخريطة التفاعلية', 'Interactive Map')}</Text>
          </View>

          {/* Driver Card */}
          <View style={[styles.driverCard, SHADOWS.md]}>
            <View style={styles.driverAvatar}>
              <Text style={{ fontSize: 36 }}>👨‍✈️</Text>
            </View>
            <View style={{ flex: 1, marginStart: SPACING.md }}>
              <Text style={styles.driverName}>{t('أحمد العامري', 'Ahmed Al Ameri')}</Text>
              <Text style={styles.driverCar}>{t('تويوتا كامري · ABC-1234', 'Toyota Camry · ABC-1234')}</Text>
              <View style={styles.driverRating}>
                <Ionicons name="star" size={14} color={COLORS.gold} />
                <Text style={styles.ratingText}>4.9</Text>
              </View>
            </View>
            <View style={styles.driverActions}>
              <TouchableOpacity style={styles.callBtn}>
                <Ionicons name="call" size={20} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.msgBtn}>
                <Ionicons name="chatbubble" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* ETA */}
          <View style={styles.etaCard}>
            <Ionicons name="time" size={24} color={COLORS.gold} />
            <View style={{ flex: 1, marginStart: 12 }}>
              <Text style={styles.etaLabel}>{t('السائق في الطريق إليك', 'Driver is on the way')}</Text>
              <Text style={styles.etaValue}>{t(`${countdown || selected.eta} دقائق`, `${countdown || selected.eta} min`)}</Text>
            </View>
            <View style={[styles.statusDot, { backgroundColor: COLORS.success }]} />
          </View>

          {/* Trip Details */}
          <View style={[styles.tripDetails, SHADOWS.sm]}>
            <View style={styles.tripRow}>
              <View style={styles.tripDot} />
              <Text style={styles.tripAddr}>{pickup}</Text>
            </View>
            <View style={styles.tripLine} />
            <View style={styles.tripRow}>
              <Ionicons name="location" size={16} color={COLORS.danger} />
              <Text style={styles.tripAddr}>{destination}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsBooked(false)}>
            <Text style={styles.cancelBtnText}>{t('إلغاء الرحلة', 'Cancel Ride')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('تاكسي سومو', 'Sumu Taxi')}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: SPACING.lg, paddingBottom: 120 }}>
        {/* Locations */}
        <View style={[styles.locationsCard, SHADOWS.sm]}>
          <View style={styles.locationInput}>
            <View style={[styles.locationDot, { backgroundColor: COLORS.success }]} />
            <TextInput
              style={styles.locInput}
              placeholder={t('نقطة الانطلاق', 'Pickup location')}
              placeholderTextColor={COLORS.textMuted}
              value={pickup}
              onChangeText={setPickup}
              textAlign={isAr ? 'right' : 'left'}
            />
          </View>
          <View style={styles.locationDivider} />
          <View style={styles.locationInput}>
            <Ionicons name="location" size={16} color={COLORS.danger} />
            <TextInput
              style={styles.locInput}
              placeholder={t('الوجهة', 'Destination')}
              placeholderTextColor={COLORS.textMuted}
              value={destination}
              onChangeText={setDestination}
              textAlign={isAr ? 'right' : 'left'}
            />
          </View>
        </View>

        {/* Car Types */}
        <Text style={styles.sectionTitle}>{t('نوع السيارة', 'Car Type')}</Text>
        {TAXI_TYPES.map(type => (
          <TouchableOpacity
            key={type.id}
            style={[styles.carCard, selectedType === type.id && styles.selectedCarCard, SHADOWS.sm]}
            onPress={() => setSelectedType(type.id)}
          >
            <Text style={styles.carEmoji}>{type.emoji}</Text>
            <View style={{ flex: 1, marginStart: SPACING.md }}>
              <Text style={styles.carName}>{isAr ? type.nameAr : type.nameEn}</Text>
              <Text style={styles.carDesc}>{isAr ? type.descriptionAr : type.descriptionEn}</Text>
              <View style={styles.carMeta}>
                <Ionicons name="time-outline" size={12} color={COLORS.textSecondary} />
                <Text style={styles.carMetaText}>{t(`${type.eta} دقائق`, `${type.eta} min`)}</Text>
                <Ionicons name="people-outline" size={12} color={COLORS.textSecondary} style={{ marginStart: 8 }} />
                <Text style={styles.carMetaText}>{type.seats}</Text>
              </View>
            </View>
            <View style={styles.carPrice}>
              <Text style={styles.carPriceEst}>{t('~', '~')}</Text>
              <Text style={styles.carPriceValue}>
                {(type.baseFare + 5 * type.pricePerKm).toFixed(0)}
              </Text>
              <Text style={styles.carPriceCurrency}>AED</Text>
            </View>
            {selectedType === type.id && (
              <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} style={{ marginStart: 8 }} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Book Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + SPACING.md }]}>
        <View style={styles.fareEstimate}>
          <Text style={styles.fareLabel}>{t('التكلفة المقدرة', 'Estimated fare')}</Text>
          <Text style={styles.fareValue}>{estimatedFare} AED</Text>
        </View>
        <TouchableOpacity style={styles.bookBtn} onPress={handleBook}>
          <Text style={styles.bookBtnText}>{t('احجز الآن', 'Book Now')}</Text>
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
  headerTitle: { flex: 1, fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.primary },
  locationsCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  locationInput: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 12 },
  locationDot: { width: 12, height: 12, borderRadius: 6 },
  locInput: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.text },
  locationDivider: { height: 1, backgroundColor: COLORS.border, marginStart: 24 },
  sectionTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.primary, marginBottom: SPACING.md },
  carCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCarCard: { borderColor: COLORS.primary, backgroundColor: '#EBF2FF' },
  carEmoji: { fontSize: 36 },
  carName: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text },
  carDesc: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 4 },
  carMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  carMetaText: { fontSize: 12, color: COLORS.textSecondary },
  carPrice: { alignItems: 'flex-end' },
  carPriceEst: { fontSize: 11, color: COLORS.textMuted },
  carPriceValue: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.primary },
  carPriceCurrency: { fontSize: 11, color: COLORS.textSecondary },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    backgroundColor: COLORS.background,
    borderTopWidth: 1, borderTopColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  fareEstimate: { flex: 1 },
  fareLabel: { fontSize: 12, color: COLORS.textSecondary },
  fareValue: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.primary },
  bookBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: 16,
    borderRadius: RADIUS.xl,
  },
  bookBtnText: { color: '#fff', fontSize: FONTS.sizes.md, fontWeight: '700' },
  // Booked state
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#E8F4FD',
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mapText: { fontSize: 56 },
  mapSubText: { fontSize: 14, color: COLORS.textSecondary, marginTop: 8 },
  driverCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  driverAvatar: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#F0EDE6',
    alignItems: 'center', justifyContent: 'center',
  },
  driverName: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text },
  driverCar: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 4 },
  driverRating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  driverActions: { flexDirection: 'row', gap: SPACING.sm },
  callBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#ECFDF5',
    alignItems: 'center', justifyContent: 'center',
  },
  msgBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#EBF2FF',
    alignItems: 'center', justifyContent: 'center',
  },
  etaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  etaLabel: { fontSize: 13, color: COLORS.textSecondary },
  etaValue: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: COLORS.primary },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  tripDetails: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  tripRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  tripDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.success },
  tripLine: { width: 2, height: 20, backgroundColor: COLORS.border, marginStart: 5, marginVertical: 2 },
  tripAddr: { fontSize: FONTS.sizes.sm, color: COLORS.text, flex: 1 },
  cancelBtn: {
    borderWidth: 1.5, borderColor: COLORS.danger,
    borderRadius: RADIUS.xl,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelBtnText: { color: COLORS.danger, fontSize: FONTS.sizes.sm, fontWeight: '700' },
});
