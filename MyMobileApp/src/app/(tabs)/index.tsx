import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Logo } from '@/components/brand/logo';
import { ProductGrid } from '@/components/shop/product-grid';
import { SectionHeader } from '@/components/shop/section-header';
import { HeroScene } from '@/components/three/hero-scene';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/ui/fade-in';
import { Icon, type IconName } from '@/components/ui/icon';
import { LoadState } from '@/components/ui/load-state';
import { Screen } from '@/components/ui/screen';
import { useAuth } from '@/context/auth-context';
import { useProducts } from '@/context/products-context';
import { categories } from '@/data/products';
import { useResponsive } from '@/hooks/use-responsive';
import { colors, radius, shadows, spacing, typography } from '@/theme';

const perks: { icon: IconName; title: string; text: string }[] = [
  { icon: 'truck', title: 'Free delivery', text: 'On orders above ₹999' },
  { icon: 'returns', title: '7-day returns', text: 'No questions asked' },
  { icon: 'shield', title: 'Secure payments', text: '100% protected' },
];


export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isTablet, isDesktop } = useResponsive();
  const { products, status, error, refresh, refreshing } = useProducts();

  const featured = products.filter((product) => product.badge);
  const recommended = products.filter((product) => !product.badge);

  const firstName = user?.name.split(' ')[0] ?? 'there';

  const openCategory = (category?: string) =>
    router.push({ pathname: '/search', params: category ? { category } : {} });

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          {isDesktop ? null : <Logo size={30} />}
          <Text style={styles.greeting}>Hi {firstName} 👋</Text>
          <Text style={styles.headline}>What are you shopping for today?</Text>
        </View>
        <Pressable
          style={styles.iconButton}
          onPress={() => router.push('/settings')}
          accessibilityRole="button"
          accessibilityLabel="Notification settings"
        >
          <Icon name="bell" size={20} />
        </Pressable>
      </View>

      {/* Search shortcut */}
      <Pressable
        onPress={() => openCategory()}
        style={styles.searchBar}
        accessibilityRole="search"
        accessibilityLabel="Search products"
      >
        <Icon name="search" size={20} color={colors.textMuted} />
        <Text style={styles.searchPlaceholder}>Search headphones, sneakers, laptops…</Text>
        <View style={styles.searchFilter}>
          <Icon name="filter" size={18} color={colors.textInverse} />
        </View>
      </Pressable>

      {/* Hero */}
      <FadeIn index={1}>
        <View style={[styles.hero, isTablet && styles.heroWide]}>
          <HeroScene style={[styles.heroScene, isTablet && styles.heroSceneWide]} />

          <View style={styles.heroCopy}>
            <View style={styles.heroTag}>
              <Icon name="bolt" size={14} color={colors.accent} />
              <Text style={styles.heroTagText}>MEGA AUDIO SALE</Text>
            </View>
            <Text style={[styles.heroTitle, isTablet && styles.heroTitleWide]}>
              Up to 40% off{'\n'}premium sound
            </Text>
            <Text style={styles.heroText}>Noise-cancelling headphones from top brands.</Text>
            <Button
              title="Shop now"
              iconRight="forward"
              size="md"
              variant="outline"
              onPress={() => openCategory('audio')}
              style={styles.heroButton}
            />
          </View>
        </View>
      </FadeIn>

      {/* Categories */}
      <SectionHeader title="Categories" actionLabel="See all" onAction={() => openCategory()} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categories}
        style={styles.categoriesScroll}
      >
        {categories.map((category) => (
          <Pressable
            key={category.id}
            onPress={() => openCategory(category.id)}
            style={({ pressed }) => [styles.category, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel={category.name}
          >
            <View style={styles.categoryIcon}>
              <Icon name={category.icon} size={26} color={colors.ink} />
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Trust perks */}
      <View style={[styles.perks, !isTablet && styles.perksStacked]}>
        {perks.map((perk, index) => (
          <FadeIn key={perk.title} index={index} style={isTablet && styles.perkWide}>
            <View style={styles.perk}>
              <View style={styles.perkIcon}>
                <Icon name={perk.icon} size={20} color={colors.primary} />
              </View>
              <View style={styles.perkCopy}>
                <Text style={styles.perkTitle}>{perk.title}</Text>
                <Text style={styles.perkText}>{perk.text}</Text>
              </View>
            </View>
          </FadeIn>
        ))}
      </View>

      {/* Products */}
      {status === 'ready' ? (
        <>
          <SectionHeader title="Trending now" actionLabel="View all" onAction={() => openCategory()} />
          <ProductGrid products={featured} />

          <View style={styles.sectionGap} />

          <SectionHeader title="Picked for you" />
          <ProductGrid products={recommended} />
        </>
      ) : (
        <LoadState loading={status === 'loading'} error={error} onRetry={refresh} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  headerText: {
    flex: 1,
    gap: spacing.xxs,
  },
  greeting: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  headline: {
    ...typography.h1,
    color: colors.text,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingLeft: spacing.md,
    paddingRight: 6,
    height: 54,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  searchPlaceholder: {
    flex: 1,
    ...typography.body,
    color: colors.textMuted,
  },
  searchFilter: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
    borderRadius: radius.xl,
    backgroundColor: colors.ink,
    padding: spacing.xl,
    overflow: 'hidden',
    gap: spacing.lg,
    ...shadows.lg,
  },
  heroWide: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  heroScene: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: -40,
    width: '62%',
  },
  heroSceneWide: {
    right: 0,
    width: '48%',
  },
  heroCopy: {
    gap: spacing.sm,
    maxWidth: '62%',
    minHeight: 200,
    justifyContent: 'center',
  },
  heroTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  heroTagText: {
    ...typography.overline,
    color: colors.textInverse,
  },
  heroTitle: {
    ...typography.h1,
    fontSize: 28,
    lineHeight: 34,
    color: colors.textInverse,
  },
  heroTitleWide: {
    ...typography.display,
    fontSize: 40,
    lineHeight: 46,
  },
  heroText: {
    ...typography.body,
    color: 'rgba(255,255,255,0.7)',
  },
  heroButton: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  categoriesScroll: {
    marginBottom: spacing.xl,
  },
  categories: {
    gap: spacing.sm,
  },
  category: {
    alignItems: 'center',
    gap: spacing.xs,
    width: 84,
  },
  categoryIcon: {
    width: 68,
    height: 68,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
  perks: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  perksStacked: {
    flexDirection: 'column',
  },
  perk: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  perkWide: {
    flex: 1,
  },
  perkIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perkCopy: {
    flex: 1,
  },
  perkTitle: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  perkText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  sectionGap: {
    height: spacing.xxl,
  },
});
