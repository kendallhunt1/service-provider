import React, {useState} from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useUserContext } from '../Context/UserContext';

const AddCustomerScreen = ({ navigation }) => {
    const { user } = useUserContext();
    console.log(user)
    const [customerData, setCustomerData] = useState({
        customerName: '',
        email: '',
        phoneNumber: '',
        streetAddress: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        industry: '',
        notes: '',
        company_id: user.company_id
      });

  const handleAddCustomer = async () => {
    try {
        const response = await fetch('http://192.168.0.3:3000/api/users/post-add-customer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(customerData),
        });
  
        if (response.status === 201) {
          console.log('Customer added successfully');
          navigation.goBack(); // Go back to the CustomerScreen
        } else {
          console.error('Error adding customer');
        }
      } catch (error) {
        console.error('Error adding customer:', error.message);
      }
  };

  return (
    <View style={styles.container}>
      {/* Form inputs */}
      <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Customer Name"
        value={customerData.customerName}
        onChangeText={(text) => setCustomerData({ ...customerData, customerName: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Email"
        value={customerData.email}
        onChangeText={(text) => setCustomerData({ ...customerData, email: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Phone Number"
        value={customerData.phoneNumber}
        onChangeText={(text) => setCustomerData({ ...customerData, phoneNumber: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Street Address"
        value={customerData.streetAddress}
        onChangeText={(text) => setCustomerData({ ...customerData, streetAddress: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={customerData.city}
        onChangeText={(text) => setCustomerData({ ...customerData, city: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="State"
        value={customerData.state}
        onChangeText={(text) => setCustomerData({ ...customerData, state: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Postal Code"
        value={customerData.postalCode}
        onChangeText={(text) => setCustomerData({ ...customerData, postalCode: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Country"
        value={customerData.country}
        onChangeText={(text) => setCustomerData({ ...customerData, country: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Industry"
        value={customerData.industry}
        onChangeText={(text) => setCustomerData({ ...customerData, industry: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Notes"
        value={customerData.notes}
        onChangeText={(text) => setCustomerData({ ...customerData, notes: text })}
      />
      </View>
      
      {/* Add Customer button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddCustomer}>
        <Text style={styles.addButtonLabel}>Add Customer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f08080',
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 25,
      color: 'white',
      marginBottom: 20,
    },
    inputContainer: {
      width: '90%',
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 20,
      marginBottom: 20,
    },
    input: {
      width: '100%',
      padding: 10,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: '#d3d3d3',
      borderRadius: 20,
      backgroundColor: '#ffffff',
      color: '#333333',
    },
    addButton: {
      backgroundColor: 'white',
      width: '90%',
      padding: 15,
      borderRadius: 20,
      alignItems: 'center',
      marginBottom: 20,
    },
    buttonText: {
      color: '#5A5A5A',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

export default AddCustomerScreen;
