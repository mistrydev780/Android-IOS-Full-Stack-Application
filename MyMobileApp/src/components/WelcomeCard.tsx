
import { useEffect, useRef, useState } from 'react';

import {
  View,
  Text,
  Pressable,
  TextInput,
  type TextInputInstance,
  StyleSheet,
} from 'react-native';

type WelcomeCardProps = {
  name: string;
  role: string;
};

export default function WelcomeCard({
  name,
  role,
}: WelcomeCardProps) {

  // useState
  const [count, setCount] = useState(0);

  const [status, setStatus] = useState(
    'Loading profile...'
  );

  // useRef
  const inputRef = useRef<TextInputInstance>(null);

  // useEffect: Run when component mounts
  useEffect(() => {

    console.log('Component Mounted');

    const timer = setTimeout(() => {
      setStatus('Profile loaded successfully ✅');
    }, 1500);

    // Cleanup
    return () => {
      clearTimeout(timer);
      console.log('Component Unmounted');
    };

  }, []);

  // useEffect: Run when count changes
  useEffect(() => {

    console.log('Count updated:', count);

  }, [count]);

  // useRef: Focus TextInput
  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <View style={styles.card}>

      <Text style={styles.title}>
        Welcome, {name}!
      </Text>

      <Text style={styles.subtitle}>
        {role}
      </Text>

      <Text style={styles.status}>
        {status}
      </Text>

      <TextInput
        ref={inputRef}
        placeholder="Enter your name"
        style={styles.input}
      />

      <Pressable
        style={styles.button}
        onPress={focusInput}
      >
        <Text style={styles.buttonText}>
          Focus Input
        </Text>
      </Pressable>

      <Text style={styles.counter}>
        Button clicked: {count}
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => setCount(prev => prev + 1)}
      >
        <Text style={styles.buttonText}>
          Increase Count
        </Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    elevation: 4,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },

  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },

  status: {
    color: 'green',
    marginTop: 15,
    fontSize: 14,
  },

  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
  },

  counter: {
    fontSize: 18,
    marginTop: 20,
  },

  button: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

});
