import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useCallback } from 'react';
import { Text, TextInput, TextInputProps, TouchableOpacity, View, StyleSheet } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
}

export function Input(props: InputProps) {
  const { isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  
  const {
    label,
    error,
    leftIcon,
    rightIcon,
    onRightIconPress,
    variant = 'outlined',
    size = 'md',
    onFocus,
    onBlur,
    value,
    ...inputProps
  } = props;

  const handleFocus = useCallback((e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  }, [onFocus]);

  const handleBlur = useCallback((e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  }, [onBlur]);

  const hasValue = Boolean(value && String(value).length > 0);
  const shouldFloatLabel = isFocused || hasValue;

  // Static styles to avoid re-computation
  const containerHeight = size === 'sm' ? 48 : size === 'lg' ? 64 : 56;
  const fontSize = size === 'sm' ? 14 : size === 'lg' ? 18 : 16;
  const iconSize = 20;

  // Base colors
  const textColor = isDark ? '#ffffff' : '#1e293b';
  const placeholderColor = isDark ? '#64748b' : '#94a3b8';
  const labelColor = error ? '#ef4444' : isFocused ? '#0ea5e9' : isDark ? '#94a3b8' : '#64748b';
  const borderColor = error ? '#ef4444' : isFocused ? '#0ea5e9' : isDark ? '#64748b' : '#d1d5db';
  const iconColor = error ? '#ef4444' : isFocused ? '#0ea5e9' : isDark ? '#94a3b8' : '#64748b';

  // Background colors based on variant
  let backgroundColor = 'transparent';
  let actualBorderColor = borderColor;
  
  switch (variant) {
    case 'filled':
      backgroundColor = isDark ? '#334155' : '#f8fafc';
      actualBorderColor = 'transparent';
      break;
    case 'outlined':
      backgroundColor = isDark ? '#1e293b' : '#ffffff';
      break;
  }

  const styles = StyleSheet.create({
    container: {
      marginBottom: 20,
    },
    labelContainer: {
      position: 'relative',
      height: label ? 20 : 0,
      marginBottom: label ? 4 : 0,
    },
    floatingLabel: {
      position: 'absolute',
      left: leftIcon ? 56 : 16,
      top: shouldFloatLabel ? 0 : containerHeight / 2 - 8,
      fontSize: shouldFloatLabel ? 12 : fontSize,
      color: labelColor,
      fontWeight: '500',
      backgroundColor: shouldFloatLabel && variant === 'outlined' ? backgroundColor : 'transparent',
      paddingHorizontal: shouldFloatLabel && variant === 'outlined' ? 4 : 0,
      zIndex: shouldFloatLabel ? 10 : 1,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 16,
      borderWidth: 2,
      borderColor: actualBorderColor,
      backgroundColor: backgroundColor,
      height: containerHeight,
      ...(isFocused && {
        shadowColor: '#0ea5e9',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
      }),
    },
    leftIconContainer: {
      paddingLeft: 16,
      paddingRight: 8,
    },
    textInput: {
      flex: 1,
      color: textColor,
      fontSize: fontSize,
      fontWeight: '500',
      paddingHorizontal: 16,
      paddingVertical: 16,
      textAlignVertical: 'center',
      minHeight: containerHeight - 4,
    },
    rightIconContainer: {
      paddingRight: 16,
      paddingLeft: 8,
    },
    errorText: {
      color: '#ef4444',
      fontSize: 12,
      fontWeight: '500',
      marginTop: 6,
      marginLeft: 4,
    },
  });

  return (
    <View style={styles.container}>
      {/* Label */}
      {/* {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.floatingLabel}>
            {label}
          </Text>
        </View>
      )} */}
      
      {/* Input Container */}
      <View style={styles.inputContainer}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <Ionicons name={leftIcon} size={iconSize} color={iconColor} />
          </View>
        )}
        
        <TextInput
          style={styles.textInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={(!label || !shouldFloatLabel) ? props.placeholder : ''}
          placeholderTextColor={placeholderColor}
          selectionColor={isDark ? '#38bdf8' : '#0ea5e9'}
          value={value}
          blurOnSubmit={true}
          {...inputProps}
        />
        
        {rightIcon && (
          <TouchableOpacity 
            style={styles.rightIconContainer}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            activeOpacity={0.7}
          >
            <Ionicons name={rightIcon} size={iconSize} color={iconColor} />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Error Message */}
      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
}