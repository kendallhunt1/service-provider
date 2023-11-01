import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
// import { registerRootComponent } from 'expo';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, {
  rootTag: document.getElementById('root'), // Replace 'root' with the ID of the div where you want to render your app
});
// registerRootComponent(App);
