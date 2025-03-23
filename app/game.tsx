import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  Platform, 
  TextInput,
  Animated,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';

export default function GameScreen() {
  const [minValue, setMinValue] = useState<string>('1');
  const [maxValue, setMaxValue] = useState<string>('100');
  const [maxAttempts, setMaxAttempts] = useState<string>('5');
  
  const [targetNumber, setTargetNumber] = useState<number | null>(null);
  const [guess, setGuess] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [previousGuesses, setPreviousGuesses] = useState<Array<{value: number, result: string}>>([]);
  
  const shakeAnimation = useState(new Animated.Value(0))[0];
  const bounceAnimation = useState(new Animated.Value(1))[0];

  function generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'error') => {
    Toast.show({
      type: type,
      text1: message,
      position: 'bottom',
      visibilityTime: 3000,
    });
    
    if (type === 'error') {
      // Also update feedback for consistent UX
      setFeedback(message);
      setTimeout(() => {
        if (feedback === message) setFeedback('');
      }, 3000);
    }
  };

  const startGame = () => {
    const min = parseInt(minValue);
    const max = parseInt(maxValue);
    const attempts = parseInt(maxAttempts);
    
    if (isNaN(min) || isNaN(max) || isNaN(attempts)) {
      showToast('Пожалуйста, введите корректные числовые значения', 'error');
      return;
    }
    
    if (min >= max) {
      showToast('Минимальное значение должно быть меньше максимального', 'error');
      return;
    }
    
    if (attempts <= 0) {
      showToast('Количество попыток должно быть больше 0', 'error');
      return;
    }

    const randomNum = generateRandomNumber(min, max);
    setTargetNumber(randomNum);
    setAttempts(0);
    setGuess('');
    setFeedback('');
    setGameActive(true);
    setGameWon(false);
    setPreviousGuesses([]);
  };

  const handleGuess = () => {
    if (!gameActive || targetNumber === null) {
      showToast('Игра не активна', 'error');
      return;
    }
    
    const min = parseInt(minValue);
    const max = parseInt(maxValue);
    const guessNumber = parseInt(guess);
    const totalAttempts = parseInt(maxAttempts);
    
    if (isNaN(guessNumber)) {
      showToast('Пожалуйста, введите число', 'error');
      return;
    }
    
    if (guessNumber < min || guessNumber > max) {
      showToast(`Пожалуйста, введите число от ${min} до ${max}`, 'error');
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    let result = '';
    if (guessNumber === targetNumber) {
      result = 'Правильно!';
      setFeedback(result);
      setGameWon(true);
      setGameActive(false);
      startBounce();
      showToast('Поздравляем! Вы угадали число!', 'success');
    } else if (newAttempts >= totalAttempts) {
      result = 'Попытки закончились';
      setFeedback(result);
      setGameActive(false);
      showToast('Игра окончена. Попытки закончились.', 'info');
    } else {
      if (totalAttempts > 1) {
        if (guessNumber < targetNumber) {
          result = 'Больше';
        } else {
          result = 'Меньше';
        }
        setFeedback(result);
        startShake();
      } else {
        result = 'Неверно';
        setFeedback(result);
        setGameActive(false);
        showToast('Неверно. Игра окончена.', 'error');
      }
    }

    setPreviousGuesses([
      { value: guessNumber, result },
      ...previousGuesses
    ]);
    
    setGuess('');
  };

  const resetGame = () => {
    setTargetNumber(null);
    setGuess('');
    setAttempts(0);
    setFeedback('');
    setGameActive(false);
    setGameWon(false);
    setPreviousGuesses([]);
    showToast('Игра сброшена', 'info');
  };

  const startShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { 
        toValue: 10, 
        duration: 100, 
        useNativeDriver: true 
      }),
      Animated.timing(shakeAnimation, { 
        toValue: -10, 
        duration: 100, 
        useNativeDriver: true 
      }),
      Animated.timing(shakeAnimation, { 
        toValue: 10, 
        duration: 100, 
        useNativeDriver: true 
      }),
      Animated.timing(shakeAnimation, { 
        toValue: 0, 
        duration: 100, 
        useNativeDriver: true 
      })
    ]).start();
  };

  const startBounce = () => {
    Animated.sequence([
      Animated.timing(bounceAnimation, { 
        toValue: 1.2, 
        duration: 200, 
        useNativeDriver: true 
      }),
      Animated.timing(bounceAnimation, { 
        toValue: 1, 
        duration: 200, 
        useNativeDriver: true 
      }),
    ]).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.gameContainer}>
            {!gameActive ? (
              <View style={styles.settingsContainer}>
                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Минимум:</Text>
                    <TextInput
                      style={styles.input}
                      value={minValue}
                      onChangeText={setMinValue}
                      keyboardType="number-pad"
                      placeholder="1"
                      placeholderTextColor="#777"
                    />
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Максимум:</Text>
                    <TextInput
                      style={styles.input}
                      value={maxValue}
                      onChangeText={setMaxValue}
                      keyboardType="number-pad"
                      placeholder="100"
                      placeholderTextColor="#777"
                    />
                  </View>
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Количество попыток:</Text>
                  <TextInput
                    style={styles.input}
                    value={maxAttempts}
                    onChangeText={setMaxAttempts}
                    keyboardType="number-pad"
                    placeholder="5"
                    placeholderTextColor="#777"
                  />
                </View>
                
                <TouchableOpacity style={styles.startButton} onPress={startGame}>
                  <Text style={styles.buttonText}>Начать игру</Text>
                </TouchableOpacity>
              </View>
            ) : gameWon ? (
              <Animated.View style={[
                styles.winContainer,
                { transform: [{ scale: bounceAnimation }] }
              ]}>
                <Text style={styles.winText}>Поздравляем!</Text>
                <Text style={styles.winSubtext}>
                  Вы угадали число {targetNumber} за {attempts} {attempts === 1 ? 'попытку' : 
                    attempts > 1 && attempts < 5 ? 'попытки' : 'попыток'}
                </Text>
                <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
                  <Text style={styles.buttonText}>Сыграть снова</Text>
                </TouchableOpacity>
              </Animated.View>
            ) : !gameActive && feedback === 'Попытки закончились' ? (
              <View style={styles.gameOverContainer}>
                <Text style={styles.gameOverText}>Попытки закончились</Text>
                <Text style={styles.gameOverSubtext}>
                  Загаданное число: <Text style={styles.targetNumberText}>{targetNumber}</Text>
                </Text>
                <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
                  <Text style={styles.buttonText}>Сыграть снова</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text style={styles.gameInfo}>
                  Угадайте число от {minValue} до {maxValue}
                </Text>
                <Text style={styles.attemptsText}>
                  Осталось попыток: {parseInt(maxAttempts) - attempts}
                </Text>
                
                <TextInput
                  style={styles.guessInput}
                  value={guess}
                  onChangeText={setGuess}
                  keyboardType="number-pad"
                  placeholder="Введите число"
                  placeholderTextColor="#777"
                />
                
                {feedback ? (
                  <Animated.View style={[
                    styles.feedbackContainer, 
                    { transform: [{ translateX: shakeAnimation }] }
                  ]}>
                    <Text style={styles.feedback}>{feedback}</Text>
                  </Animated.View>
                ) : null}

                <TouchableOpacity style={styles.guessButton} onPress={handleGuess}>
                  <Text style={styles.buttonText}>Проверить</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelButton} onPress={resetGame}>
                  <Text style={styles.cancelButtonText}>Отменить игру</Text>
                </TouchableOpacity>
              </View>
            )}

            {previousGuesses.length > 0 && (
              <View style={styles.historyContainer}>
                <Text style={styles.historyTitle}>История попыток:</Text>
                <View style={styles.historyList}>
                  {previousGuesses.map((item, index) => (
                    <View key={index} style={styles.historyItem}>
                      <Text style={styles.historyNumber}>{item.value}</Text>
                      <Text 
                        style={[
                          styles.historyResult,
                          item.result === 'Правильно!' ? styles.historyCorrect : 
                          (item.result === 'Больше' ? styles.historyHigher : 
                           item.result === 'Меньше' ? styles.historyLower : styles.historyWrong)
                        ]}
                      >
                        {item.result}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  gameContainer: {
    flex: 1,
    padding: 20,
  },
  settingsContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputGroup: {
    marginBottom: 15,
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 16,
    color: '#BBBBBB',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    height: 50,
    fontSize: 16,
    color: '#FFFFFF',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  startButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  gameInfo: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  attemptsText: {
    fontSize: 16,
    color: '#1E90FF',
    textAlign: 'center',
    marginBottom: 20,
  },
  guessInput: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    height: 60,
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  feedbackContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  feedback: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E90FF',
  },
  guessButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#555',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#BBBBBB',
  },
  historyContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    flex: 1,
    borderWidth: 1,
    borderColor: '#333',
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  historyNumber: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  historyResult: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyHigher: {
    color: '#FF6347',
  },
  historyLower: {
    color: '#4169E1',
  },
  historyCorrect: {
    color: '#32CD32',
  },
  historyWrong: {
    color: '#FF6347',
  },
  winContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 30,
    marginTop: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  winText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#32CD32',
    marginBottom: 10,
  },
  winSubtext: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  gameOverContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 30,
    marginTop: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  gameOverText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6347',
    marginBottom: 15,
  },
  gameOverSubtext: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  targetNumberText: {
    fontWeight: 'bold',
    color: '#1E90FF',
    fontSize: 20,
  },
  resetButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
});