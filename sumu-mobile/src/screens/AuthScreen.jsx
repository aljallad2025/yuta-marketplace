import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../constants/theme';

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const { login, register } = useApp();
  const [mode, setMode] = useState('login');
  const [isAr, setIsAr] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });

  const t = (ar, en) => isAr ? ar : en;
  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      Alert.alert(t('خطأ', 'Error'), t('يرجى ملء جميع الحقول', 'Please fill all fields'));
      return;
    }
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        if (!form.name) {
          Alert.alert(t('خطأ', 'Error'), t('يرجى إدخال اسمك', 'Please enter your name'));
          setLoading(false);
          return;
        }
        await register(form.email, form.password, form.name, form.phone);
      }
    } catch (err) {
      Alert.alert(t('خطأ', 'Error'), err.message || t('حدث خطأ، تحقق من الاتصال', 'Error, check your connection'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + 20 }]}
        keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.langBtn} onPress={() => setIsAr(v => !v)}>
          <Text style={styles.langText}>{isAr ? 'EN' : 'ع'}</Text>
        </TouchableOpacity>

        <View style={styles.logoWrap}>
          <View style={styles.logo}>
            <Ionicons name="bicycle" size={40} color={COLORS.gold} />
          </View>
          <Text style={styles.appName}>سومو</Text>
          <Text style={styles.tagline}>Fast Delivery · Smart Taxi</Text>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity style={[styles.tab, mode === 'login' && styles.activeTab]} onPress={() => setMode('login')}>
            <Text style={[styles.tabText, mode === 'login' && styles.activeTabText]}>{t('تسجيل الدخول', 'Sign In')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, mode === 'register' && styles.activeTab]} onPress={() => setMode('register')}>
            <Text style={[styles.tabText, mode === 'register' && styles.activeTabText]}>{t('إنشاء حساب', 'Sign Up')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          {mode === 'register' && (
            <>
              <Text style={styles.label}>{t('الاسم', 'Name')}</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="person-outline" size={18} color="#999" style={styles.inputIcon} />
                <TextInput style={styles.input} value={form.name} onChangeText={v => update('name', v)}
                  placeholder={t('الاسم الكامل', 'Full name')} placeholderTextColor="#BBB" />
              </View>
              <Text style={styles.label}>{t('الجوال', 'Phone')}</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="call-outline" size={18} color="#999" style={styles.inputIcon} />
                <TextInput style={styles.input} value={form.phone} onChangeText={v => update('phone', v)}
                  placeholder="+966 5X XXX XXXX" placeholderTextColor="#BBB" keyboardType="phone-pad" />
              </View>
            </>
          )}

          <Text style={styles.label}>{t('البريد الإلكتروني', 'Email')}</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={18} color="#999" style={styles.inputIcon} />
            <TextInput style={styles.input} value={form.email} onChangeText={v => update('email', v)}
              placeholder="example@email.com" placeholderTextColor="#BBB"
              keyboardType="email-address" autoCapitalize="none" />
          </View>

          <Text style={styles.label}>{t('كلمة المرور', 'Password')}</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={18} color="#999" style={styles.inputIcon} />
            <TextInput style={[styles.input, { flex: 1 }]} value={form.password} onChangeText={v => update('password', v)}
              placeholder="••••••••" placeholderTextColor="#BBB" secureTextEntry={!showPass} />
            <TouchableOpacity onPress={() => setShowPass(v => !v)}>
              <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color="#999" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> :
              <Text style={styles.submitText}>{mode === 'login' ? t('تسجيل الدخول', 'Sign In') : t('إنشاء الحساب', 'Create Account')}</Text>}
          </TouchableOpacity>

          <Text style={styles.terms}>{t('بالمتابعة توافق على', 'By continuing you agree to our')} <Text style={{ color: COLORS.gold }}>{t('الشروط والخصوصية', 'Terms & Privacy Policy')}</Text></Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: COLORS.background, paddingHorizontal: SPACING.lg, paddingBottom: 40 },
  langBtn: { alignSelf: 'flex-end', backgroundColor: COLORS.primary, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  langText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  logoWrap: { alignItems: 'center', marginVertical: 30 },
  logo: { width: 90, height: 90, borderRadius: 45, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  appName: { fontSize: 32, fontWeight: '900', color: COLORS.primary },
  tagline: { fontSize: 13, color: '#888', marginTop: 4 },
  tabs: { flexDirection: 'row', backgroundColor: '#F0F0F0', borderRadius: 14, padding: 4, marginBottom: 24 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12 },
  activeTab: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 14, fontWeight: '700', color: '#888' },
  activeTabText: { color: '#fff' },
  form: { gap: 6 },
  label: { fontSize: 13, fontWeight: '700', color: COLORS.primary, marginBottom: 4, marginTop: 8 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: RADIUS.md, borderWidth: 1, borderColor: '#E8E4DC', paddingHorizontal: 14, height: 50, ...SHADOWS.sm },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 14, color: COLORS.primary },
  submitBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, height: 52, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  terms: { textAlign: 'center', fontSize: 11, color: '#999', marginTop: 16 },
});
