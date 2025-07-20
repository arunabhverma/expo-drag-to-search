import { getInitials } from "@/utils/getInitials";
import { useTheme } from "@react-navigation/native";
import Color from "color";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const Avatar = ({ name }: { name: string }) => {
  const initials = getInitials(name);
  const theme = useTheme();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: Color(theme.colors.primary)
            .alpha(0.2)
            .desaturate(0.2)
            .toString(),
        },
      ]}
    >
      <Text style={[styles.text, { color: theme.colors.primary }]}>
        {initials}
      </Text>
    </View>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  container: {
    width: 45,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 99,
  },
  text: {
    fontSize: 15,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});
