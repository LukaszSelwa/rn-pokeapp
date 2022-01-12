import { GenerationIds } from "../../utils/pokeapp";

export type HomeDrawerParamList = {
  [id in GenerationIds as `Generation${id}`]: {
    generationId: id;
  };
} & {
  AllPokemons: undefined;
};
