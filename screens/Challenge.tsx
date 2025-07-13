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
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.headerContainer}
        onLongPress={clearStorage}
        activeOpacity={0.9}
      >
        {/* Простой венок цветов вокруг текста */}
        
        {/* Левая сторона от текста */}
        <View style={[styles.flowerTopLeft, { top: 90, left: 20, width: 16, height: 16 }]}>
          <View style={[styles.flowerPetals, { width: 16, height: 16 }]}>
            <View style={[styles.petal, styles.petal1, { backgroundColor: '#FF69B4', width: 6, height: 6 }]} />
            <View style={[styles.petal, styles.petal2, { backgroundColor: '#FF69B4', width: 6, height: 6 }]} />
            <View style={[styles.petal, styles.petal3, { backgroundColor: '#FF69B4', width: 6, height: 6 }]} />
            <View style={[styles.petal, styles.petal4, { backgroundColor: '#FF69B4', width: 6, height: 6 }]} />
          </View>
          <View style={[styles.flowerCenter, { backgroundColor: '#FFD700', width: 6, height: 6, top: 5, left: 5 }]} />
        </View>

        <View style={[styles.flowerTopLeft, { top: 75, left: 40, width: 14, height: 14 }]}>
          <View style={[styles.flowerPetals, { width: 14, height: 14 }]}>
            <View style={[styles.petal, styles.petal1, { backgroundColor: '#87CEEB', width: 5, height: 5 }]} />
            <View style={[styles.petal, styles.petal2, { backgroundColor: '#87CEEB', width: 5, height: 5 }]} />
            <View style={[styles.petal, styles.petal3, { backgroundColor: '#87CEEB', width: 5, height: 5 }]} />
            <View style={[styles.petal, styles.petal4, { backgroundColor: '#87CEEB', width: 5, height: 5 }]} />
          </View>
          <View style={[styles.flowerCenter, { backgroundColor: '#FFA500', width: 5, height: 5, top: 4.5, left: 4.5 }]} />
        </View>

        {/* Верхняя часть над текстом */}
        <View style={[styles.flowerTopLeft, { top: 65, left: 80, width: 18, height: 18 }]}>
          <View style={[styles.flowerPetals, { width: 18, height: 18 }]}>
            <View style={[styles.petal, styles.petal1, { backgroundColor: '#98FB98', width: 7, height: 7 }]} />
            <View style={[styles.petal, styles.petal2, { backgroundColor: '#98FB98', width: 7, height: 7 }]} />
            <View style={[styles.petal, styles.petal3, { backgroundColor: '#98FB98', width: 7, height: 7 }]} />
            <View style={[styles.petal, styles.petal4, { backgroundColor: '#98FB98', width: 7, height: 7 }]} />
          </View>
          <View style={[styles.flowerCenter, { backgroundColor: '#FF6347', width: 7, height: 7, top: 5.5, left: 5.5 }]} />
        </View>

        <View style={[styles.flowerTopLeft, { top: 70, left: 120, width: 16, height: 16 }]}>
          <View style={[styles.flowerPetals, { width: 16, height: 16 }]}>
            <View style={[styles.petal, styles.petal1, { backgroundColor: '#DDA0DD', width: 6, height: 6 }]} />
            <View style={[styles.petal, styles.petal2, { backgroundColor: '#DDA0DD', width: 6, height: 6 }]} />
            <View style={[styles.petal, styles.petal3, { backgroundColor: '#DDA0DD', width: 6, height: 6 }]} />
            <View style={[styles.petal, styles.petal4, { backgroundColor: '#DDA0DD', width: 6, height: 6 }]} />
          </View>
          <View style={[styles.flowerCenter, { backgroundColor: '#32CD32', width: 6, height: 6, top: 5, left: 5 }]} />
        </View>

        {/* Правая сторона от текста */}
        <View style={[styles.flowerTopLeft, { top: 75, right: 40, left: 'auto', width: 14, height: 14 }]}>
          <View style={[styles.flowerPetals, { width: 14, height: 14 }]}>
            <View style={[styles.petal, styles.petal1, { backgroundColor: '#F0E68C', width: 5, height: 5 }]} />
            <View style={[styles.petal, styles.petal2, { backgroundColor: '#F0E68C', width: 5, height: 5 }]} />
            <View style={[styles.petal, styles.petal3, { backgroundColor: '#F0E68C', width: 5, height: 5 }]} />
            <View style={[styles.petal, styles.petal4, { backgroundColor: '#F0E68C', width: 5, height: 5 }]} />
          </View>
          <View style={[styles.flowerCenter, { backgroundColor: '#FF1493', width: 5, height: 5, top: 4.5, left: 4.5 }]} />
        </View>

        <View style={[styles.flowerTopLeft, { top: 90, right: 20, left: 'auto', width: 16, height: 16 }]}>
          <View style={[styles.flowerPetals, { width: 16, height: 16 }]}>
            <View style={[styles.petal, styles.petal1, { backgroundColor: '#FFA07A', width: 6, height: 6 }]} />
            <View style={[styles.petal, styles.petal2, { backgroundColor: '#FFA07A', width: 6, height: 6 }]} />
            <View style={[styles.petal, styles.petal3, { backgroundColor: '#FFA07A', width: 6, height: 6 }]} />
            <View style={[styles.petal, styles.petal4, { backgroundColor: '#FFA07A', width: 6, height: 6 }]} />
          </View>
          <View style={[styles.flowerCenter, { backgroundColor: '#20B2AA', width: 6, height: 6, top: 5, left: 5 }]} />
        </View>

        {/* Нижняя часть под текстом */}
        <View style={[styles.flowerTopLeft, { top: 110, left: 50, width: 15, height: 15 }]}>
          <View style={[styles.flowerPetals, { width: 15, height: 15 }]}>
            <View style={[styles.petal, styles.petal1, { backgroundColor: '#FF7F50', width: 5.5, height: 5.5 }]} />
            <View style={[styles.petal, styles.petal2, { backgroundColor: '#FF7F50', width: 5.5, height: 5.5 }]} />
            <View style={[styles.petal, styles.petal3, { backgroundColor: '#FF7F50', width: 5.5, height: 5.5 }]} />
            <View style={[styles.petal, styles.petal4, { backgroundColor: '#FF7F50', width: 5.5, height: 5.5 }]} />
          </View>
          <View style={[styles.flowerCenter, { backgroundColor: '#00CED1', width: 5.5, height: 5.5, top: 4.75, left: 4.75 }]} />
        </View>

        <View style={[styles.flowerTopLeft, { top: 105, left: 90, width: 17, height: 17 }]}>
          <View style={[styles.flowerPetals, { width: 17, height: 17 }]}>
            <View style={[styles.petal, styles.petal1, { backgroundColor: '#DA70D6', width: 6.5, height: 6.5 }]} />
            <View style={[styles.petal, styles.petal2, { backgroundColor: '#DA70D6', width: 6.5, height: 6.5 }]} />
            <View style={[styles.petal, styles.petal3, { backgroundColor: '#DA70D6', width: 6.5, height: 6.5 }]} />
            <View style={[styles.petal, styles.petal4, { backgroundColor: '#DA70D6', width: 6.5, height: 6.5 }]} />
          </View>
          <View style={[styles.flowerCenter, { backgroundColor: '#FFFF00', width: 6.5, height: 6.5, top: 5.25, left: 5.25 }]} />
        </View>

        <View style={[styles.flowerTopLeft, { top: 110, right: 50, left: 'auto', width: 15, height: 15 }]}>
          <View style={[styles.flowerPetals, { width: 15, height: 15 }]}>
            <View style={[styles.petal, styles.petal1, { backgroundColor: '#40E0D0', width: 5.5, height: 5.5 }]} />
            <View style={[styles.petal, styles.petal2, { backgroundColor: '#40E0D0', width: 5.5, height: 5.5 }]} />
            <View style={[styles.petal, styles.petal3, { backgroundColor: '#40E0D0', width: 5.5, height: 5.5 }]} />
            <View style={[styles.petal, styles.petal4, { backgroundColor: '#40E0D0', width: 5.5, height: 5.5 }]} />
          </View>
          <View style={[styles.flowerCenter, { backgroundColor: '#FF4500', width: 5.5, height: 5.5, top: 4.75, left: 4.75 }]} />
        </View>

        {/* Несколько декоративных цветов рядом с текстом */}
        <View style={[styles.flowerTopLeft, { top: 50, left: 25, width: 12, height: 12 }]}>
          <View style={[styles.flowerPetals, { width: 12, height: 12 }]}>
            <View style={[styles.petal, styles.petal1, { backgroundColor: '#FF69B4', width: 4, height: 4 }]} />
            <View style={[styles.petal, styles.petal2, { backgroundColor: '#FF69B4', width: 4, height: 4 }]} />
            <View style={[styles.petal, styles.petal3, { backgroundColor: '#FF69B4', width: 4, height: 4 }]} />
            <View style={[styles.petal, styles.petal4, { backgroundColor: '#FF69B4', width: 4, height: 4 }]} />
          </View>
          <View style={[styles.flowerCenter, { backgroundColor: '#FFD700', width: 4, height: 4, top: 4, left: 4 }]} />
        </View>

        <View style={[styles.flowerTopLeft, { top: 45, right: 25, left: 'auto', width: 12, height: 12 }]}>
          <View style={[styles.flowerPetals, { width: 12, height: 12 }]}>
            <View style={[styles.petal, styles.petal1, { backgroundColor: '#87CEEB', width: 4, height: 4 }]} />
            <View style={[styles.petal, styles.petal2, { backgroundColor: '#87CEEB', width: 4, height: 4 }]} />
            <View style={[styles.petal, styles.petal3, { backgroundColor: '#87CEEB', width: 4, height: 4 }]} />
            <View style={[styles.petal, styles.petal4, { backgroundColor: '#87CEEB', width: 4, height: 4 }]} />
          </View>
          <View style={[styles.flowerCenter, { backgroundColor: '#FFA500', width: 4, height: 4, top: 4, left: 4 }]} />
        </View>

        <View style={[styles.flowerTopLeft, { bottom: 25, left: 40, top: 'auto', width: 14, height: 14 }]}>
          <View style={[styles.flowerPetals, { width: 14, height: 14 }]}>
            <View style={[styles.petal, styles.petal1, { backgroundColor: '#98FB98', width: 5, height: 5 }]} />
            <View style={[styles.petal, styles.petal2, { backgroundColor: '#98FB98', width: 5, height: 5 }]} />
            <View style={[styles.petal, styles.petal3, { backgroundColor: '#98FB98', width: 5, height: 5 }]} />
            <View style={[styles.petal, styles.petal4, { backgroundColor: '#98FB98', width: 5, height: 5 }]} />
          </View>
          <View style={[styles.flowerCenter, { backgroundColor: '#FF6347', width: 5, height: 5, top: 4.5, left: 4.5 }]} />
        </View>

        <View style={[styles.flowerTopLeft, { bottom: 30, right: 40, left: 'auto', top: 'auto', width: 14, height: 14 }]}>
          <View style={[styles.flowerPetals, { width: 14, height: 14 }]}>
            <View style={[styles.petal, styles.petal1, { backgroundColor: '#DDA0DD', width: 5, height: 5 }]} />
            <View style={[styles.petal, styles.petal2, { backgroundColor: '#DDA0DD', width: 5, height: 5 }]} />
            <View style={[styles.petal, styles.petal3, { backgroundColor: '#DDA0DD', width: 5, height: 5 }]} />
            <View style={[styles.petal, styles.petal4, { backgroundColor: '#DDA0DD', width: 5, height: 5 }]} />
          </View>
          <View style={[styles.flowerCenter, { backgroundColor: '#32CD32', width: 5, height: 5, top: 4.5, left: 4.5 }]} />
        </View>

        <Text style={styles.headerEmoji}>🌍</Text>
        <Text style={styles.header}>Green Challenges</Text>
        <Text style={styles.headerSubtitle}>Make a difference, one step at a time</Text>
        <Text style={styles.resetHint}>Long press to refresh data</Text>
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
  headerContainer: {
    backgroundColor: '#3CB371',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 5,
    position: 'relative',
    overflow: 'hidden',
  },
  headerEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#FFFFFF', 
    marginBottom: 5,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E8F5E8',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  resetHint: {
    fontSize: 10,
    color: '#B8E6B8',
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.7,
  },
  // Кастомные цветы
  flowerTopLeft: {
    position: 'absolute',
    top: 15,
    left: 15,
    width: 20,
    height: 20,
  },
  flowerTopRight: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 20,
    height: 20,
  },
  flowerPetals: {
    position: 'relative',
    width: 20,
    height: 20,
  },
  petal: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: '#FFE4E1',
    borderRadius: 4,
    opacity: 0.8,
  },
  petal1: {
    top: 0,
    left: 6,
    transform: [{ rotate: '0deg' }],
  },
  petal2: {
    top: 6,
    right: 0,
    transform: [{ rotate: '90deg' }],
  },
  petal3: {
    bottom: 0,
    left: 6,
    transform: [{ rotate: '180deg' }],
  },
  petal4: {
    top: 6,
    left: 0,
    transform: [{ rotate: '270deg' }],
  },
  flowerCenter: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 8,
    height: 8,
    backgroundColor: '#FFD700',
    borderRadius: 4,
    opacity: 0.9,
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