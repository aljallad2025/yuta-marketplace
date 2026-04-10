import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS } from '../constants/theme';

export default function Header({ title, onBack, rightAction, rightIcon, rightLabel, transparent, light }) {
  const insets = useSafeAreaInsets();
  const textColor = light ? '#fff' : COLORS.text;
  const bgColor = transparent ? 'transparent' : COLORS.card;

  return (
    <View style={[styles.header, { paddingTop: insets.top + 8, backgroundColor: bgColor }]}>
      <View style={styles.inner}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.iconBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconBtn} />
        )}

        <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>{title}</Text>

        {rightAction ? (
          <TouchableOpacity onPress={rightAction} style={styles.rightBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            {rightIcon && <Ionicons name={rightIcon} size={24} color={textColor} />}
            {rightLabel && <Text style={[styles.rightLabel, { color: textColor }]}>{rightLabel}</Text>}
          </TouchableOpacity>
        ) : (
          <View style={styles.iconBtn} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  rightBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  rightLabel: { fontSize: FONTS.sizes.sm, fontWeight: '600' },
});
