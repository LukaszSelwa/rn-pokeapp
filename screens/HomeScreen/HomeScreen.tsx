import { createDrawerNavigator } from "@react-navigation/drawer";
import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { RootStackParamList } from "../screens";
import AllPokemonsScreen from "./AllPokemonsScreen";
import GenerationScreen from "./GenerationScreen";
import { HomeDrawerParamList } from "./screens";

const Drawer = createDrawerNavigator<HomeDrawerParamList>();
type Props = StackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="AllPokemons"
        component={AllPokemonsScreen}
        options={{ title: "All Pokemons" }}
        initialParams={{ rootNavigation: navigation }}
      />
      <Drawer.Screen
        name="Generation1"
        component={GenerationScreen}
        options={{ title: "Generation I" }}
        initialParams={{ generationId: 1, rootNavigation: navigation }}
      />
      <Drawer.Screen
        name="Generation2"
        component={GenerationScreen}
        options={{ title: "Generation II" }}
        initialParams={{ generationId: 2, rootNavigation: navigation }}
      />
      <Drawer.Screen
        name="Generation3"
        component={GenerationScreen}
        options={{ title: "Generation III" }}
        initialParams={{ generationId: 3, rootNavigation: navigation }}
      />
      <Drawer.Screen
        name="Generation4"
        component={GenerationScreen}
        options={{ title: "Generation IV" }}
        initialParams={{ generationId: 4, rootNavigation: navigation }}
      />
    </Drawer.Navigator>
  );
}
