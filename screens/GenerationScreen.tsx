import * as React from "react";
import { InteractionManager } from "react-native";
import CardContent from "../components/CardContent";
import SwipeableCard from "../components/SwipeableCard";
import useGenerationSpecies from "../hooks/data/useGenerationSpecies";
import useStateCallback from "../hooks/useStateCallback";
import LoadingScreen from "./LoadingScreen";

type Props = {
  generationId: number;
  generation: string;
};

export default function GenerationScreen({ generationId }: Props) {
  const { loading, data } = useGenerationSpecies(generationId);
  const [expanded, setExpanded] = React.useState(false);
  const [index, setIndex] = useStateCallback<number>(0);
  const [nextIndex, setNextIndex] = React.useState<number>(1);
  const speciesIds = React.useMemo(
    () =>
      data?.generationSpecies.map(({ id }) => id).sort((a, b) => a - b) || [],
    [data]
  );
  const onSwiped = (resetFrontCard: () => void) =>
    setIndex(
      (prev) => (prev + 1) % speciesIds.length,
      (state) => {
        resetFrontCard();
        setNextIndex((state + 1) % speciesIds.length);
      }
    );
  const toggleExpanded = React.useCallback(
    () => setExpanded((prev) => !prev),
    []
  );

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <SwipeableCard
      expanded={expanded}
      onSwiped={onSwiped}
      frontCard={
        <CardContent
          key={index}
          id={speciesIds[index]}
          expanded={expanded}
          onExpandClick={toggleExpanded}
        />
      }
      backCard={<CardContent id={speciesIds[nextIndex]} expanded={false} />}
    />
  );
}
