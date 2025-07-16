import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import BottomNavBar from '../components/BottomNavBar';
import { useFocusEffect } from '@react-navigation/native';
import { useCampaignContext } from '../contexts/CampaignContext';
import EnvironmentalDataService, { AirQualityData } from '../services/EnvironmentalDataService';
import CampaignService, { Campaign as CampaignType } from '../services/CampaignService';

export default function Home({ navigation }: { navigation: any }) {
  const [activeTab, setActiveTab] = useState('home');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null);
  const [isLoadingAirQuality, setIsLoadingAirQuality] = useState(true);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
  const [homeCampaigns, setHomeCampaigns] = useState<CampaignType[]>([]);
  const { isJoined } = useCampaignContext();

  useFocusEffect(
    React.useCallback(() => {
      setActiveTab('home');
    }, [])
  );

  // Загрузка данных о качестве воздуха и кампаний
  useEffect(() => {
    loadAirQualityData();
    loadHomeCampaigns();
  }, []);

  const loadHomeCampaigns = async () => {
    setIsLoadingCampaigns(true);
    // Имитация загрузки
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Рерандомизируем статистики перед получением кампаний
    CampaignService.rerandomizeStats();
    
    // Получаем все кампании для проверки joined статуса
    const allCampaigns = CampaignService.getAllCampaigns();
    
    // Получаем кампании к которым присоединился пользователь
    const joinedCampaigns = allCampaigns.filter(campaign => isJoined(campaign.title));
    
    // Получаем кампании к которым НЕ присоединился пользователь
    const notJoinedCampaigns = allCampaigns.filter(campaign => !isJoined(campaign.title));
    
    // Перемешиваем НЕ присоединенные кампании и берем 4
    const shuffledNotJoined = [...notJoinedCampaigns].sort(() => 0.5 - Math.random());
    const randomNotJoinedCampaigns = shuffledNotJoined.slice(0, 4);
    
    // Создаем финальный список: 4 случайные НЕ присоединенные + все присоединенные в конце
    const campaigns = [...randomNotJoinedCampaigns, ...joinedCampaigns];
    
    setHomeCampaigns(campaigns);
    setIsLoadingCampaigns(false);
  };

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

  const handleCampaignPress = (campaign: any) => {
    // Просто переходим к деталям кампании, не присоединяемся автоматически
    navigation.navigate('CampaignDetail', { campaign });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.staticHeader}>
          <Text style={styles.headerTitle}>Lemonca</Text>
          <Text style={styles.headerSubtitle}>Together for a Greener Future</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Why Eco Unity? */}
          <View style={styles.whyBlock}>
            <View style={styles.whyLeft}>
              <Text style={styles.whyTitle}>Why Lemonca?</Text>
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
              <Image source={require('../assets/lem1.png')} style={styles.whyImg} resizeMode="contain" />
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

          {/* Кампании */}
          <View style={styles.campaignBlock}>
            <View style={styles.sectionHeader}>
                              <Text style={styles.sectionTitle}>Our Campaigns</Text>
                              <Text style={styles.sectionSubtitle}>Discover new campaigns{'\n'}Your joined campaigns at the end</Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.campaignScroll}
              contentContainerStyle={styles.campaignScrollContent}
            >
              {isLoadingCampaigns ? (
                // Skeleton для загрузки кампаний
                [1, 2, 3, 4].map((index) => (
                  <View key={`skeleton-${index}`} style={styles.campaignCard}>
                    <View style={[styles.campaignImageContainer, styles.skeletonImage]} />
                    <View style={styles.campaignContent}>
                      <View style={[styles.skeletonTitle]} />
                      <View style={[styles.skeletonDescription]} />
                      <View style={[styles.skeletonDescription, { width: '60%' }]} />
                      <View style={styles.campaignFooter}>
                        <View style={[styles.skeletonButton]} />
                        <View style={[styles.skeletonIcon]} />
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                homeCampaigns.map((campaign) => {
                  const joined = isJoined(campaign.title);
                  return (
                <TouchableOpacity 
                  key={campaign.id} 
                  style={[styles.campaignCard, joined && styles.campaignCardJoined]}
                  onPress={() => navigation.navigate('CampaignDetail', { campaign })}
                >
                  <View style={styles.campaignImageContainer}>
                    <Image source={campaign.image} style={styles.campaignImg} resizeMode="cover" />
                    <View style={styles.campaignOverlay}>
                      <MaterialIcons name="arrow-forward" size={18} color="#fff" />
                    </View>
                    {joined && (
                      <View style={styles.joinedOverlay}>
                        <MaterialIcons name="check-circle" size={24} color="#fff" />
                      </View>
                    )}
                  </View>
                  <View style={styles.campaignContent}>
                    <Text style={[styles.campaignTitle, joined && styles.campaignTitleJoined]}>{campaign.title}</Text>
                    <Text style={styles.campaignDesc}>
                      {joined ? 'You are participating in this campaign!' : campaign.description}
                    </Text>
                    <View style={styles.campaignFooter}>
                      <Text style={[styles.joinText, joined && styles.joinTextCompleted]}>
                        {joined ? 'Joined' : 'Join Now'}
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
                })
              )
              }
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2F4F4F',
  },
  container: { 
    flex: 1, 
    backgroundColor: '#2F4F4F' 
  },
  staticHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2F4F4F',
    zIndex: 1000,
    elevation: 5,
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerTitle: {
    color: '#F4D03F',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  headerSubtitle: {
    color: '#E8E8E8',
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
    paddingTop: 80, // Отступ для статичного заголовка
    paddingBottom: 120,
  },
  whyBlock: {
    flexDirection: 'row',
    backgroundColor: '#4A6B6B',
    borderRadius: 18,
    marginHorizontal: 18,
    marginTop: 16,
    marginBottom: 18,
    padding: 18,
    alignItems: 'center',
    elevation: 3,
  },
  whyLeft: { flex: 2 },
  whyTitle: { fontSize: 18, fontWeight: 'bold', color: '#F4D03F', marginBottom: 8 },
  whyDesc: { fontSize: 14, color: '#E8E8E8', marginBottom: 12 },
  whyList: {},
  whyItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  whyText: { fontSize: 14, color: '#E8E8E8' },
  whyRight: { flex: 1, alignItems: 'center' },
  whyImg: { 
    width: 130, 
    height: 130, 
    borderRadius: 15,
    backgroundColor: '#4A6B6B',
    padding: 10,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F4D03F',
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
    backgroundColor: '#4A6B6B',
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
    color: '#F4D03F',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: 'bold',
  },
  serviceSubtitle: {
    fontSize: 10,
    color: '#E8E8E8',
    textAlign: 'center',
    marginTop: 2,
  },
  serviceAccent: {
    width: 40,
    height: 4,
    backgroundColor: '#F4D03F',
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
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#F4D03F', marginBottom: 4 },
  sectionSubtitle: { fontSize: 13, color: '#E8E8E8', marginTop: 4 },
  campaignScroll: { marginBottom: 8 },
  campaignScrollContent: {
    paddingLeft: 18,
    paddingRight: 18,
    paddingBottom: 20,
  },
  campaignCard: {
    width: 350,
    height: 320,
    backgroundColor: '#4A6B6B',
    borderRadius: 20,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#5A7B7B',
  },
  campaignCardJoined: {
    borderColor: '#F4D03F',
    borderWidth: 2,
  },
  campaignImageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
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
  },
  campaignContent: {
    padding: 18,
    flex: 1,
    justifyContent: 'space-between',
  },
  campaignTitle: { fontSize: 16, fontWeight: 'bold', color: '#F4D03F', marginBottom: 6, textAlign: 'left' },
  campaignTitleJoined: {
    color: '#F4D03F',
  },
  campaignDesc: { fontSize: 14, color: '#E8E8E8', textAlign: 'left', lineHeight: 20 },
  campaignFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#5A7B7B',
  },
  joinText: {
    fontSize: 14,
    color: '#F4D03F',
    fontWeight: 'bold',
  },
  joinTextCompleted: {
    color: '#F4D03F',
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
    backgroundColor: '#F4D03F',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  joinedBadgeText: {
    color: '#2F4F4F',
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
    backgroundColor: '#4A6B6B',
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
    color: '#F4D03F',
    marginBottom: 2,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#E8E8E8',
  },
  closeButton: {
    padding: 5,
  },
  tipsContainer: {
    maxHeight: 300,
    marginBottom: 20,
  },
  tipItem: {
    backgroundColor: '#5A7B7B',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F4D03F',
  },
  tipText: {
    fontSize: 14,
    color: '#E8E8E8',
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: '#F4D03F',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  actionButtonText: {
    color: '#2F4F4F',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Air Quality Section Styles
  airQualitySection: {
    marginHorizontal: 18,
    marginBottom: 18,
  },
  airQualityCard: {
    backgroundColor: '#4A6B6B',
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    height: 180,
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  loadingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#E8E8E8',
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
    color: '#F4D03F',
    marginBottom: 4,
  },
  airQualityDescription: {
    fontSize: 14,
    color: '#E8E8E8',
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
    justifyContent: 'center',
    backgroundColor: '#5A7B7B',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    minWidth: 70,
    height: 60,
    flex: 1,
    marginHorizontal: 4,
  },
  pollutantLabel: {
    fontSize: 12,
    color: '#E8E8E8',
    marginBottom: 2,
  },
  pollutantValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F4D03F',
  },
  airQualityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#5A7B7B',
    paddingTop: 12,
  },
  airQualityFooterText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#E8E8E8',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  errorText: {
    marginTop: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#E8E8E8',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#F4D03F',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  retryText: {
    color: '#2F4F4F',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Skeleton стили для загрузки кампаний
  skeletonImage: {
    backgroundColor: '#5A7B7B',
  },
  skeletonTitle: {
    height: 16,
    backgroundColor: '#5A7B7B',
    borderRadius: 4,
    marginBottom: 8,
    width: '80%',
  },
  skeletonDescription: {
    height: 14,
    backgroundColor: '#5A7B7B',
    borderRadius: 4,
    marginBottom: 6,
    width: '100%',
  },
  skeletonButton: {
    height: 14,
    backgroundColor: '#5A7B7B',
    borderRadius: 4,
    width: 60,
  },
  skeletonIcon: {
    height: 16,
    width: 16,
    backgroundColor: '#5A7B7B',
    borderRadius: 8,
  },
}); 