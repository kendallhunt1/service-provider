import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const CustomHeader = ({ title, openDrawer }) => {

  return (
    <SafeAreaView style={styles.headerContainer}>
      <TouchableOpacity style={styles.menuButton} onPress={openDrawer}>
        <Text style={styles.menuButtonText}>☰</Text>
      </TouchableOpacity>
      <View style={styles.logoContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: 'lightgray',
    marginTop: 40,
    height: 70,
    justifyContent: 'center',
  },
  menuButton: {
    width: '40%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  menuButtonText: {
    paddingLeft: 18,
    fontSize: 48,
  },
  logoContainer: {
    width: '60%',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default CustomHeader;
