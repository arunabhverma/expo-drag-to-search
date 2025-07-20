import { ContactItem } from "@/components/ContactItem";
import { FakeSearch } from "@/components/FakeSearch";
import {
  IOS_LIKE_BOUNCE_CONFIG,
  ListGestureWrapper,
} from "@/components/ListGesture";
import { useSearchContext } from "@/context/SearchContext";
import { CONTACTS } from "@/mock/contact";
import React, { useRef } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export default function Home() {
  const fakeSearchRef = useAnimatedRef<View>();
  const scrollRef = useRef<FlatList<any>>(null);
  const isPanning = useSharedValue(false);
  const scrollOffset = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const hasTriggered = useSharedValue(false);
  const { setIsSearchOpen, searchOffsetY } = useSearchContext();
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.set(event.contentOffset.y);
    },
  });

  const animatedDragStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: offsetY.get() }],
    };
  });

  const openSearch = () => {
    fakeSearchRef.current?.measure((x, y, width, height, pageX, pageY) => {
      searchOffsetY.set(pageY);
      setIsSearchOpen(true);
      offsetY.set(withSpring(0, IOS_LIKE_BOUNCE_CONFIG));
    });
  };

  const hideSearch = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (e.nativeEvent.contentOffset.y > 0) {
      offsetY.set(withSpring(0, IOS_LIKE_BOUNCE_CONFIG));
    }
  };

  return (
    <View style={[styles.container, {}]}>
      <FakeSearch
        fakeSearchRef={fakeSearchRef}
        offsetY={offsetY}
        hasTriggered={hasTriggered}
        openSearch={openSearch}
      />
      <ListGestureWrapper
        scrollRef={scrollRef}
        isPanning={isPanning}
        scrollOffset={scrollOffset}
        offsetY={offsetY}
        hasTriggered={hasTriggered}
        openSearch={openSearch}
      >
        <Animated.View style={[{ flex: 1 }, animatedDragStyle]}>
          <Animated.FlatList
            ref={scrollRef}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            data={CONTACTS}
            onMomentumScrollBegin={hideSearch}
            onScrollEndDrag={hideSearch}
            renderItem={({ item }) => <ContactItem contact={item} />}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.contentContainer}
          />
        </Animated.View>
      </ListGestureWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 10,
  },
  item: {
    height: 100,
    width: 100,
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(111, 111, 111, 0.2)",
    width: "85%",
    alignSelf: "flex-end",
  },
});
