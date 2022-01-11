import { GenerationIds } from "../../utils/pokeapp";

export type HomeDrawerParamList = {
  [id in GenerationIds as `Generation${id}`]: {
    generationId: id;
    rootNavigation: StackNavigationProp<RootStackParamList, "Home">;
  };
} & {
  AllPokemons: {
    rootNavigation: StackNavigationProp<RootStackParamList, "Home">;
  };
};
