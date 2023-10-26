import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import axios from 'axios';
import { useUserContext } from '../Context/UserContext';

const LoginScreen = ({ navigation }) => {
    const { user, setUser, logout } = useUserContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
      try {
          const userData = {
              email: "kenny@hunt.com",
              password: "test"
          }
        const response = await fetch('http://192.168.0.3:3000/api/users/login', {
          method: "POST",
          cors: "no-cors",
          cache: "no-cache", 
          credentials: "same-origin", 
          headers: {
          "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
  
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          const userDataResponse = await axios.get(`http://192.168.0.3:3000/api/users/${data.user.id}`);
          if (userDataResponse.data) {
            setEmail('');
            setPassword('');
            setUser(data.user); // Set the user data using the context
            navigation.navigate('Dashboard');
          }
        } else {
          console.log('Login failed:', data.error);
        }
      } catch (error) {
        console.log('Error:', error);
      }
    };

    const handleForgotPassword = () => {
      navigation.navigate('ForgotPasswordScreen');
    }

  return (
    <ImageBackground
      style={[styles.container, { backgroundColor: '#e57373' }]}
      resizeMode="cover"
    >
      <View style={styles.loginBox}>
        <Text style={styles.loginHeader}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="gray"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="gray"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.forgotPasswordButton} onPress={handleForgotPassword}>
          <Text style={styles.buttonText}>Forgot Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signupButton}>
          <Text style={styles.buttonText}>New User? Sign Up!</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  loginHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  loginButton: {
    backgroundColor: '#f08080',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#f08080',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  signupButton: {
    alignSelf: 'center',
  },
});

export default LoginScreen;
