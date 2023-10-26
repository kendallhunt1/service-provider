import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Button,
  StyleSheet,
} from 'react-native';
import { useUserContext } from '../Context/UserContext';


const AssignTeamMemberScreen = ({ navigation, route }) => {
  const [teamMembers, setTeamMembers] = useState([]); // Fetch and store team members here
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const { caseId } = route.params;
  const { user } = useUserContext();

  useEffect(() => {
    if (user.company_id) {
      fetch(`http://192.168.0.3:3000/api/users/get-team-members?company_id=${user.company_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
          setTeamMembers(data);
        })
        .catch((error) => {
          console.error('Error fetching team members data:', error.message);
        });
    }
  }, [user.company_id]);
  

  const handleMemberSelection = (member) => {
    const isSelected = selectedMembers.some((selected) => selected.id === member.id);

    if (isSelected) {
      setSelectedMembers(selectedMembers.filter((selected) => selected.id !== member.id));
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const handleAssignTeamMember = async () => {
    const data = {
        caseId,
        selectedTeamMembers: selectedMembers.map((member) => member.id),
      };
    
      try {
        const response = await fetch('http://192.168.0.3:3000/api/users/assign-team-member', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
    
        if (response.ok) {
          // Optionally, you can navigate back to the previous screen here
          navigation.goBack();
        } else {
          // Handle errors, e.g., show an error message to the user
          console.error('Error assigning team member:', response.statusText);
        }
      } catch (error) {
        console.error('Error assigning team member:', error.message);
      }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Team Members"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={teamMembers.filter((member) =>
            member.first_name && member.first_name.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
            <TouchableOpacity
            style={styles.memberItem}
            onPress={() => handleMemberSelection(item)}
            >
            <Text>{item.first_name} {item.last_name}</Text>
            {selectedMembers.some((selected) => selected.id === item.id) && (
                <Text>Selected</Text>
            )}
            </TouchableOpacity>
        )}
        />
        <TouchableOpacity
            style={[styles.button]}
            onPress={() => handleAssignTeamMember(route.params.caseId)}
            >
            <Text style={styles.buttonText}>Assign Team Member</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 8,
  },
});

export default AssignTeamMemberScreen;
