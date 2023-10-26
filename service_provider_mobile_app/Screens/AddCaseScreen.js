import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button, Picker } from 'react-native';
import { useUserContext } from '../Context/UserContext';

const caseTypes = [
  'Application Bug',
  'General Customer Service',
  'Adding Service(s)',
  'Billing Inquiry',
  'Product Support',
];

const priorities = ['Low', 'Mild', 'High', 'Urgent'];

const AddCaseScreen = ({ navigation }) => {
  const { user } = useUserContext();

  const getCurrentDateTime = () => {
    const currentDate = new Date();
    const date = currentDate.toLocaleDateString();
    const time = currentDate.toLocaleTimeString();
    return { date, time };
  };

  const [caseData, setCaseData] = useState({
    case_type: caseTypes[0],
    status: 'Open',
    priority: priorities[0],
    customer_name: '',
    customer_email_address: '',
    customer_phone_number: '',
    case_details: '',
    ...getCurrentDateTime(), 
    user_id: user.id,
    company_id: user.company_id,
  });

  const handleAddCase = async () => {
    try {
      const response = await fetch('http://192.168.0.3:3000/api/users/post-add-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(caseData),
      });

      if (response.status === 201) {
        console.log('Case added successfully');
        navigation.goBack(); // Go back to the DashboardScreen
      } else {
        console.error('Error adding case');
      }
    } catch (error) {
      console.error('Error adding case:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
      <Text style={styles.label}>Case Type</Text>
        <Picker
          style={styles.picker}
          selectedValue={caseData.case_type}
          onValueChange={(itemValue) => setCaseData({ ...caseData, case_type: itemValue })}
        >
          {caseTypes.map((type) => (
            <Picker.Item label={type} value={type} key={type} />
          ))}
        </Picker>
        <Text style={styles.label}>Priority</Text>
        <Picker
          style={styles.picker}
          selectedValue={caseData.priority}
          onValueChange={(itemValue) => setCaseData({ ...caseData, priority: itemValue })}
        >
          {priorities.map((priority) => (
            <Picker.Item label={priority} value={priority} key={priority} />
          ))}
        </Picker>
        <TextInput
          style={styles.input}
          placeholder="Customer Name"
          value={caseData.customer_name}
          onChangeText={(text) => setCaseData({ ...caseData, customer_name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Customer Email Address"
          value={caseData.customer_email_address}
          onChangeText={(text) => setCaseData({ ...caseData, customer_email_address: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Customer Phone Number"
          value={caseData.customer_phone_number}
          onChangeText={(text) => setCaseData({ ...caseData, customer_phone_number: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Case Details"
          value={caseData.case_details}
          onChangeText={(text) => setCaseData({ ...caseData, case_details: text })}
          multiline // Allow multiple lines
          numberOfLines={6} // Set the number of lines to show initially
        />
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddCase}>
        <Text style={styles.addButtonLabel}>Add Case</Text>
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
  inputContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  picker: {
    width: '100%',
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    color: '#333333',
    padding: 5
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
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
  addButtonLabel: {
    color: '#f08080',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddCaseScreen;
