import React, { useCallback } from "react";
import { FlatList } from "react-native";
import gql from "graphql-tag";
import { FetchMoreOptions, NetworkStatus, useQuery } from "@apollo/client";
import { PokemonSpecies } from "../../utils/pokeapp";
import PokemonListItem from "../../components/PokemonListItem";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { HomeDrawerParamList } from "./screens";
import Spinner from "../../components/Spinner";
import { CompositeScreenProps } from "@react-navigation/native";
import {
  StackScreenProps,
} from "@react-navigation/stack";
import { RootStackParamList } from "../screens";

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
      variables: { offset: 0, limit: 18 },
    }
  );

  const isFetching = networkStatus !== NetworkStatus.ready;

  const handleEndReach = useCallback(() => {
    if (isFetching) return;

    fetchMore({
      variables: { offset: data?.pokemons.length },
      updateQuery: updateAllPokemons,
    });
  }, [data, isFetching]);

  return (
    <FlatList<PokemonSpecies>
      data={data?.pokemons}
      renderItem={({ item }) => (
        <PokemonListItem pokemon={item} />
      )}
      onEndReached={handleEndReach}
      onEndReachedThreshold={0.01}
      keyExtractor={({ name, id }) => `${id}-${name}`}
      numColumns={3}
      contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}
      ListFooterComponent={Spinner}
    />
  );
}
