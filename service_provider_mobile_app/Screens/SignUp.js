import React, { useState } from 'react';
import { View, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUserContext } from '../Context/UserContext';
import axios from 'axios';


const SignUpScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [reason, setReason] = useState('business');
  const [errorMessages, setErrorMessages] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { setUser } = useUserContext();

  const validateForm = () => {
    const errors = {};

    if (firstName.trim() === '' || !/^[a-zA-Z]+$/.test(firstName)) {
      errors.firstName = 'First name is required and must contain only letters.';
    }

    if (lastName.trim() === '' || !/^[a-zA-Z]+$/.test(lastName)) {
      errors.lastName = 'Last name is required and must contain only letters.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Invalid email format.';
    }

    if (!/^\d{3}-\d{3}-\d{4}$/.test(phoneNumber)) {
      errors.phoneNumber = 'Phone number must be in the format: xxx-xxx-xxxx';
    }

    if (companyName.trim() === '' || companyName.length > 70) {
      errors.companyName = 'Company name is required and must be no more than 70 characters.';
    }

    if (reason === '') {
      errors.reason = 'Please select a reason for sign up.';
    }

    setErrorMessages(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSignUp = async () => {
    console.log('handleSignUp function called');
    if (!validateForm()) {
      return;
    }
    
    try {
      const userData = {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        phone_number: phoneNumber,
        company_name: companyName,
        reason_for_signup: reason,
      };

      const response = await fetch('http://192.168.0.3:3000/api/users/signup', {
        method: "POST",
        cors: "no-cors",
        cache: "no-cache", 
        credentials: "same-origin", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
      
      const responseData = await response.json(); // Add this line
      await console.log('Response:', response.status); // Debug log
      await console.log('Response Data:', responseData);

     if (response.status === 201) {
      console.log('User signed up successfully');
      setSuccessMessage('User signed up successfully');
        setErrorMessage('');
        // Reset input fields
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhoneNumber('');
        setCompanyName('');
        setPassword('');
        setReason('');

        const handleLogin = async () => {
          try {
              const userData = {
                  email: email,
                  password: password
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
                setUser(data.user); // Set the user data using the context
                navigation.navigate('UserQuestionnaire');
              }
            } else {
              console.log('Login failed:', data.error);
            }
          } catch (error) {
            console.log('Error:', error);
          }
        };
        handleLogin();
    } else {
      setSuccessMessage('');
      setErrorMessage('Error signing up. Please try again.');
      console.error('Else, Error signing up:', response.status);
    }
  } catch (error) {
    setSuccessMessage('');
    setErrorMessage('Error signing up. Please try again.');
    console.error('Catch, Error signing up:', error.message);
  }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.upperContainer}>
        <Text style={styles.title}>Sign Up</Text>
      </View>
      <ScrollView style={styles.lowerContainer}>
        {/* Input fields */}
        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#7E7E7E"
          value={firstName}
          onChangeText={setFirstName}
        />
        {errorMessages.firstName && <Text style={styles.errorText}>{errorMessages.firstName}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#7E7E7E"
          value={lastName}
          onChangeText={setLastName}
        />
        {errorMessages.lastName && <Text style={styles.errorText}>{errorMessages.lastName}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#7E7E7E"
          value={email}
          onChangeText={setEmail}
        />
        {errorMessages.email && <Text style={styles.errorText}>{errorMessages.email}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#7E7E7E"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {errorMessages.password && <Text style={styles.errorText}>{errorMessages.password}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Phone Number (xxx-xxx-xxxx)"
          value={phoneNumber}
          placeholderTextColor="#7E7E7E"
          onChangeText={setPhoneNumber}
        />
        {errorMessages.phoneNumber && <Text style={styles.errorText}>{errorMessages.phoneNumber}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Your Company Name"
          placeholderTextColor="#7E7E7E"
          value={companyName}
          onChangeText={setCompanyName}
        />
        {errorMessages.companyName && <Text style={styles.errorText}>{errorMessages.companyName}</Text>}

        {successMessage ? (
          <Text style={styles.successText}>{successMessage}</Text>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        )}
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f08080',
  },
  upperContainer: {
    flex: 0.1,
    backgroundColor: '#f08080',
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    paddingVertical: 20,
    alignItems: 'center',
  },
  lowerContainer: {
    flex: 0.8,
    backgroundColor: '#ffffff',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 25
  },
  title: {
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 20,
    backgroundColor: '#ffffff',
    color: '#333333',
  },
  // picker: {
  //   width: '100%',
  //   borderWidth: 1,
  //   borderColor: '#d3d3d3',
  //   borderRadius: 20,
  //   backgroundColor: '#ffffff',
  //   color: '#333333',
  // },
  button: {
    width: '100%',
    backgroundColor: '#f08080',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },
  successText: {
    color: '#00ff00', // Green
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  errorText: {
    color: '#ff0000', // Red
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default SignUpScreen;
