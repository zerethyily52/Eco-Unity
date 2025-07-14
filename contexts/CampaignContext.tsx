import React, { createContext, useContext, useState, ReactNode } from 'react';

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

export const CampaignProvider: React.FC<CampaignProviderProps> = ({ children }) => {
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