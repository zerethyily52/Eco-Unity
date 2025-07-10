import React, { createContext, useContext, useState, ReactNode } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import FirstPage from './screens/FirstPage';
import Home from './screens/Home';
import Challenge from './screens/Challenge';
import Campaign from './screens/Campaign';
import CampaignDetail from './screens/CampaignDetail';
import EnvironmentalDashboard from './screens/EnvironmentalDashboard';

const Stack = createStackNavigator();

// Глобальный контекст для кампаний
interface CampaignContextType {
  joinedCampaigns: string[];
  joinCampaign: (campaignTitle: string) => void;
  leaveCampaign: (campaignTitle: string) => void;
  isJoined: (campaignTitle: string) => boolean;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const useCampaignContext = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaignContext must be used within a CampaignProvider');
  }
  return context;
};

interface CampaignProviderProps {
  children: ReactNode;
}

const CampaignProvider: React.FC<CampaignProviderProps> = ({ children }) => {
  const [joinedCampaigns, setJoinedCampaigns] = useState<string[]>([]);

  const joinCampaign = (campaignTitle: string) => {
    setJoinedCampaigns(prev => {
      if (!prev.includes(campaignTitle)) {
        return [...prev, campaignTitle];
      }
      return prev;
    });
  };

  const leaveCampaign = (campaignTitle: string) => {
    setJoinedCampaigns(prev => prev.filter(title => title !== campaignTitle));
  };

  const isJoined = (campaignTitle: string) => {
    return joinedCampaigns.includes(campaignTitle);
  };

  return (
    <CampaignContext.Provider value={{ joinedCampaigns, joinCampaign, leaveCampaign, isJoined }}>
      {children}
    </CampaignContext.Provider>
  );
};

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