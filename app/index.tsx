import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function Index() {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        style={{ color: theme.colors.text }}
        onPress={() => router.push("/home")}
      >
        Index
      </Text>
    </View>
  );
}
