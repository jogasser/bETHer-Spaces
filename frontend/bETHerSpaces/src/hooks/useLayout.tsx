import {useCallback, useState} from "react";
import {LayoutChangeEvent} from "react-native";

export default function useLayout(defaultWidth?: number, defaultHeight?: number) {
  const [layout, setLayout] = useState<{
    height: number;
    width: number;
    measured: boolean;
  }>({ height: defaultHeight || 0, width: defaultWidth || 0, measured: false });

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
