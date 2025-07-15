import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import StorageService from '../services/StorageService';

interface CampaignProgressProps {
  campaignId: string;
  campaignTitle: string;
}

export default function CampaignProgress({ campaignId, campaignTitle }: CampaignProgressProps) {
  const [progress, setProgress] = useState(0);
  const [target] = useState(10); // Фиксированная цель
  const [isResetting, setIsResetting] = useState(false);

  // Загружаем прогресс при монтировании
  useEffect(() => {
    loadProgress();
  }, [campaignId]);

  const loadProgress = async () => {
    try {
      const campaignStats = await StorageService.getCampaignStats();
      const stats = campaignStats[campaignId];
      const savedProgress = stats?.userContribution?.treesPlanted || 0;
      setProgress(savedProgress);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const saveProgress = async (newProgress: number) => {
    try {
      await StorageService.updateCampaignStat(campaignId, {
        userContribution: {
          treesPlanted: newProgress
        }
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handlePlantTree = async () => {
    if (progress < target) {
      const newProgress = progress + 1;
      setProgress(newProgress);
      await saveProgress(newProgress);
    }
  };

  const handleReset = async () => {
    setProgress(0);
    await saveProgress(0);
    
    setIsResetting(true);
    setTimeout(() => {
      setIsResetting(false);
    }, 2000); // 2 секунды cooldown после сброса
  };

  return (
    <View style={styles.progressCard}>
      <Text style={styles.cardTitle}>Your Progress</Text>
      <Text style={styles.cardDescription}>Track your environmental impact and contribute to a greener world</Text>
      <View style={styles.progressWrap}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${(progress / target) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>{progress}/{target} Trees Planted</Text>
      </View>
      <View style={styles.buttonContainer}>
        {progress >= target || isResetting ? (
          <TouchableOpacity
            style={[styles.actionButton, isResetting && styles.buttonDisabled]} 
            {...(!isResetting && { onLongPress: handleReset })}
            activeOpacity={isResetting ? 1 : 0.8}
            disabled={isResetting}
          >
            {isResetting ? (
              <Text style={styles.buttonTextDisabled}>Wait...</Text>
            ) : (
              <>
                <Text style={styles.thankYouText}>🎉 Thank you!</Text>
                <Text style={styles.resetHintText}>(Long press to reset)</Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.actionButton, styles.plantButton]} 
            onPress={handlePlantTree}
          >
            <Text style={styles.buttonText}>Plant Tree</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressCard: {
    backgroundColor: '#4A6B6B',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: -30,
    marginBottom: 8,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    minHeight: 180, // Фиксированная высота
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F4D03F',
    textAlign: 'center',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: '#E8E8E8',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 16,
  },
  progressWrap: { 
    alignItems: 'center',
    marginBottom: 16 
  },
  progressBarBg: { 
    width: '100%', 
    height: 8, 
    backgroundColor: '#2F4F4F', 
    borderRadius: 4, 
    overflow: 'hidden', 
    marginBottom: 8 
  },
  progressBarFill: { 
    height: 8, 
    backgroundColor: '#F4D03F', 
    borderRadius: 4 
  },
  progressText: { 
    fontSize: 13, 
    color: '#F4D03F', 
    fontWeight: '600' 
  },
  buttonContainer: {
    height: 40, // Фиксированная высота для контейнера кнопки
    justifyContent: 'center',
  },
  actionButton: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40, // Фиксированная высота кнопки
    backgroundColor: '#5A7B7B',
    borderWidth: 1,
    borderColor: '#F4D03F',
    minWidth: 120,
    maxWidth: 140,
    alignSelf: 'center',
  },
  plantButton: {
    backgroundColor: '#F4D03F',
    borderColor: '#F4D03F',
  },
  buttonText: { 
    color: '#2F4F4F',
    fontSize: 14, 
    fontWeight: 'bold' 
  },
  thankYouText: { 
    color: '#F4D03F', 
    fontSize: 13, 
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 16,
  },
  resetHintText: {
    color: '#B8B8B8',
    fontSize: 9,
    textAlign: 'center',
    marginTop: 1,
    fontStyle: 'italic',
    lineHeight: 10,
  },
  buttonDisabled: { 
    backgroundColor: '#5A7B7B',
    borderColor: '#5A7B7B',
    opacity: 0.5 
  },
  buttonTextDisabled: { 
    color: '#B8B8B8' 
  },
}); 