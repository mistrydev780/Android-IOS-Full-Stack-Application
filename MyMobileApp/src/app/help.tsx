import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { MenuGroup, MenuItem } from '@/components/ui/menu-item';
import { Screen } from '@/components/ui/screen';
import { colors, radius, spacing, typography } from '@/theme';

const faqs = [
  {
    q: 'How long does delivery take?',
    a: 'Most orders arrive within 2–4 business days. Delivery is free on orders above ₹999.',
  },
  {
    q: 'What is your return policy?',
    a: 'You can return any item within 7 days of delivery. We arrange a free pickup and refund to your original payment method.',
  },
  {
    q: 'Which payment methods do you accept?',
    a: 'UPI, all major credit and debit cards, and cash on delivery.',
  },
  {
    q: 'Are the products genuine?',
    a: 'Yes. Every product is sourced directly from brands or authorised sellers and comes with an official warranty.',
  },
  {
    q: 'How do I track my order?',
    a: 'You will receive order updates by notification and email once your order ships.',
  },
];

export default function HelpScreen() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Screen edges={['bottom']} contentStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>How can we help?</Text>
        <Text style={styles.heroText}>Our support team is available every day, 9 AM – 9 PM.</Text>
      </View>

      <MenuGroup title="CONTACT US">
        <MenuItem
          icon="mail"
          label="Email support"
          description="support@devcommerce.app"
          onPress={() => Linking.openURL('mailto:support@devcommerce.app')}
        />
        <MenuItem
          icon="phone"
          label="Call us"
          description="1800-123-4567 (toll free)"
          onPress={() => Linking.openURL('tel:18001234567')}
        />
      </MenuGroup>

      <View style={styles.faqs}>
        <Text style={styles.faqTitle}>FREQUENTLY ASKED QUESTIONS</Text>
        <View style={styles.faqCard}>
          {faqs.map((faq, index) => {
            const expanded = open === index;
            return (
              <View key={faq.q} style={[styles.faq, index > 0 && styles.faqDivider]}>
                <Pressable
                  onPress={() => setOpen(expanded ? null : index)}
                  accessibilityRole="button"
                  accessibilityState={{ expanded }}
                  style={styles.question}
                >
                  <Text style={styles.questionText}>{faq.q}</Text>
                  <Icon name={expanded ? 'minus' : 'plus'} size={18} color={colors.textSecondary} />
                </Pressable>
                {expanded ? <Text style={styles.answer}>{faq.a}</Text> : null}
              </View>
            );
          })}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
    maxWidth: 720,
    paddingTop: spacing.md,
  },
  hero: {
    padding: spacing.xl,
    borderRadius: radius.xl,
    backgroundColor: colors.ink,
    gap: spacing.xs,
  },
  heroTitle: {
    ...typography.h1,
    color: colors.textInverse,
  },
  heroText: {
    ...typography.body,
    color: 'rgba(255,255,255,0.7)',
  },
  faqs: {
    gap: spacing.xs,
  },
  faqTitle: {
    ...typography.overline,
    color: colors.textMuted,
    marginLeft: spacing.xxs,
  },
  faqCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  faq: {
    paddingHorizontal: spacing.md,
  },
  faqDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  question: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  questionText: {
    flex: 1,
    ...typography.bodyStrong,
    color: colors.text,
  },
  answer: {
    ...typography.body,
    color: colors.textSecondary,
    paddingBottom: spacing.md,
  },
});
