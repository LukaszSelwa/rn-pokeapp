import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import {
  GenerationSpeciesQuery,
  GenerationSpeciesQueryVariables
} from "../../types/generated/graphql";

const GENERATION_SPECIES = gql`
  query GenerationSpecies($generationId: Int!) {
    generationSpecies: pokemon_v2_pokemonspecies(
      order_by: { id: asc, evolution_chain_id: asc }
      where: { generation_id: { _eq: $generationId } }
      distinct_on: evolution_chain_id
    ) {
      id
    }
  }
`;

export default function useGenerationSpecies(generationId: number) {
  return useQuery<GenerationSpeciesQuery, GenerationSpeciesQueryVariables>(
    GENERATION_SPECIES,
    {
      variables: { generationId },
    }
  );
}
