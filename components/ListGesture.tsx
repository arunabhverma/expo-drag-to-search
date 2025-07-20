import React from "react";
import { Dimensions, type FlatList } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  type SharedValue,
  runOnJS,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { lightHaptics } from "@/utils/haptics";

interface ListGestureWrapperProps {
  children: React.ReactNode;
  scrollRef: React.ForwardedRef<FlatList<any>> | undefined;
  isPanning: SharedValue<boolean>;
  scrollOffset: SharedValue<number>;
  offsetY: SharedValue<number>;
  hasTriggered: SharedValue<boolean>;
  openSearch: () => void;
}

export const SCREEN_HEIGHT = Dimensions.get("window").height;
export const DragLowThreshold = 200;
export const SearchBarHeight = 60;
export const IOS_LIKE_BOUNCE_CONFIG = {
  stiffness: 110,
  damping: 18,
  mass: 1,
};

export const ListGestureWrapper: React.FC<ListGestureWrapperProps> = ({
  children,
  scrollRef,
  isPanning,
  scrollOffset,
  offsetY,
  hasTriggered,
  openSearch,
}) => {
  const initialTouchY = useSharedValue(0);

  const fakeScroll = (value: number) => {
    if (value < 0) {
      scrollRef.current?.scrollToOffset({
        offset: Math.abs(value),
        animated: false,
      });
    }
  };

  function resistanceFactor(distance: number) {
    "worklet";
    const maxDistance = SCREEN_HEIGHT;
    return 1 - (distance / maxDistance) * 0.7;
  }

  const finalizeOffset = (deltaY: number) => {
    "worklet";
    if (deltaY === null) {
      offsetY.set(withSpring(0, IOS_LIKE_BOUNCE_CONFIG));
    } else {
      if (scrollOffset.get() !== 0 && deltaY < 0) return;

      const target = deltaY > SearchBarHeight * 0.5 ? SearchBarHeight : 0;
      offsetY.set(withSpring(target, IOS_LIKE_BOUNCE_CONFIG));
      runOnJS(fakeScroll)(deltaY);
    }
  };

  const dragToOpenSearch = (deltaY: number) => {
    "worklet";
    if (deltaY > DragLowThreshold) {
      runOnJS(openSearch)();
    }
  };

  const panGesture = Gesture.Manual()
    .onTouchesDown((e) => {
      const y = e.changedTouches[0]?.absoluteY;
      if (y != null) {
        initialTouchY.set(y - (offsetY.get() ?? 0));
      }
    })
    .onTouchesMove((e, manager) => {
      const y = e.changedTouches[0]?.absoluteY;
      if (y == null) return;
      const deltaY = y - initialTouchY.get();

      if (scrollOffset.get() === 0) {
        if (deltaY > 0 && offsetY.value === 0) {
          isPanning.set(true);
          manager.activate();
        }
      }

      if (deltaY > DragLowThreshold && isPanning.value && !hasTriggered.value) {
        hasTriggered.set(true);
        runOnJS(lightHaptics)();
      }

      if (deltaY < DragLowThreshold && isPanning.value && hasTriggered.value) {
        hasTriggered.set(false);
      }

      if (deltaY < 0 && isPanning.value) {
        offsetY.set(0);
        runOnJS(fakeScroll)(deltaY);
      } else if (deltaY > 0 && isPanning.value) {
        const resisted = deltaY * resistanceFactor(deltaY);
        offsetY.set(resisted);
        runOnJS(fakeScroll)(deltaY);
      }
    })
    .onTouchesUp((e, manager) => {
      isPanning.set(false);
      manager.end();
      hasTriggered.set(false);
      const deltaY = e.changedTouches[0]?.absoluteY - initialTouchY.get();
      if (deltaY > DragLowThreshold) {
        dragToOpenSearch(deltaY);
      } else {
        finalizeOffset(deltaY);
      }
    })
    .onTouchesCancelled((e, manager) => {
      isPanning.set(false);
      manager.end();
      hasTriggered.set(false);
      const deltaY = e.changedTouches[0]?.absoluteY - initialTouchY.get();
      if (deltaY > DragLowThreshold) {
        dragToOpenSearch(deltaY);
      } else {
        finalizeOffset(deltaY);
      }
    });

  return <GestureDetector gesture={panGesture}>{children}</GestureDetector>;
};
