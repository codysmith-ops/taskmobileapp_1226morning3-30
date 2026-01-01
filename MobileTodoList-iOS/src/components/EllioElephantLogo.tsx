/**
 * Ellio Elephant Logo
 * Transparent elephant icon with no background or circle
 */

import React from 'react';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';

interface EllioElephantLogoProps {
  size?: number;
  color?: string;
}

export const EllioElephantLogo: React.FC<EllioElephantLogoProps> = ({
  size = 48,
  color = '#8B5CF6',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Elephant head */}
      <Ellipse cx="50" cy="45" rx="28" ry="30" fill={color} />
      
      {/* Left ear */}
      <Ellipse
        cx="28"
        cy="35"
        rx="15"
        ry="22"
        fill={color}
        opacity="0.9"
        transform="rotate(-25 28 35)"
      />
      
      {/* Right ear */}
      <Ellipse
        cx="72"
        cy="35"
        rx="15"
        ry="22"
        fill={color}
        opacity="0.9"
        transform="rotate(25 72 35)"
      />
      
      {/* Trunk */}
      <Path
        d="M 50 60 Q 48 75 42 85 Q 40 90 38 92 Q 36 94 38 95 Q 40 96 43 94 Q 46 92 48 88 Q 52 80 54 75 Q 56 70 50 60 Z"
        fill={color}
      />
      
      {/* Left eye */}
      <Circle cx="40" cy="42" r="3.5" fill="white" />
      <Circle cx="40.5" cy="42.5" r="2" fill="#1E293B" />
      
      {/* Right eye */}
      <Circle cx="60" cy="42" r="3.5" fill="white" />
      <Circle cx="60.5" cy="42.5" r="2" fill="#1E293B" />
      
      {/* Tusks */}
      <Path
        d="M 42 58 Q 40 62 38 65 Q 36 68 37 70"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <Path
        d="M 58 58 Q 60 62 62 65 Q 64 68 63 70"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      
      {/* Smile */}
      <Path
        d="M 43 52 Q 50 55 57 52"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
    </Svg>
  );
};
