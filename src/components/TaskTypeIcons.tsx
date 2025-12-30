/**
 * Task Type Icons - Contextual icons based on task category
 */

import React from 'react';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { CameraIcon, CalendarIcon } from './Icons';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// Grocery/Food Icon
const GroceryIcon: React.FC<IconProps> = ({ size = 24, color = '#5159B0', strokeWidth = 2.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 2L7.17 4H2V6H22V4H16.83L15 2H9ZM3 7V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V7H3Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Package/Delivery Icon
const PackageIcon: React.FC<IconProps> = ({ size = 24, color = '#5159B0', strokeWidth = 2.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 16V8C20.9996 7.64927 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64927 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3.27 6.96L12 12.01L20.73 6.96M12 22.08V12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Tools/Hardware Icon
const ToolsIcon: React.FC<IconProps> = ({ size = 24, color = '#5159B0', strokeWidth = 2.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M14.7 6.3C14.5134 6.11259 14.2914 5.96327 14.0468 5.86092C13.8023 5.75857 13.5401 5.70532 13.275 5.70532C13.0099 5.70532 12.7477 5.75857 12.5032 5.86092C12.2586 5.96327 12.0366 6.11259 11.85 6.3L3 15.15V21H8.85L17.7 12.15C17.8874 11.9634 18.0367 11.7414 18.1391 11.4968C18.2414 11.2523 18.2947 10.9901 18.2947 10.725C18.2947 10.4599 18.2414 10.1977 18.1391 9.95316C18.0367 9.70862 17.8874 9.48659 17.7 9.3L14.7 6.3Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21 10C21 10 19 12 18 12C17 12 15 10 15 10L19 6C19 6 21 8 21 9C21 10 21 10 21 10Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Office/Supplies Icon
const OfficeIcon: React.FC<IconProps> = ({ size = 24, color = '#5159B0', strokeWidth = 2.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 4H20C20.5304 4 21.0391 4.21071 21.4142 4.58579C21.7893 4.96086 22 5.46957 22 6V18C22 18.5304 21.7893 19.0391 21.4142 19.4142C21.0391 19.7893 20.5304 20 20 20H4C3.46957 20 2.96086 19.7893 2.58579 19.4142C2.21071 19.0391 2 18.5304 2 18V6C2 5.46957 2.21071 4.96086 2.58579 4.58579C2.96086 4.21071 3.46957 4 4 4Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 2V6M8 2V6M2 10H22"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Medical/Health Icon
const MedicalIcon: React.FC<IconProps> = ({ size = 24, color = '#5159B0', strokeWidth = 2.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L10.45 8.55H3.5L9.25 12.95L7.7 19.5L12 15.5L16.3 19.5L14.75 12.95L20.5 8.55H13.55L12 2Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 8V16M8 12H16"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Electronics Icon
const ElectronicsIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#5159B0',
  strokeWidth = 2.5,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="3" width="20" height="14" rx="2" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M8 21H16M12 17V21"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Clothing Icon
const ClothingIcon: React.FC<IconProps> = ({ size = 24, color = '#5159B0', strokeWidth = 2.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M16 3L20.29 7.29C20.3834 7.38373 20.4572 7.49565 20.5072 7.6186C20.5572 7.74155 20.5824 7.87319 20.5812 8.00599C20.58 8.13879 20.5524 8.26995 20.5 8.39195C20.4476 8.51395 20.3715 8.62445 20.276 8.71656L18 11V21H6V11L3.72398 8.71656C3.62848 8.62445 3.55238 8.51395 3.49998 8.39195C3.44758 8.26995 3.41999 8.13879 3.41879 8.00599C3.41759 7.87319 3.44281 7.74155 3.49278 7.6186C3.54276 7.49565 3.61657 7.38373 3.70998 7.29L8 3L9 6L12 3L15 6L16 3Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Home/Household Icon
const HouseholdIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#5159B0',
  strokeWidth = 2.5,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
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

// Generic/Other Icon
const GenericIcon: React.FC<IconProps> = ({ size = 24, color = '#5159B0', strokeWidth = 2.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M12 16V12M12 8H12.01"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Scanner/Barcode Icon
const ScannerIcon: React.FC<IconProps> = ({ size = 24, color = '#5159B0', strokeWidth = 2.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 7V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H7M17 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V7M21 17V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H17M7 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V17"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Line
      x1="7"
      y1="12"
      x2="7"
      y2="12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Line
      x1="10"
      y1="9"
      x2="10"
      y2="15"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Line
      x1="13"
      y1="9"
      x2="13"
      y2="15"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Line
      x1="16"
      y1="12"
      x2="16"
      y2="12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

// Assignment/User Icon
const AssignIcon: React.FC<IconProps> = ({ size = 24, color = '#5159B0', strokeWidth = 2.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

// Dental Icon
const DentalIcon: React.FC<IconProps> = ({ size = 24, color = '#5159B0', strokeWidth = 2.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 14C13.6569 14 15 12.6569 15 11C15 9.34315 13.6569 8 12 8C10.3431 8 9 9.34315 9 11C9 12.6569 10.3431 14 12 14Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 4C6.5 4 5 5 5 7C5 9 5.5 14 7 18C8 20 9 22 10 22C11 22 11.5 20 11.5 18V11"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 4C17.5 4 19 5 19 7C19 9 18.5 14 17 18C16 20 15 22 14 22C13 22 12.5 20 12.5 18V11"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Chiropractic Icon
const ChiropracticIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#5159B0',
  strokeWidth = 2.5,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="5" r="2" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M12 7C10.5 7 10 8 10 9V11C10 12 10.5 13 12 13C13.5 13 14 12 14 11V9C14 8 13.5 7 12 7Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M12 13V22" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path
      d="M9 15L7 17M15 15L17 17"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

// Automotive Icon
const AutomotiveIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#5159B0',
  strokeWidth = 2.5,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 11L4 16V21H6V19H18V21H20V16L19 11L17 6H7L5 11Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="7.5" cy="15.5" r="1.5" stroke={color} strokeWidth={strokeWidth} />
    <Circle cx="16.5" cy="15.5" r="1.5" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M7 6H17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

// Home Maintenance Icon
const HomeMaintenanceIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#5159B0',
  strokeWidth = 2.5,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 12L12 3L21 12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5 10V20C5 20.5523 5.44772 21 6 21H9"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19 10V20C19 20.5523 18.5523 21 18 21H15"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15 13L12 16L9 13M12 16V21"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Pet Care Icon
const PetCareIcon: React.FC<IconProps> = ({ size = 24, color = '#5159B0', strokeWidth = 2.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="8" cy="8" r="1.5" stroke={color} strokeWidth={strokeWidth} />
    <Circle cx="16" cy="8" r="1.5" stroke={color} strokeWidth={strokeWidth} />
    <Circle cx="5" cy="13" r="1.5" stroke={color} strokeWidth={strokeWidth} />
    <Circle cx="19" cy="13" r="1.5" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M12 20C14.7614 20 17 17.7614 17 15C17 12.2386 14.7614 10 12 10C9.23858 10 7 12.2386 7 15C7 17.7614 9.23858 20 12 20Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Fitness Icon
const FitnessIcon: React.FC<IconProps> = ({ size = 24, color = '#5159B0', strokeWidth = 2.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6.5 6.5L7.5 5.5M17.5 6.5L16.5 5.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Rect
      x="2"
      y="9"
      width="3"
      height="6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Rect
      x="19"
      y="9"
      width="3"
      height="6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Line
      x1="5"
      y1="12"
      x2="19"
      y2="12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

// Pharmacy Icon (different from Medical)
const PharmacyIcon: React.FC<IconProps> = ({ size = 24, color = '#5159B0', strokeWidth = 2.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 4H20C20.5523 4 21 4.44772 21 5V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V5C3 4.44772 3.44772 4 4 4Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M12 8V16M8 12H16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

// Beauty Icon
const BeautyIcon: React.FC<IconProps> = ({ size = 24, color = '#5159B0', strokeWidth = 2.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="8" stroke={color} strokeWidth={strokeWidth} />
    <Circle cx="9" cy="10" r="1" fill={color} />
    <Circle cx="15" cy="10" r="1" fill={color} />
    <Path
      d="M8 15C8.5 16 10 17 12 17C14 17 15.5 16 16 15"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

/**
 * Get icon component based on task category/keywords
 */
export const getTaskIcon = (title: string, category?: string): React.FC<IconProps> => {
  const lowerTitle = title.toLowerCase();
  const lowerCategory = category?.toLowerCase() || '';

  // New categories
  if (
    lowerTitle.includes('dental') ||
    lowerTitle.includes('dentist') ||
    lowerCategory === 'dental'
  ) {
    return DentalIcon;
  }
  if (
    lowerTitle.includes('chiro') ||
    lowerTitle.includes('chiropractor') ||
    lowerCategory === 'chiropractic'
  ) {
    return ChiropracticIcon;
  }
  if (
    lowerTitle.includes('car') ||
    lowerTitle.includes('auto') ||
    lowerTitle.includes('vehicle') ||
    lowerCategory === 'automotive'
  ) {
    return AutomotiveIcon;
  }
  if (
    lowerTitle.includes('home repair') ||
    lowerTitle.includes('maintenance') ||
    lowerTitle.includes('hvac') ||
    lowerCategory === 'home-maintenance'
  ) {
    return HomeMaintenanceIcon;
  }
  if (lowerTitle.includes('pet') || lowerTitle.includes('vet') || lowerCategory === 'pet-care') {
    return PetCareIcon;
  }
  if (
    lowerTitle.includes('gym') ||
    lowerTitle.includes('fitness') ||
    lowerTitle.includes('workout') ||
    lowerCategory === 'fitness'
  ) {
    return FitnessIcon;
  }
  if (
    lowerTitle.includes('pharmacy') ||
    lowerTitle.includes('prescription') ||
    lowerTitle.includes('medication') ||
    lowerCategory === 'pharmacy'
  ) {
    return PharmacyIcon;
  }
  if (
    lowerTitle.includes('beauty') ||
    lowerTitle.includes('salon') ||
    lowerTitle.includes('spa') ||
    lowerCategory === 'beauty'
  ) {
    return BeautyIcon;
  }

  if (
    lowerTitle.includes('grocery') ||
    lowerTitle.includes('food') ||
    lowerCategory === 'grocery'
  ) {
    return GroceryIcon;
  }
  if (
    lowerTitle.includes('package') ||
    lowerTitle.includes('delivery') ||
    lowerCategory === 'delivery'
  ) {
    return PackageIcon;
  }
  if (lowerTitle.includes('tool') || lowerTitle.includes('hardware') || lowerCategory === 'tools') {
    return ToolsIcon;
  }
  if (
    lowerTitle.includes('office') ||
    lowerTitle.includes('supply') ||
    lowerCategory === 'office'
  ) {
    return OfficeIcon;
  }
  if (
    lowerTitle.includes('medical') ||
    lowerTitle.includes('health') ||
    lowerTitle.includes('pharmacy') ||
    lowerCategory === 'medical'
  ) {
    return MedicalIcon;
  }
  if (
    lowerTitle.includes('electronics') ||
    lowerTitle.includes('computer') ||
    lowerCategory === 'electronics'
  ) {
    return ElectronicsIcon;
  }
  if (
    lowerTitle.includes('clothing') ||
    lowerTitle.includes('clothes') ||
    lowerCategory === 'clothing'
  ) {
    return ClothingIcon;
  }
  if (
    lowerTitle.includes('home') ||
    lowerTitle.includes('household') ||
    lowerCategory === 'household'
  ) {
    return HouseholdIcon;
  }

  return GenericIcon;
};

// Export all task-specific icons (CameraIcon and CalendarIcon imported from Icons.tsx and re-exported)
export {
  GroceryIcon,
  PackageIcon,
  ToolsIcon,
  OfficeIcon,
  MedicalIcon,
  ElectronicsIcon,
  ClothingIcon,
  HouseholdIcon,
  GenericIcon,
  ScannerIcon,
  AssignIcon,
  DentalIcon,
  ChiropracticIcon,
  AutomotiveIcon,
  HomeMaintenanceIcon,
  PetCareIcon,
  FitnessIcon,
  PharmacyIcon,
  BeautyIcon,
  CameraIcon,
  CalendarIcon,
};
