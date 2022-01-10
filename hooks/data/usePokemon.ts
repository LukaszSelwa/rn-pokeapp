import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { PokemonSpecies } from "../../utils/pokeapp";

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

type PokemonData = {
  pokemon: PokemonSpecies;
};

export default function usePokemon(pokemonId: number) {
  return useQuery<PokemonData>(POKEMON_QUERY, {
    variables: { pokemonId },
  });
}
