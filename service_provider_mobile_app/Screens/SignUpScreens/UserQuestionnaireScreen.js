import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useUserContext } from '../../Context/UserContext';

const CustomCheckbox = ({ label, isChecked, onPress, service }) => {
  return (
    <TouchableOpacity style={styles.checkboxContainer} onPress={() => onPress(service)}>
      <View style={[styles.checkbox, isChecked && styles.checkedBox]}>
        {isChecked && <Text style={styles.checkMark}>✓</Text>}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const UserQuestionnaireScreen = ({ navigation }) => {
  const [userRole, setUserRole] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const selectedServicesJSON = JSON.stringify(selectedServices);
  const { user } = useUserContext();

  const handleCheckboxPress = (service) => {
    setSelectedServices((prevServices) =>
      prevServices.includes(service)
        ? prevServices.filter((s) => s.service_id !== service.service_id)
        : [...prevServices, service]
    );
  };

  const handleSubmit = async () => {

    const questionnaireData = {
      user_id: user.id,
      company_id: user.company_id,
      user_role: userRole,
      selected_services: selectedServices,
    };
  
    try {
      const response = await fetch('http://192.168.0.3:3000/api/users/post-add-services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionnaireData),
      });
  
      if (response.status === 201) {
        console.log('User role and services data submitted successfully');
        // Redirect to AddTeamMembersScreen or UserScreen
        navigation.navigate('AddTeamMembersScreen');
      } else {
        console.error('Error submitting user role and services data');
      }
    } catch (error) {
      console.error('Error submitting user role and services data:', error.message);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.label}>User Role:</Text>
      <Picker selectedValue={userRole} onValueChange={(value) => setUserRole(value)} style={styles.input}>
        <Picker.Item label="Owner" value="Owner" />
        <Picker.Item label="Primary Operator" value="Primary Operator" />
        <Picker.Item label="Owner/Operator" value="Owner/Operator" />
        <Picker.Item label="Employee" value="Employee" />
      </Picker>

      <Text style={styles.label}>Services Adding To Account:</Text>
      <View>
      <CustomCheckbox
          label="Service Provider"
          service_price={100.00}
          service={{ service_name: 'Service Provider', service_price: 100.00, service_id: '4bdef88f-56a0-4331-8d35-f592cbceb3c6' }}
          isChecked={selectedServices.some((service) => service.service_id === '4bdef88f-56a0-4331-8d35-f592cbceb3c6')}
          onPress={handleCheckboxPress}
        />

        <CustomCheckbox
          label="Automated Marketing"
          service_price={300.00}
          service={{ service_name: 'Automated Marketing', service_price: 300.00, service_id: '7aaf99f9-a43b-4665-afec-fb3ca3928619' }}
          isChecked={selectedServices.some((service) => service.service_id === '7aaf99f9-a43b-4665-afec-fb3ca3928619')}
          onPress={handleCheckboxPress}
        />

        <CustomCheckbox
          label="Customer Interface"
          service_price={500.00}
          service={{ service_name: 'Customer Interface', service_price: 500.00, service_id: 'be8cb65f-152c-4491-950c-5aea49ab948f' }}
          isChecked={selectedServices.some((service) => service.service_id === 'be8cb65f-152c-4491-950c-5aea49ab948f')}
          onPress={handleCheckboxPress}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f08080',
    padding: 16,
  },
  title: {
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 20,
  },
  label: {
    fontSize: 30,
    color: 'white',
    marginBottom: 8,
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 20,
    backgroundColor: '#ffffff',
    color: '#333333',
  },
  label: {
    fontSize: 16,
    color: '#333', // Customize the label text color
    marginLeft: 8, // Add some space between the checkbox and the label
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: 'black',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  checkedBox: {
    backgroundColor: 'black',
  },
  checkMark: {
    color: 'white',
  },
  button: {
    backgroundColor: '#f08080',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },
  checkBox: {
    width: '100%',
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 20,
    backgroundColor: '#ffffff',
    color: '#333333',

  }
});

export default UserQuestionnaireScreen;
