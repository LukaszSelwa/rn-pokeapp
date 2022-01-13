import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import gql from 'graphql-tag';
import { FetchMoreOptions, NetworkStatus, useQuery } from '@apollo/client';
import PokemonListItem from '../../components/PokemonListItem';
import Spinner from '../../components/Spinner';
import { AllPokemonsQuery } from '../../types/generated/graphql';

const ALL_POKEMON_QUERY = gql`
  query AllPokemons($limit: Int!, $offset: Int!) {
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

const updateAllPokemons: FetchMoreOptions<AllPokemonsQuery>['updateQuery'] = (
  prev,
  { fetchMoreResult },
) => {
  if (!fetchMoreResult?.pokemons) return prev;
  return {
    ...prev,
    pokemons: [...prev.pokemons, ...fetchMoreResult.pokemons],
  };
};

export default function AllPokemonsScreen() {
  const { data, fetchMore, networkStatus } = useQuery<AllPokemonsQuery>(
    ALL_POKEMON_QUERY,
    {
      variables: { offset: 0, limit: 18 },
    },
  );

  const isFetching = networkStatus !== NetworkStatus.ready;

  const handleEndReach = useCallback(() => {
    if (isFetching) return;

    fetchMore({
      variables: { offset: data?.pokemons.length },
      updateQuery: updateAllPokemons,
    });
  }, [data?.pokemons.length, fetchMore, isFetching]);

  return (
    <FlatList<AllPokemonsQuery['pokemons'][0]>
      data={data?.pokemons}
      renderItem={({ item }) => <PokemonListItem pokemon={item} />}
      onEndReached={handleEndReach}
      onEndReachedThreshold={0.01}
      keyExtractor={({ name, id }) => `${id}-${name}`}
      numColumns={3}
      contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}
      ListFooterComponent={Spinner}
    />
  );
}
