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
    { h: 1, x: half, y: half / 2 },
    { h: 2, x: half / 2, y: 35 },
    { h: 3, x: 35, y: half / 2 },
    { h: 4, x: half / 2, y: half },
    { h: 5, x: 35, y: size - (half / 2) },
    { h: 6, x: half / 2, y: size - 35 },
    { h: 7, x: half, y: size - (half / 2) },
    { h: 8, x: size - (half / 2), y: size - 35 },
    { h: 9, x: size - 35, y: size - (half / 2) },
    { h: 10, x: size - (half / 2), y: half },
    { h: 11, x: size - 35, y: half / 2 },
    { h: 12, x: size - (half / 2), y: 35 },
  ];

  const getPlanetCode = (name: string) => {
    const cleanName = name.replace(/[^a-zA-Z]/g, '').toLowerCase();
    if (cleanName.includes("sun")) return "Su";
    if (cleanName.includes("moon")) return "Mo";
    if (cleanName.includes("mars")) return "Ma";
    if (cleanName.includes("mercury")) return "Me";
    if (cleanName.includes("jupiter")) return "Ju";
    if (cleanName.includes("venus")) return "Ve";
    if (cleanName.includes("saturn")) return "Sa";
    if (cleanName.includes("raagu") || cleanName.includes("rahu")) return "Ra";
    if (cleanName.includes("kethu") || cleanName.includes("ketu")) return "Ke";
    if (cleanName.includes("ascendant") || cleanName.includes("lagna")) return "Asc";
    if (cleanName.includes("uranus")) return "Ur";
    if (cleanName.includes("neptune")) return "Ne";
    if (cleanName.includes("pluto")) return "Pl";
    return name.substring(0, 2);
  };

  const getZodiacNumber = (signName: string) => {
    if (!signName) return 1;
    const s = signName.toLowerCase();
    if (s.includes("aries")) return 1;
    if (s.includes("taurus")) return 2;
    if (s.includes("gemini")) return 3;
    if (s.includes("cancer")) return 4;
    if (s.includes("leo")) return 5;
    if (s.includes("virgo")) return 6;
    if (s.includes("libra")) return 7;
    if (s.includes("scorpio")) return 8;
    if (s.includes("sagittarius")) return 9;
    if (s.includes("capricorn")) return 10;
    if (s.includes("aquarius")) return 11;
    if (s.includes("pisces")) return 12;
    return 1;
  };

  const ascZodiacNum = getZodiacNumber(ascendantSign);

  return (
    <View style={styles.chartContainer}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Outer Square */}
        <Polygon
          points={`2,2 ${size - 2},2 ${size - 2},${size - 2} 2,${size - 2}`}
          fill="#fff" stroke="#dfbfbc" strokeWidth="2"
        />
        {/* Diagonals */}
        <Line x1="0" y1="0" x2={size} y2={size} stroke="#dfbfbc" strokeWidth="2" />
        <Line x1={size} y1="0" x2="0" y2={size} stroke="#dfbfbc" strokeWidth="2" />
        {/* Inner diamond lines */}
        <Line x1={half} y1="0" x2="0" y2={half} stroke="#dfbfbc" strokeWidth="2" />
        <Line x1="0" y1={half} x2={half} y2={size} stroke="#dfbfbc" strokeWidth="2" />
        <Line x1={half} y1={size} x2={size} y2={half} stroke="#dfbfbc" strokeWidth="2" />
        <Line x1={size} y1={half} x2={half} y2="0" stroke="#dfbfbc" strokeWidth="2" />

        {housePositions.map((pos) => {
          // pos.h is the visual box index (1 = top diamond, 2 = top-left upper, etc.)
          // targetZodiacNum is the Zodiac sign that belongs in this box
          const targetZodiacNum = ((ascZodiacNum + pos.h - 2) % 12) + 1;
          
          // Find the data for this Zodiac sign from the backend payload
          const houseData = houses.find((h) => getZodiacNumber(h.sign) === targetZodiacNum);
          const pList = houseData?.planets || [];
          const pLabel = pList.map(getPlanetCode).join(" ");

          return (
            <React.Fragment key={`house-${pos.h}`}>
              <SvgText x={pos.x} y={pos.y - 10} fontSize="12" fill="#d47970" textAnchor="middle" fontWeight="bold">
                {targetZodiacNum}
              </SvgText>
              {pLabel ? (
                <SvgText x={pos.x} y={pos.y + 8} fontSize="13" fontWeight="bold" fill="#3b2b07" textAnchor="middle">
                  {pLabel}
                </SvgText>
              ) : null}
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    padding: 16,
  },
});
