import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import BottomNavBar from '../components/BottomNavBar';

type ChallengeType = {
  id: number;
  title: string;
  desc: string;
  emoji: string;
  progress: number;
  total: number;
};

const CHALLENGES_KEY = '@challenges_progress';

const challengesData: ChallengeType[] = [
  {
    id: 1,
    title: 'Reduce Water Usage',
    desc: 'Take shorter showers and fix leaks',
    emoji: '💧',
    progress: 0,
    total: 4,
  },
  {
    id: 2,
    title: 'Go Paperless',
    desc: 'Use digital receipts and bills',
    emoji: '📄',
    progress: 0,
    total: 3,
  },
  {
    id: 3,
    title: 'Walk More, Drive Less',
    desc: 'Use public transport or walk',
    emoji: '🚶',
    progress: 0,
    total: 5,
  },
  {
    id: 4,
    title: 'Plant a Tree',
    desc: 'Contribute to reforestation',
    emoji: '🌳',
    progress: 0,
    total: 1,
  },
  {
    id: 5,
    title: 'Reduce Plastic Use',
    desc: 'Use reusable bags and bottles',
    emoji: '♻️',
    progress: 0,
    total: 6,
  },
];

export default function Challenge({ navigation }: { navigation: any }) {
  const [challengesList, setChallengesList] = useState<ChallengeType[]>(challengesData);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeType | null>(null);
  const [activeTab, setActiveTab] = useState('challenge');

  const clearStorage = async () => {
    try {
      await AsyncStorage.removeItem(CHALLENGES_KEY);
      setChallengesList(challengesData.map(ch => ({ ...ch, progress: 0 })));
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

  const loadChallengesProgress = async () => {
    try {
      const storedChallenges = await AsyncStorage.getItem(CHALLENGES_KEY);
      if (storedChallenges) {
        const parsedChallenges = JSON.parse(storedChallenges);
        const mergedChallenges = challengesData.map(challenge => {
          const storedChallenge = parsedChallenges.find((stored: ChallengeType) => stored.id === challenge.id);
          return storedChallenge ? { ...challenge, progress: storedChallenge.progress } : challenge;
        });
        setChallengesList(mergedChallenges);
      }
    } catch (error) {
      console.error('Error loading challenges:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setActiveTab('challenge');
    }, [])
  );

  useEffect(() => {
    loadChallengesProgress();
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
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
      <View style={styles.staticHeader}>
        <TouchableOpacity 
          onLongPress={clearStorage}
          activeOpacity={0.9}
          style={styles.headerContent}
        >
          <Text style={styles.header}>Green Challenges</Text>
          <Text style={styles.headerSubtitle}>Make a difference, one step at a time</Text>
          <Text style={styles.resetHint}>Long press to refresh data</Text>
        </TouchableOpacity>
      </View>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2F4F4F',
  },
  container: { flex: 1, backgroundColor: '#2F4F4F' },
  staticHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2F4F4F',
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerContent: {
    backgroundColor: '#2F4F4F',
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#F4D03F', 
    marginBottom: 5,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E8E8E8',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  resetHint: {
    fontSize: 10,
    color: '#B8B8B8',
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.7,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 130, // Увеличенный отступ для статичного заголовка
    paddingBottom: 120,
  },
  card: {
    backgroundColor: '#4A6B6B',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    position: 'relative',
  },
  completedCard: {
    backgroundColor: '#5A7B7B',
    borderColor: '#F4D03F',
    borderWidth: 2,
  },
  doneLabel: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#F4D03F',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    elevation: 4,
  },
  doneLabelText: {
    color: '#2F4F4F',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardEmoji: { fontSize: 24, marginRight: 10 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#F4D03F', flex: 1 },
  cardDesc: { fontSize: 14, color: '#E8E8E8', marginBottom: 10 },
  cardFooter: { alignItems: 'flex-end' },
  cardProgress: { fontSize: 12, color: '#F4D03F', fontWeight: 'bold' },
  completedText: { color: '#F4D03F', textDecorationLine: 'line-through' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#4A6B6B',
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
  closeIconText: { fontSize: 20, color: '#E8E8E8', fontWeight: 'bold' },
  modalEmoji: { fontSize: 48, marginBottom: 15 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#F4D03F' },
  modalDesc: { fontSize: 14, color: '#E8E8E8', marginBottom: 15, textAlign: 'center' },
  modalProgress: { fontSize: 16, color: '#F4D03F', fontWeight: 'bold', marginBottom: 20 },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  resetBtn: {
    backgroundColor: '#8B5A5A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    flex: 1,
  },
  resetBtnText: { color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' },
  modalBtn: {
    backgroundColor: '#F4D03F',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    flex: 1,
  },
  modalBtnText: { color: '#2F4F4F', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  thankYouBlock: {
    alignItems: 'center',
    backgroundColor: '#5A7B7B',
    borderRadius: 10,
    padding: 15,
  },
  thankYouText: { fontSize: 16, fontWeight: 'bold', color: '#F4D03F', marginBottom: 5 },
  thankYouSubText: { fontSize: 12, color: '#E8E8E8', textAlign: 'center' },
}); 