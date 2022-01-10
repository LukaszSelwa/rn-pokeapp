import {
  GestureResponderEvent,
  Image,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Feather } from "@expo/vector-icons";
import {
  capitalizeString,
  getPokemonOfficialArtworkUrl,
} from "../utils/pokemon";
import usePokemon from "../hooks/data/usePokemon";
import LoadableImage from "./LoadableImage";

type Props = {
  id: number;
  expanded: boolean;
  onExpandClick?: () => void;
};

type MappedEvolution = {
  id: number;
  name: string;
  imageUrl: string;
};

export default function CardContent({ id, onExpandClick, expanded }: Props) {
  const [evolutionIdx, setEvolutionIdx] = useState(0);
  const cardWidth = useRef(0);
  useEffect(() => {
    setEvolutionIdx(0);
  }, [id]);

  const { loading, data, error } = usePokemon(id);

  const evolutions = useMemo(
    () =>
      data?.pokemon?.evolutions.species
        .map(
          (evolution): MappedEvolution => ({
            id: evolution.id,
            name: evolution.name,
            imageUrl: getPokemonOfficialArtworkUrl(evolution),
          })
        )
        .sort((a, b) => a.id - b.id) || [],
    [data]
  );

  const handlePress = useCallback(
    ({ nativeEvent }: GestureResponderEvent) => {
      if (nativeEvent.locationX > cardWidth.current / 2) {
        setEvolutionIdx((prev) => Math.min(prev + 1, evolutions.length - 1));
      } else {
        setEvolutionIdx((prev) => Math.max(prev - 1, 0));
      }
    },
    [evolutions]
  );
  const updateCardLayout = useCallback((event: LayoutChangeEvent) => {
    cardWidth.current = event.nativeEvent.layout.width;
  }, []);

  const pokemon: MappedEvolution | undefined = evolutions[evolutionIdx];
  return (
    <View onLayout={updateCardLayout} style={styles.container}>
      <TouchableWithoutFeedback onPress={handlePress}>
        <View>
          <LoadableImage uri={pokemon?.imageUrl} />
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.bar}>
        {pokemon && (
          <Text style={styles.barTitle}>
            {String(pokemon.id).padStart(3, "0")}{" "}
            {capitalizeString(pokemon.name)}
          </Text>
        )}
        {loading && <Text style={styles.barTitle}>Loading...</Text>}
        {error && <Text>ERROR</Text>}
      </View>
      <TouchableHighlight
        onPress={onExpandClick}
        style={styles.infoButton}
        underlayColor="#001972"
        activeOpacity={0.4}
      >
        <Feather name={expanded ? "x" : "info"} size={28} color="#001972" />
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  },
  bar: {
    height: 75,
    backgroundColor: "white",
    flexGrow: 1,
  },
  barTitle: {
    color: "#001972",
    fontWeight: "700",
    fontSize: 32,
    padding: 10,
  },
  infoButton: {
    position: "absolute",
    top: 13,
    right: 13,
    backgroundColor: "white",
    width: 36,
    height: 36,
    borderRadius: 18,
    shadowColor: "black",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    justifyContent: "center",
    alignItems: "center",
  },
});
