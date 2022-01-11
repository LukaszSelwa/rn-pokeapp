import { StackNavigationProp } from "@react-navigation/stack";
import { useCallback, useRef } from "react";
import { Image } from "react-native";
import { RootStackParamList } from "../screens/screens";

type Arguments = {
  id: number;
  rootNavigation: StackNavigationProp<RootStackParamList, "Home">;
};

export default function useOpenPokemonScreen({
  id,
  rootNavigation,
}: Arguments) {
  const imageRef = useRef<Image | null>();
  const openPokemonScreen = useCallback(() => {
    try {
      imageRef.current?.measure((_x, _y, width, _height, pageX, pageY) => {
        rootNavigation.navigate("Pokemon", {
          id,
          sharedImageMeasure: { width, x: pageX, y: pageY },
        });
      });
    } catch (err) {
      rootNavigation.navigate("Pokemon", { id });
    }
  }, [id, rootNavigation]);
  return {
    imageRef,
    openPokemonScreen,
  };
}
