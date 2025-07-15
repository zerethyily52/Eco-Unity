import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavBar from '../components/BottomNavBar';
import CampaignProgress from '../components/CampaignProgress';
import { useFocusEffect } from '@react-navigation/native';
import { useCampaignContext } from '../contexts/CampaignContext';
import CampaignService, { Campaign as CampaignType } from '../services/CampaignService';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  safeArea: { flex: 1, backgroundColor: '#2F4F4F' },
  container: { flex: 1, backgroundColor: '#2F4F4F' },
  scrollContent: { paddingBottom: 80 },
  mainCampaignTouchable: { marginBottom: 24 },
  img: {
    width: screenWidth,
    height: 240,
    borderRadius: 0,
    alignSelf: 'center',
    backgroundColor: '#4A6B6B',
  },
  contentBlock: {
    alignItems: 'center',
    marginTop: 18,
    paddingHorizontal: 16,
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#F4D03F', marginBottom: 8, textAlign: 'center' },
  desc: { fontSize: 15, color: '#E8E8E8', textAlign: 'center', marginBottom: 18 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#FFFFFF', marginLeft: 8, marginBottom: 8, alignSelf: 'flex-start' },
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
    backgroundColor: '#4A6B6B',
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
    backgroundColor: '#4A6B6B',
    borderRadius: 18,
    marginRight: 16,
    marginBottom: 16,
    padding: 14,
    alignItems: 'center',
    elevation: 3,
    minHeight: 220,
    borderWidth: 2,
    borderColor: '#F4D03F',
    position: 'relative',
  },
  joinedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#F4D03F',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 1,
  },
  joinedBadgeText: {
    color: '#2F4F4F',
    fontSize: 10,
    fontWeight: 'bold',
  },
  joinedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(244, 208, 63, 0.1)',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinedCheckmark: {
    fontSize: 40,
    color: '#F4D03F',
    opacity: 0.7,
  },
  otherImg: {
    width: 180,
    height: 100,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#2F4F4F',
    alignSelf: 'center',
  },
  otherTitle: { fontSize: 15, fontWeight: 'bold', color: '#F4D03F', textAlign: 'center', marginBottom: 4 },
  otherDesc: { fontSize: 12, color: '#E8E8E8', textAlign: 'center' },
  otherScroll: { marginBottom: 8, minHeight: 220 },

  // Skeleton стили для загрузки
  skeletonProgressCard: {
    backgroundColor: '#4A6B6B',
    borderRadius: 16,
    margin: 16,
    marginBottom: 8,
    padding: 20,
    elevation: 3,
  },
  skeletonProgressTitle: {
    height: 20,
    backgroundColor: '#5A7B7B',
    borderRadius: 4,
    width: '60%',
    alignSelf: 'center',
    marginBottom: 16,
  },
  skeletonProgressBar: {
    height: 12,
    backgroundColor: '#5A7B7B',
    borderRadius: 6,
    marginBottom: 8,
    width: '100%',
  },
  skeletonProgressText: {
    height: 16,
    backgroundColor: '#5A7B7B',
    borderRadius: 4,
    width: 120,
    alignSelf: 'center',
    marginBottom: 16,
  },
  skeletonProgressButton: {
    height: 40,
    backgroundColor: '#5A7B7B',
    borderRadius: 12,
    width: '50%',
    alignSelf: 'center',
  },
  skeletonMainImage: {
    backgroundColor: '#5A7B7B',
  },
  skeletonMainTitle: {
    height: 28,
    backgroundColor: '#5A7B7B',
    borderRadius: 6,
    marginBottom: 12,
    width: '80%',
  },
  skeletonMainDescription: {
    height: 18,
    backgroundColor: '#5A7B7B',
    borderRadius: 4,
    marginBottom: 8,
    width: '100%',
  },

  skeletonOtherImage: {
    backgroundColor: '#5A7B7B',
  },
  skeletonOtherTitle: {
    height: 15,
    backgroundColor: '#5A7B7B',
    borderRadius: 4,
    marginBottom: 8,
    width: '70%',
    alignSelf: 'center',
  },
  skeletonOtherDescription: {
    height: 12,
    backgroundColor: '#5A7B7B',
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
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
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
                        </View>
          </TouchableOpacity>
                      )}

          {/* Блок прогресса */}
          {isLoadingCampaigns ? (
            <View style={styles.skeletonProgressCard}>
              <View style={styles.skeletonProgressTitle} />
              <View style={styles.skeletonProgressBar} />
              <View style={styles.skeletonProgressText} />
              <View style={styles.skeletonProgressButton} />
            </View>
          ) : (
            <CampaignProgress
              progress={progress}
              target={target}
              isButtonDisabled={isButtonDisabled}
              onDone={handleDone}
              onReset={resetProgress}
            />
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
    </SafeAreaView>
  );
}