import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Linking, Button } from 'react-native';


const CaseListComponent = ({ cases, onCasePress, expandedCaseId, navigation }) => {
  function formatDateAndTime(createdAt) {
    const date = new Date(createdAt);
    const formattedDate = `${date.toLocaleDateString()}`;
    const formattedTime = `${date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true, // Use 12-hour format
    })}`;

    return {
      formattedDate,
      formattedTime,
    };
  }

  const handleAssignTeamMember = () => {
    navigation.navigate('AssignTeamMember', { caseId: expandedCaseId });
  }

  const handleUpdateCase = () => {
    navigation.navigate('UpdateCase', { caseId: expandedCaseId });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Open Cases</Text>
      <FlatList
        data={cases}
        keyExtractor={(item) => item.case_id.toString()}
        renderItem={({ item }) => {
          const formattedDateTime = formatDateAndTime(item.createdAt);

          return (
            <TouchableOpacity
              style={styles.caseItem}
              onPress={() => onCasePress(item)}
            >
              <Text style={styles.caseId}>Case #{item.case_id.split("-")[0]}</Text>
              <Text>Customer Name: {item.customer_name}</Text>
              <Text>Case Type: {item.case_type}</Text>
              <Text>Status: {item.status}</Text>
              <Text>Priority: {item.priority}</Text>
              {expandedCaseId === item.case_id && (
                <View>
                  <Text>Case Open Date: {formattedDateTime.formattedDate}</Text>
                  <Text>Case Open Time: {formattedDateTime.formattedTime}</Text>
                  <Text>Phone Number: {item.customer_phone_number}</Text>
                  <Text>Email Address: {item.customer_email_address}</Text>
                  <Text>Assigned Team Member: {item.assigned_user}</Text>
                  <Text>
                    Case Details: <Text style={styles.caseDetails}>{item.case_details}</Text>
                  </Text>
                  <Text>
                    Team Notes: <Text style={styles.caseDetails}>{item.team_notes}</Text>
                  </Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.button]}
                      onPress={() => handleAssignTeamMember()}
                    >
                      <Text style={styles.buttonText}>
                          {item.assigned_user ? "Assign New Team Member" : "Assign Team Member"}
                      </Text>                    
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button]}
                      onPress={() => handleUpdateCase()}
                    >
                      <Text style={styles.buttonText}>Update Case</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.buttonRow}>
                    <Button
                      title="Email"
                      onPress={() => handleEmail(item.customer_email_address)}
                      style={styles.button}
                      color="#34C759" // Green color
                    />
                    <Button
                      title="Call"
                      onPress={() => handleCall(item.customer_phone_number)}
                      style={styles.button}
                      color="#FF9500" // Orange color
                    />
                    <Button
                      title="Text"
                      onPress={() => handleText(item.customer_phone_number)}
                      style={styles.button}
                      color="#007AFF"
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

function handleEmail(emailAddress) {
  Linking.openURL(`mailto:${emailAddress}`);
}

function handleCall(phoneNumber) {
  Linking.openURL(`tel:${phoneNumber}`);
}

function handleText(phoneNumber) {
  Linking.openURL(`sms:${phoneNumber}`);
}

function handleAddAttachment(item) {
  // Implement attachment functionality here
  // For example, you can open a file picker or access the device's camera
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    flex: 1
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  caseItem: {
    backgroundColor: 'white',
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 15,
    marginBottom: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  caseId: {
    fontWeight: 'bold',
  },
  caseDetails: {
    fontWeight: 'bold'
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 25,
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    marginBottom: 10,
  },
  buttonText: {
    justifyContent: 'center',
    color: '#007AFF',
    padding: 18,
  }
});

export default CaseListComponent;
