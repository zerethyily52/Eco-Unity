import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';

const { width, height } = Dimensions.get('window');

interface FirstPageProps {
  navigation: StackNavigationProp<any, any>;
}

export default function FirstPage({ navigation }: FirstPageProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ImageBackground
        source={require('../assets/bg.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.flexContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>Join the Journey{"\n"}Towards a</Text>
          <Text style={styles.greenTitle}>Greener World</Text>
          <Text style={styles.desc}>
            We are a community that's determined to invite everyone to participate in the Go Green movement.
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>8.2</Text>
              <Text style={styles.statLabel}>Million Tons{"\n"}plastic waste</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>1,54</Text>
              <Text style={styles.statLabel}>Million Species{"\n"}endangered</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>+1°C</Text>
              <Text style={styles.statLabel}>Temperature{"\n"}increases per year</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Home')}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2F4F4F',
  },
  background: {
    flex: 1,
    backgroundColor: '#2F4F4F',
  },
  flexContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(47, 79, 79, 0.8)',
  },
  content: {
    maxWidth: 400,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    zIndex: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 0,
    marginBottom: 0,
    lineHeight: 34,
  },
  greenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F4D03F',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 34,
  },
  desc: {
    fontSize: 14,
    color: '#E8E8E8',
    textAlign: 'center',
    marginBottom: 28,
    marginTop: 8,
    maxWidth: 320,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
    width: '100%',
  },
  statBox: {
    backgroundColor: '#4A6B6B',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 4,
    height: 85,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F4D03F',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#E8E8E8',
    textAlign: 'center',
    lineHeight: 12,
  },
  button: {
    backgroundColor: '#F4D03F',
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 70,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#F4D03F',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  buttonText: {
    color: '#2F4F4F',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});