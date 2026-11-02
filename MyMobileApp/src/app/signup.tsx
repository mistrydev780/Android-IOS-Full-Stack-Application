import { Link } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, Text, View, type TextInputInstance } from 'react-native';

import { AuthLayout } from '@/components/auth/auth-layout';
import { Button } from '@/components/ui/button';
import { FormAlert } from '@/components/ui/form-alert';
import { TextField } from '@/components/ui/text-field';
import { useAuth } from '@/context/auth-context';
import { ApiError } from '@/services/api';
import { colors, typography } from '@/theme';
import {
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
} from '@/utils/validation/validation';

type Field = 'name' | 'email' | 'password' | 'confirmPassword';
type Errors = Partial<Record<Field, string>>;

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const emailRef = useRef<TextInputInstance>(null);
  const passwordRef = useRef<TextInputInstance>(null);
  const confirmRef = useRef<TextInputInstance>(null);

  const [values, setValues] = useState<Record<Field, string>>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (field: Field) => (text: string) => {
    setValues((current) => ({ ...current, [field]: text }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSignUp = async () => {
    const nextErrors: Errors = {
      name: validateName(values.name) || undefined,
      email: validateEmail(values.email) || undefined,
      password: validatePassword(values.password) || undefined,
      confirmPassword: validateConfirmPassword(values.password, values.confirmPassword) || undefined,
    };

    setErrors(nextErrors);
    setFormError('');
    if (Object.values(nextErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      await signUp(values.name, values.email, values.password);
    } catch (error) {
      if (error instanceof ApiError) {
        // Show server validation errors next to their fields
        setErrors({
          name: error.fieldError('name'),
          email: error.fieldError('email'),
          password: error.fieldError('password'),
        });
        setFormError(error.errors.length ? '' : error.message);
      } else {
        setFormError('Something went wrong. Please try again.');
      }
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join DevCommerce and start shopping in seconds."
      footer={
        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Link href="/signin" replace style={styles.link}>
            Sign in
          </Link>
        </Text>
      }
    >
      <FormAlert message={formError} />

      <View style={styles.fields}>
        <TextField
          label="Full name"
          icon="person"
          placeholder="Your full name"
          value={values.name}
          onChangeText={update('name')}
          error={errors.name}
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
        />

        <TextField
          ref={emailRef}
          label="Email"
          icon="mail"
          placeholder="you@example.com"
          value={values.email}
          onChangeText={update('email')}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />

        <TextField
          ref={passwordRef}
          label="Password"
          icon="lock"
          placeholder="At least 8 characters"
          password
          value={values.password}
          onChangeText={update('password')}
          error={errors.password}
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="next"
          onSubmitEditing={() => confirmRef.current?.focus()}
        />

        <TextField
          ref={confirmRef}
          label="Confirm password"
          icon="lock"
          placeholder="Re-enter your password"
          password
          value={values.confirmPassword}
          onChangeText={update('confirmPassword')}
          error={errors.confirmPassword}
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="go"
          onSubmitEditing={handleSignUp}
        />
      </View>

      <Button title="Create account" onPress={handleSignUp} loading={submitting} iconRight="forward" fullWidth />

      <Text style={styles.terms}>
        By creating an account you agree to our Terms of Service and Privacy Policy.
      </Text>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  fields: {
    gap: 16,
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  link: {
    color: colors.primary,
    fontWeight: '700',
  },
  terms: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
