import React, {
  useCallback,
  useMemo,
  useEffect,
  ReactNode, ReactElement, useState,
} from 'react';
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnUI, AnimatedStyleProp, useDerivedValue, withTiming,
} from 'react-native-reanimated';
import { TouchableRipple, withTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import {ReactNativePaperProps} from "../props/ReactNativePaperProps";
import useLayout from "../hooks/useLayout";

interface AccordionProps extends ReactNativePaperProps {
  children: ReactNode
  title: ReactNode
  left?: ReactElement
  style?: StyleProp<ViewStyle>
}

function Accordion({
                     children,
                     left,
                     title,
                     style,
                     theme,
                   }: AccordionProps): ReactElement {
  const styles = StyleSheet.create({
    wrapper: {
      backgroundColor: theme.colors.surface,
    },
    content: {
      overflow: 'hidden',
    },
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: 20
    },
  });

  const [layout, onLayout] = useLayout(0, 0);
  const [isOpen, setIsOpen] = useState(false);
  const open = useSharedValue(false);

  const handleHeightContent = useMemo(
    () => layout.height,
    [layout.height],
  );

  const size = useSharedValue(handleHeightContent);

  useEffect(() => {
    runOnUI(() => {
      if (handleHeightContent) {
        size.value = handleHeightContent;
      }
    })();
  }, [handleHeightContent, size]);

  useEffect(() => {
    runOnUI(() => {
      if (!handleHeightContent) {
        size.value = handleHeightContent;
      }
    })();
  }, [handleHeightContent, size]);

  const progress = useDerivedValue(() => (open.value ? withTiming(1) : withTiming(0)));

  const animatedStyle = useAnimatedStyle<AnimatedStyleProp<ViewStyle>>(() => ({
    height: size.value * progress.value + 1,
    opacity: progress.value === 0 ? 0 : 1,
  }));

  const openAccordion = useCallback(() => {
    if (size.value === 0) {
      runOnUI(() => {
        size.value = handleHeightContent;
      })();
    }
    open.value = !open.value;
    setIsOpen(b => !b);
  }, [handleHeightContent, open, size]);

  const containerAnimatedStyle = useMemo(
    () => StyleSheet.compose<AnimatedStyleProp<ViewStyle>>(styles.content, animatedStyle),
    [styles.content, animatedStyle],
  );

  const wrapperStyle = useMemo(
    () => StyleSheet.compose<ViewStyle>(styles.wrapper, style),
    [styles.wrapper, style],
  );

  return (
    <View style={wrapperStyle}>
      <TouchableRipple onPress={openAccordion}>
        <View style={styles.header}>
          {left}
          {title}
          <Ionicons name={!isOpen ? 'chevron-down-outline' : 'chevron-up-outline'} size={20} color={theme.colors.text} />
        </View>
      </TouchableRipple>

      <Animated.View style={containerAnimatedStyle}>
        <View onLayout={onLayout} style={styles.container}>
          { children }
        </View>
      </Animated.View>
    </View>
  );
}

export default withTheme(Accordion);
