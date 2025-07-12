import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavBar from '../components/BottomNavBar';
import { useFocusEffect } from '@react-navigation/native';
import { useCampaignContext } from '../App';
import CampaignService, { Campaign as CampaignType } from '../services/CampaignService';

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F6FFF6' },
  container: { flex: 1, backgroundColor: '#F6FFF6' },
  scrollContent: { paddingBottom: 80 },
  mainCampaignTouchable: { marginBottom: 16, position: 'relative' },
  img: {
    width: screenWidth,
    height: 240,
    borderRadius: 0,
    alignSelf: 'center',
    backgroundColor: '#E0F2E9',
  },
  imgJoined: {
    borderWidth: 3,
    borderColor: '#3CB371',
  },
  mainJoinedBadgeBottom: {
    backgroundColor: '#2E7D32',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  mainJoinedBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  contentBlock: {
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 16,
  },
  challengeContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#3CB371', marginBottom: 6, textAlign: 'center' },
  desc: { fontSize: 15, color: '#444', textAlign: 'center', marginBottom: 12 },
  challengeExplanationBlock: {
    backgroundColor: '#E8F5E8',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3CB371',
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3CB371',
    marginLeft: 8,
  },
  challengeDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: 20,
  },
  progressWrap: { width: '90%', alignItems: 'center', marginBottom: 8 },
  progressBarBg: { width: '100%', height: 18, backgroundColor: '#E0F2E9', borderRadius: 10, overflow: 'hidden', marginBottom: 6 },
  progressBarFill: { height: 18, backgroundColor: '#3CB371', borderRadius: 10 },
  progressText: { fontSize: 13, color: '#3CB371', fontWeight: 'bold' },
  doneBtn: { backgroundColor: '#3CB371', borderRadius: 22, paddingVertical: 24, paddingHorizontal: 40, alignItems: 'center', marginTop: 6, marginBottom: 8, elevation: 2, borderWidth: 2, borderColor: '#2E7D32', alignSelf: 'stretch', minWidth: 280, minHeight: 68 },
  doneBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  thankYouBlock: { 
    backgroundColor: '#E8F5E8', 
    borderRadius: 22, 
    paddingVertical: 16, 
    paddingHorizontal: 40, 
    alignItems: 'center', 
    marginTop: 6, 
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#3CB371'
  },
  thankYouText: { 
    color: '#3CB371', 
    fontSize: 16, 
    fontWeight: 'bold', 
    textAlign: 'center' 
  },
  resetHintText: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic'
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#3CB371', marginBottom: 8, alignSelf: 'center', textAlign: 'center' },
  otherCard: {
    width: 220,
    backgroundColor: '#fff',
    borderRadius: 18,
    marginRight: 16,
    marginBottom: 16,
    padding: 14,
    alignItems: 'center',
    elevation: 2,
    minHeight: 220,
    borderWidth: 1.5,
    borderColor: '#B8E6B8',
  },
  otherCardJoined: {
    width: 220,
    backgroundColor: '#fff',
    borderRadius: 18,
    marginRight: 16,
    marginBottom: 16,
    padding: 14,
    alignItems: 'center',
    elevation: 3,
    minHeight: 220,
    borderWidth: 2.5,
    borderColor: '#2E7D32',
    position: 'relative',
  },
  joinedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#3CB371',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 1,
  },
  joinedBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  joinedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(60, 179, 113, 0.1)',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinedCheckmark: {
    fontSize: 40,
    color: '#3CB371',
    opacity: 0.7,
  },
  otherImg: {
    width: 180,
    height: 100,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#E0F2E9',
    alignSelf: 'center',
  },
  otherTitle: { fontSize: 15, fontWeight: 'bold', color: '#3CB371', textAlign: 'center', marginBottom: 4 },
  otherDesc: { fontSize: 12, color: '#555', textAlign: 'center' },
  otherScroll: { marginBottom: 8, minHeight: 220 },
  doneBtnDisabled: { 
    backgroundColor: '#CCCCCC', 
    opacity: 0.6 
  },
  doneBtnTextDisabled: { 
    color: '#999999' 
  },
  
  // Enhanced Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  loadingCard: {
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#E8F5E8',
  },
  loadingIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  loadingDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
});

