import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, Picker, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import FormSection from './FormSection';
import { useUserContext } from '../../Context/UserContext';

const AddTeamMembersScreen = ({ navigation }) => {
  const { user } = useUserContext();
  console.log(user)

  const [teamMembers, setTeamMembers] = useState([
    { first_name: '', 
    last_name: '', 
    phone_number: '', 
    email: '', 
    password: 'new-user',
    company_name: user.company_name,
    company_id: user.company_id,
    reason_for_signup: 'Team Member', 
    user_role: '' },
  ]);

  const handleAddMember = () => {
    setTeamMembers([...teamMembers, { 
      first_name: '', 
      last_name: '', 
      phone_number: '', 
      email: '',
      password: 'new-user',
      company_name: user.company_name,
      company_id: user.company_id,
      reason_for_signup: 'Team Member', 
      user_role: '' }]);
  };

  const handleSubmit = async () => {
    try {
        const response = await fetch('http://192.168.0.3:3000/api/users/post-team-members', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ teamMembers }), // Send the teamMembers array as JSON
        });
    
        if (response.status === 201) {
          console.log('Team members data submitted successfully');
          // Redirect to the desired screen (e.g., UserScreen)
          navigation.navigate('User');
        } else {
          console.error('Error submitting team members data');
        }
      } catch (error) {
        console.error('Error submitting team members data:', error.message);
      }
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.titleWrapper}>
            <Text style={styles.title}>Add Team Members</Text>
        </View>
        <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        >
            {teamMembers.map((member, index) => (
                <FormSection key={index} title={`Team Member:`}>
                <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    value={member.first_name}
                    onChangeText={(text) => {
                    const updatedMembers = [...teamMembers];
                    updatedMembers[index].first_name = text;
                    setTeamMembers(updatedMembers);
                    }}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    value={member.last_name}
                    onChangeText={(text) => {
                    const updatedMembers = [...teamMembers];
                    updatedMembers[index].last_name = text;
                    setTeamMembers(updatedMembers);
                    }}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    value={member.phone_number}
                    onChangeText={(text) => {
                    const updatedMembers = [...teamMembers];
                    updatedMembers[index].phone_number = text;
                    setTeamMembers(updatedMembers);
                    }}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={member.email}
                    onChangeText={(text) => {
                    const updatedMembers = [...teamMembers];
                    updatedMembers[index].email = text;
                    setTeamMembers(updatedMembers);
                    }}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Role"
                    value={member.user_role}
                    onChangeText={(text) => {
                    const updatedMembers = [...teamMembers];
                    updatedMembers[index].user_role = text;
                    setTeamMembers(updatedMembers);
                    }}
                />
                </FormSection>
            ))}
            <Pressable
            onPress={handleAddMember}
            style={styles.buttonPrimary}
            >
            <Text style={styles.buttonText}>Add Another Team Member</Text>
            </Pressable>

            <Pressable
            onPress={handleSubmit}
            style={styles.buttonSecondary}
            >
            <Text style={styles.buttonText}>Complete Registration</Text>
            </Pressable>

            <Pressable
            onPress={() => navigation.navigate('User')}
            style={styles.buttonSkip}
            >
            <Text style={styles.buttonText}>Skip For Now</Text>
            </Pressable>
        </ScrollView>
    </SafeAreaView>
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
      titleWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        padding: 0
      },
      title: {
        fontSize: 25,
      },
      scrollView: {
        marginTop: 5,
        marginBottom: 25,
        width: '90%',
        height: '60%',
      },
      scrollViewContent: {
        alignItems: 'center',
        justifyContent: 'center',
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
        width: '90%',
        padding: 10,
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
      buttonPrimary: {
        backgroundColor: 'white',
        width: "84%",
        padding: 15,
        borderRadius: 20,
        alignItems: 'center',
        marginBottom: 20,
      },
      buttonSecondary: {
        backgroundColor: '#333',
        width: "84%",
        padding: 15,
        borderRadius: 20,
        alignItems: 'center',
        marginBottom: 20,
      },
      buttonSkip: {
        backgroundColor: '#fff',
        width: "84%",
        padding: 15,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#f08080',
        alignItems: 'center',
        marginBottom: 20,
      },
      buttonText: {
        color: '#5A5A5A',
        fontSize: 18,
        fontWeight: 'bold',
      },
});

export default AddTeamMembersScreen;
