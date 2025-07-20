import React, { createContext, ReactNode, useContext, useState } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";

type SearchContextType = {
  searchOffsetY: SharedValue<number>;
  isSearchOpen: boolean;
  setIsSearchOpen: (value: boolean) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchOffsetY = useSharedValue(0);

  return (
    <SearchContext.Provider
      value={{ searchOffsetY, isSearchOpen, setIsSearchOpen }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context)
    throw new Error("useSearchContext must be used inside SearchProvider");
  return context;
};
