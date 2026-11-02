import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { colors, radius, spacing, typography } from '@/theme';

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

export function QuantityStepper({ value, onChange, min = 1, max = 10 }: QuantityStepperProps) {
  return (
    <View style={styles.row} accessibilityLabel={`Quantity ${value}`}>
      <StepButton icon="minus" label="Decrease quantity" disabled={value <= min} onPress={() => onChange(value - 1)} />
      <Text style={styles.value}>{value}</Text>
      <StepButton icon="plus" label="Increase quantity" disabled={value >= max} onPress={() => onChange(value + 1)} />
    </View>
  );
}

type StepButtonProps = {
  icon: 'plus' | 'minus';
  label: string;
  disabled: boolean;
  onPress: () => void;
};

function StepButton({ icon, label, disabled, onPress }: StepButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, disabled && styles.disabled]}
    >
      <Icon name={icon} size={16} color={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    padding: 3,
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.35,
  },
  value: {
    ...typography.bodyStrong,
    minWidth: 32,
    textAlign: 'center',
    color: colors.text,
  },
});
