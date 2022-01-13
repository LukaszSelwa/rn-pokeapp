import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import useOpenPokemonScreen from '../hooks/useOpenPokemonScreen';
import {
  capitalizeString,
  getPokemonOfficialArtworkUrl,
} from '../utils/pokemon';

type Props = {
  pokemon?: {
    id: number;
    name: string;
  };
};

export default function PokemonListItem({ pokemon }: Props) {
  const id = pokemon?.id || 1;
  const name = pokemon?.name ?? 'Loading';
  const { imageRef, openPokemonScreen } = useOpenPokemonScreen(id);

  return (
    <TouchableHighlight onPress={openPokemonScreen} style={styles.listItem}>
      <View>
        <Image
          ref={(img) => {
            imageRef.current = img;
          }}
          style={styles.image}
          source={{ uri: getPokemonOfficialArtworkUrl({ id }) }}
        />
        <Text style={styles.title}>{capitalizeString(name)}</Text>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: '#001972',
    padding: 10,
    margin: 3,
    borderRadius: 10,
  },
  image: {
    height: 75,
    aspectRatio: 1,
  },
  title: {
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
    width: 75,
  },
});