export default function Campaign({ navigation }: { navigation: any }) {
  const [activeTab, setActiveTab] = useState('campaign');
  const [progress, setProgress] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [campaigns, setCampaigns] = useState<CampaignType[]>([]);
  const [loading, setLoading] = useState(true);
  const target = 10;
  const { isJoined } = useCampaignContext();

  // Animation values for loading
  const spinValue = useState(new Animated.Value(0))[0];
  const pulseValue = useState(new Animated.Value(1))[0];
  const fadeValue = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Start animations when loading
    if (loading) {
      // Spin animation
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Fade in animation
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [loading]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Загрузка кампаний при монтировании компонента
  useEffect(() => {
    loadProgress();
    loadCampaigns();
  }, []);

  // Сохранение прогресса в AsyncStorage
  const saveProgress = async (newProgress: number) => {
    try {
      await AsyncStorage.setItem('campaignProgress', newProgress.toString());
    } catch (error) {
      console.log('Error saving progress:', error);
    }
  };

  // Загрузка прогресса из AsyncStorage
  const loadProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem('campaignProgress');
      if (savedProgress !== null) {
        setProgress(parseInt(savedProgress));
      }
    } catch (error) {
      console.log('Error loading progress:', error);
    }
  };

  // Загрузка кампаний из сервиса
  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const campaignData = await CampaignService.getCampaigns();
      setCampaigns(campaignData);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setActiveTab('campaign');
    }, [])
  );

  const campaign = campaigns.length > 0 ? campaigns[0] : null;
  const isCampaignJoined = campaign ? isJoined(campaign.title) : false;

  const handleDone = () => {
    if (isButtonDisabled) return; // Защита от случайного нажатия
    if (progress < target) {
      const newProgress = progress + 1;
      setProgress(newProgress);
      saveProgress(newProgress);
    }
  };

  // Сброс прогресса (для тестирования - долгое нажатие на блок благодарности)
  const resetProgress = () => {
    setProgress(0);
    saveProgress(0);
    
    // Блокируем кнопку на 1 секунду после сброса
    setIsButtonDisabled(true);
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 1000);
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {loading ? (
            <Animated.View style={[styles.loadingContainer, { opacity: fadeValue }]}>
              <LinearGradient
                colors={['#ffffff', '#f8fff8', '#ffffff']}
                style={styles.loadingCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Animated.View style={[styles.loadingIconContainer, { transform: [{ scale: pulseValue }] }]}>
                  <Animated.View style={{ transform: [{ rotate: spin }] }}>
                    <MaterialIcons name="eco" size={48} color="#4CAF50" />
                  </Animated.View>
                </Animated.View>
                
                <Text style={styles.loadingTitle}>Loading Campaigns</Text>
                <Text style={styles.loadingSubtitle}>Discovering eco-friendly initiatives...</Text>
                
                <View style={styles.loadingDots}>
                  <Animated.View style={[styles.dot, { opacity: pulseValue }]} />
                  <Animated.View style={[styles.dot, { opacity: pulseValue }]} />
                  <Animated.View style={[styles.dot, { opacity: pulseValue }]} />
                </View>
              </LinearGradient>
            </Animated.View>
          ) : campaign ? (
            <>
              {/* Главная кампания - только кликабельная часть */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => navigation.navigate('CampaignDetail', { campaign })}
                style={styles.mainCampaignTouchable}
              >
                <Image 
                  source={campaign.image} 
                  style={styles.img} 
                  resizeMode="cover" 
                />
                
                {/* Badge для присоединившихся - под картинкой */}
                {isCampaignJoined && (
                  <View style={styles.mainJoinedBadgeBottom}>
                    <MaterialIcons name="verified" size={18} color="#fff" />
                    <Text style={styles.mainJoinedBadgeText}>PARTICIPATING</Text>
                  </View>
                )}
                
                <View style={styles.contentBlock}>
                  <Text style={styles.title}>{campaign.title}</Text>
                  <Text style={styles.desc}>{campaign.description}</Text>
                </View>
              </TouchableOpacity>
              
              {/* Блок объяснения челленджа - НЕ кликабельный */}
              <View style={styles.challengeContainer}>
                <View style={styles.challengeExplanationBlock}>
                  <View style={styles.challengeHeader}>
                    <MaterialIcons name="park" size={24} color="#3CB371" />
                    <Text style={styles.challengeTitle}>Tree Planting Challenge</Text>
                  </View>
                  <Text style={styles.challengeDescription}>
                    Help improve air quality by planting trees! Each time you plant a tree or take action to improve air quality, tap the "Done" button below. Together we can make our cities greener! 🌱
                  </Text>
                </View>
                
                <View style={styles.progressWrap}>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${(progress / target) * 100}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{progress}/{target} Done</Text>
                </View>
                {progress >= target ? (
                  <TouchableOpacity 
                    style={styles.thankYouBlock} 
                    onLongPress={resetProgress}
                    onPress={() => {}} 
                    activeOpacity={0.8}
                  >
                    <Text style={styles.thankYouText}>🎉 Thank you for participating!</Text>
                    <Text style={styles.resetHintText}>(Long press to reset)</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                    style={[styles.doneBtn, isButtonDisabled && styles.doneBtnDisabled]} 
                    onPress={handleDone}
                    disabled={isButtonDisabled}
                    activeOpacity={isButtonDisabled ? 1 : 0.8}
                  >
                    <Text style={[styles.doneBtnText, isButtonDisabled && styles.doneBtnTextDisabled]}>
                      {isButtonDisabled ? 'Wait...' : 'Done'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              
              {/* Другие кампании */}
              <Text style={styles.sectionTitle}>Other Campaigns</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.otherScroll}
                contentContainerStyle={{ paddingLeft: 8, paddingRight: 16, marginBottom: 24 }}
              >
                {campaigns.slice(1).map((c, i) => {
                  const joined = isJoined(c.title);
                  return (
                    <TouchableOpacity
                      key={i}
                      style={joined ? styles.otherCardJoined : styles.otherCard}
                      activeOpacity={0.85}
                      onPress={() => navigation.navigate('CampaignDetail', { campaign: c })}
                    >
                      {joined && (
                        <View style={styles.joinedBadge}>
                          <Text style={styles.joinedBadgeText}>JOINED</Text>
                        </View>
                      )}
                      <Image source={c.image} style={styles.otherImg} resizeMode="cover" />
                      <Text style={styles.otherTitle}>{c.title}</Text>
                      <Text style={styles.otherDesc}>
                        {c.description}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <View style={{ height: 48 }} />
            </>
          ) : (
            <View style={styles.contentBlock}>
              <Text style={styles.desc}>No campaigns available</Text>
            </View>
          )}
        </ScrollView>
        <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} navigation={navigation} />
      </View>
    </View>
  );
}