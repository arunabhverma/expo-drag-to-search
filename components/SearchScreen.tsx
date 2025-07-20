import {
  IOS_LIKE_BOUNCE_CONFIG,
  SearchBarHeight,
} from "@/components/ListGesture";
import { useSearchContext } from "@/context/SearchContext";
import { useBackHandler } from "@/hooks/useBackHandler";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import Color from "color";
import React, { useEffect, useRef } from "react";
import { Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const SearchScreen = () => {
  const { searchOffsetY, isSearchOpen, setIsSearchOpen } = useSearchContext();
  const { top } = useSafeAreaInsets();
  const theme = useTheme();
  const searchInputRef = useRef<TextInput>(null);

  useBackHandler(() => {
    if (isSearchOpen) {
      runOnJS(setIsSearchOpen)(false);
    }
    return true;
  }, [isSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      searchOffsetY.value = withSpring(top, IOS_LIKE_BOUNCE_CONFIG);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
    }
  }, [isSearchOpen, searchOffsetY, top]);

  const animatedBackButtonStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(searchOffsetY.get(), [top, 200], [44, 0]),
    };
  });

  const animatedSearchBarStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: searchOffsetY.get() }],
    };
  });

  if (!isSearchOpen) return null;
  return (
    <Animated.View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      entering={FadeIn}
      exiting={FadeOut}
    >
      <Animated.View
        style={[styles.searchBarContainer, animatedSearchBarStyle]}
      >
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Animated.View
            style={[styles.searchBarIcon, animatedBackButtonStyle]}
          >
            <Pressable
              style={({ pressed }) => [
                styles.searchBarIconBack,
                pressed && {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => setIsSearchOpen(false)}
            >
              <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
            </Pressable>
          </Animated.View>
          <View style={styles.searchBarInput}>
            <TextInput
              ref={searchInputRef}
              placeholder="Search"
              style={[styles.input, { color: theme.colors.text }]}
              placeholderTextColor={"rgba(111, 111, 111, 0.5)"}
              cursorColor={theme.colors.text}
              selectionHandleColor={theme.colors.text}
              selectionColor={
                Platform.OS === "android"
                  ? Color(theme.colors.text).alpha(0.3).toString()
                  : theme.colors.text
              }
            />
          </View>
        </View>
      </Animated.View>
      <View
        style={{
          flex: 1,
          marginTop: SearchBarHeight,
        }}
      ></View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  searchBarContainer: {
    height: SearchBarHeight,
    width: "100%",
    justifyContent: "center",
    zIndex: 1000,
  },
  searchBar: {
    marginHorizontal: 10,
    borderRadius: 99,
    height: 44,
    justifyContent: "center",
    flexDirection: "row",
    borderWidth: StyleSheet.hairlineWidth,
  },
  searchBarIcon: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  searchBarIconBack: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 99,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "transparent",
  },
  searchBarInput: {
    flex: 1,
  },
  input: {
    flex: 1,
    fontSize: 17,
  },
});
