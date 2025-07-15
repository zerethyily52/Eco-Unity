import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { CampaignProvider } from './contexts/CampaignContext';
import FirstPage from './screens/FirstPage';
import Home from './screens/Home';
import Challenge from './screens/Challenge';
import Campaign from './screens/Campaign';
import CampaignDetail from './screens/CampaignDetail';
import EnvironmentalDashboard from './screens/EnvironmentalDashboard';

const Stack = createStackNavigator();

export default function App() {
  return (
    <CampaignProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="FirstPage" 
          screenOptions={{ 
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forNoAnimation 
          }}>
          <Stack.Screen name="FirstPage" component={FirstPage} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Challenge" component={Challenge} />
          <Stack.Screen name="Campaign" component={Campaign} />
          <Stack.Screen name="CampaignDetail" component={CampaignDetail} />
          <Stack.Screen name="EnvironmentalDashboard" component={EnvironmentalDashboard} />
        </Stack.Navigator>
      </NavigationContainer>
    </CampaignProvider>

  );
}
