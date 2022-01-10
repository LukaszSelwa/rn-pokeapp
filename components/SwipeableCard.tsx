import * as React from "react";
import { ReactNode } from "react";
import {
  Dimensions,
  LayoutChangeEvent,
  LayoutRectangle,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type Props = {
  expanded: boolean;
  backCard: ReactNode;
  frontCard: ReactNode;
  onSwiped: (reset: () => void) => void;
};

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_DIMENSIONS = {
  width: SCREEN_WIDTH - 30,
  height: ((SCREEN_WIDTH - 30) * 4) / 3,
};
const INITIAL_POSITION = {
  x: 0,
  y: 0,
};

export default function SwipeableCard({
  frontCard,
  backCard,
  onSwiped,
  expanded,
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
    []
  );

  const eventHandler = useAnimatedGestureHandler(
    {
      onStart: (event, ctx) => {
        pressed.value = true;
      },
      onActive: (event, ctx) => {
        x.value = INITIAL_POSITION.x + event.translationX;
        y.value = INITIAL_POSITION.y + event.translationY;
        backCardDistance.value = Math.abs(event.translationX) / SCREEN_WIDTH;
      },
      onEnd: (event, ctx) => {
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
    [expanded, onSwiped]
  );

  const animatedStyleContainer = useAnimatedStyle(
    () => ({
      width: withTiming(
        expanded
          ? containerLayout.current?.width ?? CARD_DIMENSIONS.width
          : CARD_DIMENSIONS.width
      ),
      height: withTiming(
        expanded
          ? containerLayout.current?.height ?? CARD_DIMENSIONS.height
          : CARD_DIMENSIONS.height
      ),
    }),
    [expanded]
  );

  const animatedStyleFrontCard = useAnimatedStyle(
    () => ({
      borderRadius: withTiming(expanded ? 0 : 15),
      transform: [
        { translateX: x.value },
        { translateY: y.value },
        {
          rotateZ: `${((x.value - INITIAL_POSITION.x) * 30) / SCREEN_WIDTH}deg`,
        },
        { scale: withSpring(pressed.value ? 1.05 : 1) },
      ],
    }),
    [expanded]
  );

  const animatedStyleBackCard = useAnimatedStyle(() => {
    return {
      borderRadius: 15,
      opacity: interpolate(
        backCardDistance.value,
        [0, 1],
        [0.9, 1],
        Extrapolate.CLAMP
      ),
      transform: [
        {
          scale: interpolate(
            backCardDistance.value,
            [0, 1],
            [0.8, 1],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <View style={styles.container} onLayout={handleUpdateContainerLayout}>
      <Animated.View style={[styles.cardContainer, animatedStyleContainer]}>
        <Animated.View style={[styles.card, animatedStyleBackCard]}>
          {backCard}
        </Animated.View>
        <PanGestureHandler onGestureEvent={eventHandler} enabled={!expanded}>
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
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    position: "relative",
  },
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    shadowColor: "#000",
  },
});
