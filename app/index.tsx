import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView,  
  StatusBar 
} from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.buttonsContainer}>
          <Link 
            href="/quiz"
            style={styles.button}
          >
            <Text style={styles.buttonIcon}>❓</Text>
            <Text>Квиз</Text>
          </Link>
          
          <Link 
            href="/calculator"
            style={styles.button}
          >
            <Text style={styles.buttonIcon}>🧮</Text>
            <Text>Калькулятор</Text>
          </Link>
          <Link 
            href="/game"
            style={styles.button}
          >
            <Text style={styles.buttonIcon}>🎮</Text>
            <Text>Угадай число</Text>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  buttonsContainer: {
    marginBottom: 30,
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonIcon: {
    fontSize: 24,
    marginRight: 16,
  },
});