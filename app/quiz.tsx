import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Checkbox from 'expo-checkbox';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

export default function QuizScreen() {
  const questions: Question[] = [
    {
      id: 1,
      question: 'Какая планета является самой большой в Солнечной системе?',
      options: ['Земля', 'Марс', 'Юпитер', 'Сатурн'],
      correctAnswer: 'Юпитер'
    },
    {
      id: 2,
      question: 'Какой химический элемент обозначается символом "O"?',
      options: ['Озон', 'Кислород', 'Золото', 'Осмий'],
      correctAnswer: 'Кислород'
    },
    {
      id: 3,
      question: 'Кто написал роман "Война и мир"?',
      options: ['Федор Достоевский', 'Лев Толстой', 'Антон Чехов', 'Иван Тургенев'],
      correctAnswer: 'Лев Толстой'
    },
    {
      id: 4,
      question: 'Какой язык программирования используется в React Native?',
      options: ['Java', 'Swift', 'JavaScript', 'C++'],
      correctAnswer: 'JavaScript'
    },
    {
      id: 5,
      question: 'Какой год считается началом Второй мировой войны?',
      options: ['1937', '1939', '1941', '1945'],
      correctAnswer: '1939'
    },
    {
      id: 6,
      question: 'Какая страна является самой большой по территории?',
      options: ['Китай', 'США', 'Канада', 'Россия'],
      correctAnswer: 'Россия'
    },
    {
      id: 7,
      question: 'Какой элемент в таблице Менделеева идет первым?',
      options: ['Гелий', 'Водород', 'Литий', 'Кислород'],
      correctAnswer: 'Водород'
    },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(Array(questions.length).fill(''));
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleOptionSelect = (option: string) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestionIndex] = option;
    setSelectedOptions(newSelectedOptions);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptions(Array(questions.length).fill(''));
    setShowResults(false);
  };

  const calculateScore = () => {
    let score = 0;

    questions.forEach((question, index) => {
      if (selectedOptions[index] === question.correctAnswer) {
        score += 1;
      }
    });

    return score;
  };

  if (showResults) {
    const score = calculateScore();

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Результаты теста</Text>
            <Text style={styles.resultScore}>
              Вы ответили правильно на {score} из {questions.length} вопросов
            </Text>
            <Text style={styles.resultPercentage}>
              ({Math.round((score / questions.length) * 100)}%)
            </Text>
            
            <View style={styles.resultDetails}>
              {questions.map((question, index) => (
                <View key={question.id} style={styles.resultQuestion}>
                  <Text style={styles.resultQuestionText}>
                    {index + 1}. {question.question}
                  </Text>
                  <Text style={styles.resultAnswerText}>
                    Ваш ответ: {selectedOptions[index] || 'Нет ответа'}
                  </Text>
                  <Text style={[
                    styles.resultAnswerText,
                    selectedOptions[index] === question.correctAnswer 
                      ? styles.correctAnswer 
                      : styles.wrongAnswer
                  ]}>
                    Правильный ответ: {question.correctAnswer}
                  </Text>
                </View>
              ))}
            </View>
            
            <TouchableOpacity 
              style={styles.restartButton} 
              onPress={restartQuiz}
            >
              <Text style={styles.buttonText}>Пройти тест снова</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.quizContainer}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Вопрос {currentQuestionIndex + 1} из {questions.length}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }
              ]} 
            />
          </View>
        </View>

        <ScrollView style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
          
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionItem}
                onPress={() => handleOptionSelect(option)}
                activeOpacity={0.7}
              >
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    value={selectedOptions[currentQuestionIndex] === option}
                    onValueChange={() => handleOptionSelect(option)}
                    color={selectedOptions[currentQuestionIndex] === option ? '#1E90FF' : undefined}
                    style={styles.checkbox}
                  />
                  <Text style={styles.optionText}>{option}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Navigation buttons with extra bottom padding to avoid tab bar overlap */}
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[
              styles.navButton,
              styles.prevButton,
              currentQuestionIndex === 0 && styles.disabledButton
            ]}
            onPress={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <Text style={styles.buttonText}>Предыдущий</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={handleNextQuestion}
          >
            <Text style={styles.buttonText}>
              {currentQuestionIndex === questions.length - 1 ? 'Завершить' : 'Следующий'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
  },
  quizContainer: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
  },
  progressContainer: {
    marginBottom: 20,
    marginTop: 10,
  },
  progressText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#E0E0E0',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#333333',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1E90FF',
  },
  questionContainer: {
    flex: 1,
    marginBottom: 70,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionItem: {
    marginBottom: 12,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 10,
    borderRadius: 4,
  },
  optionText: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  navButton: {
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  prevButton: {
    backgroundColor: '#333333',
  },
  nextButton: {
    backgroundColor: '#1E90FF',
  },
  disabledButton: {
    backgroundColor: '#2A2A2A',
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },

  // result styles
  resultContainer: {
    flex: 1,
    padding: 20,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#FFFFFF',
  },
  resultScore: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 5,
    color: '#E0E0E0',
  },
  resultPercentage: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#E0E0E0',
  },
  resultDetails: {
    marginBottom: 30,
  },
  resultQuestion: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#333',
  },
  resultQuestionText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#FFFFFF',
  },
  resultAnswerText: {
    fontSize: 15,
    marginBottom: 5,
    color: '#BBBBBB',
  },
  correctAnswer: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  wrongAnswer: {
    color: '#F44336',
    fontWeight: '500',
  },
  restartButton: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});