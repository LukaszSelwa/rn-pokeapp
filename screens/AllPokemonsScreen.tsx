import React, { useCallback, useRef } from "react";
import { FlatList, Text, View } from "react-native";
import gql from "graphql-tag";
import { FetchMoreOptions, NetworkStatus, useQuery } from "@apollo/client";
import { PokemonSpecies } from "../utils/pokeapp";
import LoadingScreen from "./LoadingScreen";
import PokemonListItem from "../components/PokemonListItem";

const ALL_POKEMON_QUERY = gql`
  query Pokemons($limit: Int!, $offset: Int!) {
    pokemons: pokemon_v2_pokemonspecies(
      limit: $limit
      offset: $offset
      order_by: { id: asc }
      distinct_on: id
    ) {
      id
      name
      evolutions: pokemon_v2_evolutionchain {
        id
        species: pokemon_v2_pokemonspecies {
          id
          name
        }
      }
    }
  }
`;

type AllPokemonData = {
  pokemons: PokemonSpecies[];
};

const updateAllPokemons: FetchMoreOptions<AllPokemonData>["updateQuery"] = (
  prev,
  { fetchMoreResult }
) => {
  if (!fetchMoreResult?.pokemons) return prev;
  return Object.assign({}, prev, {
    pokemons: [...prev.pokemons, ...fetchMoreResult.pokemons],
  });
};

export default function AllPokemonsScreen() {
  const { loading, data, fetchMore, networkStatus } = useQuery<AllPokemonData>(
    ALL_POKEMON_QUERY,
    {
      variables: { offset: 0, limit: 10 },
    }
  );

  const handleEndReach = useCallback(() => {
    if (networkStatus !== NetworkStatus.ready) return;

    fetchMore({
      variables: { offset: data?.pokemons.length },
      updateQuery: updateAllPokemons,
    });
  }, [data]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <FlatList<PokemonSpecies>
      data={data?.pokemons}
      renderItem={({ item }) => <PokemonListItem pokemon={item} />}
      onEndReached={handleEndReach}
      onEndReachedThreshold={0.01}
      keyExtractor={({ name, id }) => `${id}-${name}`}
      numColumns={3}
      contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}
    />
  );
}
