import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useCampaignContext } from '../App';
import CampaignService, { CampaignData } from '../services/CampaignService';

const { width } = Dimensions.get('window');

export default function CampaignDetail({ route, navigation }: { route: any, navigation: any }) {
  const { campaign } = route.params;
  const { joinCampaign, leaveCampaign, isJoined } = useCampaignContext();
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null);
  const [loading, setLoading] = useState(true);

  // Загрузка данных кампании при монтировании компонента
  useEffect(() => {
    loadCampaignData();
  }, [campaign]);

  // Загрузка данных кампании из сервиса
  const loadCampaignData = async () => {
    try {
      setLoading(true);
      const data = await CampaignService.getCampaignData(campaign.id || campaign.title);
      setCampaignData(data);
    } catch (error) {
      console.error('Error loading campaign data:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasJoined = isJoined(campaign.title);

  const handleJoinCampaign = () => {
    joinCampaign(campaign.title);
  };

  const handleLeaveCampaign = () => {
    leaveCampaign(campaign.title);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#3CB371" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Hero Image Section */}
        <View style={styles.heroSection}>
          <Image source={campaign.image} style={styles.heroImg} />
          <View style={styles.heroOverlay}>
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>{campaignData?.difficulty || 'Loading...'}</Text>
            </View>
            {hasJoined && (
              <View style={styles.joinedStatusBadge}>
                <MaterialIcons name="verified" size={20} color="#fff" />
                <Text style={styles.joinedStatusText}>PARTICIPATING</Text>
              </View>
            )}
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {loading ? (
            <Text style={styles.desc}>Loading campaign details...</Text>
          ) : (
            <>
              {/* Title and Description */}
              <Text style={styles.title}>{campaign.title}</Text>
              <Text style={styles.desc}>{campaign.description}</Text>
              {campaign.details && <Text style={styles.details}>{campaign.details}</Text>}

              {/* Quick Info Cards */}
              <View style={styles.infoCards}>
                <View style={styles.infoCard}>
                  <MaterialIcons name="schedule" size={20} color="#3CB371" />
                  <Text style={styles.infoLabel}>Duration</Text>
                  <Text style={styles.infoValue}>{campaignData?.duration || 'TBD'}</Text>
                </View>
                <View style={styles.infoCard}>
                  <MaterialIcons name="location-on" size={20} color="#3CB371" />
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>{campaignData?.location || 'TBD'}</Text>
                </View>
              </View>

              {/* Stats Section */}
              <View style={styles.statsSection}>
                <Text style={styles.sectionTitle}>Impact Statistics</Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statCard}>
                    <Text style={styles.statNumber}>
                      {campaignData?.stats.treesPlanted || 
                       campaignData?.stats.trashCollected || 
                       campaignData?.stats.milesWalked || 
                       campaignData?.stats.studentsImpacted || 
                       (campaignData?.stats.iceProtected ? `${campaignData.stats.iceProtected.toFixed(1)}M` : null) ||
                       campaignData?.stats.carbonReduced ||
                       campaignData?.stats.oceanCleaned || 0}
                    </Text>
                    <Text style={styles.statLabel} numberOfLines={2}>
                      {campaignData?.stats.treesPlanted ? 'Trees\nPlanted' : 
                       campaignData?.stats.trashCollected ? 'Lbs\nCollected' : 
                       campaignData?.stats.milesWalked ? 'Miles\nWalked' : 
                       campaignData?.stats.studentsImpacted ? 'Students' : 
                       campaignData?.stats.iceProtected ? 'km², Ice Protected' :
                       campaignData?.stats.carbonReduced ? 'kg, Carbon\nReduced' :
                       campaignData?.stats.oceanCleaned ? 'Ocean\nCleaned (km²)' : 'Total Impact'}
                    </Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{campaignData?.stats.participants || 0}</Text>
                    <Text style={styles.statLabel} numberOfLines={2}>Participants</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statNumber}>
                      {campaignData?.stats.areas || 
                       campaignData?.stats.schoolsReached || 
                       campaignData?.stats.beachesClean || 
                       campaignData?.stats.co2Saved || 
                       campaignData?.stats.airQualityImproved || 0}
                    </Text>
                    <Text style={styles.statLabel} numberOfLines={2}>
                      {campaignData?.stats.areas ? 'Areas' : 
                       campaignData?.stats.schoolsReached ? 'Schools' : 
                       campaignData?.stats.beachesClean ? 'Beaches\nCleaned' : 
                       campaignData?.stats.co2Saved ? 'CO2 Saved\n(kg)' :
                       campaignData?.stats.airQualityImproved ? 'Air Quality\nImproved (%)' : 'Impact'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* How to Participate */}
              {campaignData?.steps && campaignData.steps.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>How to Participate</Text>
                  {campaignData.steps.map((step: string, idx: number) => (
                    <View key={idx} style={styles.stepItem}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>{idx + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Benefits */}
              {campaignData?.benefits && campaignData.benefits.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Benefits & Impact</Text>
                  {campaignData.benefits.map((benefit: string, idx: number) => (
                    <View key={idx} style={styles.benefitItem}>
                      <MaterialIcons name="check-circle" size={20} color="#3CB371" />
                      <Text style={styles.benefitText}>{benefit}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Action Buttons */}
              {!hasJoined ? (
                <TouchableOpacity 
                  style={styles.joinButton} 
                  onPress={handleJoinCampaign}
                >
                  <MaterialIcons name="volunteer-activism" size={24} color="#fff" />
                  <Text style={styles.joinButtonText}>Join This Campaign</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.buttonContainer}>
                  <View style={styles.participatingContainer}>
                    <MaterialIcons name="verified" size={24} color="#2E7D32" />
                    <Text style={styles.participatingText}>You're participating in this campaign!</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.leaveButton} 
                    onPress={handleLeaveCampaign}
                  >
                    <MaterialIcons name="exit-to-app" size={20} color="#fff" />
                    <Text style={styles.leaveButtonText}>Leave Campaign</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={{ height: 40 }} />
            </>
          )}
                </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6FFF6' },
  header: { 
    width: '100%', 
    paddingHorizontal: 24, 
    paddingTop: 48, 
    paddingBottom: 16 
  },
  backBtn: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  backText: { 
    color: '#3CB371', 
    fontSize: 18, 
    marginLeft: 8 
  },
  scrollView: { 
    flex: 1 
  },
  heroSection: {
    width: width - 48,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: '#E0F2E9',
    position: 'relative',
  },
  heroImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  difficultyBadge: {
    backgroundColor: 'rgba(60, 179, 113, 0.9)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  difficultyText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  joinedStatusBadge: {
    backgroundColor: 'rgba(46, 125, 50, 0.95)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinedStatusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  content: {
    marginHorizontal: 24,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3CB371',
    marginBottom: 12,
    textAlign: 'center',
  },
  desc: {
    fontSize: 18,
    color: '#444',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  details: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  infoCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  infoCard: {
    alignItems: 'center',
    backgroundColor: '#F8FFF8',
    borderRadius: 12,
    padding: 16,
    width: '47%',
    borderWidth: 1,
    borderColor: '#E0F2E9',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3CB371',
    marginTop: 4,
    textAlign: 'center',
  },
  statsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3CB371',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statCard: {
    backgroundColor: '#E8F5E8',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '32%',
    marginBottom: 16,
    minHeight: 80,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    lineHeight: 14,
  },
  section: {
    marginBottom: 32,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3CB371',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 16,
    color: '#444',
    flex: 1,
    lineHeight: 22,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  benefitText: {
    fontSize: 16,
    color: '#444',
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
  },
  buttonContainer: {
    marginTop: 20,
  },
  participatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E8',
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#2E7D32',
  },
  participatingText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3CB371',
    borderRadius: 16,
    paddingVertical: 18,
    marginTop: 20,
    shadowColor: '#3CB371',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  leaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D32F2F',
    borderRadius: 16,
    paddingVertical: 14,
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  leaveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});