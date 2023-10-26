import React from 'react';
import { View, Text, Pressable, TextInput, Picker, StyleSheet } from 'react-native';

const FormSection = ({ title, children }) => {
  return (
    <View style={styles.formSection}>
      <Text style={styles.label}>{title}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  formSection: {
    marginBottom: 15,
    padding: 5,
    width: '95%',
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  label: {
    fontSize: 20,
    color: 'black',
    marginBottom: 8,
  },
});

export default FormSection;
