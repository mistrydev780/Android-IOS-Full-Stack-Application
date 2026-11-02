import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';
import type { DashboardStats } from '@/types/shop';
import { formatCompactPrice, formatPrice } from '@/utils/format';

type Day = DashboardStats['sales'][number];

const CHART_HEIGHT = 150;
const MAX_BAR_WIDTH = 24;

const dayLabel = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short' });
const fullDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });

/**
 * Single-series column chart of daily revenue. Tap a column to read its value;
 * the latest day is selected by default. A table view is available for
 * screen-reader and precise reading.
 */
export function SalesChart({ sales }: { sales: Day[] }) {
  const [selected, setSelected] = useState(sales.length - 1);
  const [showTable, setShowTable] = useState(false);

  const max = Math.max(...sales.map((day) => day.revenue), 1);
  const total = sales.reduce((sum, day) => sum + day.revenue, 0);
  const orders = sales.reduce((sum, day) => sum + day.orders, 0);
  const active = sales[selected];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.flex}>
          <Text style={styles.title}>Revenue · last 7 days</Text>
          <Text style={styles.total}>{formatPrice(total)}</Text>
          <Text style={styles.sub}>
            {orders} {orders === 1 ? 'order' : 'orders'} (cancelled excluded)
          </Text>
        </View>
        <Pressable
          onPress={() => setShowTable((value) => !value)}
          accessibilityRole="button"
          hitSlop={8}
          style={styles.toggle}
        >
          <Text style={styles.toggleText}>{showTable ? 'Chart' : 'Table'}</Text>
        </Pressable>
      </View>

      {showTable ? (
        <View>
          {sales.map((day) => (
            <View key={day.date} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.flex]}>{fullDate(day.date)}</Text>
              <Text style={styles.tableCell}>{day.orders}</Text>
              <Text style={[styles.tableCell, styles.tableValue]}>{formatPrice(day.revenue)}</Text>
            </View>
          ))}
        </View>
      ) : (
        <>
          {active ? (
            <Text style={styles.readout} accessibilityLiveRegion="polite">
              {fullDate(active.date)}: <Text style={styles.readoutValue}>{formatPrice(active.revenue)}</Text> ·{' '}
              {active.orders} {active.orders === 1 ? 'order' : 'orders'}
            </Text>
          ) : null}

          <View style={styles.plot}>
            {sales.map((day, index) => {
              const height = day.revenue > 0 ? Math.max(4, (day.revenue / max) * CHART_HEIGHT) : 0;
              const isSelected = index === selected;
              return (
                <Pressable
                  key={day.date}
                  onPress={() => setSelected(index)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={`${fullDate(day.date)}: ${formatPrice(day.revenue)}, ${day.orders} orders`}
                  // Whole column is the hit target, larger than the bar itself
                  style={styles.slot}
                >
                  <Text style={[styles.barLabel, !isSelected && styles.invisible]}>
                    {formatCompactPrice(day.revenue)}
                  </Text>
                  <View
                    style={[
                      styles.bar,
                      { height },
                      isSelected ? styles.barSelected : styles.barIdle,
                    ]}
                  />
                </Pressable>
              );
            })}
          </View>
          <View style={styles.baseline} />
          <View style={styles.axis}>
            {sales.map((day, index) => (
              <Text key={day.date} style={[styles.axisLabel, index === selected && styles.axisLabelActive]}>
                {dayLabel(day.date)}
              </Text>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  title: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  total: {
    ...typography.h1,
    color: colors.text,
  },
  sub: {
    ...typography.caption,
    color: colors.textMuted,
  },
  toggle: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.text,
  },
  readout: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  readoutValue: {
    fontWeight: '700',
    color: colors.text,
  },
  plot: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: CHART_HEIGHT + 22,
  },
  slot: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // 2px surface gap between neighbouring columns
    paddingHorizontal: 1,
  },
  bar: {
    width: '62%',
    maxWidth: MAX_BAR_WIDTH,
    // Rounded data end, square at the baseline
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barIdle: {
    backgroundColor: colors.primary,
    opacity: 0.35,
  },
  barSelected: {
    backgroundColor: colors.primary,
  },
  barLabel: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  invisible: {
    opacity: 0,
  },
  baseline: {
    height: 1,
    backgroundColor: colors.borderStrong,
  },
  axis: {
    flexDirection: 'row',
    marginTop: -spacing.xs,
  },
  axisLabel: {
    flex: 1,
    textAlign: 'center',
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
  },
  axisLabelActive: {
    color: colors.text,
    fontWeight: '700',
  },
  tableRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableCell: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  tableValue: {
    minWidth: 80,
    textAlign: 'right',
    color: colors.text,
    fontWeight: '600',
  },
});
