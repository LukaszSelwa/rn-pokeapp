export type GenerationIds = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type PokemonSpecies = {
  id: number;
  name: string;
  evolutions: {
    id: number;
    species: { id: number; name: string }[];
  };
};
