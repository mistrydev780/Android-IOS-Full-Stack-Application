import Constants from 'expo-constants';
import { useState } from 'react';
import { StyleSheet, Switch, Text } from 'react-native';

import { MenuGroup, MenuItem } from '@/components/ui/menu-item';
import { Screen } from '@/components/ui/screen';
import { useAuth } from '@/context/auth-context';
import { API_URL } from '@/services/api';
import { colors, spacing, typography } from '@/theme';
import { confirm } from '@/utils/confirm';

export default function SettingsScreen() {
  const { signOut } = useAuth();

  const [orderUpdates, setOrderUpdates] = useState(true);
  const [offers, setOffers] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  const handleSignOut = async () => {
    if (await confirm('Sign out', 'Are you sure you want to sign out?', 'Sign out')) {
      await signOut();
    }
  };

  const toggle = (value: boolean, onChange: (value: boolean) => void) => (
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ true: colors.ink, false: colors.borderStrong }}
      thumbColor={colors.surface}
    />
  );

  return (
    <Screen edges={['bottom']} contentStyle={styles.content}>
      <MenuGroup title="NOTIFICATIONS">
        <MenuItem icon="truck" label="Order updates" description="Shipping and delivery alerts" right={toggle(orderUpdates, setOrderUpdates)} />
        <MenuItem icon="tag" label="Offers & deals" description="Sales and personalised offers" right={toggle(offers, setOffers)} />
        <MenuItem icon="mail" label="Newsletter" description="Weekly picks by email" right={toggle(newsletter, setNewsletter)} />
      </MenuGroup>

      <MenuGroup title="APP">
        <MenuItem icon="globe" label="Language" right={<Text style={styles.value}>English</Text>} />
        <MenuItem icon="card" label="Currency" right={<Text style={styles.value}>INR (₹)</Text>} />
        <MenuItem icon="info" label="Version" right={<Text style={styles.value}>{Constants.expoConfig?.version ?? '1.0.0'}</Text>} />
      </MenuGroup>

      {__DEV__ ? (
        <MenuGroup title="DEVELOPER">
          <MenuItem icon="globe" label="API server" description={API_URL} />
        </MenuGroup>
      ) : null}

      <MenuGroup>
        <MenuItem icon="logout" label="Sign out" danger onPress={handleSignOut} />
      </MenuGroup>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
    maxWidth: 720,
    paddingTop: spacing.md,
  },
  value: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
