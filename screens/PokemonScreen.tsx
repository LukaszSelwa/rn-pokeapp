import { StackScreenProps, useCardAnimation } from '@react-navigation/stack';
import React from 'react';
import {
  Button,
  StyleSheet,
  View,
  Animated,
  Dimensions,
  Text,
} from 'react-native';
import usePokemon from '../hooks/data/usePokemon';
import {
  capitalizeString,
  getPokemonOfficialArtworkUrl,
} from '../utils/pokemon';
import { RootStackParamList } from './screens';

type Props = StackScreenProps<RootStackParamList, 'Pokemon'>;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function PokemonScreen({ navigation, route }: Props) {
  const { current } = useCardAnimation();
  const { id, sharedImageMeasure = { width: 0, x: 0, y: 0 } } = route.params;
  const { data } = usePokemon(id);
  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.background,
          {
            opacity: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          },
        ]}
      />
      <Animated.Image
        style={[
          styles.image,
          {
            borderRadius: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [10, 0],
              extrapolate: 'clamp',
            }),
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    (sharedImageMeasure.width - SCREEN_WIDTH) / 2 +
                      sharedImageMeasure.x,
                    0,
                  ],
                  extrapolate: 'clamp',
                }),
              },
              {
                translateY: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    (sharedImageMeasure.width - SCREEN_WIDTH) / 2 +
                      sharedImageMeasure.y,
                    10,
                  ],
                  extrapolate: 'clamp',
                }),
              },
              {
                scale: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [sharedImageMeasure.width / SCREEN_WIDTH, 1],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}
        source={{
          uri: getPokemonOfficialArtworkUrl({ id }),
        }}
      />
      <Animated.View
        style={[
          styles.details,
          {
            transform: [
              {
                translateY: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [SCREEN_HEIGHT, 0],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.title}>
          {String(id).padStart(3, '0')}{' '}
          {data?.pokemon ? capitalizeString(data.pokemon.name) : 'Loading...'}
        </Text>
        <Button title="Go back" onPress={navigation.goBack} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flex: 1,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#001972',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#001972',
  },
  details: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
    padding: 20,
    flexGrow: 1,
  },
  title: {
    color: '#001972',
    fontWeight: '700',
    fontSize: 32,
    padding: 10,
  },
});
