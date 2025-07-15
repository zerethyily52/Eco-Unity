import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import StorageService from '../services/StorageService';

// Глобальный контекст для кампаний
interface CampaignContextType {
  joinedCampaigns: string[];
  joinCampaign: (campaignTitle: string, campaignId?: string) => void;
  leaveCampaign: (campaignTitle: string, campaignId?: string) => void;
  isJoined: (campaignTitle: string) => boolean;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка данных при инициализации
  useEffect(() => {
    loadJoinedCampaigns();
  }, []);

  const loadJoinedCampaigns = async () => {
    try {
      setIsLoading(true);
      const savedCampaigns = await StorageService.getJoinedCampaigns();
      setJoinedCampaigns(savedCampaigns);
    } catch (error) {
      console.error('Error loading joined campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const joinCampaign = async (campaignTitle: string, campaignId?: string) => {
    const updatedCampaigns = joinedCampaigns.includes(campaignTitle) 
      ? joinedCampaigns 
      : [...joinedCampaigns, campaignTitle];
    
    setJoinedCampaigns(updatedCampaigns);
    
    try {
      await StorageService.saveJoinedCampaigns(updatedCampaigns);
      
      // Сохраняем статистику присоединения к кампании
      if (campaignId) {
        await StorageService.updateCampaignStat(campaignId, {
          dateJoined: new Date().toISOString(),
          userContribution: {},
          isCompleted: false
        });
      }
    } catch (error) {
      console.error('Error saving joined campaign:', error);
      // Откатываем изменения при ошибке
      setJoinedCampaigns(joinedCampaigns);
    }
  };

  const leaveCampaign = async (campaignTitle: string, campaignId?: string) => {
    const updatedCampaigns = joinedCampaigns.filter(title => title !== campaignTitle);
    setJoinedCampaigns(updatedCampaigns);
    
    try {
      await StorageService.saveJoinedCampaigns(updatedCampaigns);
      
      // Удаляем статистику кампании при выходе
      if (campaignId) {
        const currentStats = await StorageService.getCampaignStats();
        delete currentStats[campaignId];
        await StorageService.saveCampaignStats(currentStats);
      }
    } catch (error) {
      console.error('Error saving after leaving campaign:', error);
      // Откатываем изменения при ошибке
      setJoinedCampaigns(joinedCampaigns);
    }
  };

  const isJoined = (campaignTitle: string) => {
    return joinedCampaigns.includes(campaignTitle);
  };



  return (
    <CampaignContext.Provider value={{ 
      joinedCampaigns, 
      joinCampaign, 
      leaveCampaign, 
      isJoined, 
      isLoading 
    }}>
      {children}
    </CampaignContext.Provider>
  );
}; 