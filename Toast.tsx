import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import styles from './toastStyles';

const TOAST_DURATION_MS = 3000;
const SLIDE_DURATION_MS = 300;

type Props = {
  value: any;
  visible?: boolean;
  onDismiss?: () => void;
};

const Toast = (props: Props) => {
  const {value, visible = true, onDismiss} = props;
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!visible) return;

    // Start from bottom (off-screen)
    translateY.value = 100;
    opacity.value = 0;

    // Slide up from bottom to top
    translateY.value = withTiming(0, {duration: SLIDE_DURATION_MS});
    opacity.value = withTiming(1, {duration: SLIDE_DURATION_MS});

    // Dismiss after 3 seconds - slide back down
    const dismissTimeout = setTimeout(() => {
      translateY.value = withTiming(
        100,
        {duration: SLIDE_DURATION_MS},
        finished => {
          if (finished && onDismiss) {
            runOnJS(onDismiss)();
          }
        },
      );
      opacity.value = withTiming(0, {duration: SLIDE_DURATION_MS});
    }, TOAST_DURATION_MS);

    return () => clearTimeout(dismissTimeout);
  }, [visible, value, onDismiss, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Animated.View style={[styles.toastWrapper, animatedStyle]}>
        <View style={styles.content}>
          <Text
            style={
              styles.message
            }>{`No component found for sheet type : ${value}`}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

export default Toast;
