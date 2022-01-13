import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useRef } from 'react';
import { Image } from 'react-native';
import { RootStackParamList } from '../screens/screens';

type HomeScreenNavigationProps = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

export default function useOpenPokemonScreen(id: number) {
  const imageRef = useRef<Image | null>();
  const navigation = useNavigation<HomeScreenNavigationProps>();
  const openPokemonScreen = useCallback(() => {
    try {
      imageRef.current?.measure((_x, _y, width, _height, pageX, pageY) => {
        navigation.navigate('Pokemon', {
          id,
          sharedImageMeasure: { width, x: pageX, y: pageY },
        });
      });
    } catch (err) {
      navigation.navigate('Pokemon', { id });
    }
  }, [id, navigation]);
  return {
    imageRef,
    openPokemonScreen,
  };
}
