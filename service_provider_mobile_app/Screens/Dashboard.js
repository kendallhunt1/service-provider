import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity, Button } from 'react-native';
import CaseListComponent from '../Components/DashboardComponents/CaseListComponent';
import { Ionicons } from '@expo/vector-icons';
import { useUserContext } from '../Context/UserContext';


const DashboardScreen = ({ navigation }) => {
  const [expandedCaseId, setExpandedCaseId] = useState(null);
  const [cases, setCases] = useState([]);
  const { user } = useUserContext();

  const handleCasePress = (selectedCase) => {
    if (expandedCaseId === selectedCase.case_id) {
      setExpandedCaseId(null); // Collapse if expanded
    } else {
      setExpandedCaseId(selectedCase.case_id); // Expand
    }
  };

  const navigateToAddCase = () => {
    navigation.navigate('AddCaseScreen');
  };

  useEffect(() => {
    if (user && user.company_id) { // Check if user is not null and has company_id
      fetch(`http://192.168.0.3:3000/api/users/get-cases?company_id=${user.company_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setCases(data);
        })
        .catch((error) => {
          console.error('Error fetching customer data:', error.message);
        });
    }
  }, [user]);

  return (
    <SafeAreaView style={styles.dashboardScreen}>
      <TouchableOpacity onPress={navigateToAddCase} style={styles.addButton}>
        <Ionicons name="add-circle" size={30} color="black" />
      </TouchableOpacity>

      <CaseListComponent
        cases={cases}
        onCasePress={handleCasePress}
        expandedCaseId={expandedCaseId}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

  DashboardScreen.navigationOptions = {
    headerRight: () => (
      <Button title="Add Case" onPress={navigateToAddCase} />
    ),
  };

  const styles = StyleSheet.create({
    dashboardScreen: {
      flex: 1,
    }
  })
  
  export default DashboardScreen;