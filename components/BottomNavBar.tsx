import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

export default function BottomNavBar({ activeTab, setActiveTab, navigation }: { activeTab: string; setActiveTab: (tab: string) => void; navigation: any }) {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navBtn} onPress={() => { setActiveTab('home'); navigation.navigate('Home'); }}>
        <Ionicons name="home" size={24} color={activeTab === 'home' ? '#F4D03F' : '#B0B0B0'} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navBtn} onPress={() => { setActiveTab('campaign'); navigation.navigate('Campaign'); }}>
        <FontAwesome5 name="leaf" size={22} color={activeTab === 'campaign' ? '#F4D03F' : '#B0B0B0'} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navBtn} onPress={() => { setActiveTab('challenge'); navigation.navigate('Challenge'); }}>
        <FontAwesome5 name="trophy" size={22} color={activeTab === 'challenge' ? '#F4D03F' : '#B0B0B0'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
    backgroundColor: '#4A6B6B',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#5A7B7B',
    elevation: 10,
  },
  navBtn: { flex: 1, alignItems: 'center' },
});