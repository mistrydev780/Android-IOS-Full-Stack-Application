import { useState, type Ref } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputInstance,
  type TextInputProps,
} from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

import { Icon, type IconName } from './icon';

type TextFieldProps = Omit<TextInputProps, 'style'> & {
  label: string;
  icon?: IconName;
  error?: string;
  // Adds a show/hide toggle and hides the text by default
  password?: boolean;
  ref?: Ref<TextInputInstance>;
};

export function TextField({ label, icon, error, password, ref, onFocus, onBlur, ...props }: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  const borderColor = error ? colors.danger : focused ? colors.primary : colors.border;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      <View style={[styles.field, { borderColor }, focused && styles.fieldFocused]}>
        {icon ? <Icon name={icon} size={18} color={focused ? colors.primary : colors.textMuted} /> : null}

        <TextInput
          ref={ref}
          {...props}
          secureTextEntry={password ? hidden : props.secureTextEntry}
          placeholderTextColor={colors.textMuted}
          accessibilityLabel={label}
          style={styles.input}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
        />

        {password ? (
          <Pressable
            onPress={() => setHidden((value) => !value)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
          >
            <Icon name={hidden ? 'eye' : 'eyeOff'} size={18} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 54,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    backgroundColor: colors.surface,
  },
  // Soft brand halo; border width stays the same so nothing shifts
  fieldFocused: {
    boxShadow: '0px 0px 0px 4px rgba(91, 76, 240, 0.12)',
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: spacing.sm,
    outlineWidth: 0,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
  },
});
