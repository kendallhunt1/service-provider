import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import { useRoute } from '@react-navigation/native';

const ResetPasswordScreen = () => {
  const route = useRoute();
  const { token } = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    // You can send an API request to update the user's password here.
    // If successful, set `resetSuccess` to true.
    // Example:
    // API.resetPassword(email, newPassword)
    //   .then(() => setResetSuccess(true))
    //   .catch(error => console.error('Error resetting password:', error));
  };

  return (
    <ImageBackground style={styles.background} resizeMode="cover">
      <View style={styles.container}>
        <View style={styles.form}>
          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your new password"
            secureTextEntry
            onChangeText={(text) => setNewPassword(text)}
          />
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm your new password"
            secureTextEntry
            onChangeText={(text) => setConfirmPassword(text)}
          />
          {passwordMismatch && (
            <Text style={styles.errorText}>Passwords do not match.</Text>
          )}
          <TouchableOpacity
            style={
              resetSuccess ? styles.successButton : styles.resetButton
            }
            onPress={handleResetPassword}
          >
            <Text style={styles.buttonText}>
              {resetSuccess ? 'Success!' : 'Reset Password'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#e57373', // Set your background color
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  form: {
    width: '80%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  resetButton: {
    backgroundColor: 'blue', // Set your button color
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  successButton: {
    backgroundColor: 'green', // Set your success button color
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
});

export default ResetPasswordScreen;
