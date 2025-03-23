import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

export default function AppLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={() => ({
        headerStyle: {
          backgroundColor: '#121212',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#333',
        },
        headerTitleStyle: {
          color: '#FFFFFF',
          fontSize: 18,
          fontWeight: 'bold',
        },
        headerTintColor: '#1E90FF',
        cardStyle: { backgroundColor: '#121212' }
      })}
    >
      <Stack.Screen 
        name="index" 
        options={{
          title: 'Главная',
        }}
      />
      <Stack.Screen 
        name="quiz"
        options={{
          title: '❓ Квиз'
        }}
      />
      <Stack.Screen 
        name="calculator"
        options={{
          title: '🧮 Калькулятор'
        }}
      />
      <Stack.Screen 
        name="game" 
        options={{
          title: '🎮 Угадай число'
        }}
      />
    </Stack>
  );
}