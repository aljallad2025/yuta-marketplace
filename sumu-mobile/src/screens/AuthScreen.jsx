import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../services/api';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../constants/theme';

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [isAr, setIsAr] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  });

  const t = (ar, en) => isAr ? ar : en;
  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      Alert.alert(t('خطأ', 'Error'), t('يرجى ملء جميع الحقول', 'Please fill all fields'));
      return;
    }
    if (form.password.length < 6) {
      Alert.alert(t('خطأ', 'Error'), t('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'Password must be at least 6 characters'));
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await authService.signIn(form.email, form.password);
      } else {
        if (!form.name) {
          Alert.alert(t('خطأ', 'Error'), t('يرجى إدخال اسمك', 'Please enter your name'));
          setLoading(false);
          return;
        }
        const { user, session } = await authService.signUp(form.email, form.password, form.name, form.phone);
        if (!session) {
          Alert.alert(
            t('تم إنشاء الحساب', 'Account Created'),
            t('تحقق من بريدك الإلكتروني لتأكيد الحساب', 'Check your email to confirm your account')
          );
        }
      }
    } catch (err) {
      const msg = err.message || t('حدث خطأ', 'An error occurred');
      Alert.alert(t('خطأ', 'Error'), msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setIsAr(!isAr)} style={styles.langToggle}>
            <Text style={styles.langToggleText}>{isAr ? 'EN' : 'ع'}</Text>
          </TouchableOpacity>
        </View>

        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🛵</Text>
          </View>
          <Text style={styles.logoTitle}>سومو</Text>
          <Text style={styles.logoSubtitle}>{t('توصيل سريع · تاكسي ذكي', 'Fast Delivery · Smart Taxi')}</Text>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, mode === 'login' && styles.activeTab]}
            onPress={() => setMode('login')}
          >
            <Text style={[styles.tabText, mode === 'login' && styles.activeTabText]}>
              {t('تسجيل الدخول', 'Sign In')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, mode === 'register' && styles.activeTab]}
            onPress={() => setMode('register')}
          >
            <Text style={[styles.tabText, mode === 'register' && styles.activeTabText]}>
              {t('إنشاء حساب', 'Sign Up')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={[styles.formCard, SHADOWS.md]}>
          {mode === 'register' && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('الاسم الكامل', 'Full Name')}</Text>
                <View style={styles.inputRow}>
                  <Ionicons name="person-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder={t('أحمد محمد', 'Ahmed Mohamed')}
                    placeholderTextColor={COLORS.textMuted}
                    value={form.name}
                    onChangeText={v => update('name', v)}
                    textAlign={isAr ? 'right' : 'left'}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('رقم الهاتف', 'Phone Number')}</Text>
                <View style={styles.inputRow}>
                  <Ionicons name="call-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="+971 50 000 0000"
                    placeholderTextColor={COLORS.textMuted}
                    value={form.phone}
                    onChangeText={v => update('phone', v)}
                    keyboardType="phone-pad"
                    textAlign={isAr ? 'right' : 'left'}
                  />
                </View>
              </View>
            </>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('البريد الإلكتروني', 'Email')}</Text>
            <View style={styles.inputRow}>
              <Ionicons name="mail-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="example@email.com"
                placeholderTextColor={COLORS.textMuted}
                value={form.email}
                onChangeText={v => update('email', v)}
                keyboardType="email-address"
                autoCapitalize="none"
                textAlign={isAr ? 'right' : 'left'}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('كلمة المرور', 'Password')}</Text>
            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder={t('••••••••', '••••••••')}
                placeholderTextColor={COLORS.textMuted}
                value={form.password}
                onChangeText={v => update('password', v)}
                secureTextEntry={!showPass}
                textAlign={isAr ? 'right' : 'left'}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)} style={{ padding: 4 }}>
                <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {mode === 'login' && (
            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>{t('نسيت كلمة المرور؟', 'Forgot password?')}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.submitBtn, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>
                {mode === 'login' ? t('تسجيل الدخول', 'Sign In') : t('إنشاء الحساب', 'Create Account')}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.terms}>
          {t(
            'بالمتابعة توافق على شروط الاستخدام وسياسة الخصوصية',
            'By continuing, you agree to our Terms & Privacy Policy'
          )}
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, paddingHorizontal: SPACING.lg, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'flex-end', paddingVertical: SPACING.md },
  langToggle: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    width: 36, height: 36,
    alignItems: 'center', justifyContent: 'center',
  },
  langToggleText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  logoSection: { alignItems: 'center', marginVertical: SPACING.xxl },
  logoCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  logoEmoji: { fontSize: 42 },
  logoTitle: { fontSize: 36, fontWeight: '900', color: COLORS.primary, letterSpacing: 1 },
  logoSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.full,
    padding: 4,
    marginBottom: SPACING.lg,
  },
  tab: { flex: 1, paddingVertical: 10, borderRadius: RADIUS.full, alignItems: 'center' },
  activeTab: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary },
  activeTabText: { color: '#fff' },
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  inputGroup: { marginBottom: SPACING.md },
  label: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
  },
  inputIcon: { marginEnd: 8 },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
  },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: SPACING.md },
  forgotText: { fontSize: 13, color: COLORS.gold, fontWeight: '600' },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  submitText: { color: '#fff', fontSize: FONTS.sizes.md, fontWeight: '800' },
  terms: { textAlign: 'center', fontSize: 11, color: COLORS.textMuted, lineHeight: 18 },
});
