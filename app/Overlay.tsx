import { Canvas, DiffRect, rect, rrect } from "@shopify/react-native-skia";
import { Dimensions, Platform, StyleSheet, View } from "react-native";

interface OverlayProps {
  scannerSize?: number;
  cornerRadius?: number;
  opacity?: number;
}

export const Overlay = ({ 
  scannerSize = 300,
  cornerRadius = 50,
  opacity = 0.5 
}: OverlayProps) => {
  const { width, height } = Dimensions.get("window");

  const outer = rrect(rect(0, 0, width, height), 0, 0);
  const inner = rrect(
    rect(
      width / 2 - scannerSize / 2,
      height / 2 - scannerSize / 2,
      scannerSize,
      scannerSize
    ),
    cornerRadius,
    cornerRadius
  );

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <Canvas
        style={[
          Platform.OS === "android" ? { flex: 1 } : StyleSheet.absoluteFillObject,
          { width, height }
        ]}
      >
        <DiffRect inner={inner} outer={outer} color="black" opacity={opacity} />
      </Canvas>
    </View>
  );
};