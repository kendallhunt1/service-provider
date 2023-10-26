import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Linking, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUserContext } from '../Context/UserContext';

const CustomerScreen = ({ navigation }) => {
  const { user } = useUserContext();
  const [customerList, setCustomerList] = useState([]);
  if (!user) {
    navigation.navigate('Login');
  }
  
  const [expandedCustomers, setExpandedCustomers] = useState([]);

  const toggleCustomerExpansion = (customerId) => {
    setExpandedCustomers((prevExpandedCustomers) =>
      prevExpandedCustomers.includes(customerId)
        ? prevExpandedCustomers.filter((id) => id !== customerId)
        : [...prevExpandedCustomers, customerId]
    );
  };

  useEffect(() => {
    console.log('user:', user);
    if (user) {
      console.log('user.company_id:', user.company_id);
      if (user.company_id) {
        fetch(`http://192.168.0.3:3000/api/users/get-customers?company_id=${user.company_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setCustomerList(data);
          })
          .catch((error) => {
            console.error('Error fetching customer data:', error.message);
          });
      }
    }
  }, [user]);

  const handleAddCustomer = () => {
    navigation.navigate('Add-Customer');
  };

  const renderCustomerItem = ({ item }) => (
    <TouchableOpacity
      style={styles.customerItem}
      onPress={() => toggleCustomerExpansion(item.customer_id)}
    >
      <View style={styles.customerHeader}>
        <Text style={styles.customerName}>{item.customer_name}</Text>
        <TouchableOpacity
            onPress={() => {
              Linking.openURL(`mailto:${item.email}`);
            }}
          >
            <Text style={styles.customerEmail}>
              <Text style={styles.bold}>Email:</Text> {item.email}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(`tel:${item.phone_number}`);
            }}
          >
            <Text style={styles.customerEmail}>
              <Text style={styles.bold}>Phone:</Text> {item.phone_number}
            </Text>
          </TouchableOpacity>
          
      </View>
      {expandedCustomers.includes(item.customer_id) && (
        <View style={styles.expandedDetails}>
          <Text style={styles.customerEmail}><Text style={styles.bold}>Address:</Text> {item.street_address}, {item.city}</Text>
          <Text style={styles.customerEmail}><Text style={styles.bold}>State:</Text> {item.state}</Text>
          <Text style={styles.customerEmail}><Text style={styles.bold}>Country:</Text> {item.country}</Text>
          <Text style={styles.customerEmail}><Text style={styles.bold}>Industry:</Text> {item.industry}</Text>
          <Text style={styles.customerEmail}><Text style={styles.bold}>Notes:</Text> {item.notes}</Text>
          
        </View>
      )}
      <Ionicons
        name={expandedCustomers.includes(item.customer_id) ? 'arrow-up-circle' : 'arrow-down-circle'}
        size={30}
        color="black"
      />
    </TouchableOpacity>
    
  );
  

  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <TouchableOpacity onPress={handleAddCustomer} style={styles.addButton}>
          <Ionicons name="add-circle" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={customerList}
        keyExtractor={(item) => item.customer_id.toString()}
        renderItem={renderCustomerItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f08080',
    padding: 16,
  },
  titleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    color: 'white',
  },
  addButton: {
    backgroundColor: '#f08080',
    borderRadius: 20,
    padding: 5,
  },
  customerItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16, // Increase padding to create more space for customer information
    marginBottom: 10,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
  customerEmail: {
    fontSize: 14,
    color: 'gray'
  }
});

export default CustomerScreen;
