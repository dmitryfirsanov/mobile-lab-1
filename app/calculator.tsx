import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function CalculatorScreen() {
  const [displayExpression, setDisplayExpression] = useState<string>('0');
  const [historyExpression, setHistoryExpression] = useState<string>('');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState<boolean>(false);
  const [calculationDone, setCalculationDone] = useState<boolean>(false);
  const [fullExpression, setFullExpression] = useState<string>('');

  const clearDisplay = (): void => {
    setDisplayExpression('0');
    setHistoryExpression('');
    setFirstOperand(null);
    setOperation(null);
    setWaitingForSecondOperand(false);
    setCalculationDone(false);
    setFullExpression('');
  };

  const inputDigit = (digit: number): void => {
    if (calculationDone) {
      setDisplayExpression(String(digit));
      setFullExpression(String(digit));
      setHistoryExpression('');
      setCalculationDone(false);
      return;
    }
    
    if (waitingForSecondOperand) {
      setDisplayExpression(String(digit));
      setFullExpression(fullExpression + String(digit));
      setWaitingForSecondOperand(false);
    } else {
      const newDisplay = displayExpression === '0' ? String(digit) : displayExpression + digit;
      setDisplayExpression(newDisplay);
      
      if (operation && firstOperand !== null) {
        setFullExpression(String(firstOperand) + ' ' + operation + ' ' + newDisplay);
      } else {
        setFullExpression(newDisplay);
      }
    }
  };

  const inputDecimal = (): void => {
    if (calculationDone) {
      setDisplayExpression('0.');
      setFullExpression('0.');
      setHistoryExpression('');
      setCalculationDone(false);
      return;
    }
    
    if (waitingForSecondOperand) {
      setDisplayExpression('0.');
      setFullExpression(fullExpression + '0.');
      setWaitingForSecondOperand(false);
      return;
    }

    if (displayExpression.indexOf('.') === -1) {
      const newDisplay = displayExpression + '.';
      setDisplayExpression(newDisplay);
      
      if (operation && firstOperand !== null) {
        setFullExpression(String(firstOperand) + ' ' + operation + ' ' + newDisplay);
      } else {
        setFullExpression(newDisplay);
      }
    }
  };

  const handleOperator = (nextOperator: string): void => {
    if (calculationDone) {
      setFirstOperand(parseFloat(displayExpression));
      setOperation(nextOperator);
      setFullExpression(displayExpression + ' ' + nextOperator + ' ');
      setWaitingForSecondOperand(true);
      setCalculationDone(false);
      setHistoryExpression('');
      return;
    }

    const inputValue = parseFloat(displayExpression);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
      setOperation(nextOperator);
      setFullExpression(displayExpression + ' ' + nextOperator + ' ');
      setWaitingForSecondOperand(true);
    } else if (operation) {
      if (waitingForSecondOperand) {
        setOperation(nextOperator);
        setFullExpression(fullExpression.substring(0, fullExpression.length - 2) + nextOperator + ' ');
      } else {
        const result = performCalculation();
        const resultStr = formatResultForDisplay(result);
        
        setHistoryExpression(fullExpression + ' = ' + resultStr);
        setDisplayExpression(resultStr);
        setFullExpression(resultStr + ' ' + nextOperator + ' ');
        setFirstOperand(result);
        setOperation(nextOperator);
        setWaitingForSecondOperand(true);
      }
    }
  };

  const formatResultForDisplay = (result: number): string => {
    if (Number.isInteger(result)) {
      return String(result);
    }
    
    return result.toFixed(10).replace(/\.?0+$/, '');
  };

  const performCalculation = (): number => {
    const inputValue = parseFloat(displayExpression);

    if (operation === '+') {
      return firstOperand! + inputValue;
    } else if (operation === '-') {
      return firstOperand! - inputValue;
    } else if (operation === '×') {
      return firstOperand! * inputValue;
    } else if (operation === '÷') {
      return firstOperand! / inputValue;
    } else if (operation === '^') {
      return Math.pow(firstOperand!, inputValue);
    }

    return inputValue;
  };

  const calculateSquareRoot = (): void => {
    const inputValue = parseFloat(displayExpression);
    const result = Math.sqrt(inputValue);
    const resultStr = formatResultForDisplay(result);
    
    setHistoryExpression('√(' + displayExpression + ') = ' + resultStr);
    setDisplayExpression(resultStr);
    setFullExpression('');
    setFirstOperand(null);
    setOperation(null);
    setWaitingForSecondOperand(false);
    setCalculationDone(true);
  };

  const toggleSign = (): void => {
    const newValue = parseFloat(displayExpression) * -1;
    setDisplayExpression(String(newValue));
    
    if (operation && firstOperand !== null && !waitingForSecondOperand) {
      setFullExpression(String(firstOperand) + ' ' + operation + ' ' + newValue);
    } else if (!operation) {
      setFullExpression(String(newValue));
    }
  };

  const calculatePercentage = (): void => {
    if (firstOperand !== null && operation) {
      let percentValue;
      if (operation === '+' || operation === '-') {
        percentValue = firstOperand * parseFloat(displayExpression) / 100;
      } else {
        percentValue = parseFloat(displayExpression) / 100;
      }
      
      setDisplayExpression(String(percentValue));
      setFullExpression(String(firstOperand) + ' ' + operation + ' ' + percentValue);
    } else {
      const result = parseFloat(displayExpression) / 100;
      setDisplayExpression(String(result));
      setHistoryExpression(displayExpression + '% = ' + result);
      setFullExpression('');
      setCalculationDone(true);
    }
  };

  const handleEquals = (): void => {
    if (!operation || firstOperand === null) return;
    if (waitingForSecondOperand) return;

    const secondOperand = displayExpression;
    const result = performCalculation();
    const resultStr = formatResultForDisplay(result);
    
    setHistoryExpression(fullExpression + ' = ' + resultStr);
    setDisplayExpression(resultStr);
    setFullExpression('');
    setFirstOperand(null);
    setOperation(null);
    setWaitingForSecondOperand(false);
    setCalculationDone(true);
  };

  const formatDisplayValue = (value: string): string => {
    if (value === '' || value === '0') return '0';
    
    let isNegative = false;
    let valueToFormat = value;
    
    if (value.startsWith('-')) {
      isNegative = true;
      valueToFormat = value.substring(1);
    }
    
    if (valueToFormat.includes('.')) {
      const [integerPart, decimalPart] = valueToFormat.split('.');
      
      let formattedIntegerPart;
      if (integerPart === '') {
        formattedIntegerPart = '0';
      } else {
        formattedIntegerPart = Number(integerPart).toLocaleString('ru-RU');
      }
      
      return (isNegative ? '-' : '') + formattedIntegerPart + ',' + decimalPart;
    }

    return (isNegative ? '-' : '') + Number(valueToFormat).toLocaleString('ru-RU');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.calculatorContainer}>
        <View style={styles.displayContainer}>
          <Text 
            style={styles.historyDisplay}
            adjustsFontSizeToFit
            numberOfLines={1}
          >
            {historyExpression || (calculationDone ? '' : fullExpression)}
          </Text>
          <Text 
            style={styles.mainDisplay}
            adjustsFontSizeToFit
            numberOfLines={1}
          >
            {formatDisplayValue(displayExpression)}
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.buttonLight} onPress={clearDisplay}>
            <Text style={styles.buttonTextLight}>{firstOperand !== null || displayExpression !== '0' ? 'C' : 'AC'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonLight} onPress={toggleSign}>
            <Text style={styles.buttonTextLight}>+/-</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonLight} onPress={calculatePercentage}>
            <Text style={styles.buttonTextLight}>%</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.operationButton, operation === '÷' && !waitingForSecondOperand ? styles.activeOperation : null]} 
            onPress={() => handleOperator('÷')}
          >
            <Text style={styles.buttonTextOperation}>÷</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.buttonDark} onPress={() => inputDigit(7)}>
            <Text style={styles.buttonText}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonDark} onPress={() => inputDigit(8)}>
            <Text style={styles.buttonText}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonDark} onPress={() => inputDigit(9)}>
            <Text style={styles.buttonText}>9</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.operationButton, operation === '×' && !waitingForSecondOperand ? styles.activeOperation : null]} 
            onPress={() => handleOperator('×')}
          >
            <Text style={styles.buttonTextOperation}>×</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.buttonDark} onPress={() => inputDigit(4)}>
            <Text style={styles.buttonText}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonDark} onPress={() => inputDigit(5)}>
            <Text style={styles.buttonText}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonDark} onPress={() => inputDigit(6)}>
            <Text style={styles.buttonText}>6</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.operationButton, operation === '-' && !waitingForSecondOperand ? styles.activeOperation : null]} 
            onPress={() => handleOperator('-')}
          >
            <Text style={styles.buttonTextOperation}>-</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.buttonDark} onPress={() => inputDigit(1)}>
            <Text style={styles.buttonText}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonDark} onPress={() => inputDigit(2)}>
            <Text style={styles.buttonText}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonDark} onPress={() => inputDigit(3)}>
            <Text style={styles.buttonText}>3</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.operationButton, operation === '+' && !waitingForSecondOperand ? styles.activeOperation : null]} 
            onPress={() => handleOperator('+')}
          >
            <Text style={styles.buttonTextOperation}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.buttonZero} onPress={() => inputDigit(0)}>
            <Text style={styles.buttonText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonDark} onPress={inputDecimal}>
            <Text style={styles.buttonText}>,</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.operationButton, operation === '^' && !waitingForSecondOperand ? styles.activeOperation : null]} 
            onPress={() => handleOperator('^')}
          >
            <Text style={styles.buttonTextOperation}>xʸ</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.buttonDark} onPress={calculateSquareRoot}>
            <Text style={styles.buttonText}>√</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.equalsButton} onPress={handleEquals}>
            <Text style={styles.buttonTextEquals}>=</Text>
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
  calculatorContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  displayContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 16,
    marginBottom: 16,
    height: 140,
  },
  historyDisplay: {
    fontSize: 24,
    color: '#999999',
    textAlign: 'right',
    width: '100%',
    marginBottom: 10,
  },
  mainDisplay: {
    fontSize: 70,
    color: '#FFFFFF',
    textAlign: 'right',
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  buttonDark: {
    backgroundColor: '#333333',
    borderRadius: 50,
    width: '22%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLight: {
    backgroundColor: '#A5A5A5',
    borderRadius: 50,
    width: '22%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonZero: {
    backgroundColor: '#333333',
    borderRadius: 50,
    width: '47%',
    aspectRatio: 2.1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: '11%',
  },
  operationButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 50,
    width: '22%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeOperation: {
    backgroundColor: '#64B5F6',
  },
  equalsButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 50,
    width: '73%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  buttonTextLight: {
    fontSize: 28,
    color: '#000000',
    fontWeight: '500',
  },
  buttonTextOperation: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  buttonTextEquals: {
    fontSize: 40,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});