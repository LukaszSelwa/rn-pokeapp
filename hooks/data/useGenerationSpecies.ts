import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

const GENERATION_SPECIES = gql`
  query Pokemon($generationId: Int!) {
    generationSpecies: pokemon_v2_pokemonspecies(
      order_by: { id: asc, evolution_chain_id: asc }
      where: { generation_id: { _eq: $generationId } }
      distinct_on: evolution_chain_id
    ) {
      id
    }
  }
`;

type GenerationSpeciesData = {
  generationSpecies: { id: number }[];
};

export default function useGenerationSpecies(generationId: number) {
  return useQuery<GenerationSpeciesData>(GENERATION_SPECIES, {
    variables: { generationId },
  });
}
