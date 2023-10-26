import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [resetLinkSent, setResetLinkSent] = useState(false);

  const handleSendResetLink = async () => {
    try {
        const response = await fetch('http://192.168.0.3:3000/api/users/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email }), // Replace userEmail with the user's email
        });
    
        if (response.status === 200) {
          // Password reset email sent successfully
          // You can display a success message to the user
          console.log('Password reset email sent successfully');
          setResetLinkSent(true); // Update the state to show the success message
        } else if (response.status === 404) {
          // No account associated with that email
          // You can display an error message to the user
          console.error('No account associated with that email');
        } else {
          // Handle other error cases
          console.error('Error sending reset link:', response.statusText);
        }
      } catch (error) {
        console.error('Error sending reset link:', error.message);
      }
  };

  return (
    <ImageBackground
      style={styles.background}
      resizeMode="cover"
    >
        <View style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                style={styles.input}
                placeholder="Your email"
                onChangeText={(text) => setEmail(text)}
                />
                <TouchableOpacity
                style={resetLinkSent ? styles.linkSentButton : styles.sendResetButton}
                onPress={handleSendResetLink}
                disabled={resetLinkSent}
                >
                <Text style={styles.buttonText}>
                    {resetLinkSent ? 'Link sent!' : 'Send Reset Link'}
                </Text>
                </TouchableOpacity>
            </View>
        </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: '#e57373',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    form: {
        borderRadius: 8,
        width: '90%',
        backgroundColor: 'white',
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
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
        borderRadius: 8
    },
    sendResetButton: {
        backgroundColor: '#007AFF',
        padding: 12,
        alignItems: 'center',
        borderRadius: 8,
    },
    linkSentButton: {
        backgroundColor: 'green',
        padding: 12,
        alignItems: 'center',
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ForgotPasswordScreen;
