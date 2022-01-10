import React, { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import Spinner from "./Spinner";

type Props = {
  uri?: string;
};

export default function LoadableImage({ uri }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <View style={styles.imageContainer}>
      {typeof uri === "string" && (
        <Image
          style={styles.image}
          source={{ uri }}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
        />
      )}
      {(typeof uri !== "string" || isLoading) && (
        <View style={styles.spinnerView}>
          <Spinner color="white" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: "center",
    alignContent: "center",
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#001972",
    position: "relative",
  },
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "contain",
  },
  spinnerView: {
    height: "100%",
    width: "100%",
    backgroundColor: "#rgba(0, 24, 112, 0.51)",
    position: "absolute",
    justifyContent: "center",
    alignContent: "center",
  },
});
