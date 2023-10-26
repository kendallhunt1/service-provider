import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const UpdateCaseScreen = ({ route }) => {
  const { caseId } = route.params;
  const [caseData, setCaseData] = useState({});
  const [editedData, setEditedData] = useState({
    customer_name: '',
    case_type: '',
    status: '',
    priority: '',
    customer_email_address: '',
    customer_phone_number: '',
    case_details: '',
    team_notes: '',
  });

  useEffect(() => {
    const fetchCaseData = async () => {
      try {
        const response = await fetch(`http://192.168.0.3:3000/api/users/get-case/${caseId}`);
        if (!response.ok) {
          throw new Error(`Error fetching case data: ${response.statusText}`);
        }
        const caseInfo = await response.json();
        setCaseData(caseInfo);
        // Initialize the edited data state with the fetched data
        setEditedData(caseInfo);
      } catch (error) {
        console.error('Error fetching case data:', error.message);
      }
    };
  
    fetchCaseData();
  }, [caseId]);

  // Define a function to update the edited data
  const handleInputChange = (field, value) => {
    setEditedData({ ...editedData, [field]: value });
  };

  const updateCaseData = async () => {
    try {
      const response = await fetch(`http://192.168.0.3:3000/api/users/update-case/${caseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedData),
      });
  
      if (response.ok) {
        // Case data updated successfully
        // You can also navigate back to the previous screen or show a success message to the user
        console.log('Case data updated successfully');
      } else {
        // Handle errors, e.g., show an error message to the user
        console.error('Error updating case data:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating case data:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Case ID: {caseData.case_id}</Text>
      <Text>Customer Name:</Text>
      <TextInput
        style={styles.input}
        value={editedData.customer_name}
        onChangeText={(text) => handleInputChange('customer_name', text)}
      />
      <Text>Case Type:</Text>
      <TextInput
        style={styles.input}
        value={editedData.case_type}
        onChangeText={(text) => handleInputChange('case_type', text)}
      />
      <Text>Status:</Text>
      <TextInput
        style={styles.input}
        value={editedData.status}
        onChangeText={(text) => handleInputChange('status', text)}
      />
      <Text>Priority:</Text>
      <TextInput
        style={styles.input}
        value={editedData.priority}
        onChangeText={(text) => handleInputChange('priority', text)}
      />
      <Text>Email Address:</Text>
      <TextInput
        style={styles.input}
        value={editedData.customer_email_address}
        onChangeText={(text) => handleInputChange('customer_email_address', text)}
      />
      <Text>Phone Number:</Text>
      <TextInput
        style={styles.input}
        value={editedData.customer_phone_number}
        onChangeText={(text) => handleInputChange('customer_phone_number', text)}
      />
      <Text>Case Details:</Text>
      <TextInput
        style={styles.input}
        value={editedData.case_details}
        onChangeText={(text) => handleInputChange('case_details', text)}
      />
      <Text>Team Notes:</Text>
      <TextInput
        style={styles.input}
        value={editedData.team_notes}
        onChangeText={(text) => handleInputChange('team_notes', text)}
      />

      <Button title="Update Case" onPress={updateCaseData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
  },
});

export default UpdateCaseScreen;
