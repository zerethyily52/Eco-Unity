// Environmental Data Service
// Интеграция с экологическими API для получения данных о качестве воздуха, углеродном следе и других экологических метриках

// API Keys - замените 'demo' на ваши настоящие токены
// Для продакшена используйте environment variables или React Native Config
const WAQI_API_KEY = 'baa800788dfc1c8f21bcc4a75e6b85cdc0816ca6'; // 🔑 ЗАМЕНИТЕ: Получите ключ на aqicn.org/data-platform/token/
const OPENAQ_API_KEY = ''; // 🔑 ОПЦИОНАЛЬНО: Регистрация на openaq.org
const OPENAQ_API_BASE = 'https://api.openaq.org/v2';
const WAQI_API_BASE = 'https://api.waqi.info';

// Для продакшена используйте:
// const WAQI_API_KEY = process.env.WAQI_API_KEY || 'demo';
// const OPENAQ_API_KEY = process.env.OPENAQ_API_KEY || '';

export interface AirQualityData {
  aqi: number;
  city: string;
  dominentpol: string;
  pollution: {
    pm25?: number;
    pm10?: number;
    o3?: number;
    no2?: number;
    so2?: number;
    co?: number;
  };
  timestamp: string;
  status: 'good' | 'moderate' | 'unhealthy_sg' | 'unhealthy' | 'very_unhealthy' | 'hazardous';
}

export interface CarbonFootprintData {
  transport: number;
  energy: number;
  total: number;
  unit: 'kg_co2' | 'tons_co2';
}

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
}

class EnvironmentalDataService {
  
