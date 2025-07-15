import AsyncStorage from '@react-native-async-storage/async-storage';

// Ключи для хранения данных
export const STORAGE_KEYS = {
  JOINED_CAMPAIGNS: '@joined_campaigns',
  CAMPAIGN_STATS: '@campaign_stats', 
  USER_ACTIVITIES: '@user_activities',
  USER_PROGRESS: '@user_progress',
  CHALLENGES_PROGRESS: '@challenges_progress',
  ENVIRONMENTAL_SETTINGS: '@environmental_settings',
  APP_PREFERENCES: '@app_preferences',
  // Старый ключ для совместимости
  LEGACY_CAMPAIGN_PROGRESS: 'campaignProgress'
};

// Типы данных для сохранения
export interface UserActivity {
  campaignId: string;
  actionType: 'tree_planted' | 'trash_collected' | 'education_session' | 'eco_transport' | 'energy_saved';
  amount: number;
  timestamp: string;
}

export interface UserProgress {
  totalTreesPlanted: number;
  totalTrashCollected: number;
  totalStudentsEducated: number;
  totalEcoMiles: number;
  totalCO2Saved: number;
  achievementsUnlocked: string[];
  joinDate: string;
}

export interface CampaignStats {
  [campaignId: string]: {
    userContribution: {
      treesPlanted?: number;
      trashCollected?: number;
      milesWalked?: number;
      studentsEducated?: number;
      energySaved?: number;
    };
    dateJoined: string;
    lastActivity: string;
    isCompleted: boolean;
  };
}

export interface AppPreferences {
  notificationsEnabled: boolean;
  autoSyncData: boolean;
  preferredUnits: 'metric' | 'imperial';
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'ru';
}

class StorageService {
  
  // Универсальные методы для работы с AsyncStorage
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      throw error;
    }
  }

  async getItem<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue != null) {
        return JSON.parse(jsonValue);
      }
      return defaultValue;
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      return defaultValue;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      throw error;
    }
  }

  async clearAll(): Promise<void> {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
      console.log('All app data cleared');
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }

  // Метод для полной очистки всех данных приложения (включая старые ключи)
  async clearAllAppData(): Promise<void> {
    try {
      // Очищаем все новые ключи
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
      
      // Дополнительно очищаем возможные старые ключи
      const legacyKeys = ['campaignProgress', 'userProgress', 'challenges'];
      await AsyncStorage.multiRemove(legacyKeys);
      
      console.log('All app data cleared completely');
    } catch (error) {
      console.error('Error clearing all app data:', error);
      throw error;
    }
  }

  // Методы для присоединенных кампаний
  async saveJoinedCampaigns(campaigns: string[]): Promise<void> {
    await this.setItem(STORAGE_KEYS.JOINED_CAMPAIGNS, campaigns);
  }

  async getJoinedCampaigns(): Promise<string[]> {
    return this.getItem(STORAGE_KEYS.JOINED_CAMPAIGNS, []);
  }

  // Методы для статистики кампаний
  async saveCampaignStats(stats: CampaignStats): Promise<void> {
    await this.setItem(STORAGE_KEYS.CAMPAIGN_STATS, stats);
  }

  async getCampaignStats(): Promise<CampaignStats> {
    return this.getItem(STORAGE_KEYS.CAMPAIGN_STATS, {});
  }

  async updateCampaignStat(campaignId: string, statUpdate: Partial<CampaignStats[string]>): Promise<void> {
    const currentStats = await this.getCampaignStats();
    const campaignStat = currentStats[campaignId] || {
      userContribution: {},
      dateJoined: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      isCompleted: false
    };

    currentStats[campaignId] = {
      ...campaignStat,
      ...statUpdate,
      lastActivity: new Date().toISOString()
    };

    await this.saveCampaignStats(currentStats);
  }

  // Методы для пользовательских активностей
  async saveUserActivity(activity: UserActivity): Promise<void> {
    const activities = await this.getUserActivities();
    activities.push(activity);
    await this.setItem(STORAGE_KEYS.USER_ACTIVITIES, activities);
  }

  async getUserActivities(): Promise<UserActivity[]> {
    return this.getItem(STORAGE_KEYS.USER_ACTIVITIES, []);
  }

  // Методы для общего прогресса пользователя
  async saveUserProgress(progress: UserProgress): Promise<void> {
    await this.setItem(STORAGE_KEYS.USER_PROGRESS, progress);
  }

  async getUserProgress(): Promise<UserProgress> {
    const defaultProgress: UserProgress = {
      totalTreesPlanted: 0,
      totalTrashCollected: 0,
      totalStudentsEducated: 0,
      totalEcoMiles: 0,
      totalCO2Saved: 0,
      achievementsUnlocked: [],
      joinDate: new Date().toISOString()
    };
    return this.getItem(STORAGE_KEYS.USER_PROGRESS, defaultProgress);
  }

  async updateUserProgress(update: Partial<UserProgress>): Promise<void> {
    const currentProgress = await this.getUserProgress();
    const updatedProgress = { ...currentProgress, ...update };
    await this.saveUserProgress(updatedProgress);
  }

  // Методы для настроек приложения
  async saveAppPreferences(preferences: AppPreferences): Promise<void> {
    await this.setItem(STORAGE_KEYS.APP_PREFERENCES, preferences);
  }

  async getAppPreferences(): Promise<AppPreferences> {
    const defaultPreferences: AppPreferences = {
      notificationsEnabled: true,
      autoSyncData: true,
      preferredUnits: 'metric',
      theme: 'auto',
      language: 'en'
    };
    return this.getItem(STORAGE_KEYS.APP_PREFERENCES, defaultPreferences);
  }

  // Метод для добавления достижения
  async unlockAchievement(achievementId: string): Promise<void> {
    const progress = await this.getUserProgress();
    if (!progress.achievementsUnlocked.includes(achievementId)) {
      progress.achievementsUnlocked.push(achievementId);
      await this.saveUserProgress(progress);
    }
  }

  // Метод для получения статистики по категориям
  async getCategoryStats(): Promise<{[category: string]: number}> {
    const activities = await this.getUserActivities();
    const stats: {[category: string]: number} = {};
    
    activities.forEach(activity => {
      if (!stats[activity.actionType]) {
        stats[activity.actionType] = 0;
      }
      stats[activity.actionType] += activity.amount;
    });
    
    return stats;
  }

  // Метод для экспорта всех данных (для резервного копирования)
  async exportAllData(): Promise<string> {
    try {
      const allData = {
        joinedCampaigns: await this.getJoinedCampaigns(),
        campaignStats: await this.getCampaignStats(),
        userActivities: await this.getUserActivities(),
        userProgress: await this.getUserProgress(),
        appPreferences: await this.getAppPreferences(),
        exportDate: new Date().toISOString()
      };
      return JSON.stringify(allData, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  // Метод для импорта данных (для восстановления)
  async importAllData(dataString: string): Promise<void> {
    try {
      const data = JSON.parse(dataString);
      
      if (data.joinedCampaigns) {
        await this.saveJoinedCampaigns(data.joinedCampaigns);
      }
      if (data.campaignStats) {
        await this.saveCampaignStats(data.campaignStats);
      }
      if (data.userActivities) {
        await this.setItem(STORAGE_KEYS.USER_ACTIVITIES, data.userActivities);
      }
      if (data.userProgress) {
        await this.saveUserProgress(data.userProgress);
      }
      if (data.appPreferences) {
        await this.saveAppPreferences(data.appPreferences);
      }
      
      console.log('Data imported successfully');
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }
}

export default new StorageService(); 