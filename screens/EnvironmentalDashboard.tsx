import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import EnvironmentalDataService, { AirQualityData, CarbonFootprintData } from '../services/EnvironmentalDataService';

const { width } = Dimensions.get('window');

export default function EnvironmentalDashboard({ navigation }: { navigation: any }) {
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null);
  const [carbonFootprint, setCarbonFootprint] = useState<CarbonFootprintData | null>(null);
  const [globalStats, setGlobalStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Carbon footprint calculator inputs
  const [transportKm, setTransportKm] = useState('');
  const [energyKwh, setEnergyKwh] = useState('');
  const [flights, setFlights] = useState('');
  const [showCalculator, setShowCalculator] = useState(false);

  useEffect(() => {
    loadEnvironmentalData();
  }, []);

  const loadEnvironmentalData = async () => {
    setIsLoading(true);
    try {
      const [airData, globalData] = await Promise.all([
        EnvironmentalDataService.getAirQuality(),
        EnvironmentalDataService.getGlobalEnvironmentalStats(),
      ]);
      
      setAirQualityData(airData);
      setGlobalStats(globalData);
    } catch (error) {
      console.error('Error loading environmental data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCarbonFootprint = async () => {
    if (!transportKm && !energyKwh && !flights) {
      Alert.alert('Input Required', 'Please enter at least one value to calculate your carbon footprint.');
      return;
    }

    try {
      const result = await EnvironmentalDataService.getCarbonFootprint({
        transport: parseFloat(transportKm) || 0,
        energy: parseFloat(energyKwh) || 0,
        flights: parseFloat(flights) || 0,
      });
      
      setCarbonFootprint(result);
      setShowCalculator(false);
      
      Alert.alert(
        'Carbon Footprint Calculated',
        `Your estimated annual carbon footprint is ${result.total.toFixed(1)} kg CO₂`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error calculating carbon footprint:', error);
      Alert.alert('Error', 'Failed to calculate carbon footprint. Please try again.');
    }
  };

  const resetCalculator = () => {
    setTransportKm('');
    setEnergyKwh('');
    setFlights('');
    setCarbonFootprint(null);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#3CB371" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <MaterialIcons name="eco" size={48} color="#3CB371" />
          <Text style={styles.loadingText}>Loading environmental data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#3CB371" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Environmental Data</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Detailed Air Quality Card */}
        {airQualityData && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="air" size={24} color="#3CB371" />
              <Text style={styles.cardTitle}>Air Quality Details</Text>
            </View>
            
            <View style={styles.airQualityDetail}>
              <View style={styles.aqiMainInfo}>
                <View style={[styles.aqiCircleLarge, { backgroundColor: EnvironmentalDataService.getAQIColor(airQualityData.status) }]}>
                  <Text style={styles.aqiValueLarge}>{airQualityData.aqi}</Text>
                  <Text style={styles.aqiLabelLarge}>AQI</Text>
                </View>
                <View style={styles.aqiInfo}>
                  <Text style={styles.cityName}>{airQualityData.city}</Text>
                  <Text style={styles.aqiStatus}>{EnvironmentalDataService.getAQIDescription(airQualityData.status)}</Text>
                  <Text style={styles.timestamp}>Updated: {new Date(airQualityData.timestamp).toLocaleTimeString()}</Text>
                </View>
              </View>
              
              <View style={styles.pollutantGrid}>
                {Object.entries(airQualityData.pollution).map(([key, value]) => {
                  if (!value) return null;
                  return (
                    <View key={key} style={styles.pollutantCard}>
                      <Text style={styles.pollutantName}>{key.toUpperCase()}</Text>
                      <Text style={styles.pollutantVal}>{value}</Text>
                    </View>
                  );
                })}
              </View>
              
              <View style={styles.recommendationsSection}>
                <Text style={styles.recommendationsTitle}>Recommendations</Text>
                {EnvironmentalDataService.getAQIRecommendations(airQualityData.status).map((rec, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <MaterialIcons name="lightbulb-outline" size={16} color="#3CB371" />
                    <Text style={styles.recommendationText}>{rec}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Global Environmental Stats */}
        {globalStats && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="public" size={24} color="#3CB371" />
              <Text style={styles.cardTitle}>Global Environmental Stats</Text>
            </View>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <MaterialIcons name="visibility" size={20} color="#3CB371" />
                <Text style={styles.statValue}>{globalStats.globalAirQuality}</Text>
                <Text style={styles.statLabel}>Global Avg AQI</Text>
              </View>
              
              <View style={styles.statItem}>
                <MaterialIcons name="location-city" size={20} color="#3CB371" />
                <Text style={styles.statValue}>{globalStats.citiesMonitored.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Cities Monitored</Text>
              </View>
              
              <View style={styles.statItem}>
                <MaterialIcons name="cloud" size={20} color="#3CB371" />
                <Text style={styles.statValue}>{globalStats.co2Levels}</Text>
                <Text style={styles.statLabel}>CO₂ Levels (ppm)</Text>
              </View>
              
              <View style={styles.statItem}>
                <MaterialIcons name="park" size={20} color="#3CB371" />
                <Text style={styles.statValue}>{globalStats.forestCoverage}%</Text>
                <Text style={styles.statLabel}>Forest Coverage</Text>
              </View>
            </View>
          </View>
        )}

        {/* Carbon Footprint Calculator */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="calculate" size={24} color="#3CB371" />
            <Text style={styles.cardTitle}>Carbon Footprint Calculator</Text>
          </View>
          
          {!showCalculator ? (
            <View style={styles.calculatorPreview}>
              {carbonFootprint ? (
                <View style={styles.footprintResult}>
                  <Text style={styles.footprintTotal}>{carbonFootprint.total.toFixed(1)} kg CO₂</Text>
                  <Text style={styles.footprintLabel}>Annual Carbon Footprint</Text>
                  <View style={styles.footprintBreakdown}>
                    <Text style={styles.breakdownItem}>Transport: {carbonFootprint.transport.toFixed(1)} kg</Text>
                    <Text style={styles.breakdownItem}>Energy & Flights: {carbonFootprint.energy.toFixed(1)} kg</Text>
                  </View>
                  <TouchableOpacity onPress={() => setShowCalculator(true)} style={styles.recalculateButton}>
                    <Text style={styles.recalculateText}>Recalculate</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.calculatorIntro}>
                  <FontAwesome5 name="calculator" size={48} color="#3CB371" />
                  <Text style={styles.introTitle}>Calculate Your Carbon Footprint</Text>
                  <Text style={styles.introDesc}>Track your environmental impact and get personalized recommendations</Text>
                  <TouchableOpacity onPress={() => setShowCalculator(true)} style={styles.startButton}>
                    <Text style={styles.startButtonText}>Get Started</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.calculatorForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Daily Transport (km)</Text>
                <TextInput
                  style={styles.textInput}
                  value={transportKm}
                  onChangeText={setTransportKm}
                  placeholder="e.g., 20"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Monthly Energy Usage (kWh)</Text>
                <TextInput
                  style={styles.textInput}
                  value={energyKwh}
                  onChangeText={setEnergyKwh}
                  placeholder="e.g., 300"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Annual Flights</Text>
                <TextInput
                  style={styles.textInput}
                  value={flights}
                  onChangeText={setFlights}
                  placeholder="e.g., 2"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.buttonRow}>
                <TouchableOpacity onPress={() => setShowCalculator(false)} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={calculateCarbonFootprint} style={styles.calculateButton}>
                  <Text style={styles.calculateButtonText}>Calculate</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6FFF6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#3CB371',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginRight: 80, // Offset for back button
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#666',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  airQualityDetail: {},
  aqiMainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  aqiCircleLarge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  aqiValueLarge: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  aqiLabelLarge: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  aqiInfo: {
    flex: 1,
    marginLeft: 20,
  },
  cityName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  aqiStatus: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 14,
    color: '#999',
  },
  pollutantGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pollutantCard: {
    backgroundColor: '#F8FFF8',
    borderRadius: 8,
    padding: 12,
    width: '48%',
    marginBottom: 8,
    alignItems: 'center',
  },
  pollutantName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  pollutantVal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  recommendationsSection: {
    marginTop: 10,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recommendationText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#F8FFF8',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  calculatorPreview: {
    alignItems: 'center',
  },
  footprintResult: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footprintTotal: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3CB371',
    marginBottom: 8,
  },
  footprintLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  footprintBreakdown: {
    alignItems: 'center',
    marginBottom: 20,
  },
  breakdownItem: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  recalculateButton: {
    backgroundColor: '#3CB371',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  recalculateText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  calculatorIntro: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 16,
    marginBottom: 8,
  },
  introDesc: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: '#3CB371',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  calculatorForm: {},
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  calculateButton: {
    flex: 1,
    backgroundColor: '#3CB371',
    borderRadius: 8,
    paddingVertical: 12,
    marginLeft: 8,
    alignItems: 'center',
  },
  calculateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
}); 