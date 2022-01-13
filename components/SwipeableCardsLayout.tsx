import * as React from 'react';
import { ReactNode } from 'react';
import {
  Dimensions,
  LayoutChangeEvent,
  LayoutRectangle,
  StyleSheet,
  View,
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  backCard: ReactNode;
  frontCard: ReactNode;
  onSwiped: (reset: () => void) => void;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_DIMENSIONS = {
  width: SCREEN_WIDTH - 30,
  height: ((SCREEN_WIDTH - 30) * 4) / 3,
};
const INITIAL_POSITION = {
  x: 0,
  y: 0,
};

export default function SwipeableCardsLayout({
  frontCard,
  backCard,
  onSwiped,
}: Props) {
  const pressed = useSharedValue(false);
  const x = useSharedValue(INITIAL_POSITION.x);
  const y = useSharedValue(INITIAL_POSITION.y);
  const backCardDistance = useSharedValue(0);
  const containerLayout = React.useRef<LayoutRectangle>();

  const handleSwiped = () => {
    onSwiped(() => {
      x.value = 0;
      y.value = 0;
    });
  };

  const handleUpdateContainerLayout = React.useCallback(
    ({ nativeEvent }: LayoutChangeEvent) => {
      containerLayout.current = nativeEvent.layout;
    },
    [],
  );

  const eventHandler = useAnimatedGestureHandler(
    {
      onStart: () => {
        pressed.value = true;
      },
      onActive: (event) => {
        x.value = INITIAL_POSITION.x + event.translationX;
        y.value = INITIAL_POSITION.y + event.translationY;
        backCardDistance.value = Math.abs(event.translationX) / SCREEN_WIDTH;
      },
      onEnd: (event) => {
        pressed.value = false;
        if (Math.abs(event.translationX) > 120) {
          const outsideX =
            Math.sign(event.translationX) *
            (SCREEN_WIDTH + CARD_DIMENSIONS.width);
          x.value = withTiming(outsideX, {}, () => {
            runOnJS(handleSwiped)();
          });
          backCardDistance.value = withTiming(1);
        } else {
          x.value = withSpring(INITIAL_POSITION.x);
          y.value = withSpring(INITIAL_POSITION.y);
          backCardDistance.value = withSpring(0);
        }
      },
      onCancel: () => {
        pressed.value = false;
      },
      onFinish: () => {
        pressed.value = false;
      },
    },
    [onSwiped],
  );

  const animatedStyleFrontCard = useAnimatedStyle(
    () => ({
      transform: [
        { translateX: x.value },
        { translateY: y.value },
        {
          rotateZ: `${((x.value - INITIAL_POSITION.x) * 30) / SCREEN_WIDTH}deg`,
        },
        { scale: withSpring(pressed.value ? 1.05 : 1) },
      ],
    }),
    [],
  );

  const animatedStyleBackCard = useAnimatedStyle(() => {
    return {
      borderRadius: 15,
      opacity: interpolate(
        backCardDistance.value,
        [0, 1],
        [0.9, 1],
        Extrapolate.CLAMP,
      ),
      transform: [
        {
          scale: interpolate(
            backCardDistance.value,
            [0, 1],
            [0.8, 1],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <View style={styles.container} onLayout={handleUpdateContainerLayout}>
      <Animated.View style={[styles.cardContainer]}>
        <Animated.View style={[styles.card, animatedStyleBackCard]}>
          {backCard}
        </Animated.View>
        <PanGestureHandler onGestureEvent={eventHandler}>
          <Animated.View style={[styles.card, animatedStyleFrontCard]}>
            {frontCard}
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cardContainer: {
    width: '100%',
    aspectRatio: 2 / 3,
    position: 'relative',
  },
  card: {
    borderRadius: 15,
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    shadowColor: '#000',
  },
});
