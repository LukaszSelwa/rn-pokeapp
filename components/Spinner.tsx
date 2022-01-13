import React, { useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import pokeball from '../assets/pokeball.png';
import pokeballWhite from '../assets/pokeball-white.png';

type Props = {
  color?: 'blue' | 'white';
};

export default function Spinner({ color = 'blue' }: Props) {
  const angle = useSharedValue(0);
  const scale = useSharedValue(0.9);
  useEffect(() => {
    angle.value = withRepeat(withTiming(360, { duration: 1000 }), -1);
    scale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 500 }),
        withTiming(0.9, { duration: 500 }),
      ),
      -1,
    );
  }, [angle, scale]);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${angle.value}deg` }, { scale: scale.value }],
  }));
  return (
    <Animated.View style={[styles.animatedView, animatedStyle]}>
      <Image
        style={styles.image}
        source={color === 'blue' ? pokeball : pokeballWhite}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedView: {
    alignSelf: 'center',
  },
  image: {
    width: 75,
    height: 75,
  },
});
