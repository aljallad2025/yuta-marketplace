import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  FlatList, Dimensions, TextInput, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS } from '../constants/theme';
import { STORES, CATEGORIES, OFFERS } from '../constants/data';
import { storeService, categoryService, offerService } from '../services/api';
import StoreCard from '../components/StoreCard';

const { width } = Dimensions.get('window');
const OFFER_WIDTH = width - SPACING.lg * 2;

export default function HomeScreen({ navigation }) {
  const { isAr, toggleLang, user, profile } = useApp();
  const insets = useSafeAreaInsets();
  const [activeOffer, setActiveOffer] = useState(0);
  const [searchText, setSearchText] = useState('');

  // البيانات - تبدأ بالبيانات المحلية ثم تُحدَّث من Supabase
  const [stores, setStores] = useState(STORES);
  const [categories, setCategories] = useState(CATEGORIES);
  const [offers, setOffers] = useState(OFFERS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const t = (ar, en) => isAr ? ar : en;

  // ─── جلب البيانات من Supabase ──────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    try {
      const [storesData, catsData, offersData] = await Promise.all([
        storeService.getStores(),
        categoryService.getCategories(),
        offerService.getOffers(),
      ]);
      if (storesData?.length) setStores(storesData);
      if (catsData?.length) setCategories(catsData);
      if (offersData?.length) setOffers(offersData);
    } catch (e) {
      // يبقى على البيانات المحلية عند انعدام الاتصال
      console.log('Using local data (offline mode)');
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const handleOfferScroll = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / OFFER_WIDTH);
    setActiveOffer(index);
  };

  // البحث محلياً أو في Supabase
  const [searchResults, setSearchResults] = useState(null);
  useEffect(() => {
    if (!searchText.trim()) {
      setSearchResults(null);
      return;
    }
    const results = stores.filter(s =>
      (s.name_ar || s.nameAr || '').includes(searchText) ||
      (s.name_en || s.nameEn || '').toLowerCase().includes(searchText.toLowerCase())
    );
    setSearchResults(results);
  }, [searchText, stores]);

  // تطبيع البيانات (Supabase snake_case ↔ local camelCase)
  const normalizeStore = (s) => ({
    id: s.id,
    nameAr: s.name_ar || s.nameAr,
    nameEn: s.name_en || s.nameEn,
    category: s.category,
    rating: s.rating,
    reviewCount: s.review_count || s.reviewCount,
    deliveryTime: s.delivery_time || s.deliveryTime,
    deliveryFee: s.delivery_fee ?? s.deliveryFee,
    minOrder: s.min_order || s.minOrder,
    emoji: s.emoji,
    descriptionAr: s.description_ar || s.descriptionAr,
    descriptionEn: s.description_en || s.descriptionEn,
    isOpen: s.is_open ?? s.isOpen ?? true,
    isFeatured: s.is_featured ?? s.isFeatured ?? false,
    badge: s.badge_ar || s.badge,
    badgeEn: s.badge_en || s.badgeEn,
    // للتوافق مع خدمة API
    name_ar: s.name_ar || s.nameAr,
    name_en: s.name_en || s.nameEn,
    delivery_fee: s.delivery_fee ?? s.deliveryFee,
  });

  const normalizeOffer = (o) => ({
    id: o.id,
    titleAr: o.title_ar || o.titleAr,
    titleEn: o.title_en || o.titleEn,
    subtitleAr: o.subtitle_ar || o.subtitleAr,
    subtitleEn: o.subtitle_en || o.subtitleEn,
    color: o.color,
    emoji: o.emoji,
  });

  const normalizeCategory = (c) => ({
    id: c.id,
    nameAr: c.name_ar || c.nameAr,
    nameEn: c.name_en || c.nameEn,
    icon: c.icon,
  });

  const normalizedStores = stores.map(normalizeStore);
  const featuredStores = normalizedStores.filter(s => s.isFeatured);
  const openStores = normalizedStores.filter(s => s.isOpen);
  const normalizedOffers = offers.map(normalizeOffer);
  const normalizedCategories = categories.map(normalizeCategory);

  // اسم المستخدم
  const userName = profile?.name || user?.user_metadata?.name || t('مرحباً', 'Hello');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={18} color={COLORS.gold} />
          <View style={{ marginStart: 6 }}>
            <Text style={styles.locationLabel}>{t('مرحباً،', 'Hello,')} {userName} 👋</Text>
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
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

        {loading && !refreshing && (
          <View style={{ alignItems: 'center', padding: 20 }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}

        {searchText.length > 0 ? (
          /* نتائج البحث */
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t(`نتائج البحث (${(searchResults || []).length})`, `Results (${(searchResults || []).length})`)}
            </Text>
            {(searchResults || []).map(store => (
              <StoreCard
                key={store.id}
                store={store}
                horizontal
                onPress={() => navigation.navigate('Store', { store })}
              />
            ))}
            {(searchResults || []).length === 0 && (
              <View style={styles.emptySearch}>
                <Text style={{ fontSize: 40 }}>🔍</Text>
                <Text style={styles.emptySearchText}>{t('لا توجد نتائج', 'No results found')}</Text>
              </View>
            )}
          </View>
        ) : (
          <>
            {/* العروض */}
            <View style={styles.offersSection}>
              <FlatList
                data={normalizedOffers}
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
                {normalizedOffers.map((_, i) => (
                  <View key={i} style={[styles.dot, i === activeOffer && styles.activeDot]} />
                ))}
              </View>
            </View>

            {/* الفئات */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('التصنيفات', 'Categories')}</Text>
              <FlatList
                data={normalizedCategories}
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

            {/* مميزة */}
            {featuredStores.length > 0 && (
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
            )}

            {/* جميع المتاجر المفتوحة */}
            <View style={[styles.section, { paddingHorizontal: SPACING.lg }]}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t('جميع المتاجر المفتوحة', 'All Open Stores')}</Text>
                <Text style={[styles.seeAll, { color: COLORS.textMuted }]}>{openStores.length}</Text>
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
  emptySearch: { alignItems: 'center', padding: 40 },
  emptySearchText: { fontSize: 16, color: COLORS.textMuted, marginTop: 12, fontWeight: '600' },
});
