import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';
import { STORES, CATEGORIES } from '../constants/data';
import StoreCard from '../components/StoreCard';

export default function StoresScreen({ navigation, route }) {
  const { isAr } = useApp();
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState(route?.params?.categoryId || 'all');

  const t = (ar, en) => isAr ? ar : en;

  const filtered = activeCategory === 'all'
    ? STORES
    : STORES.filter(s => s.category === activeCategory);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('المتاجر', 'Stores')}</Text>
      </View>

      {/* Category Tabs */}
      <View style={styles.tabsContainer}>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: SPACING.sm, paddingVertical: SPACING.sm }}
          renderItem={({ item }) => {
            const isActive = activeCategory === item.id;
            return (
              <TouchableOpacity
                style={[styles.tab, isActive && styles.activeTab]}
                onPress={() => setActiveCategory(item.id)}
              >
                <Text style={styles.tabEmoji}>{item.icon}</Text>
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                  {isAr ? item.nameAr : item.nameEn}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Stores */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.storesList}
      >
        <Text style={styles.count}>
          {t(`${filtered.length} متجر`, `${filtered.length} stores`)}
        </Text>
        {filtered.map(store => (
          <StoreCard
            key={store.id}
            store={store}
            onPress={() => navigation.navigate('Store', { store })}
          />
        ))}
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
  tabsContainer: {
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabEmoji: { fontSize: 16 },
  tabText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  activeTabText: { color: '#fff' },
  storesList: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: 20,
  },
  count: { fontSize: 13, color: COLORS.textSecondary, marginBottom: SPACING.md },
});
