import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Line, Polygon, Text as SvgText } from "react-native-svg";

interface NorthIndianChartProps {
  houses: {
    house_number: number;
    sign: string;
    planets: string[];
  }[];
  ascendantSign: string;
}

export const NorthIndianChart: React.FC<NorthIndianChartProps> = ({ houses, ascendantSign }) => {
  const size = 300;
  const half = size / 2;

  const housePositions = [
    { h: 1, x: half, y: half - 60 },
    { h: 2, x: half - 60, y: half - 120 },
    { h: 3, x: half - 120, y: half - 60 },
    { h: 4, x: half - 60, y: half },
    { h: 5, x: half - 120, y: half + 60 },
    { h: 6, x: half - 60, y: half + 120 },
    { h: 7, x: half, y: half + 60 },
    { h: 8, x: half + 60, y: half + 120 },
    { h: 9, x: half + 120, y: half + 60 },
    { h: 10, x: half + 60, y: half },
    { h: 11, x: half + 120, y: half - 60 },
    { h: 12, x: half + 60, y: half - 120 },
  ];

  const getPlanetCode = (name: string) => {
    const codes: { [key: string]: string } = {
      Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me", Jupiter: "Ju",
      Venus: "Ve", Saturn: "Sa", Rahu: "Ra", Ketu: "Ke",
    };
    return codes[name] || name.substring(0, 2);
  };

  return (
    <View style={styles.chartContainer}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Outer Square */}
        <Polygon
          points={`2,2 ${size - 2},2 ${size - 2},${size - 2} 2,${size - 2}`}
          fill="none" stroke="#C5A059" strokeWidth="2"
        />
        {/* Diagonals */}
        <Line x1="0" y1="0" x2={size} y2={size} stroke="#C5A059" strokeWidth="1.5" strokeOpacity="0.5" />
        <Line x1={size} y1="0" x2="0" y2={size} stroke="#C5A059" strokeWidth="1.5" strokeOpacity="0.5" />
        {/* Inner diamond lines */}
        <Line x1={half} y1="0" x2="0" y2={half} stroke="#C5A059" strokeWidth="1.5" strokeOpacity="0.5" />
        <Line x1="0" y1={half} x2={half} y2={size} stroke="#C5A059" strokeWidth="1.5" strokeOpacity="0.5" />
        <Line x1={half} y1={size} x2={size} y2={half} stroke="#C5A059" strokeWidth="1.5" strokeOpacity="0.5" />
        <Line x1={size} y1={half} x2={half} y2="0" stroke="#C5A059" strokeWidth="1.5" strokeOpacity="0.5" />

        {housePositions.map((pos) => {
          const houseData = houses.find((h) => h.house_number === pos.h);
          const pList = houseData?.planets || [];
          const pLabel = pList.map(getPlanetCode).join(" ");

          return (
            <React.Fragment key={`house-${pos.h}`}>
              <SvgText x={pos.x} y={pos.y - 12} fontSize="10" fill="#C5A059" textAnchor="middle" opacity="0.6">
                {pos.h}
              </SvgText>
              <SvgText x={pos.x} y={pos.y + 4} fontSize="13" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">
                {pLabel}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
      <Text style={styles.lagnaLabel}>Lagna (Ascendant): {ascendantSign}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(30, 30, 30, 0.75)",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(197, 160, 89, 0.2)",
    overflow: "hidden",
  },
  lagnaLabel: {
    fontSize: 11,
    color: "#C5A059",
    marginTop: 12,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
});
