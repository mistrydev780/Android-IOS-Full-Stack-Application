import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { CategoryChip } from '@/components/shop/category-chip';
import { ProductImage } from '@/components/shop/product-image';
import { Button } from '@/components/ui/button';
import { FormAlert } from '@/components/ui/form-alert';
import { LoadState } from '@/components/ui/load-state';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { useAuth } from '@/context/auth-context';
import { useProducts } from '@/context/products-context';
import { categories } from '@/data/products';
import { ApiError } from '@/services/api';
import { productService } from '@/services/shop.service';
import { colors, radius, spacing, typography } from '@/theme';
import type { CategoryId, Product, ProductBadge, ProductInput } from '@/types/shop';
import { confirm } from '@/utils/confirm';

const badges: (ProductBadge | null)[] = [null, 'New', 'Bestseller', 'Trending'];

type FormValues = {
  name: string;
  brand: string;
  category: CategoryId;
  price: string;
  originalPrice: string;
  stock: string;
  image: string;
  badge: ProductBadge | null;
  description: string;
  highlights: string;
};

const emptyForm: FormValues = {
  name: '',
  brand: '',
  category: 'audio',
  price: '',
  originalPrice: '',
  stock: '',
  image: '',
  badge: null,
  description: '',
  highlights: '',
};

function toForm(product: Product): FormValues {
  return {
    name: product.name,
    brand: product.brand,
    category: product.category,
    price: String(product.price),
    originalPrice: product.originalPrice ? String(product.originalPrice) : '',
    stock: String(product.stock),
    image: product.image,
    badge: product.badge ?? null,
    description: product.description,
    highlights: product.highlights.join('\n'),
  };
}

