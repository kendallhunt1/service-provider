import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Button, TextInput, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import placeholderImg from '../Components/randomlogo.png';
import { useUserContext } from '../Context/UserContext';
import { useNavigation } from '@react-navigation/native';

const TopTab = createMaterialTopTabNavigator();

const UserInformationTab = () => {
  const { user, logout } = useUserContext();
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    email: user.email,
    phone_number: user.phone_number,
    company_name: user.company_name,
    user_role: user.user_role
  });

  const [editedUserInfo, setEditedUserInfo] = useState({ ...user });

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch('http://192.168.0.3:3000/api/users/update-user-information', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUserInfo),
      });
  
      if (response.ok) {
        console.log('User information updated successfully');
      } else {
        console.error('Error updating user information:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating user information:', error.message);
    }
    setEditing(false);
  };

  const handleCancelClick = () => {
    setFormData({
      email: user.email,
      phone_number: user.phone_number,
      company_name: user.company_name,
      user_role: user.user_role
    });
    setEditing(false);
  };

  return (
    <View style={userInformationStyles.container}>
      {editing ? (
        <>
         {/* Insert Company That they work for */}
         {/* Insert their role within the company */}
          <TextInput
            style={userInformationStyles.input}
            placeholder="Email"
            value={editedUserInfo.email}
            onChangeText={(text) =>
              setEditedUserInfo({ ...editedUserInfo, email: text })
            }
          />
          <TextInput
            style={userInformationStyles.input}
            placeholder="Phone Number"
            value={editedUserInfo.phone_number}
            onChangeText={(text) =>
              setEditedUserInfo({ ...editedUserInfo, phone_number: text })
            }
          />
          <TouchableOpacity
            style={userInformationStyles.cancel}
            onPress={handleCancelClick}
          >
            <Text style={userInformationStyles.buttonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={userInformationStyles.save}
            backgroundColor="blue"
            onPress={handleSaveClick}
          >
            <Text style={userInformationStyles.buttonText}>Save</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={userInformationStyles.label}>Email:</Text>
          <Text style={userInformationStyles.text}>{editedUserInfo.email}</Text>
          <Text style={userInformationStyles.label}>Phone Number:</Text>
          <Text style={userInformationStyles.text}>{editedUserInfo.phone_number}</Text>
          <Text style={userInformationStyles.label}>Company:</Text>
          <Text style={userInformationStyles.text}>{formData.company_name}</Text>
          <Text style={userInformationStyles.label}>Role:</Text>
          <Text style={userInformationStyles.text}>{formData.user_role}</Text>

          <TouchableOpacity
            style={userInformationStyles.editButton}
            onPress={handleEditClick}
          >
            <Text style={userInformationStyles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  )
};

const TeamTab = () => {
  const { user } = useUserContext();
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    fetch(`http://192.168.0.3:3000/api/users/get-team-members?company_id=${user.company_id}`)
      .then((response) => response.json())
      .then((data) => {
        setTeamMembers(data);
      })
      .catch((error) => {
        console.error('Error fetching team members:', error.message);
      });
  }, []);

  return (
    <View style={teamTab.tabContentContainer}>
      <Text style={teamTab.title}>Team Members</Text>
      {teamMembers.map((member) => (
        <View style={teamTab.teamMember} key={member.id}>
          <Text style={teamTab.teamMemberName}>{member.first_name} {member.last_name}</Text>
          <Text style={teamTab.teamMemberName}>Position: <Text style={teamTab.value}>{member.user_role}</Text></Text>
          <Text style={teamTab.value}>{member.email}</Text>
          <Text style={teamTab.value}>{member.phone_number}</Text>
        </View>
      ))}
    </View>
  );
};

const ServicesTab = () => {
  const { user } = useUserContext();
  const [services, setServices] = useState([]);

  const fetchServices = async () => {
    try {
      const response = await fetch(`http://192.168.0.3:3000/api/users/get-company-services?company_id=${user.company_id}`);
      if (!response.ok) {
        throw new Error(`Error fetching services: ${response.statusText}`);
      }
      const data = await response.text();
      console.log(data);
      // Clean up the string to make it a valid JSON array
      const cleanedData = data.replace(/\\\\"/g, '"'); // Remove extra backslashes
      const parsedServices = JSON.parse(cleanedData);

      setServices(parsedServices);
    } catch (error) {
      console.error('Error fetching services:', error.message);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    console.log(services); // Log whenever services changes
  }, [services]);

  return (
    <View style={servicesTab.tabContentContainer}>
      <Text style={servicesTab.title}>Services</Text>
      {services.map((service, index) => (
        <View style={servicesTab.service} key={index}>
          <Text style={servicesTab.serviceName}>Service Name: {service.service_name}</Text>
          <Text style={servicesTab.servicePrice}>Service Price: {service.service_price}</Text>
        </View>
      ))}
    </View>
  );
  
};

const UserScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useUserContext();

  
  const handleLogout = async () => {
    navigation.navigate('Login');
    logout();
  };

  if (!user) {
    navigation.navigate('Login');
  }

  return (
    <View style={styles.container}>
      <Pressable style={({ pressed }) => [
          styles.logoutButton,
          { backgroundColor: pressed ? '#f08080' : '#e57373' },
        ]} 
        onPress={handleLogout}
      >
        <Text>Logout</Text>
      </Pressable>
      <View style={styles.profileContainer}>
        <Image source={placeholderImg} style={styles.profileImage} />
        <Text style={styles.userName}>{user.first_name} {user.last_name}</Text>
        <Text style={styles.companyName}>{user.company_name}</Text>
      </View>
      <View style={styles.tabsContainer}>
        <TopTab.Navigator
            screenOptions={{
                tabBarScrollEnabled: true,
                tabBarLabelStyle: {
                fontSize: 14,
                fontWeight: 'bold',
                textTransform: 'none',
                },
                tabBarItemStyle: {
                width: 150,
                },
              }}
        >
          <TopTab.Screen name="User Information" component={UserInformationTab} />
          <TopTab.Screen name="Team" component={TeamTab} />
          <TopTab.Screen name="onTrack Services" component={ServicesTab} />
        </TopTab.Navigator>
      </View>
    </View>
  );
};

const userInformationStyles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#555',
  },
  value: {
    fontSize: 16,
    marginBottom: 16,
    color: '#333',
  },
  input: {
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    color: '#333',
  },
  cancel: {
    backgroundColor: '#e57373',
    borderRadius: 8,
    marginBottom: 16,
    padding: 8,
  },
  save: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    marginBottom: 16,
    padding: 8,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold', // Set to 'bold' to make labels bold
    marginBottom: 8,
    color: '#555',
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: '#007AFF',
    color: '#333',
    borderRadius: 8,
    padding: 8,
  },
  editButtonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const teamTab = StyleSheet.create({
  tabContentContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  teamMember: {
    marginBottom: 16,
    borderRadius: 8, // Add border radius
    borderColor: 'grey', // Add border color
    borderWidth: 1, // Add border width
    paddingLeft: 8,
    paddingTop: 4,
    paddingBottom: 4
  },
  teamMemberName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
})

const servicesTab = StyleSheet.create({
  tabContentContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  service: {
    marginBottom: 16,
    borderRadius: 8,
    borderColor: 'grey',
    borderWidth: 1,
    paddingLeft: 8,
    paddingTop: 4,
    paddingBottom: 4,
  },
  serviceName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  servicePrice: {
    fontSize: 16,
    color: '#333',
  },
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  logoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e57373',
    borderRadius: 5,
    alignSelf: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  companyName: {
    fontSize: 14,
    color: 'gray',
  },
  tabsContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: 'lightgray',
  },
  tabContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'none'
  },
  tab: {
    width: 150, // Adjust the width of each tab
  },
});

export default UserScreen;
