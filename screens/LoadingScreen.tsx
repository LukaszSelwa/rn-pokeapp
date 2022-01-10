import React from "react";
import { StyleSheet, View } from "react-native";
import Spinner from "../components/Spinner";

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <Spinner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
});
