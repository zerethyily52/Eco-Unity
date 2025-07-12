import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Modal, Animated, Dimensions } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import BottomNavBar from '../components/BottomNavBar';
import { useFocusEffect } from '@react-navigation/native';
import { useCampaignContext } from '../App';
import EnvironmentalDataService, { AirQualityData } from '../services/EnvironmentalDataService';

const { width: screenWidth } = Dimensions.get('window');

export default function Home({ navigation }: { navigation: any }) {
  const [activeTab, setActiveTab] = useState('home');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null);
  const [isLoadingAirQuality, setIsLoadingAirQuality] = useState(true);
  const { isJoined } = useCampaignContext();

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const getGradientColors = (status: string): [string, string] => {
    const gradients = {
      good: ['#4CAF50', '#81C784'] as [string, string],
      moderate: ['#FFEB3B', '#FFF176'] as [string, string],  
      unhealthy_sg: ['#FF9800', '#FFB74D'] as [string, string],
      unhealthy: ['#F44336', '#EF5350'] as [string, string],
      very_unhealthy: ['#9C27B0', '#BA68C8'] as [string, string],
      hazardous: ['#8BC34A', '#AED581'] as [string, string],
    };
    return gradients[status as keyof typeof gradients] || ['#666', '#999'];
  };

  useFocusEffect(
    React.useCallback(() => {
      setActiveTab('home');
    }, [])
  );

  // Загрузка данных о качестве воздуха
  useEffect(() => {
    loadAirQualityData();
  }, []);

  const loadAirQualityData = async () => {
    setIsLoadingAirQuality(true);
    try {
      const data = await EnvironmentalDataService.getAirQuality();
      setAirQualityData(data);
    } catch (error) {
      console.error('Failed to load air quality data:', error);
    } finally {
      setIsLoadingAirQuality(false);
    }
  };



  const openServiceModal = (service: any) => {
    setSelectedService(service);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedService(null);
  };





  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2E7D32', '#4CAF50', '#66BB6A']}
        style={styles.topBarGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View style={[styles.topBarContent, { opacity: fadeAnim }]}>
          <Text style={styles.topBarText}>🌍 EcoUnity</Text>
          <Text style={styles.topBarSubtext}>Together for a Greener Future</Text>
        </Animated.View>
      </LinearGradient>
      <View style={styles.flexGrowContent}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Why Eco Unity? */}
          <View style={styles.whyBlock}>
            <View style={styles.whyLeft}>
              <Text style={styles.whyTitle}>Why Eco Unity?</Text>
              <Text style={styles.whyDesc}>We are a community that's determined to invite everyone to participate in the Go Green movement.</Text>
              <View style={styles.whyList}>
                <View style={styles.whyItem}>
                  <View style={styles.checkIcon}>
                    <MaterialIcons name="check" size={16} color="#fff" />
                  </View>
                  <Text style={styles.whyText}>Community Dedicated</Text>
                </View>
                <View style={styles.whyItem}>
                  <View style={styles.checkIcon}>
                    <MaterialIcons name="check" size={16} color="#fff" />
                  </View>
                  <Text style={styles.whyText}>Sustainable Initiatives</Text>
                </View>
                <View style={styles.whyItem}>
                  <View style={styles.checkIcon}>
                    <MaterialIcons name="check" size={16} color="#fff" />
                  </View>
                  <Text style={styles.whyText}>Eco-Friendly Products</Text>
                </View>
              </View>
            </View>
            <View style={styles.whyRight}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80' }} style={styles.whyImg} resizeMode="cover" />
            </View>
          </View>
          
          {/* Environmental Dashboard */}
          <View style={styles.environmentalSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.mainSectionTitle}>Environmental Dashboard</Text>
              <Text style={styles.sectionSubtitle}>Real-time environmental data for your area</Text>
            </View>
            
            {/* Air Quality Main Card */}
            <Animated.View style={[styles.mainAirQualityCard, { 
              opacity: fadeAnim, 
              transform: [{ translateY: slideAnim }] 
            }]}>
              <LinearGradient
                colors={['#ffffff', '#f8fff8', '#ffffff']}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {isLoadingAirQuality ? (
                  <View style={styles.mainLoadingContainer}>
                    <View style={styles.loadingIconContainer}>
                      <MaterialIcons name="hourglass-empty" size={32} color="#3CB371" />
                    </View>
                    <Text style={styles.mainLoadingText}>Loading environmental data...</Text>
                  </View>
                ) : airQualityData ? (
                  <>
                    {/* Header with AQI */}
                    <View style={styles.mainAirQualityHeader}>
                      <View style={styles.mainAirQualityLeft}>
                        <Text style={styles.mainAirQualityCity}>🌍 {airQualityData.city}</Text>
                        <Text style={styles.mainAirQualityStatus}>
                          Air Quality: {EnvironmentalDataService.getAQIDescription(airQualityData.status)}
                        </Text>
                        <Text style={styles.airQualityTimestamp}>Last updated: {new Date().toLocaleTimeString()}</Text>
                      </View>
                      <View style={styles.aqiCircleContainer}>
                        <LinearGradient
                          colors={getGradientColors(airQualityData.status)}
                          style={styles.aqiGradientCircle}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          <Text style={styles.aqiValue}>{airQualityData.aqi}</Text>
                          <Text style={styles.aqiLabel}>AQI</Text>
                        </LinearGradient>
                      </View>
                    </View>

                  {/* Detailed Pollutants Grid */}
                  <View style={styles.pollutantsGrid}>
                    {airQualityData.pollution.pm25 && (
                      <View style={styles.pollutantDetailItem}>
                        <View style={styles.pollutantIcon}>
                          <MaterialIcons name="grain" size={20} color="#FF6B6B" />
                        </View>
                        <Text style={styles.pollutantDetailLabel}>PM2.5</Text>
                        <Text style={styles.pollutantDetailValue}>{airQualityData.pollution.pm25} μg/m³</Text>
                        <Text style={styles.pollutantDetailDesc}>Fine particles</Text>
                      </View>
                    )}
                    {airQualityData.pollution.pm10 && (
                      <View style={styles.pollutantDetailItem}>
                        <View style={styles.pollutantIcon}>
                          <MaterialIcons name="blur-circular" size={20} color="#FF9500" />
                        </View>
                        <Text style={styles.pollutantDetailLabel}>PM10</Text>
                        <Text style={styles.pollutantDetailValue}>{airQualityData.pollution.pm10} μg/m³</Text>
                        <Text style={styles.pollutantDetailDesc}>Coarse particles</Text>
                      </View>
                    )}
                    {airQualityData.pollution.o3 && (
                      <View style={styles.pollutantDetailItem}>
                        <View style={styles.pollutantIcon}>
                          <MaterialIcons name="wb-sunny" size={20} color="#3CB371" />
                        </View>
                        <Text style={styles.pollutantDetailLabel}>O₃</Text>
                        <Text style={styles.pollutantDetailValue}>{airQualityData.pollution.o3} μg/m³</Text>
                        <Text style={styles.pollutantDetailDesc}>Ground ozone</Text>
                      </View>
                    )}
                    {airQualityData.pollution.co && (
                      <View style={styles.pollutantDetailItem}>
                        <View style={styles.pollutantIcon}>
                          <MaterialIcons name="local-gas-station" size={20} color="#666" />
                        </View>
                        <Text style={styles.pollutantDetailLabel}>CO</Text>
                        <Text style={styles.pollutantDetailValue}>{airQualityData.pollution.co} μg/m³</Text>
                        <Text style={styles.pollutantDetailDesc}>Carbon monoxide</Text>
                      </View>
                    )}
                  </View>

                  {/* Health Recommendations */}
                  <View style={styles.healthRecommendations}>
                    <View style={styles.recommendationHeader}>
                      <MaterialIcons name="health-and-safety" size={20} color="#3CB371" />
                      <Text style={styles.recommendationTitle}>Health Recommendations</Text>
                    </View>
                                         <Text style={styles.recommendationText}>
                       {airQualityData.aqi <= 50 
                         ? "🟢 Great air quality! Perfect for outdoor activities and exercise."
                         : airQualityData.aqi <= 100
                         ? "🟡 Moderate air quality. Sensitive individuals should limit prolonged outdoor activities."
                         : airQualityData.aqi <= 150
                         ? "🟠 Unhealthy for sensitive groups. Children and elderly should limit outdoor exposure."
                         : "🔴 Unhealthy air quality. Everyone should avoid outdoor activities."}
                     </Text>
                  </View>

                  {/* Action Button */}
                  <View style={styles.actionButtonContainer}>
                    <TouchableOpacity style={styles.detailsActionButton} onPress={() => navigation.navigate('EnvironmentalDashboard')}>
                      <MaterialIcons name="analytics" size={18} color="#3CB371" />
                      <Text style={styles.detailsActionText}>View Details</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <View style={styles.mainErrorContainer}>
                  <MaterialIcons name="cloud-off" size={32} color="#FF6B6B" />
                  <Text style={styles.mainErrorText}>Unable to load environmental data</Text>
                  <Text style={styles.errorSubtext}>Please check your internet connection</Text>
                  <TouchableOpacity onPress={loadAirQualityData} style={styles.retryButton}>
                    <MaterialIcons name="refresh" size={16} color="#fff" />
                    <Text style={styles.retryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              )}
              </LinearGradient>
            </Animated.View>
          </View>


          <View style={{ height: 48 }} />
        </ScrollView>
      </View>
      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} navigation={navigation} />
      
      {/* Modal с советами */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={[styles.modalIconContainer, { backgroundColor: selectedService?.color || '#3CB371' }]}>
                <MaterialIcons name={selectedService?.icon as any || 'eco'} size={28} color="#fff" />
              </View>
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalTitle}>
                  {selectedService?.title} {selectedService?.subtitle}
                </Text>
                <Text style={styles.modalSubtitle}>Helpful Tips</Text>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.tipsContainer} showsVerticalScrollIndicator={false}>
              {selectedService?.tips?.map((tip: string, index: number) => (
                <View key={index} style={[styles.tipItem, { borderLeftColor: selectedService?.color || '#3CB371' }]}>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </ScrollView>
            
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: selectedService?.color || '#3CB371' }]} onPress={closeModal}>
              <Text style={styles.actionButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6FFF6' },
  
  // Enhanced Top Bar Styles
  topBarGradient: {
    height: Platform.OS === 'android' ? 110 : 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
    paddingTop: Platform.OS === 'android' ? 40 : 50,
    marginBottom: 8,
  },
  topBarContent: {
    alignItems: 'center',
  },
  topBarText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  topBarSubtext: {
    color: '#fff',
    fontSize: 15,
    marginTop: 4,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  flexGrowContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingBottom: 120,
  },
  whyBlock: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 18,
    marginTop: 16,
    marginBottom: 18,
    padding: 18,
    alignItems: 'center',
    elevation: 2,
  },
  whyLeft: { flex: 2 },
  whyTitle: { fontSize: 18, fontWeight: 'bold', color: '#222', marginBottom: 8 },
  whyDesc: { fontSize: 14, color: '#666', marginBottom: 12 },
  whyList: {},
  whyItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  whyText: { fontSize: 14, color: '#444' },
  whyRight: { flex: 1, alignItems: 'center' },
  whyImg: { 
    width: 110, 
    height: 110, 
    borderRadius: 55,
    backgroundColor: '#E0F2E9',
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3CB371',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  servicesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 12,
    marginBottom: 18,
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    width: 100,
    height: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },

  serviceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 12,
    color: '#2E7D32',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: 'bold',
  },
  serviceSubtitle: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
  serviceAccent: {
    width: 40,
    height: 4,
    backgroundColor: '#2E7D32',
    borderRadius: 2,
    marginTop: 8,
  },
  campaignBlock: {
    marginTop: 16,
    marginBottom: 0,
  },
  sectionHeader: {
    marginHorizontal: 18,
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#222', marginBottom: 4 },
  sectionSubtitle: { fontSize: 13, color: '#666', marginTop: 4 },
  campaignScroll: { marginBottom: 8 },
  campaignScrollContent: {
    paddingLeft: 18,
    paddingRight: 18,
    paddingBottom: 20,
  },
  campaignCard: {
    width: 260,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  campaignCardJoined: {
    borderColor: '#2E7D32',
    borderWidth: 2,
  },
  campaignImageContainer: {
    width: '100%',
    height: 140,
    position: 'relative',
  },
  campaignImg: {
    width: '100%',
    height: '100%',
  },
  campaignGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  campaignOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 16,
    padding: 6,
  },
  joinedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  campaignContent: {
    padding: 16,
  },
  campaignTitle: { fontSize: 15, fontWeight: 'bold', color: '#3CB371', marginBottom: 6, textAlign: 'left' },
  campaignTitleJoined: {
    color: '#2E7D32',
  },
  campaignDesc: { fontSize: 12, color: '#666', textAlign: 'left', lineHeight: 16 },
  campaignFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  joinText: {
    fontSize: 12,
    color: '#3CB371',
    fontWeight: 'bold',
  },
  joinTextCompleted: {
    color: '#2E7D32',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    elevation: 10,
  },
  navBtn: { flex: 1, alignItems: 'center' },
  joinedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  joinedBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  // Стили для модального окна
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E2E2E',
    marginBottom: 2,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  closeButton: {
    padding: 5,
  },
  tipsContainer: {
    maxHeight: 300,
    marginBottom: 20,
  },
  tipItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3CB371',
  },
  tipText: {
    fontSize: 14,
    color: '#2E2E2E',
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: '#3CB371',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Environmental Dashboard Section Styles
  environmentalSection: {
    marginHorizontal: 18,
    marginBottom: 18,
  },
  mainSectionTitle: {
    fontSize: 22,
    fontWeight: 'bold', 
    color: '#222',
    marginBottom: 4,
  },
  mainAirQualityCard: {
    borderRadius: 24,
    marginTop: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    borderWidth: 0.5,
    borderColor: '#E8F5E8',
  },
  
  // Enhanced Card Styles
  cardGradient: {
    borderRadius: 24,
    padding: 24,
    minHeight: 400,
  },
  loadingIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  // Enhanced AQI Circle Styles
  aqiCircleContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  aqiGradientCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  aqiValue: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  aqiLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.95,
    marginTop: 2,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  mainLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  mainLoadingText: {
    marginLeft: 12,
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
  mainAirQualityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  mainAirQualityLeft: {
    flex: 1,
    paddingRight: 16,
  },
  mainAirQualityCity: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 6,
  },
  mainAirQualityStatus: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
  },
  airQualityTimestamp: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  mainAqiCircle: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  mainAqiValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  mainAqiLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 2,
  },
  pollutantsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  pollutantDetailItem: {
    width: '48%',
    backgroundColor: '#F8FFF8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8F5E8',
  },
  pollutantIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 1,
  },
  pollutantDetailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  pollutantDetailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  pollutantDetailDesc: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  healthRecommendations: {
    backgroundColor: '#F0F8F0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3CB371',
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginLeft: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  actionButtonContainer: {
    alignItems: 'center',
  },
  detailsActionButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#3CB371',
    elevation: 2,
  },
  detailsActionText: {
    color: '#3CB371',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  mainErrorContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  mainErrorText: {
    marginTop: 12,
    marginBottom: 8,
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3CB371',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  noCampaignsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noCampaignsText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
}); 