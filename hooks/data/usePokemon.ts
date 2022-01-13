import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import {
  PokemonQuery,
  PokemonQueryVariables,
} from '../../types/generated/graphql';

const POKEMON_QUERY = gql`
  query Pokemon($pokemonId: Int!) {
    pokemon: pokemon_v2_pokemonspecies_by_pk(id: $pokemonId) {
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

export default function usePokemon(pokemonId: number) {
  return useQuery<PokemonQuery, PokemonQueryVariables>(POKEMON_QUERY, {
    variables: { pokemonId },
  });
}
