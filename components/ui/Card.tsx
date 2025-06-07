import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  borderRadius?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export function Card({ 
  variant = 'default', 
  padding = 'md', 
  borderRadius = 'xl',
  className, 
  children, 
  style,
  ...props 
}: CardProps) {
  const { isDark } = useTheme();

  const getCardStyle = () => {
    const baseStyle: any = {
      borderRadius: getBorderRadius(),
      overflow: 'hidden',
    };
    
    // Background and styling based on variant
    switch (variant) {
      case 'elevated':
        baseStyle.backgroundColor = isDark ? '#1e293b' : '#ffffff';
        baseStyle.shadowColor = '#000';
        baseStyle.shadowOffset = { width: 0, height: 4 };
        baseStyle.shadowOpacity = isDark ? 0.3 : 0.1;
        baseStyle.shadowRadius = 12;
        baseStyle.elevation = 8;
        break;
      case 'outlined':
        baseStyle.backgroundColor = isDark ? '#1e293b' : '#ffffff';
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = isDark ? '#334155' : '#e2e8f0';
        break;
      case 'glass':
        baseStyle.backgroundColor = isDark 
          ? 'rgba(30, 41, 59, 0.8)' 
          : 'rgba(255, 255, 255, 0.8)';
        baseStyle.backdropFilter = 'blur(10px)';
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = isDark 
          ? 'rgba(148, 163, 184, 0.2)' 
          : 'rgba(203, 213, 225, 0.3)';
        baseStyle.shadowColor = '#000';
        baseStyle.shadowOffset = { width: 0, height: 2 };
        baseStyle.shadowOpacity = 0.1;
        baseStyle.shadowRadius = 8;
        baseStyle.elevation = 4;
        break;
      case 'gradient':
        // Will be handled with LinearGradient wrapper
        break;
      default:
        baseStyle.backgroundColor = isDark ? '#1e293b' : '#ffffff';
        baseStyle.shadowColor = '#000';
        baseStyle.shadowOffset = { width: 0, height: 2 };
        baseStyle.shadowOpacity = isDark ? 0.2 : 0.05;
        baseStyle.shadowRadius = 6;
        baseStyle.elevation = 3;
    }
    
    // Padding
    const paddingValue = getPadding();
    if (paddingValue > 0) {
      baseStyle.padding = paddingValue;
    }
    
    return baseStyle;
  };

  const getBorderRadius = () => {
    switch (borderRadius) {
      case 'sm': return 8;
      case 'md': return 12;
      case 'lg': return 16;
      case '2xl': return 24;
      default: return 16; // xl
    }
  };

  const getPadding = () => {
    switch (padding) {
      case 'none': return 0;
      case 'sm': return 12;
      case 'lg': return 24;
      case 'xl': return 32;
      default: return 16; // md
    }
  };

  return (
    <View style={[getCardStyle(), style]} {...props}>
      {children}
    </View>
  );
}
