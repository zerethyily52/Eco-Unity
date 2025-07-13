import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavBar from '../components/BottomNavBar';
import { useFocusEffect } from '@react-navigation/native';
import { useCampaignContext } from '../App';
import CampaignService, { Campaign as CampaignType } from '../services/CampaignService';

const { width: screenWidth } = Dimensions.get('window');

const campaigns = [
  {
    title: 'Tree Planting Program',
    description: 'Join us every weekend to plant trees and make our city greener. Every tree counts!',
    image: { uri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80' },
    details: 'Participate in our tree planting events. Tools and saplings are provided. Suitable for all ages.',
    steps: [
      'Register for the event',
      'Arrive at the park',
      'Plant your tree',
      'Share your experience on social media'
    ],
    benefits: [
      'Greener city',
      'Cleaner air',
      'Community bonding'
    ]
  },
  {
    title: 'Clean River Initiative',
    description: 'Help clean local rivers and lakes. Together we restore nature and protect wildlife.',
    image: { uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' },
    details: 'Join our river clean-up teams. Gloves and bags are provided. Let’s make our rivers beautiful again!',
    steps: [
      'Sign up for a clean-up day',
      'Meet at the riverbank',
      'Collect and sort trash',
      'Celebrate with the team'
    ],
    benefits: [
      'Healthier rivers',
      'Safer wildlife',
      'Cleaner environment'
    ]
  },
  {
    title: 'Plastic-Free Challenge',
    description: 'Say no to single-use plastics for a week! Share your experience and inspire others.',
    image: { uri: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80' },
    details: 'Challenge yourself to avoid single-use plastics. Get tips and support from our community.',
    steps: [
      'Refuse plastic bags and bottles',
      'Use reusable containers',
      'Share your progress daily',
      'Nominate a friend'
    ],
    benefits: [
      'Less plastic waste',
      'Healthier lifestyle',
      'Inspiring others'
    ]
  },
];

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F6FFF6' },
  container: { flex: 1, backgroundColor: '#F6FFF6' },
  scrollContent: { paddingBottom: 80 },
  mainCampaignTouchable: { marginBottom: 24 },
  img: {
    width: screenWidth,
    height: 240,
    borderRadius: 0,
    alignSelf: 'center',
    backgroundColor: '#E0F2E9',
  },
  contentBlock: {
    alignItems: 'center',
    marginTop: 18,
    paddingHorizontal: 16,
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#3CB371', marginBottom: 8, textAlign: 'center' },
  desc: { fontSize: 15, color: '#444', textAlign: 'center', marginBottom: 18 },
  progressWrap: { width: '90%', alignItems: 'center', marginBottom: 18 },
  progressBarBg: { width: '100%', height: 18, backgroundColor: '#E0F2E9', borderRadius: 10, overflow: 'hidden', marginBottom: 6 },
  progressBarFill: { height: 18, backgroundColor: '#3CB371', borderRadius: 10 },
  progressText: { fontSize: 13, color: '#3CB371', fontWeight: 'bold' },
  doneBtn: { backgroundColor: '#3CB371', borderRadius: 22, paddingVertical: 28, paddingHorizontal: 40, alignItems: 'center', marginTop: 10, marginBottom: 24, elevation: 2, width: '100%', minHeight: 80 },
  doneBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  thankYouBlock: { 
    backgroundColor: '#E8F5E8', 
    borderRadius: 22, 
    paddingVertical: 16, 
    paddingHorizontal: 40, 
    alignItems: 'center', 
    marginTop: 10, 
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#3CB371',
    width: '100%',
    minHeight: 80
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
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#222', marginLeft: 8, marginBottom: 8, alignSelf: 'flex-start' },
  otherCampaignsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
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
    borderWidth: 2,
    borderColor: '#3CB371',
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
  // Skeleton стили для загрузки
  skeletonMainImage: {
    backgroundColor: '#E0E0E0',
  },
  skeletonMainTitle: {
    height: 28,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    marginBottom: 12,
    width: '80%',
  },
  skeletonMainDescription: {
    height: 18,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 8,
    width: '100%',
  },
  skeletonProgressBar: {
    backgroundColor: '#E0E0E0',
  },
  skeletonProgressText: {
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    width: 80,
    marginTop: 8,
  },
  skeletonDoneButton: {
    height: 48,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    marginTop: 16,
    width: '100%',
  },
  skeletonOtherImage: {
    backgroundColor: '#E0E0E0',
  },
  skeletonOtherTitle: {
    height: 15,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 8,
    width: '70%',
    alignSelf: 'center',
  },
  skeletonOtherDescription: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    width: '90%',
    alignSelf: 'center',
  },
});

export default function Campaign({ navigation }: { navigation: any }) {
  const [activeTab, setActiveTab] = useState('campaign');
  const [progress, setProgress] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
  const [mainCampaign, setMainCampaign] = useState<CampaignType | null>(null);
  const [otherCampaigns, setOtherCampaigns] = useState<CampaignType[]>([]);
  const target = 10;
  const { isJoined } = useCampaignContext();

  // Загрузка прогресса при монтировании компонента
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

  // Загрузка кампаний
  const loadCampaigns = async () => {
    setIsLoadingCampaigns(true);
    // Имитация загрузки
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Рерандомизируем статистики перед получением кампаний
    CampaignService.rerandomizeStats();
    
    // Получаем главную кампанию по посадке деревьев (Tree Planting Program всегда первая)
    const treePlantingCampaigns = CampaignService.getTreePlantingCampaigns();
    const main = treePlantingCampaigns.find(c => c.title.includes('Tree Planting Program') || c.title.includes('Urban Forest Project')) || treePlantingCampaigns[0];
    setMainCampaign(main);

    // Получаем 4 другие кампании, исключая главную
    const others = CampaignService.getCampaignsExcluding([main.id]).slice(0, 4);
    setOtherCampaigns(others);
    setIsLoadingCampaigns(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      setActiveTab('campaign');
    }, [])
  );

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
                    {/* Главная кампания */}
                    {isLoadingCampaigns ? (
                      // Skeleton для главной кампании
                      <View style={styles.mainCampaignTouchable}>
                        <View style={[styles.img, styles.skeletonMainImage]} />
                        <View style={styles.contentBlock}>
                          <View style={[styles.skeletonMainTitle]} />
                          <View style={[styles.skeletonMainDescription]} />
                          <View style={[styles.skeletonMainDescription, { width: '70%' }]} />
                          <View style={styles.progressWrap}>
                            <View style={[styles.progressBarBg, styles.skeletonProgressBar]} />
                            <View style={[styles.skeletonProgressText]} />
                          </View>
                          <View style={[styles.skeletonDoneButton]} />
                        </View>
                      </View>
                    ) : mainCampaign && (
                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => navigation.navigate('CampaignDetail', { campaign: mainCampaign })}
                        style={styles.mainCampaignTouchable}
                      >
                        <Image source={mainCampaign.image} style={styles.img} resizeMode="cover" />
                        <View style={styles.contentBlock}>
                          <Text style={styles.title}>{mainCampaign.title}</Text>
                          <Text style={styles.desc}>{mainCampaign.description}</Text>
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
          </TouchableOpacity>
                      )}
          {/* Другие кампании */}
          <Text style={styles.sectionTitle}>Other Campaigns</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.otherScroll}
            contentContainerStyle={{ paddingLeft: 8, paddingRight: 16, marginBottom: 24 }}
          >
            {isLoadingCampaigns ? (
              // Skeleton для других кампаний
              [1, 2, 3, 4].map((index) => (
                <View key={`skeleton-other-${index}`} style={styles.otherCard}>
                  <View style={[styles.otherImg, styles.skeletonOtherImage]} />
                  <View style={[styles.skeletonOtherTitle]} />
                  <View style={[styles.skeletonOtherDescription]} />
                </View>
              ))
            ) : (
              otherCampaigns.map((c, i) => {
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
                    {joined ? 'Participating' : c.description}
                  </Text>
                  {joined && (
                    <View style={styles.joinedOverlay}>
                      <Text style={styles.joinedCheckmark}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            }))
            }
          </ScrollView>
          <View style={{ height: 48 }} />
        </ScrollView>
        <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} navigation={navigation} />
      </View>
    </View>
  );
}