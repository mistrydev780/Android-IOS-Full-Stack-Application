import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Logo } from '@/components/brand/logo';
import { HeroScene } from '@/components/three/hero-scene';
import { FadeIn } from '@/components/ui/fade-in';
import { Icon, type IconName } from '@/components/ui/icon';
import { useResponsive } from '@/hooks/use-responsive';
import { colors, radius, shadows, spacing, typography } from '@/theme';

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

const perks: { icon: IconName; text: string }[] = [
  { icon: 'truck', text: 'Free delivery on orders above ₹999' },
  { icon: 'returns', text: 'Easy 7-day returns' },
  { icon: 'shield', text: '100% secure payments' },
];

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  const { width } = useResponsive();
  const split = width >= 900;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.flex, split && styles.splitRow]}>
          {split ? <BrandPanel /> : null}

          <ScrollView
            style={styles.flex}
            contentContainerStyle={[styles.scroll, split && styles.scrollSplit]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <FadeIn style={[styles.form, split && styles.formCard]}>
              {split ? null : (
                <View style={styles.mobileHero}>
                  <HeroScene compact style={StyleSheet.absoluteFill} />
                  <Logo size={34} inverse />
                </View>
              )}

              <View style={styles.heading}>
                <Text style={styles.title} accessibilityRole="header">
                  {title}
                </Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
              </View>

              {children}

              <View style={styles.footer}>{footer}</View>
            </FadeIn>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function BrandPanel() {
  return (
    <View style={styles.brandPanel}>
      <HeroScene style={styles.panelScene} />

      <Logo size={44} inverse />

      <View style={styles.brandCopy}>
        <Text style={styles.brandOverline}>PREMIUM TECH & LIFESTYLE</Text>
        <Text style={styles.brandTitle}>Everything you love,{'\n'}delivered beautifully.</Text>
        <View style={styles.perks}>
          {perks.map((perk) => (
            <View key={perk.text} style={styles.perkRow}>
              <View style={styles.perkIcon}>
                <Icon name={perk.icon} size={18} color={colors.textInverse} />
              </View>
              <Text style={styles.perkText}>{perk.text}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.brandFooter}>© {new Date().getFullYear()} Dev E-Commerce</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  splitRow: {
    flexDirection: 'row',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  scrollSplit: {
    alignItems: 'center',
    padding: spacing.xxl,
  },
  form: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    gap: spacing.lg,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
  },
  mobileHero: {
    height: 170,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.ink,
    padding: spacing.lg,
    justifyContent: 'flex-end',
  },
  heading: {
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  brandPanel: {
    flex: 1,
    maxWidth: 560,
    backgroundColor: colors.ink,
    padding: spacing.xxxl,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  panelScene: {
    position: 'absolute',
    top: -60,
    right: -150,
    width: 480,
    height: 480,
  },
  brandCopy: {
    gap: spacing.lg,
  },
  brandOverline: {
    ...typography.overline,
    color: 'rgba(255,255,255,0.6)',
  },
  brandTitle: {
    ...typography.display,
    fontSize: 40,
    lineHeight: 46,
    color: colors.textInverse,
  },
  perks: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  perkIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  perkText: {
    ...typography.body,
    color: 'rgba(255,255,255,0.85)',
  },
  brandFooter: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.45)',
  },
});
