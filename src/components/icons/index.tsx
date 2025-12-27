/**
 * Icon Library - Design System Compliant SVG Icons
 * All icons follow design system specifications with stroke-width: 2.5-3
 * Brand color: #5159B0
 */

import React from 'react';
import Svg, { Path, Circle, Rect, Line, Polyline } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  filled?: boolean;
}

// Location/Pin Icon
export const LocationIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#5159B0',
  strokeWidth = 2.5,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

// Phone Icon
export const PhoneIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#5159B0',
  strokeWidth = 2.5,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.19 12.85C3.49998 10.2412 2.44824 7.27099 2.12 4.17997C2.095 3.90344 2.12787 3.62474 2.21649 3.3616C2.30512 3.09846 2.44756 2.85666 2.63476 2.65162C2.82196 2.44658 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.11 1.99997H7.11C7.59531 1.9952 8.06579 2.16705 8.43376 2.48351C8.80173 2.79996 9.04207 3.23945 9.11 3.71997C9.23662 4.68004 9.47145 5.6227 9.81 6.52997C9.94455 6.88793 9.9736 7.27691 9.89384 7.65086C9.81408 8.02481 9.6288 8.36811 9.36 8.63998L8.09 9.90997C9.51356 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9752 14.1859 16.3491 14.1061C16.7231 14.0263 17.1121 14.0553 17.47 14.19C18.3773 14.5285 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Navigation/Compass Icon
export const NavigationIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#5159B0',
  strokeWidth = 2.5,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M16.24 7.76L14.12 14.12L7.76 16.24L9.88 9.88L16.24 7.76Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Link/External Icon
export const LinkIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#5159B0',
  strokeWidth = 2.5,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6467 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9548 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.4791 3.53087C19.5521 2.60383 18.298 2.07799 16.987 2.0666C15.676 2.0552 14.413 2.55918 13.47 3.46997L11.75 5.17997"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14 11C13.5705 10.4259 13.0226 9.95083 12.3934 9.60704C11.7642 9.26324 11.0685 9.05888 10.3533 9.00768C9.63819 8.95648 8.92037 9.05965 8.24861 9.31023C7.57685 9.5608 6.96684 9.95302 6.45996 10.46L3.45996 13.46C2.54917 14.403 2.04519 15.666 2.05659 16.977C2.06798 18.288 2.59382 19.5421 3.52086 20.4691C4.4479 21.3961 5.70197 21.922 7.01295 21.9334C8.32393 21.9448 9.58694 21.4408 10.53 20.53L12.24 18.82"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Search Icon
export const SearchIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#5159B0',
  strokeWidth = 2.5,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M21 21L16.65 16.65"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Star (Rating) Icon
export const StarIcon: React.FC<IconProps> = ({ size = 20, color = '#5159B0', filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'}>
    <Path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// List Icon
export const ListIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#5159B0',
  strokeWidth = 2.5,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line
      x1="8"
      y1="6"
      x2="21"
      y2="6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Line
      x1="8"
      y1="12"
      x2="21"
      y2="12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Line
      x1="8"
      y1="18"
      x2="21"
      y2="18"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Line
      x1="3"
      y1="6"
      x2="3.01"
      y2="6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Line
      x1="3"
      y1="12"
      x2="3.01"
      y2="12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Line
      x1="3"
      y1="18"
      x2="3.01"
      y2="18"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

// Folder/Group Icon
export const FolderIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#5159B0',
  strokeWidth = 2.5,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H9L11 6H20C20.5304 6 21.0391 6.21071 21.4142 6.58579C21.7893 6.96086 22 7.46957 22 8V19Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Map Icon
export const MapIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#5159B0',
  strokeWidth = 2.5,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M1 6V22L8 18L16 22L23 18V2L16 6L8 2L1 6Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Line
      x1="8"
      y1="2"
      x2="8"
      y2="18"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Line
      x1="16"
      y1="6"
      x2="16"
      y2="22"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

// Checkmark Icon
export const CheckIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#059669',
  strokeWidth = 3,
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M3 10L8 15L17 5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Alert Star Icon (for alerts/warnings)
export const AlertStarIcon: React.FC<
  IconProps & { alertType?: 'critical' | 'warning' | 'success' | 'info' }
> = ({ size = 20, alertType = 'critical' }) => {
  const colorMap = {
    critical: '#DC2626',
    warning: '#D97706',
    success: '#059669',
    info: '#818CF8',
  };
  const color = colorMap[alertType];

  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Path
        d="M24 8L26.4 20.8L38 16L30.4 26.4L42 30L28.8 34.4L32 46L24 36L16 46L19.2 34.4L6 30L17.6 26.4L10 16L21.6 20.8L24 8Z"
        fill={color}
      />
    </Svg>
  );
};

// Target/AI Icon
export const TargetIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#5159B0',
  strokeWidth = 3,
}) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <Circle cx="24" cy="24" r="18" stroke={color} strokeWidth={strokeWidth} fill="none" />
    <Circle cx="24" cy="24" r="12" stroke={color} strokeWidth={strokeWidth} fill="none" />
    <Circle cx="24" cy="24" r="4" fill={color} />
  </Svg>
);

// Store/Building Icon
export const StoreIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#5159B0',
  strokeWidth = 2.5,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V9H3Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 22V12H15V22"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Filter Icon
export const FilterIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#5159B0',
  strokeWidth = 2.5,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ChevronDown Icon
export const ChevronDownIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#5159B0',
  strokeWidth = 2.5,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 9L12 15L18 9"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ChevronRight Icon
export const ChevronRightIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#5159B0',
  strokeWidth = 2.5,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 18L15 12L9 6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default {
  LocationIcon,
  PhoneIcon,
  NavigationIcon,
  LinkIcon,
  SearchIcon,
  StarIcon,
  ListIcon,
  FolderIcon,
  MapIcon,
  CheckIcon,
  AlertStarIcon,
  TargetIcon,
  StoreIcon,
  FilterIcon,
  ChevronDownIcon,
  ChevronRightIcon,
};
