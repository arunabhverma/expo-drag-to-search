import { SearchScreen } from "@/components/SearchScreen";
import { SearchProvider } from "@/context/SearchContext";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

declare module "@react-navigation/native" {
  export type ExtendedTheme = {
    dark: boolean;
    colors: {
      primary: string;
      background: string;
      card: string;
      text: string;
      border: string;
      notification: string;
      menuBg: string;
    };
  };
  export function useTheme(): ExtendedTheme;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  let dark = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      card: DarkTheme.colors.background,
      background: DarkTheme.colors.card,
    },
  };
  let light = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      card: DefaultTheme.colors.background,
      background: DefaultTheme.colors.card,
    },
  };
  const theme = colorScheme === "dark" ? dark : light;

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.colors.background);
  }, [theme.colors.background]);

  return (
    <SearchProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={theme}>
          <Stack screenOptions={{ headerShadowVisible: false }}>
            <Stack.Screen
              name="index"
              options={{
                title: "Index",
              }}
            />
            <Stack.Screen name="home" options={{ title: "Contacts" }} />
          </Stack>
          <StatusBar style="auto" />
          <SearchScreen />
        </ThemeProvider>
      </GestureHandlerRootView>
    </SearchProvider>
  );
}