  // Получение качества воздуха для текущей локации
  async getAirQuality(location?: LocationData): Promise<AirQualityData | null> {
    try {
      let url: string;
      
      if (location) {
        // Поиск по координатам
        url = `${WAQI_API_BASE}/feed/geo:${location.latitude};${location.longitude}/?token=${WAQI_API_KEY}`;
      } else {
        // Поиск по IP (автоматическое определение локации)
        url = `${WAQI_API_BASE}/feed/here/?token=${WAQI_API_KEY}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status !== 'ok' || !data.data) {
        throw new Error('Failed to fetch air quality data');
      }
      
      const aqiValue = data.data.aqi;
      const pollution = data.data.iaqi || {};
      
      return {
        aqi: aqiValue,
        city: data.data.city?.name || 'Unknown Location',
        dominentpol: data.data.dominentpol || 'pm25',
        pollution: {
          pm25: pollution.pm25?.v,
          pm10: pollution.pm10?.v,
          o3: pollution.o3?.v,
          no2: pollution.no2?.v,
          so2: pollution.so2?.v,
          co: pollution.co?.v,
        },
        timestamp: data.data.time?.s || new Date().toISOString(),
        status: this.getAQIStatus(aqiValue),
      };
    } catch (error) {
      console.error('Error fetching air quality data:', error);
      return null;
    }
  }
  
  // Получение качества воздуха для конкретного города
  async getAirQualityForCity(cityName: string): Promise<AirQualityData | null> {
    try {
      const url = `${WAQI_API_BASE}/feed/${encodeURIComponent(cityName)}/?token=${WAQI_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status !== 'ok' || !data.data) {
        throw new Error(`Failed to fetch air quality data for ${cityName}`);
      }
      
      const aqiValue = data.data.aqi;
      const pollution = data.data.iaqi || {};
      
      return {
        aqi: aqiValue,
        city: data.data.city?.name || cityName,
        dominentpol: data.data.dominentpol || 'pm25',
        pollution: {
          pm25: pollution.pm25?.v,
          pm10: pollution.pm10?.v,
          o3: pollution.o3?.v,
          no2: pollution.no2?.v,
          so2: pollution.so2?.v,
          co: pollution.co?.v,
        },
        timestamp: data.data.time?.s || new Date().toISOString(),
        status: this.getAQIStatus(aqiValue),
      };
    } catch (error) {
      console.error(`Error fetching air quality data for ${cityName}:`, error);
      return null;
    }
  }
  
  // Получение мокированных данных углеродного следа (для демо)
  // В продакшене интегрируется с CarbonSutra API
  async getCarbonFootprint(activities: {
    transport?: number; // км в день
    energy?: number; // кВт⋅ч в месяц
    flights?: number; // количество перелетов в год
  }): Promise<CarbonFootprintData> {
    try {
      // Упрощенные расчеты для демо
      const transportCO2 = (activities.transport || 0) * 0.21 * 365; // кг CO2 в год
      const energyCO2 = (activities.energy || 0) * 0.5 * 12; // кг CO2 в год
      const flightsCO2 = (activities.flights || 0) * 1000; // кг CO2 в год (примерно)
      
      const total = transportCO2 + energyCO2 + flightsCO2;
      
      return {
        transport: transportCO2,
        energy: energyCO2 + flightsCO2,
        total: total,
        unit: 'kg_co2',
      };
    } catch (error) {
      console.error('Error calculating carbon footprint:', error);
      return {
        transport: 0,
        energy: 0,
        total: 0,
        unit: 'kg_co2',
      };
    }
  }
  
  // Получение глобальных экологических данных
  async getGlobalEnvironmentalStats(): Promise<{
    globalAirQuality: number;
    citiesMonitored: number;
    co2Levels: number;
    forestCoverage: number;
  }> {
    try {
      // Используем фиксированные значения без случайных вариаций
      return {
        globalAirQuality: 85,
        citiesMonitored: 8469,
        co2Levels: 418.5,
        forestCoverage: 31.0,
      };
    } catch (error) {
      console.error('Error fetching global environmental stats:', error);
      return {
        globalAirQuality: 85,
        citiesMonitored: 8469,
        co2Levels: 418.5,
        forestCoverage: 31.0,
      };
    }
  }
  
  // Определение статуса качества воздуха по AQI
  private getAQIStatus(aqi: number): AirQualityData['status'] {
    if (aqi <= 50) return 'good';
    if (aqi <= 100) return 'moderate';
    if (aqi <= 150) return 'unhealthy_sg';
    if (aqi <= 200) return 'unhealthy';
    if (aqi <= 300) return 'very_unhealthy';
    return 'hazardous';
  }
  
  // Получение цвета для AQI статуса
  getAQIColor(status: AirQualityData['status']): string {
    const colors = {
      good: '#4CAF50',
      moderate: '#FFEB3B',
      unhealthy_sg: '#FF9800',
      unhealthy: '#F44336',
      very_unhealthy: '#9C27B0',
      hazardous: '#8BC34A',
    };
    return colors[status] || '#666';
  }
  
  // Получение описания статуса качества воздуха
  getAQIDescription(status: AirQualityData['status']): string {
    const descriptions = {
      good: 'Good - Air quality is satisfactory',
      moderate: 'Moderate - Acceptable for most people',
      unhealthy_sg: 'Unhealthy for Sensitive Groups',
      unhealthy: 'Unhealthy - Everyone may experience effects',
      very_unhealthy: 'Very Unhealthy - Health warning',
      hazardous: 'Hazardous - Emergency conditions',
    };
    return descriptions[status] || 'Unknown status';
  }
  
  // Получение рекомендаций по качеству воздуха
  getAQIRecommendations(status: AirQualityData['status']): string[] {
    const recommendations = {
      good: [
        'Perfect day for outdoor activities! 🌟',
        'Great time for jogging or cycling',
        'Windows can be opened for fresh air'
      ],
      moderate: [
        'Generally safe for outdoor activities',
        'Sensitive people should consider limiting extended outdoor exertion',
        'Good day for most outdoor plans'
      ],
      unhealthy_sg: [
        'Sensitive groups should reduce outdoor activities',
        'Consider wearing a mask outdoors',
        'Keep windows closed'
      ],
      unhealthy: [
        'Limit outdoor activities for everyone',
        'Wear protective masks when going outside',
        'Consider air purifiers indoors'
      ],
      very_unhealthy: [
        'Avoid outdoor activities',
        'Stay indoors with air purification',
        'Seek medical attention if feeling unwell'
      ],
      hazardous: [
        'Emergency conditions - stay indoors!',
        'Seal windows and doors',
        'Use air purifiers if available'
      ],
    };
    return recommendations[status] || ['No recommendations available'];
  }
}

export default new EnvironmentalDataService(); 