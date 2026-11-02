import { StyleSheet, Text, View } from 'react-native';

import { colors, radius } from '@/theme';

type LogoProps = {
  size?: number;
  inverse?: boolean;
  showName?: boolean;
};

export function Logo({ size = 40, inverse = false, showName = true }: LogoProps) {
  return (
    <View style={styles.row} accessibilityRole="header" accessibilityLabel="Dev E-Commerce">
      <View
        style={[
          styles.mark,
          {
            width: size,
            height: size,
            borderRadius: size * 0.3,
            backgroundColor: inverse ? colors.textInverse : colors.ink,
          },
        ]}
      >
        <Text style={[styles.markText, { fontSize: size * 0.42, color: inverse ? colors.ink : colors.textInverse }]}>
          {'</>'}
        </Text>
        <View style={[styles.dot, { width: size * 0.22, height: size * 0.22, right: -size * 0.06, top: -size * 0.06 }]} />
      </View>

      {showName ? (
        <View>
          <Text style={[styles.name, { fontSize: size * 0.45, color: inverse ? colors.textInverse : colors.text }]}>
            Dev<Text style={{ color: colors.primary }}>Commerce</Text>
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mark: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markText: {
    fontWeight: '800',
    letterSpacing: -1,
  },
  dot: {
    position: 'absolute',
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },
  name: {
    fontWeight: '800',
    letterSpacing: -0.6,
  },
});
