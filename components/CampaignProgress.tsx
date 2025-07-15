import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface CampaignProgressProps {
  progress: number;
  target: number;
  isButtonDisabled: boolean;
  onDone: () => void;
  onReset: () => void;
}

const CampaignProgress: React.FC<CampaignProgressProps> = ({
  progress,
  target,
  isButtonDisabled,
  onDone,
  onReset
}) => {
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
        {progress >= target ? (
          <TouchableOpacity 
            style={styles.actionButton} 
            onLongPress={onReset}
            onPress={() => {}} 
            activeOpacity={0.8}
          >
            <Text style={styles.thankYouText}>🎉 Thank you!</Text>
            <Text style={styles.resetHintText}>(Long press to reset)</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.actionButton, styles.plantButton, isButtonDisabled && styles.buttonDisabled]} 
            onPress={onDone}
            disabled={isButtonDisabled}
            activeOpacity={isButtonDisabled ? 1 : 0.8}
          >
            <Text style={[styles.buttonText, isButtonDisabled && styles.buttonTextDisabled]}>
              {isButtonDisabled ? 'Wait...' : 'Plant Tree'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

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

export default CampaignProgress; 