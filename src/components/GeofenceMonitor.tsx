import { useEffect, useRef } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { useTodoStore, Task } from '../store';

interface GeofenceMonitorProps {
  onTasksNearby: (tasks: Task[]) => void;
}

export const GeofenceMonitor: React.FC<GeofenceMonitorProps> = ({ onTasksNearby }) => {
  const { tasks, userPreferences } = useTodoStore();
  const watchIdRef = useRef<number | null>(null);
  const lastCheckedTasks = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (userPreferences?.geofencingEnabled) {
      requestLocationPermission();
    }

    return () => {
      if (watchIdRef.current !== null) {
        Geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [userPreferences?.geofencingEnabled]);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization(() => startMonitoring());
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location for smart task completion',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          startMonitoring();
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const startMonitoring = () => {
    watchIdRef.current = Geolocation.watchPosition(
      position => {
        const { latitude, longitude } = position.coords;
        checkNearbyTasks(latitude, longitude);
      },
      error => {
        console.warn('Location error:', error);
      },
      {
        enableHighAccuracy: false,
        distanceFilter: 50, // Update every 50 meters
        interval: 30000, // Check every 30 seconds
        fastestInterval: 15000,
      }
    );
    setIsMonitoring(true);
  };

  const checkNearbyTasks = (currentLat: number, currentLon: number) => {
    const radius = userPreferences?.autoCompleteRadius || 100;
    const nearbyTasks: Task[] = [];

    tasks.forEach(task => {
      if (
        !task.completed &&
        task.storeLatitude &&
        task.storeLongitude &&
        !lastCheckedTasks.current.has(task.id)
      ) {
        const distance = calculateDistance(
          currentLat,
          currentLon,
          task.storeLatitude,
          task.storeLongitude
        );

        // Check if user is leaving the geofence (within radius)
        if (distance <= radius) {
          nearbyTasks.push(task);
          lastCheckedTasks.current.add(task.id);

          // Clear from checked after 5 minutes
          setTimeout(() => {
            lastCheckedTasks.current.delete(task.id);
          }, 300000);
        }
      }
    });

    if (nearbyTasks.length > 0) {
      onTasksNearby(nearbyTasks);
    }
  };

  return null; // This is a background monitor component
};

// Haversine formula to calculate distance between coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
