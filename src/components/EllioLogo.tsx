import React from 'react';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

interface EllioLogoProps {
  size?: number;
  showText?: boolean;
}

export const EllioLogo: React.FC<EllioLogoProps> = ({ size = 40, showText = true }) => {
  const textSize = size * 2.5;

  return (
    <>
      {/* Elephant Logo */}
      <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <Defs>
          <LinearGradient id="ellioGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#7C83DB" />
            <Stop offset="50%" stopColor="#5159B0" />
            <Stop offset="100%" stopColor="#3d4389" />
          </LinearGradient>
        </Defs>

        {/* Elephant body */}
        <Circle cx="50" cy="55" r="35" fill="url(#ellioGradient)" />

        {/* Elephant head */}
        <Circle cx="45" cy="40" r="25" fill="url(#ellioGradient)" />

        {/* Ear */}
        <Path d="M20 35 Q15 25, 25 20 Q30 25, 28 35 Z" fill="#818CF8" opacity="0.8" />

        {/* Trunk */}
        <Path
          d="M45 50 Q50 60, 48 70 Q46 75, 50 78"
          stroke="#5159B0"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Eye */}
        <Circle cx="48" cy="35" r="3" fill="#FFFFFF" />

        {/* Legs */}
        <Path d="M35 85 L35 95" stroke="#5159B0" strokeWidth="10" strokeLinecap="round" />
        <Path d="M50 85 L50 95" stroke="#5159B0" strokeWidth="10" strokeLinecap="round" />
        <Path d="M65 85 L65 95" stroke="#5159B0" strokeWidth="10" strokeLinecap="round" />
      </Svg>

      {showText && (
        <Svg
          width={textSize}
          height={size * 0.6}
          viewBox="0 0 200 40"
          style={{ marginLeft: size * 0.2 }}
        >
          <Path
            d="M10 30 L10 10 L30 10 M10 20 L25 20"
            stroke="#334155"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <Path
            d="M40 10 L40 30 M40 10 L50 10 M40 30 L50 30"
            stroke="#334155"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <Path
            d="M60 10 L60 30 M60 10 L70 10 M60 30 L70 30"
            stroke="#334155"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <Circle cx="85" cy="20" r="10" stroke="#334155" strokeWidth="4" fill="none" />
          <Path
            d="M100 10 L100 30"
            stroke="#334155"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
      )}
    </>
  );
};
