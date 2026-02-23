import {BlurView} from '@react-native-community/blur';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import {Modal, Pressable, useWindowDimensions} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {styles} from './styles';
import {SheetRef} from './types';

type SheetProps = {
  children?: React.ReactNode;
  onHide?: () => void;
};

const Sheet = forwardRef<SheetRef, SheetProps>(({children, onHide}, ref) => {
  //* Local State
  const {height} = useWindowDimensions();
  const [visible, setVisible] = useState(false);
  const [disableClose, setDisableClose] = useState(false);
  const [showBlur, setShowBlur] = useState(false);

  //* Gesture and Animation Variables
  let translateY = useSharedValue(0);
  const context = useSharedValue({y: 0});
  const disableCloseShared = useSharedValue(false);
  const contentOpacity = useSharedValue(0);

  //* Snap points configuration as shared values
  const snapClosed = useSharedValue(height);
  const snapOpen = useSharedValue(0);
  const snapThreshold = useSharedValue(height * 0.3);

  //* Stable callback functions
  const hideSheet = useCallback(() => {
    // eslint-disable-next-line react-compiler/react-compiler
    contentOpacity.value = 0;
    setShowBlur(false);
    setVisible(false);
    onHide?.();
  }, [onHide, contentOpacity]);

  const closeModal = useCallback(() => {
    // Just hide immediately without animation from JS thread
    hideSheet();
  }, [hideSheet]);

  //* Enhanced gesture handler with proper snap points using new Gesture API
  const panGesture = Gesture.Pan()
    .onStart(() => {
      'worklet';
      // Store the starting position when gesture begins
      context.value = {y: translateY.value};
    })
    .onUpdate(event => {
      'worklet';
      if (disableCloseShared.value) return;

      // Allow dragging in both directions but with constraints
      const newTranslateY = context.value.y + event.translationY;

      if (newTranslateY < 0) {
        // Add resistance when trying to drag above
        translateY.value = newTranslateY * 0.1;
      } else {
        translateY.value = newTranslateY;
      }
    })
    .onEnd(event => {
      'worklet';
      if (disableCloseShared.value) {
        translateY.value = withSpring(snapOpen.value, {
          damping: 10,
          stiffness: 500,
        });
        return;
      }

      const {velocityY} = event;
      const finalPosition = translateY.value + velocityY * 0.1;
      if (finalPosition > snapThreshold.value || velocityY > 300) {
        // Use withTiming for fast, predictable close animation
        translateY.value = withTiming(
          snapClosed.value,
          {duration: 200},
          finished => {
            'worklet';
            if (finished) {
              runOnJS(hideSheet)();
            }
          },
        );
      } else {
        translateY.value = withSpring(snapOpen.value, {
          damping: 45,
          stiffness: 500,
        });
      }
    });

  //* Animated styles with backdrop opacity
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
      opacity: contentOpacity.value,
    };
  });

  const backdropStyle = useAnimatedStyle(() => {
    const opacityValue = interpolate(
      translateY.value,
      [0, snapClosed.value],
      [0.5, 0],
      Extrapolate.CLAMP,
    );

    return {
      opacity: opacityValue,
    };
  });

  //* Ref Imperative Functions
  useImperativeHandle(
    ref,
    () => ({
      show: props => {
        const shouldDisableClose = !!props?.disablePanGestureHandler;
        setDisableClose(shouldDisableClose);
        disableCloseShared.value = shouldDisableClose;
        setShowBlur(!!props?.blur);

        // Set to open position immediately without animation
        translateY.value = snapOpen.value;
        setVisible(true);
        contentOpacity.value = withDelay(50, withTiming(1, {duration: 1}));
        // contentOpacity.value = withDelay(100, withTiming(1, {duration: 1}));
      },
      hide: closeModal,
    }),
    [closeModal, disableCloseShared, snapOpen, translateY, contentOpacity],
  );

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={() => !disableClose && closeModal()}
      statusBarTranslucent>
      <GestureHandlerRootView style={styles.overlay}>
        {/* Blur or Animated backdrop */}
        {showBlur ? (
          <BlurView
            style={styles.blurBackdrop}
            blurType={'dark'}
            blurAmount={1}
          />
        ) : (
          <Animated.View style={[styles.backdrop, backdropStyle]} />
        )}

        {/* Backdrop pressable */}
        <Pressable
          style={styles.backdropPressable}
          onPress={() => !disableClose && closeModal()}
        />

        {/* Sheet container */}
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[styles.contentWrapper, animatedStyle]}
            pointerEvents="box-none">
            {children}
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
});

export default Sheet;
