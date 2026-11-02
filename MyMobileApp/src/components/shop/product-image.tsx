import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { colors } from '@/theme';

type ProductImageProps = {
  uri: string;
  style?: StyleProp<ViewStyle>;
};

// Product photo with a neutral placeholder and an offline fallback
export function ProductImage({ uri, style }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <View style={[styles.frame, style]}>
      {failed ? (
        <Icon name="bag" size={32} color={colors.textMuted} />
      ) : (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={250}
          cachePolicy="memory-disk"
          onError={() => setFailed(true)}
          accessibilityIgnoresInvertColors
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
