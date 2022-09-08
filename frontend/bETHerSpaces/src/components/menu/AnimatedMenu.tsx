import {ReactElement, useCallback, useEffect, useMemo, useState} from "react";
import {
  LayoutChangeEvent,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewStyle
} from "react-native";
import {Divider, Text, Title} from "react-native-paper";
import {Rating} from "react-native-ratings";
import {Space} from "../../data/Space";
import {theme} from "../../config/theme";
import Animated, {
  AnimatedStyleProp,
  runOnUI,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import {Ionicons} from "@expo/vector-icons";

function useLayout(defaultWidth?: number) {
  const [layout, setLayout] = useState<{
    height: number;
    width: number;
    measured: boolean;
  }>({ height: 0, width: defaultWidth || 0, measured: false });

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const { height, width } = e.nativeEvent.layout;

      if (height === layout.height && width === layout.width) {
        return;
      }

      setLayout({
        height,
        width,
        measured: true,
      });
    },
    [layout.height, layout.width],
  );

  return [layout, onLayout] as const;
}

interface StaticMenuProps {
  selectedSpaceId?: number;
  data: Space[];
  setSelectedSpaceId: (v: number) => void;
}

export default function AnimatedMenu({data, selectedSpaceId, setSelectedSpaceId}: StaticMenuProps): ReactElement {
  const { height, width } = useWindowDimensions();
  const styles = StyleSheet.create({
    placesWrapper: {
      height: height - 64,
      right: 0,
      paddingTop: 55,
      backgroundColor: theme.colors.surface,
    },
    place: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: theme.colors.surface
    },
    selectedPlace: {
      backgroundColor: theme.colors.primary + '33'
    },
    menu: {
      position: "absolute",
      right: 0
    }
  })

  const [layout] = useLayout(width < 340 ? width : 340);
  const open = useSharedValue(false);
  const handleHeightContent = useMemo(
    () => layout.width,
    [layout.width],
  );

  const size = useSharedValue(handleHeightContent);

  useEffect(() => {
    runOnUI(() => {
      if (handleHeightContent) {
        size.value = handleHeightContent;
      }
    })();
  }, [handleHeightContent, size]);

  useEffect(() => {
    runOnUI(() => {
      if (!handleHeightContent) {
        size.value = handleHeightContent;
      }
    })();
  }, [handleHeightContent, size]);

  const progress = useDerivedValue(() => (open.value ? withTiming(1) : withTiming(0)));

  const animatedStyle = useAnimatedStyle<AnimatedStyleProp<ViewStyle>>(() => ({
    width: progress.value == 0 ? 0 : size.value,
    right: -(size.value * (1-progress.value)),
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
  }));

  const openMenu = useCallback(() => {
    if (size.value === 0) {
      runOnUI(() => {
        size.value = handleHeightContent;
      })();
    }
    open.value = !open.value;
  }, [handleHeightContent, open, size]);

  return (
    <View style={styles.menu}>
      <View style={{alignItems: 'flex-end', zIndex: 1}}>
        <TouchableOpacity onPress={openMenu} style={{backgroundColor: theme.colors.surface}}>
          <Ionicons name={'menu'} size={50} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
      <Animated.View style={animatedStyle}>
        <ScrollView style={styles.placesWrapper}>
          <Divider />
          {data.map(value =>
            <View key={value.id}>
              <TouchableOpacity style={[styles.place, selectedSpaceId === value.id && styles.selectedPlace]}
                                onPress={() => setSelectedSpaceId(value.id)}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Title>{value.name}</Title>
                  {value.rating != null ?
                    <Rating readonly
                            showRating={false}
                            showReadOnlyText={false}
                            style={{}}
                            startingValue={value.rating}
                            imageSize={20} /> :
                    <Text>Noch keine Bewertungen</Text> }
                </View>
              </TouchableOpacity>
              <Divider />
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
}