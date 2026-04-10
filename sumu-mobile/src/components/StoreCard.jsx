import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function StoreCard({ store, onPress, horizontal }) {
  const { isAr } = useApp();
  const name = isAr ? store.nameAr : store.nameEn;
  const desc = isAr ? store.descriptionAr : store.descriptionEn;
  const badge = isAr ? store.badge : store.badgeEn;

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
            <Text style={styles.meta}>{store.deliveryTime} min</Text>
            <Text style={styles.dot}>·</Text>
            <Text style={styles.meta}>
              {store.deliveryFee === 0 ? (isAr ? 'توصيل مجاني' : 'Free') : `${store.deliveryFee} AED`}
            </Text>
          </View>
        </View>
        {!store.isOpen && (
          <View style={styles.closedBadge}>
            <Text style={styles.closedText}>{isAr ? 'مغلق' : 'Closed'}</Text>
          </View>
        )}
        {badge && store.isOpen && (
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
        {!store.isOpen && (
          <View style={styles.closedOverlay}>
            <Text style={styles.closedText}>{isAr ? 'مغلق' : 'Closed'}</Text>
          </View>
        )}
        {badge && store.isOpen && (
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
          <Text style={styles.meta}>{store.deliveryTime} min</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.meta}>
            {store.deliveryFee === 0 ? (isAr ? 'توصيل مجاني' : 'Free Delivery') : `${store.deliveryFee} AED`}
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
