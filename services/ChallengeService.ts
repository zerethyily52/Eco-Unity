// Challenge Service
// Сервис для создания экологических челленджей на основе данных API

import EnvironmentalDataService from './EnvironmentalDataService';

export interface Challenge {
  id: number;
  title: string;
  desc: string;
  emoji: string;
  progress: number;
  total: number;
  category: 'air' | 'carbon' | 'water' | 'energy' | 'transport';
  impact: string;
}

class ChallengeService {
  // Создание челленджей на основе данных о качестве воздуха
  private async createAirQualityChallenge(): Promise<Challenge> {
    const airData = await EnvironmentalDataService.getAirQuality();
    const aqi = airData?.aqi || 3;
    
    if (aqi >= 4) {
      return {
        id: 1,
        title: 'Urgent Air Action',
        desc: 'Air quality is poor - use public transport today',
        emoji: '🚌',
        progress: 0,
        total: 3,
        category: 'air',
        impact: 'Reduces air pollution and improves health'
      };
    } else if (aqi >= 3) {
      return {
        id: 1,
        title: 'Plant for Clean Air',
        desc: 'Plant or care for trees to improve air quality',
        emoji: '🌳',
        progress: 0,
        total: 2,
        category: 'air',
        impact: 'Trees filter air pollutants naturally'
      };
    } else {
      return {
        id: 1,
        title: 'Keep Air Clean',
        desc: 'Walk or bike instead of driving',
        emoji: '🚴',
        progress: 0,
        total: 5,
        category: 'transport',
        impact: 'Prevents air pollution from vehicles'
      };
    }
  }

  // Создание челленджа по углеродному следу
  private async createCarbonChallenge(): Promise<Challenge> {
    return {
      id: 2,
      title: 'Reduce Carbon Footprint',
      desc: 'Track and reduce daily CO₂ emissions',
      emoji: '🌱',
      progress: 0,
      total: 7,
      category: 'carbon',
      impact: 'Helps fight climate change directly'
    };
  }

  // Создание челленджа по энергосбережению
  private async createEnergyChallenge(): Promise<Challenge> {
    return {
      id: 3,
      title: 'Energy Saving Week',
      desc: 'Reduce electricity usage by 20%',
      emoji: '💡',
      progress: 0,
      total: 7,
      category: 'energy',
      impact: 'Saves energy and reduces carbon emissions'
    };
  }

  // Создание челленджа по воде
  private async createWaterChallenge(): Promise<Challenge> {
    return {
      id: 4,
      title: 'Water Conservation',
      desc: 'Take shorter showers and fix leaks',
      emoji: '💧',
      progress: 0,
      total: 5,
      category: 'water',
      impact: 'Conserves precious water resources'
    };
  }

  // Создание челленджа по транспорту на основе глобальных данных
  private async createTransportChallenge(): Promise<Challenge> {
    const globalStats = await EnvironmentalDataService.getGlobalEnvironmentalStats();
    const co2Level = globalStats?.co2Levels || 420;
    
    if (co2Level > 420) {
      return {
        id: 5,
        title: 'Emergency Transport Action',
        desc: 'CO₂ levels critical - go car-free this week',
        emoji: '🚭',
        progress: 0,
        total: 7,
        category: 'transport',
        impact: 'Significantly reduces personal CO₂ emissions'
      };
    } else {
      return {
        id: 5,
        title: 'Green Transport Days',
        desc: 'Use eco-friendly transport options',
        emoji: '🚌',
        progress: 0,
        total: 5,
        category: 'transport',
        impact: 'Reduces carbon footprint from transportation'
      };
    }
  }

  // Получение всех челленджей
  async getChallenges(): Promise<Challenge[]> {
    try {
      const challenges = await Promise.all([
        this.createAirQualityChallenge(),
        this.createCarbonChallenge(),
        this.createEnergyChallenge(),
        this.createWaterChallenge(),
        this.createTransportChallenge()
      ]);
      
      return challenges;
    } catch (error) {
      console.error('Error creating challenges:', error);
      // Fallback challenges если API недоступны
      return [
        {
          id: 1,
          title: 'Plant a Tree',
          desc: 'Contribute to reforestation',
          emoji: '🌳',
          progress: 0,
          total: 1,
          category: 'air',
          impact: 'Improves air quality and carbon absorption'
        },
        {
          id: 2,
          title: 'Reduce Plastic Use',
          desc: 'Use reusable bags and bottles',
          emoji: '♻️',
          progress: 0,
          total: 6,
          category: 'carbon',
          impact: 'Reduces plastic pollution and carbon emissions'
        },
        {
          id: 3,
          title: 'Walk More, Drive Less',
          desc: 'Use public transport or walk',
          emoji: '🚶',
          progress: 0,
          total: 5,
          category: 'transport',
          impact: 'Reduces transportation emissions'
        }
      ];
    }
  }

  // Получение рекомендаций для челленджа
  getChallengeRecommendations(challenge: Challenge): string[] {
    switch (challenge.category) {
      case 'air':
        return [
          'Plant native trees in your area',
          'Use air-purifying plants indoors',
          'Avoid outdoor exercise during high pollution',
          'Support clean air initiatives'
        ];
      case 'carbon':
        return [
          'Calculate your carbon footprint',
          'Switch to renewable energy',
          'Eat less meat and dairy',
          'Offset unavoidable emissions'
        ];
      case 'energy':
        return [
          'Use LED bulbs and energy-efficient appliances',
          'Unplug devices when not in use',
          'Adjust thermostat settings',
          'Use natural light during the day'
        ];
      case 'water':
        return [
          'Take shorter showers (5 minutes max)',
          'Fix leaky faucets immediately',
          'Use full loads for washing machines',
          'Collect rainwater for plants'
        ];
      case 'transport':
        return [
          'Walk or bike for short distances',
          'Use public transportation',
          'Carpool with friends or colleagues',
          'Work from home when possible'
        ];
      default:
        return ['Follow the challenge description for best results'];
    }
  }
}

export default new ChallengeService(); 