import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Animated, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

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
  const [animatedValue] = useState(new Animated.Value(props.value ? 1 : 0));
  
  const {
    label,
    error,
    leftIcon,
    rightIcon,
    onRightIconPress,
    variant = 'outlined',
    size = 'md',
    style,
    onFocus,
    onBlur,
    ...inputProps
  } = props;

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (label) {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    if (props.onFocus) {
      props.onFocus(e);
    }
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (!props.value && label) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  const getContainerStyle = () => {
    const baseStyle: any = {
      marginBottom: 20,
      position: 'relative',
    };

    switch (size) {
      case 'sm':
        baseStyle.height = 48;
        break;
      case 'lg':
        baseStyle.height = 64;
        break;
      default:
        baseStyle.height = 56;
    }

    return baseStyle;
  };

  const getInputContainerStyle = () => {
    const baseStyle: any = {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 16,
      borderWidth: 2,
      height: '100%',
    };

    // Variant styles
    switch (variant) {
      case 'filled':
        baseStyle.backgroundColor = isDark ? '#334155' : '#f8fafc';
        baseStyle.borderColor = 'transparent';
        break;
      case 'outlined':
        baseStyle.backgroundColor = isDark ? '#1e293b' : '#ffffff';
        baseStyle.borderColor = error 
          ? '#ef4444' 
          : isFocused 
            ? '#0ea5e9' 
            : isDark ? '#475569' : '#e2e8f0';
        break;
      default:
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderColor = error 
          ? '#ef4444' 
          : isFocused 
            ? '#0ea5e9' 
            : isDark ? '#475569' : '#cbd5e1';
    }

    if (isFocused) {
      baseStyle.shadowColor = '#0ea5e9';
      baseStyle.shadowOffset = { width: 0, height: 0 };
      baseStyle.shadowOpacity = 0.2;
      baseStyle.shadowRadius = 8;
      baseStyle.elevation = 4;
    }

    return baseStyle;
  };

  const getInputStyle = () => {
    const baseStyle: any = {
      flex: 1,
      color: isDark ? '#ffffff' : '#1e293b',
      fontSize: size === 'sm' ? 14 : size === 'lg' ? 18 : 16,
      fontWeight: '500',
      paddingHorizontal: 16,
      paddingTop: label ? 24 : 16,
      paddingBottom: label ? 8 : 16,
      minHeight: 56,
    };

    return baseStyle;
  };

  const getLabelStyle = () => {
    return {
      position: 'absolute' as const,
      left: leftIcon ? 56 : 16,
      fontSize: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [16, 12],
      }),
      top: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 8],
      }),
      color: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [
          'transparent', // Hide label when not focused/filled
          error ? '#ef4444' : isFocused ? '#0ea5e9' : isDark ? '#94a3b8' : '#64748b'
        ],
      }),
      fontWeight: '500' as const,
      zIndex: 1,
      backgroundColor: isDark ? '#0f172a' : '#ffffff',
      paddingHorizontal: 4,
    };
  };

  const iconColor = error 
    ? '#ef4444' 
    : isFocused 
      ? '#0ea5e9' 
      : isDark ? '#94a3b8' : '#64748b';

  return (
    <View style={getContainerStyle()}>
      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <View style={{ paddingLeft: 16, paddingRight: 8 }}>
            <Ionicons name={leftIcon} size={20} color={iconColor} />
          </View>
        )}
        
        <View style={{ flex: 1, position: 'relative' }}>
          {label && (
            <Animated.Text style={getLabelStyle()}>
              {label}
            </Animated.Text>
          )}
          
          <TextInput
            style={getInputStyle()}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={label && (isFocused || props.value) ? '' : props.placeholder}
            placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
            selectionColor={isDark ? '#38bdf8' : '#0ea5e9'}
            blurOnSubmit={false}
            {...inputProps}
          />
        </View>
        
        {rightIcon && (
          <TouchableOpacity 
            style={{ paddingRight: 16, paddingLeft: 8 }}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            <Ionicons name={rightIcon} size={20} color={iconColor} />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={{
          color: '#ef4444',
          fontSize: 12,
          fontWeight: '500',
          marginTop: 6,
          marginLeft: 4,
        }}>
          {error}
        </Text>
      )}
    </View>
  );
}
