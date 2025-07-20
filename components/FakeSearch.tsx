import { lightHaptics } from "@/utils/haptics";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  AnimatedRef,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { SearchBarHeight } from "./ListGesture";

interface FakeSearchProps {
  fakeSearchRef: AnimatedRef<View>;
  offsetY: SharedValue<number>;
  hasTriggered: SharedValue<boolean>;
  openSearch: () => void;
}

export const FakeSearch: React.FC<FakeSearchProps> = ({
  fakeSearchRef,
  offsetY,
  hasTriggered,
  openSearch,
}) => {
  const theme = useTheme();

  const animatedSearchBarStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: offsetY.get() }],
      opacity: interpolate(offsetY.get(), [0, SearchBarHeight], [0, 1]),
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      color: hasTriggered.value
        ? theme.colors.text
        : "rgba(111, 111, 111, 0.5)",
      transform: [
        { scale: withTiming(hasTriggered.value ? 1.05 : 1, { duration: 50 }) },
      ],
    };
  });

  const animatedFakeSearchStyle = useAnimatedStyle(() => {
    return {
      borderColor: hasTriggered.value
        ? "rgba(111, 111, 111, 0.5)"
        : theme.colors.border,
    };
  });

  return (
    <Animated.View
      ref={fakeSearchRef}
      style={[styles.container, animatedSearchBarStyle]}
      onTouchEnd={() => {
        lightHaptics();
        openSearch();
      }}
    >
      <Animated.View
        style={[
          styles.content,
          {
            backgroundColor: theme.colors.card,
          },
          animatedFakeSearchStyle,
        ]}
      >
        <Animated.Text style={[styles.text, animatedTextStyle]}>
          Search
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: SearchBarHeight,
    position: "absolute",
    width: "100%",
    top: -SearchBarHeight - 1,
    justifyContent: "center",
  },
  content: {
    marginHorizontal: 10,
    paddingHorizontal: 20,
    borderRadius: 99,
    height: 44,
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  text: {
    fontSize: 17,
    alignSelf: "flex-start",
  },
  fakeBG: {
    width: "100%",
    height: 200,
    position: "absolute",
    top: -200 - SearchBarHeight - 1,
  },
});
