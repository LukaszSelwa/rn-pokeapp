import { DrawerScreenProps } from '@react-navigation/drawer';
import * as React from 'react';
import CardContent from '../../components/CardContent';
import SwipeableCardsLayout from '../../components/SwipeableCardsLayout';
import useGenerationSpecies from '../../hooks/data/useGenerationSpecies';
import useStateCallback from '../../hooks/useStateCallback';
import { GenerationIds } from '../../utils/pokeapp';
import LoadingScreen from '../LoadingScreen';
import { HomeDrawerParamList } from './screens';

type Props = DrawerScreenProps<
  HomeDrawerParamList,
  `Generation${GenerationIds}`
>;

export default function GenerationScreen({ route }: Props) {
  const { generationId } = route.params;
  const { loading, data } = useGenerationSpecies(generationId);
  const [index, setIndex] = useStateCallback<number>(0);
  const [nextIndex, setNextIndex] = React.useState<number>(1);
  const speciesIds = React.useMemo(
    () =>
      data?.generationSpecies.map(({ id }) => id).sort((a, b) => a - b) || [],
    [data],
  );
  const onSwiped = (resetFrontCard: () => void) =>
    setIndex(
      (prev) => (prev + 1) % speciesIds.length,
      (state) => {
        resetFrontCard();
        setNextIndex((state + 1) % speciesIds.length);
      },
    );

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <SwipeableCardsLayout
      onSwiped={onSwiped}
      frontCard={<CardContent key={index} id={speciesIds[index]} />}
      backCard={<CardContent id={speciesIds[nextIndex]} />}
    />
  );
}
