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
import { validateEmail } from '@/utils/validation/validation';

type Errors = { email?: string; password?: string };

export default function SignInScreen() {
  const { signIn } = useAuth();
  const passwordRef = useRef<TextInputInstance>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSignIn = async () => {
    const nextErrors: Errors = {
      email: validateEmail(email) || undefined,
      password: password ? undefined : 'Password is required',
    };

    setErrors(nextErrors);
    setFormError('');
    if (nextErrors.email || nextErrors.password) return;

    setSubmitting(true);
    try {
      // On success the protected routes switch to the home screen automatically
      await signIn(email, password);
    } catch (error) {
      setFormError(error instanceof ApiError ? error.message : 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to your account."
      footer={
        <Text style={styles.footerText}>
          New to DevCommerce?{' '}
          <Link href="/signup" replace style={styles.link}>
            Create an account
          </Link>
        </Text>
      }
    >
      <FormAlert message={formError} />

      <View style={styles.fields}>
        <TextField
          label="Email"
          icon="mail"
          placeholder="you@example.com"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
          }}
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
          placeholder="Enter your password"
          password
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
          }}
          error={errors.password}
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={handleSignIn}
        />
      </View>

      <Button title="Sign in" onPress={handleSignIn} loading={submitting} iconRight="forward" fullWidth />
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
});
