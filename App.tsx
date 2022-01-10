import { ApolloClient, ApolloProvider } from "@apollo/client";
import { InMemoryCache } from "@apollo/client/cache/inmemory/inMemoryCache";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import AllPokemonsScreen from "./screens/AllPokemonsScreen";
import GenerationScreen from "./screens/GenerationScreen";

const Drawer = createDrawerNavigator();

const pokemonAPIClient = new ApolloClient({
  uri: "https://beta.pokeapi.co/graphql/v1beta",
  cache: new InMemoryCache(),
  defaultOptions: { watchQuery: { fetchPolicy: "cache-and-network" } },
});

const generations = [
  { name: "I", id: 1 },
  { name: "II", id: 2 },
  { name: "III", id: 3 },
  { name: "IV", id: 4 },
  { name: "V", id: 5 },
  { name: "VI", id: 6 },
  { name: "VII", id: 7 },
  { name: "VIII", id: 8 },
];
const GenerationsScreens = generations.map(({ name, id }) => ({
  name: `Generation ${name}`,
  Screen: function Screen() {
    return <GenerationScreen generation={name} generationId={id} />;
  },
}));

export default function App() {
  return (
    <NavigationContainer>
      <ApolloProvider client={pokemonAPIClient}>
        <Drawer.Navigator>
          <Drawer.Screen name="All Pokemons" component={AllPokemonsScreen} />
          {GenerationsScreens.map(({ name, Screen }) => (
            <Drawer.Screen key={name} name={name} component={Screen} />
          ))}
        </Drawer.Navigator>
      </ApolloProvider>
    </NavigationContainer>
  );
}
