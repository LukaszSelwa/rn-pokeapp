export const capitalizeString = (str: string) =>
  (str && str[0].toUpperCase() + str.slice(1)) || "";

export const getPokemonOfficialArtworkUrl = ({ id }: { id: number }) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
