
import React, {
  useState,
  useMemo,
  useCallback,
  memo,
} from 'react';

import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';

// Memoized Child Component
type ButtonProps = {
  onPress: () => void;
};

const CounterButton = memo(({ onPress }: ButtonProps) => {
  console.log('Button Component Rendered');

  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>Increase Count</Text>
    </Pressable>
  );
});

const products = [
  'Laptop',
  'Mobile',
  'Keyboard',
  'Mouse',
  'Monitor',
];

export default function PerformanceDemo() {

  const [count, setCount] = useState(0);
  const [search, setSearch] = useState('');

  // useMemo: Cache filtered result
  const filteredProducts = useMemo(() => {
    console.log('Filtering Products');

    return products.filter((product) =>
      product.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // useCallback: Cache function reference
  const handleIncrement = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        React Native Hooks
      </Text>

      <Text style={styles.count}>
        Count: {count}
      </Text>

      <CounterButton onPress={handleIncrement} />

      <TextInput
        style={styles.input}
        placeholder="Search products..."
        value={search}
        onChangeText={setSearch}
      />

      <Text style={styles.subtitle}>
        Products:
      </Text>

      {filteredProducts.map((product) => (
        <Text key={product} style={styles.product}>
          {product}
        </Text>
      ))}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  count: {
    fontSize: 20,
    marginBottom: 15,
  },

  button: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },

  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },

  product: {
    fontSize: 16,
    padding: 8,
  },
});
