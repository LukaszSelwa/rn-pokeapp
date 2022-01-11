import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import useOpenPokemonScreen from "../hooks/useOpenPokemonScreen";
import { RootStackParamList } from "../screens/screens";
import { PokemonSpecies } from "../utils/pokeapp";
import {
  capitalizeString,
  getPokemonOfficialArtworkUrl,
} from "../utils/pokemon";

type Props = {
  pokemon: PokemonSpecies;
  rootNavigation: StackNavigationProp<RootStackParamList, "Home">;
};

export default function PokemonListItem({ pokemon, rootNavigation }: Props) {
  const { imageRef, openPokemonScreen } = useOpenPokemonScreen({
    id: pokemon.id,
    rootNavigation,
  });

  return (
    <TouchableHighlight onPress={openPokemonScreen} style={styles.listItem}>
      <View>
        <Image
          ref={(img) => (imageRef.current = img)}
          style={styles.image}
          source={{ uri: getPokemonOfficialArtworkUrl(pokemon) }}
        />
        <Text style={styles.title}>{capitalizeString(pokemon.name)}</Text>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: "#001972",
    padding: 10,
    margin: 3,
    borderRadius: 10,
  },
  image: {
    height: 75,
    aspectRatio: 1,
  },
  title: {
    color: "white",
    fontWeight: "700",
    textAlign: "center",
    width: 75,
  },
});
