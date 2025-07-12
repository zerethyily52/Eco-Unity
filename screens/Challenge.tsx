import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import BottomNavBar from '../components/BottomNavBar';
import ChallengeService, { Challenge as ChallengeType } from '../services/ChallengeService';

const { width: screenWidth } = Dimensions.get('window');

const CHALLENGES_KEY = '@challenges_progress';

export default function Challenge({ navigation }: { navigation: any }) {
  const [challengesList, setChallengesList] = useState<ChallengeType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeType | null>(null);
  const [activeTab, setActiveTab] = useState('challenge');
  const [isLoading, setIsLoading] = useState(true);

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

  const clearStorage = async () => {
    try {
      await AsyncStorage.removeItem(CHALLENGES_KEY);
      const freshChallenges = await ChallengeService.getChallenges();
      setChallengesList(freshChallenges.map(ch => ({ ...ch, progress: 0 })));
      console.log('Challenges storage cleared');
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  };

  const saveChallengesProgress = async (challenges: ChallengeType[]) => {
    try {
      await AsyncStorage.setItem(CHALLENGES_KEY, JSON.stringify(challenges));
    } catch (error) {
      console.error('Error saving challenges:', error);
    }
  };

  const loadChallengesData = async () => {
    try {
      setIsLoading(true);
      const apiChallenges = await ChallengeService.getChallenges();
      const storedChallenges = await AsyncStorage.getItem(CHALLENGES_KEY);
      
      if (storedChallenges) {
        const parsedChallenges = JSON.parse(storedChallenges);
        const mergedChallenges = apiChallenges.map(challenge => {
          const storedChallenge = parsedChallenges.find((stored: ChallengeType) => stored.id === challenge.id);
          return storedChallenge ? { ...challenge, progress: storedChallenge.progress } : challenge;
        });
        setChallengesList(mergedChallenges);
      } else {
        setChallengesList(apiChallenges);
      }
    } catch (error) {
      console.error('Error loading challenges:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setActiveTab('challenge');
    }, [])
  );

  useEffect(() => {
    loadChallengesData();
  }, []);

  const openModal = (challenge: ChallengeType) => {
    setSelectedChallenge(challenge);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedChallenge(null);
  };

  const incrementProgress = () => {
    if (selectedChallenge) {
      const updatedChallenge = {
        ...selectedChallenge,
        progress: Math.min(selectedChallenge.progress + 1, selectedChallenge.total),
      };
      updateChallengeInList(updatedChallenge);
    }
  };

  const resetProgress = () => {
    if (selectedChallenge) {
      const updatedChallenge = {
        ...selectedChallenge,
        progress: 0,
      };
      updateChallengeInList(updatedChallenge);
    }
  };

  const updateChallengeInList = (updatedChallenge: ChallengeType) => {
    const updatedList = challengesList.map(ch =>
      ch.id === updatedChallenge.id ? updatedChallenge : ch
    );
    setChallengesList(updatedList);
    setSelectedChallenge(updatedChallenge);
    saveChallengesProgress(updatedList);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.topBarGradientContainer}
        onLongPress={clearStorage}
        activeOpacity={1}
      >
        <LinearGradient
          colors={['#2E7D32', '#4CAF50', '#66BB6A']}
          style={styles.topBarGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View style={[styles.topBarContent, { opacity: fadeAnim }]}>
            <Text style={styles.topBarText}>Green Challenges</Text>
            <Text style={styles.resetHint}>Long press to refresh data</Text>
          </Animated.View>
        </LinearGradient>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {challengesList.map(ch => {
          const isCompleted = ch.progress >= ch.total;
          return (
            <TouchableOpacity
              key={ch.id}
              style={[styles.card, isCompleted && styles.completedCard]}
              onPress={() => openModal(ch)}
            >
              {isCompleted && (
                <View style={styles.doneLabel}>
                  <Text style={styles.doneLabelText}>DONE</Text>
                </View>
              )}
              <View style={styles.cardHeader}>
                <Text style={styles.cardEmoji}>{ch.emoji}</Text>
                <Text style={[styles.cardTitle, isCompleted && styles.completedText]}>{ch.title}</Text>
              </View>
              <Text style={[styles.cardDesc, isCompleted && styles.completedText]}>{ch.desc}</Text>
              <View style={styles.cardFooter}>
                <Text style={[styles.cardProgress, isCompleted && styles.completedText]}>
                  {ch.progress}/{ch.total} weeks
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 80 }} />
      </ScrollView>
      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} navigation={navigation} />

      {/* Модальное окно */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeIcon} onPress={closeModal}>
              <Text style={styles.closeIconText}>✕</Text>
            </TouchableOpacity>
            {selectedChallenge && (
              <>
                <Text style={styles.modalEmoji}>{selectedChallenge.emoji}</Text>
                <Text style={styles.modalTitle}>{selectedChallenge.title}</Text>
                <Text style={styles.modalDesc}>{selectedChallenge.desc}</Text>
                <Text style={styles.modalProgress}>
                  Progress: {selectedChallenge.progress}/{selectedChallenge.total}
                </Text>
                {selectedChallenge.progress >= selectedChallenge.total ? (
                  <View style={styles.thankYouBlock}>
                    <Text style={styles.thankYouText}>🎉 Challenge Completed!</Text>
                    <Text style={styles.thankYouSubText}>Great job on finishing this challenge!</Text>
                  </View>
                ) : (
                  <View style={styles.modalButtons}>
                    <Pressable style={styles.resetBtn} onPress={resetProgress}>
                      <Text style={styles.resetBtnText}>Reset</Text>
                    </Pressable>
                    <Pressable style={styles.modalBtn} onPress={incrementProgress}>
                      <Text style={styles.modalBtnText}>+</Text>
                    </Pressable>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F8F0' },
  
  // Enhanced Top Bar Styles
  topBarGradientContainer: {
    marginBottom: 20,
  },
  topBarGradient: {
    height: Platform.OS === 'android' ? 110 : 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
    paddingTop: Platform.OS === 'android' ? 40 : 50,
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
    marginTop: 8,
  },
  resetHint: {
    fontSize: 12,
    color: '#E8F5E8',
    textAlign: 'center',
    marginTop: 12,
    opacity: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  completedCard: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  doneLabel: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    elevation: 4,
  },
  doneLabelText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardEmoji: { fontSize: 24, marginRight: 10 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#2E7D32', flex: 1 },
  cardDesc: { fontSize: 14, color: '#666', marginBottom: 10 },
  cardFooter: { alignItems: 'flex-end' },
  cardProgress: { fontSize: 12, color: '#4CAF50', fontWeight: 'bold' },
  completedText: { color: '#2E7D32', textDecorationLine: 'line-through' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 10,
    maxWidth: '90%',
    width: 300,
    position: 'relative',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 15,
    padding: 5,
  },
  closeIconText: { fontSize: 20, color: '#666', fontWeight: 'bold' },
  modalEmoji: { fontSize: 48, marginBottom: 15 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#2E7D32' },
  modalDesc: { fontSize: 14, color: '#666', marginBottom: 15, textAlign: 'center' },
  modalProgress: { fontSize: 16, color: '#4CAF50', fontWeight: 'bold', marginBottom: 20 },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  resetBtn: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    flex: 1,
  },
  resetBtnText: { color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' },
  modalBtn: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    flex: 1,
  },
  modalBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  thankYouBlock: {
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    borderRadius: 10,
    padding: 15,
  },
  thankYouText: { fontSize: 16, fontWeight: 'bold', color: '#4CAF50', marginBottom: 5 },
  thankYouSubText: { fontSize: 12, color: '#2E7D32', textAlign: 'center' },
}); 