export default function ProductFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { token } = useAuth();
  const { refresh: refreshStore } = useProducts();
  const isEdit = Boolean(id);

  const [values, setValues] = useState<FormValues>(emptyForm);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id || !token) return;
    productService
      .get(id, token)
      .then(({ product }) => {
        setValues(toForm(product));
        setIsActive(product.isActive);
      })
      .catch((err) => setLoadError(err instanceof ApiError ? err.message : 'Could not load product'))
      .finally(() => setLoading(false));
  }, [id, token]);

  const set = (field: keyof FormValues) => (value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const next: typeof errors = {};
    const price = Number(values.price);
    const original = values.originalPrice ? Number(values.originalPrice) : null;

    if (values.name.trim().length < 2) next.name = 'Name is required';
    if (!values.brand.trim()) next.brand = 'Brand is required';
    if (!(price > 0)) next.price = 'Enter a valid price';
    if (original !== null && !(original >= price)) next.originalPrice = 'Must be at least the price';
    if (!/^\d+$/.test(values.stock)) next.stock = 'Enter a whole number';
    if (!/^https?:\/\/\S+$/.test(values.image.trim())) next.image = 'Enter an image URL (https://…)';
    if (values.description.trim().length < 10) next.description = 'At least 10 characters';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!token || !validate()) return;

    const input: ProductInput = {
      name: values.name.trim(),
      brand: values.brand.trim(),
      category: values.category,
      price: Number(values.price),
      originalPrice: values.originalPrice ? Number(values.originalPrice) : null,
      stock: Number(values.stock),
      image: values.image.trim(),
      badge: values.badge,
      description: values.description.trim(),
      highlights: values.highlights
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, 8),
    };

    setSaving(true);
    setFormError('');
    try {
      if (id) await productService.update(token, id, input);
      else await productService.create(token, input);
      void refreshStore();
      router.back();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Could not save the product');
      setSaving(false);
    }
  };

  const handleHide = async () => {
    if (!token || !id) return;
    const ok = await confirm(
      'Remove from store',
      'Customers will no longer see this product. Past orders are kept. You can restore it later.',
      'Remove',
    );
    if (!ok) return;

    setDeleting(true);
    try {
      await productService.remove(token, id);
      void refreshStore();
      router.back();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Could not remove the product');
      setDeleting(false);
    }
  };

  if (loading || loadError) {
    return (
      <Screen edges={['bottom']}>
        <LoadState loading={loading} error={loadError} />
      </Screen>
    );
  }

  return (
    <Screen edges={['bottom']} contentStyle={styles.content}>
      <Stack.Screen options={{ title: isEdit ? 'Edit product' : 'New product' }} />

      {!isActive ? (
        <FormAlert message="This product is hidden from the store. Use Restore on the products list to show it again." />
      ) : null}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Basics</Text>
        <TextField label="Product name" value={values.name} onChangeText={set('name')} error={errors.name} />
        <TextField label="Brand" value={values.brand} onChangeText={set('brand')} error={errors.brand} />

        <Text style={styles.label}>Category</Text>
        <View style={styles.chips}>
          {categories.map((category) => (
            <CategoryChip
              key={category.id}
              label={category.name}
              icon={category.icon}
              selected={values.category === category.id}
              onPress={() => setValues((current) => ({ ...current, category: category.id }))}
            />
          ))}
        </View>

        <Text style={styles.label}>Badge</Text>
        <View style={styles.chips}>
          {badges.map((badge) => (
            <CategoryChip
              key={badge ?? 'none'}
              label={badge ?? 'None'}
              selected={values.badge === badge}
              onPress={() => setValues((current) => ({ ...current, badge }))}
            />
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Pricing & stock</Text>
        <View style={styles.row}>
          <View style={styles.flex}>
            <TextField label="Price (₹)" value={values.price} onChangeText={set('price')} keyboardType="decimal-pad" error={errors.price} />
          </View>
          <View style={styles.flex}>
            <TextField
              label="MRP (₹, optional)"
              value={values.originalPrice}
              onChangeText={set('originalPrice')}
              keyboardType="decimal-pad"
              error={errors.originalPrice}
            />
          </View>
        </View>
        <TextField label="Units in stock" value={values.stock} onChangeText={set('stock')} keyboardType="number-pad" error={errors.stock} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Media & details</Text>
        <TextField
          label="Image URL"
          icon="image"
          placeholder="https://images.unsplash.com/…"
          value={values.image}
          onChangeText={set('image')}
          autoCapitalize="none"
          keyboardType="url"
          error={errors.image}
        />
        {/^https?:\/\/\S+$/.test(values.image.trim()) ? (
          <ProductImage uri={values.image.trim()} style={styles.preview} />
        ) : null}

        <MultilineField
          label="Description"
          value={values.description}
          onChangeText={set('description')}
          error={errors.description}
        />
        <MultilineField
          label="Highlights (one per line)"
          value={values.highlights}
          onChangeText={set('highlights')}
          placeholder={'Bluetooth 5.4\n40h battery'}
        />
      </View>

      <FormAlert message={formError} />

      <View style={styles.actions}>
        <Button title={isEdit ? 'Save changes' : 'Create product'} icon="check" onPress={handleSave} loading={saving} fullWidth />
        {isEdit && isActive ? (
          <Button title="Remove from store" variant="danger" icon="eyeSlash" onPress={handleHide} loading={deleting} fullWidth />
        ) : null}
      </View>
    </Screen>
  );
}

function MultilineField({
  label,
  value,
  onChangeText,
  error,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  placeholder?: string;
}) {
  return (
    <View style={styles.multiline}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        multiline
        textAlignVertical="top"
        accessibilityLabel={label}
        style={[styles.textarea, error && styles.textareaError]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    maxWidth: 760,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  flex: {
    flex: 1,
  },
  card: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.text,
  },
  label: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: -spacing.xs,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  preview: {
    width: 140,
    height: 140,
    borderRadius: radius.md,
  },
  multiline: {
    gap: spacing.xs,
  },
  textarea: {
    minHeight: 110,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    ...typography.body,
    color: colors.text,
    outlineWidth: 0,
  },
  textareaError: {
    borderColor: colors.danger,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
  },
  actions: {
    gap: spacing.sm,
  },
});
