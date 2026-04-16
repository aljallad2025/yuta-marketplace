import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function StoreCard({ store, onPress, horizontal }) {
  const { isAr } = useApp();
  // دعم كلاً من camelCase و snake_case
  const name = isAr ? (store.name_ar || store.nameAr) : (store.name_en || store.nameEn);
  const desc = isAr ? (store.description_ar || store.descriptionAr) : (store.description_en || store.descriptionEn);
  const badge = isAr ? (store.badge_ar || store.badge) : (store.badge_en || store.badgeEn);
  const deliveryFee = store.delivery_fee ?? store.deliveryFee ?? 0;
  const deliveryTime = store.delivery_time || store.deliveryTime;
  const isOpen = store.is_open ?? store.isOpen ?? true;

  if (horizontal) {
    return (
      <TouchableOpacity style={[styles.hCard, SHADOWS.md]} onPress={onPress} activeOpacity={0.85}>
        <View style={styles.hEmoji}>
          <Text style={styles.emoji}>{store.emoji}</Text>
        </View>
        <View style={styles.hInfo}>
          <Text style={styles.hName} numberOfLines={1}>{name}</Text>
          <Text style={styles.hDesc} numberOfLines={1}>{desc}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.rating}>⭐ {store.rating}</Text>
            <Text style={styles.dot}>·</Text>
            <Text style={styles.meta}>{deliveryTime} min</Text>
            <Text style={styles.dot}>·</Text>
            <Text style={styles.meta}>
              {deliveryFee === 0 ? (isAr ? 'توصيل مجاني' : 'Free') : `${deliveryFee} AED`}
            </Text>
          </View>
        </View>
        {!isOpen && (
          <View style={styles.closedBadge}>
            <Text style={styles.closedText}>{isAr ? 'مغلق' : 'Closed'}</Text>
          </View>
        )}
        {badge && isOpen && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={[styles.card, SHADOWS.md]} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.emojiContainer}>
        <Text style={styles.bigEmoji}>{store.emoji}</Text>
        {!isOpen && (
          <View style={styles.closedOverlay}>
            <Text style={styles.closedText}>{isAr ? 'مغلق' : 'Closed'}</Text>
          </View>
        )}
        {badge && isOpen && (
          <View style={styles.topBadge}>
            <Text style={styles.topBadgeText}>{badge}</Text>
          </View>
        )}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.desc} numberOfLines={1}>{desc}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.rating}>⭐ {store.rating}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.meta}>{deliveryTime} min</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.meta}>
            {deliveryFee === 0 ? (isAr ? 'توصيل مجاني' : 'Free Delivery') : `${deliveryFee} AED`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  emojiContainer: {
    height: 120,
    backgroundColor: '#F0EDE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigEmoji: { fontSize: 56 },
  closedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closedText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  topBadge: {
    position: 'absolute',
    top: 8, left: 8,
    backgroundColor: COLORS.gold,
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  topBadgeText: { color: COLORS.primary, fontSize: 10, fontWeight: '800' },
  cardBody: { padding: SPACING.md },
  name: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  desc: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rating: { fontSize: 12, color: COLORS.text, fontWeight: '600' },
  dot: { color: COLORS.textMuted, fontSize: 12 },
  meta: { fontSize: 12, color: COLORS.textSecondary },
  // Horizontal card
  hCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    alignItems: 'center',
  },
  hEmoji: {
    width: 64, height: 64,
    backgroundColor: '#F0EDE6',
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: SPACING.md,
  },
  emoji: { fontSize: 32 },
  hInfo: { flex: 1 },
  hName: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  hDesc: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginBottom: 4 },
  closedBadge: {
    backgroundColor: '#F3F4F6',
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badge: {
    backgroundColor: COLORS.gold,
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { color: COLORS.primary, fontSize: 10, fontWeight: '800' },
});
