import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  FlatList, Dimensions, TextInput, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS } from '../constants/theme';
import { STORES, CATEGORIES, OFFERS } from '../constants/data';
import StoreCard from '../components/StoreCard';

const { width } = Dimensions.get('window');
const OFFER_WIDTH = width - SPACING.lg * 2;

export default function HomeScreen({ navigation }) {
  const { isAr, toggleLang, user } = useApp();
  const insets = useSafeAreaInsets();
  const [activeOffer, setActiveOffer] = useState(0);
  const [searchText, setSearchText] = useState('');

  const featuredStores = STORES.filter(s => s.isFeatured);
  const openStores = STORES.filter(s => s.isOpen);

  const t = (ar, en) => isAr ? ar : en;

  const handleOfferScroll = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / OFFER_WIDTH);
    setActiveOffer(index);
  };

  const filteredStores = searchText
    ? STORES.filter(s =>
        s.nameAr.includes(searchText) ||
        s.nameEn.toLowerCase().includes(searchText.toLowerCase())
      )
    : null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={18} color={COLORS.gold} />
          <View style={{ marginStart: 6 }}>
            <Text style={styles.locationLabel}>{t('توصيل إلى', 'Deliver to')}</Text>
            <Text style={styles.locationValue}>{t('دبي، الإمارات 🇦🇪', 'Dubai, UAE 🇦🇪')}</Text>
          </View>
        </View>
        <View style={styles.topRight}>
          <TouchableOpacity onPress={toggleLang} style={styles.langBtn}>
            <Text style={styles.langText}>{isAr ? 'EN' : 'ع'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.primary} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color={COLORS.textMuted} style={{ marginEnd: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder={t('ابحث عن مطعم أو متجر...', 'Search restaurant or store...')}
              placeholderTextColor={COLORS.textMuted}
              value={searchText}
              onChangeText={setSearchText}
              textAlign={isAr ? 'right' : 'left'}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {searchText.length > 0 ? (
          /* Search Results */
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t(`نتائج البحث (${filteredStores.length})`, `Results (${filteredStores.length})`)}
            </Text>
            {filteredStores.map(store => (
              <StoreCard
                key={store.id}
                store={store}
                horizontal
                onPress={() => navigation.navigate('Store', { store })}
              />
            ))}
          </View>
        ) : (
          <>
            {/* Offers Banner */}
            <View style={styles.offersSection}>
              <FlatList
                data={OFFERS}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleOfferScroll}
                keyExtractor={item => String(item.id)}
                renderItem={({ item }) => (
                  <View style={[styles.offerCard, { backgroundColor: item.color, width: OFFER_WIDTH }]}>
                    <Text style={styles.offerEmoji}>{item.emoji}</Text>
                    <View style={{ flex: 1, marginStart: 12 }}>
                      <Text style={styles.offerTitle}>{isAr ? item.titleAr : item.titleEn}</Text>
                      <Text style={styles.offerSub}>{isAr ? item.subtitleAr : item.subtitleEn}</Text>
                    </View>
                  </View>
                )}
                contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: SPACING.md }}
              />
              <View style={styles.dots}>
                {OFFERS.map((_, i) => (
                  <View key={i} style={[styles.dot, i === activeOffer && styles.activeDot]} />
                ))}
              </View>
            </View>

            {/* Categories */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('التصنيفات', 'Categories')}</Text>
              <FlatList
                data={CATEGORIES}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: SPACING.sm }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.categoryChip}
                    onPress={() => navigation.navigate('Stores', { categoryId: item.id })}
                  >
                    <Text style={styles.categoryEmoji}>{item.icon}</Text>
                    <Text style={styles.categoryName}>{isAr ? item.nameAr : item.nameEn}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            {/* Featured */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t('مميزة', 'Featured')}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Stores')}>
                  <Text style={styles.seeAll}>{t('الكل', 'See All')}</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={featuredStores}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => String(item.id)}
                contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: SPACING.md }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.featuredCard, SHADOWS.md]}
                    onPress={() => navigation.navigate('Store', { store: item })}
                    activeOpacity={0.85}
                  >
                    <View style={styles.featuredEmoji}>
                      <Text style={{ fontSize: 48 }}>{item.emoji}</Text>
                    </View>
                    <View style={styles.featuredBody}>
                      <Text style={styles.featuredName} numberOfLines={1}>{isAr ? item.nameAr : item.nameEn}</Text>
                      <Text style={styles.featuredMeta}>⭐ {item.rating} · {item.deliveryTime} min</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>

            {/* All Open Stores */}
            <View style={[styles.section, { paddingHorizontal: SPACING.lg }]}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t('جميع المتاجر المفتوحة', 'All Open Stores')}</Text>
              </View>
              {openStores.map(store => (
                <StoreCard
                  key={store.id}
                  store={store}
                  onPress={() => navigation.navigate('Store', { store })}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationLabel: { fontSize: 11, color: COLORS.textMuted },
  locationValue: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  langBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    width: 34, height: 34,
    alignItems: 'center', justifyContent: 'center',
  },
  langText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  notifBtn: { padding: 4, position: 'relative' },
  notifDot: {
    position: 'absolute', top: 4, right: 4,
    width: 8, height: 8,
    backgroundColor: COLORS.danger,
    borderRadius: 4,
    borderWidth: 1.5, borderColor: '#fff',
  },
  searchContainer: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, backgroundColor: COLORS.card },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.text },
  offersSection: { marginVertical: SPACING.lg },
  offerCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'center',
    height: 120,
  },
  offerEmoji: { fontSize: 42 },
  offerTitle: { color: '#fff', fontSize: FONTS.sizes.lg, fontWeight: '800', marginBottom: 4 },
  offerSub: { color: 'rgba(255,255,255,0.85)', fontSize: FONTS.sizes.sm },
  dots: { flexDirection: 'row', justifyContent: 'center', marginTop: 10, gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.border },
  activeDot: { width: 18, backgroundColor: COLORS.primary },
  section: { marginBottom: SPACING.lg },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: COLORS.primary },
  seeAll: { fontSize: FONTS.sizes.sm, color: COLORS.gold, fontWeight: '700' },
  categoryChip: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    minWidth: 72,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryEmoji: { fontSize: 26, marginBottom: 4 },
  categoryName: { fontSize: 11, fontWeight: '600', color: COLORS.text },
  featuredCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    width: 160,
    overflow: 'hidden',
  },
  featuredEmoji: {
    height: 100,
    backgroundColor: '#F0EDE6',
    alignItems: 'center', justifyContent: 'center',
  },
  featuredBody: { padding: SPACING.sm },
  featuredName: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.text },
  featuredMeta: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
});
