export type PokemonSpecies = {
  id: number;
  name: string;
  evolutions: {
    id: number;
    species: { id: number; name: string }[];
  };
};
