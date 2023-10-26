import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useUserContext } from '../Context/UserContext';

import DashboardScreen from '../Screens/Dashboard';
import SettingsScreen from '../Screens/SettingsScreen';
import SignUpScreen from '../Screens/SignUp';
import UserScreen from '../Screens/UserScreen';
import LoginScreen from '../Screens/LoginScreen';
import UserQuestionnaireScreen from '../Screens/SignUpScreens/UserQuestionnaireScreen';
import AddTeamMembersScreen from '../Screens/SignUpScreens/AddTeamMembersScreen';
import CustomerScreen from '../Screens/CustomerScreen';
import AddCaseScreen from '../Screens/AddCaseScreen';
import AddCustomerScreen from '../Screens/AddCustomersScreen';
import AssignTeamMemberScreen from '../Screens/AssignTeamMemberScreen';
import UpdateCaseScreen from '../Screens/UpdateCaseScreen';
import ForgotPasswordScreen from '../Screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../Screens/ResetPasswordScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
  const { user } = useUserContext();

  return (
      <Tab.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        <Tab.Screen name="Customers" component={CustomerScreen} />
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        {user ? <Tab.Screen name="User" component={UserScreen} /> : null}
        <Tab.Screen name="Settings" component={SettingsScreen} />
        {user ? null : (
        <>
          <Tab.Screen name="Sign Up" component={SignUpScreen} />
          <Tab.Screen name="Login" component={LoginScreen} />
        </>
      )}
      </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TabNavigator"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserQuestionnaire"
        component={UserQuestionnaireScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddTeamMembersScreen"
        component={AddTeamMembersScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddCaseScreen"
        component={AddCaseScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddCustomerScreen"
        component={AddCustomerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AssignTeamMember"
        component={AssignTeamMemberScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UpdateCase"
        component={UpdateCaseScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: 'blue',
    borderWidth: 2,
  },
});

export default AppNavigator;
