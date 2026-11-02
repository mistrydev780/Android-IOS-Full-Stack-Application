
// import React, { forwardRef } from 'react';

// import {
//   View,
//   Text,
//   TextInput,
//   Pressable,
//   StyleSheet,
//   TextInputProps,
// } from 'react-native';

// type AppInputProps = TextInputProps & {
//   label: string;
//   error?: string;
//   rightLabel?: string;
//   onRightPress?: () => void;
// };

// const AppInput = forwardRef<TextInput, AppInputProps>(
//   function AppInput(
//     {
//       label,
//       error,
//       rightLabel,
//       onRightPress,
//       ...props
//     },
//     ref
//   ) {
//     return (
//       <View style={styles.wrapper}>

//         <Text style={styles.label}>{label}</Text>

//         <View style={styles.inputContainer}>
//           <TextInput
//             ref={ref}
//             {...props}
//             style={styles.input}
//             placeholderTextColor="#999"
//           />

//           {rightLabel ? (
//             <Pressable onPress={onRightPress}>
//               <Text style={styles.rightLabel}>
//                 {rightLabel}
//               </Text>
//             </Pressable>
//           ) : null}
//         </View>

//         {error ? (
//           <Text style={styles.error}>{error}</Text>
//         ) : null}

//       </View>
//     );
//   }
// );

// export default AppInput;

// const styles = StyleSheet.create({
//   wrapper: {
//     marginTop: 15,
//   },

//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     marginBottom: 8,
//   },

//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 10,
//     paddingHorizontal: 12,
//   },

//   input: {
//     flex: 1,
//     paddingVertical: 15,
//     fontSize: 15,
//     color: '#222',
//   },

//   rightLabel: {
//     color: '#2563eb',
//     fontWeight: 'bold',
//     padding: 5,
//   },

//   error: {
//     color: '#dc2626',
//     fontSize: 12,
//     marginTop: 5,
//   },
// });
