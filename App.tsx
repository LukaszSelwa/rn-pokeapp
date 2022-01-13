import { ApolloClient, ApolloProvider } from '@apollo/client';
import { InMemoryCache } from '@apollo/client/cache/inmemory/inMemoryCache';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import HomeScreen from './screens/HomeScreen/HomeScreen';
import PokemonScreen from './screens/PokemonScreen';
import { RootStackParamList } from './screens/screens';

const Stack = createStackNavigator<RootStackParamList>();

const pokemonAPIClient = new ApolloClient({
  uri: 'https://beta.pokeapi.co/graphql/v1beta',
  cache: new InMemoryCache(),
  defaultOptions: { watchQuery: { fetchPolicy: 'cache-and-network' } },
});

export default function App() {
  return (
    <NavigationContainer>
      <ApolloProvider client={pokemonAPIClient}>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Pokemon"
            component={PokemonScreen}
            options={{
              presentation: 'transparentModal',
              headerShown: false,
              cardStyleInterpolator: () => ({}),
              gestureDirection: 'vertical',
            }}
          />
        </Stack.Navigator>
      </ApolloProvider>
    </NavigationContainer>
  );
}
