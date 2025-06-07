import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  className,
}: ButtonProps) {
  const { isDark } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    };

    // Size styles
    switch (size) {
      case 'sm':
        baseStyle.paddingHorizontal = 16;
        baseStyle.paddingVertical = 10;
        break;
      case 'lg':
        baseStyle.paddingHorizontal = 32;
        baseStyle.paddingVertical = 18;
        break;
      case 'xl':
        baseStyle.paddingHorizontal = 40;
        baseStyle.paddingVertical = 20;
        break;
      default:
        baseStyle.paddingHorizontal = 24;
        baseStyle.paddingVertical = 14;
    }

    // Variant styles
    switch (variant) {
      case 'primary':
      case 'gradient':
        baseStyle.backgroundColor = isDark ? '#0ea5e9' : '#0284c7';
        baseStyle.shadowColor = '#0ea5e9';
        baseStyle.shadowOpacity = 0.25;
        break;
      case 'secondary':
        baseStyle.backgroundColor = isDark ? '#334155' : '#f1f5f9';
        baseStyle.shadowOpacity = 0.1;
        break;
      case 'outline':
        baseStyle.borderWidth = 2;
        baseStyle.borderColor = isDark ? '#0ea5e9' : '#0284c7';
        baseStyle.backgroundColor = 'transparent';
        baseStyle.shadowOpacity = 0;
        break;
      case 'ghost':
        baseStyle.backgroundColor = isDark ? 'rgba(14, 165, 233, 0.1)' : 'rgba(2, 132, 199, 0.05)';
        baseStyle.shadowOpacity = 0;
        break;
    }

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    if (disabled || loading) {
      baseStyle.opacity = 0.6;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
      letterSpacing: 0.5,
    };

    // Size styles
    switch (size) {
      case 'sm':
        baseStyle.fontSize = 14;
        break;
      case 'lg':
        baseStyle.fontSize = 18;
        break;
      case 'xl':
        baseStyle.fontSize = 20;
        break;
      default:
        baseStyle.fontSize = 16;
    }

    // Variant text colors
    switch (variant) {
      case 'primary':
      case 'gradient':
        baseStyle.color = '#ffffff';
        break;
      case 'secondary':
        baseStyle.color = isDark ? '#ffffff' : '#1e293b';
        break;
      case 'outline':
      case 'ghost':
        baseStyle.color = isDark ? '#38bdf8' : '#0284c7';
        break;
    }

    return baseStyle;
  };

  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' || variant === 'gradient' ? 'white' : (isDark ? '#38bdf8' : '#0284c7')} 
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text style={[
            getTextStyle(), 
            textStyle, 
            leftIcon && { marginLeft: 8 }, 
            rightIcon && { marginRight: 8 }
          ]}>
            {title}
          </Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </>
  );

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}
