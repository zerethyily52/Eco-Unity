import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Modal } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import BottomNavBar from '../components/BottomNavBar';
import { useFocusEffect } from '@react-navigation/native';
import { useCampaignContext } from '../App';
import EnvironmentalDataService, { AirQualityData } from '../services/EnvironmentalDataService';

export default function Home({ navigation }: { navigation: any }) {
  const [activeTab, setActiveTab] = useState('home');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null);
  const [isLoadingAirQuality, setIsLoadingAirQuality] = useState(true);
  const { isJoined } = useCampaignContext();

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

  const homeCampaigns = [
    {
      title: 'Urban Forest Project',
      description: 'Help us plant and care for trees in city parks and streets.',
      image: { uri: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80' },
      details: 'Join our urban forest project to make the city greener. We organize regular tree planting and care events. Everyone is welcome!',
    },
    {
      title: 'Eco School Program',
      description: 'Support eco-education and recycling in local schools.',
      image: { uri: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80' },
      details: 'Become a volunteer in our Eco School Program. Teach kids about recycling, energy saving, and nature protection.',
    },
    {
      title: 'Clean Beach Action',
      description: 'Join us to clean up beaches and protect marine life.',
      image: { uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80' },
      details: 'Participate in our monthly beach cleanups. Help us collect plastic and other waste to keep our coasts beautiful and safe for wildlife.',
    },
    {
      title: 'Green Transport Week',
      description: 'Promote cycling, walking, and public transport in your city.',
      image: { uri: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80' },
      details: 'Take part in Green Transport Week! Use a bike, walk, or take public transport. Share your experience and inspire others.',
    },
  ];

  const handleCampaignPress = (campaign: any) => {
    // Просто переходим к деталям кампании, не присоединяемся автоматически
    navigation.navigate('CampaignDetail', { campaign });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>EcoUnity</Text>
        <Text style={styles.topBarSubtext}>Together for a Greener Future</Text>
      </View>
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
          
          {/* Air Quality Section */}
          <View style={styles.airQualitySection}>
            <Text style={styles.sectionTitle}>Air Quality Today</Text>
            <TouchableOpacity 
              style={styles.airQualityCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('EnvironmentalDashboard')}
            >
              {isLoadingAirQuality ? (
                <View style={styles.loadingContainer}>
                  <MaterialIcons name="hourglass-empty" size={24} color="#3CB371" />
                  <Text style={styles.loadingText}>Loading air quality data...</Text>
                </View>
              ) : airQualityData ? (
                <>
                  <View style={styles.airQualityHeader}>
                    <View style={styles.airQualityLeft}>
                      <Text style={styles.airQualityCity}>{airQualityData.city}</Text>
                      <Text style={styles.airQualityDescription}>
                        {EnvironmentalDataService.getAQIDescription(airQualityData.status)}
                      </Text>
                    </View>
                    <View style={[styles.aqiCircle, { backgroundColor: EnvironmentalDataService.getAQIColor(airQualityData.status) }]}>
                      <Text style={styles.aqiValue}>{airQualityData.aqi}</Text>
                      <Text style={styles.aqiLabel}>AQI</Text>
                    </View>
                  </View>
                  <View style={styles.pollutantRow}>
                    {airQualityData.pollution.pm25 && (
                      <View style={styles.pollutantItem}>
                        <Text style={styles.pollutantLabel}>PM2.5</Text>
                        <Text style={styles.pollutantValue}>{airQualityData.pollution.pm25}</Text>
                      </View>
                    )}
                    {airQualityData.pollution.pm10 && (
                      <View style={styles.pollutantItem}>
                        <Text style={styles.pollutantLabel}>PM10</Text>
                        <Text style={styles.pollutantValue}>{airQualityData.pollution.pm10}</Text>
                      </View>
                    )}
                    {airQualityData.pollution.o3 && (
                      <View style={styles.pollutantItem}>
                        <Text style={styles.pollutantLabel}>O₃</Text>
                        <Text style={styles.pollutantValue}>{airQualityData.pollution.o3}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.airQualityFooter}>
                    <MaterialIcons name="info-outline" size={16} color="#666" />
                    <Text style={styles.airQualityFooterText}>Tap for detailed environmental data</Text>
                  </View>
                </>
              ) : (
                <View style={styles.errorContainer}>
                  <MaterialIcons name="cloud-off" size={24} color="#FF6B6B" />
                  <Text style={styles.errorText}>Unable to load air quality data</Text>
                  <TouchableOpacity onPress={loadAirQualityData} style={styles.retryButton}>
                    <Text style={styles.retryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Our Campaign */}
          <View style={styles.campaignBlock}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Our Campaign</Text>
              <Text style={styles.sectionSubtitle}>Join our environmental initiatives</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.campaignScroll}
              contentContainerStyle={styles.campaignScrollContent}
            >
              {homeCampaigns.map((c, i) => {
                const joined = isJoined(c.title);
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.campaignCard, joined && styles.campaignCardJoined]}
                    onPress={() => handleCampaignPress(c)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.campaignImageContainer}>
                      <Image source={c.image} style={styles.campaignImg} resizeMode="cover" />
                      {joined && (
                        <View style={styles.joinedBadge}>
                          <MaterialIcons name="verified" size={24} color="#fff" />
                          <Text style={styles.joinedBadgeText}>JOINED</Text>
                        </View>
                      )}
                      <View style={styles.campaignOverlay}>
                        <MaterialIcons name={joined ? "check" : "arrow-forward"} size={18} color="#fff" />
                      </View>
                    </View>
                    <View style={styles.campaignContent}>
                      <Text style={[styles.campaignTitle, joined && styles.campaignTitleJoined]}>{c.title}</Text>
                      <Text style={styles.campaignDesc}>{c.description}</Text>
                      <View style={styles.campaignFooter}>
                        <Text style={[styles.joinText, joined && styles.joinTextCompleted]}>
                          {joined ? "Participating" : "Join Now"}
                        </Text>
                        <MaterialIcons 
                          name={joined ? "verified" : "trending-up"} 
                          size={16} 
                          color={joined ? "#2E7D32" : "#3CB371"} 
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
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
  topBar: {
    height: Platform.OS === 'android' ? 110 : 120,
    backgroundColor: '#247A4D',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
    paddingTop: Platform.OS === 'android' ? 40 : 50,
    marginBottom: 8,
  },
  topBarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  topBarSubtext: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
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
  
  // Air Quality Section Styles
  airQualitySection: {
    marginHorizontal: 18,
    marginBottom: 18,
  },
  airQualityCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#666',
  },
  airQualityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  airQualityLeft: {
    flex: 1,
  },
  airQualityCity: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  airQualityDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  aqiCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  aqiValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  aqiLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  pollutantRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  pollutantItem: {
    alignItems: 'center',
    backgroundColor: '#F8FFF8',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 60,
  },
  pollutantLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  pollutantValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  airQualityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  airQualityFooterText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorText: {
    marginTop: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#3CB371',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 