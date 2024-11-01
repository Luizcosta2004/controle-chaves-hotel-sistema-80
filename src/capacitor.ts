import { Capacitor } from '@capacitor/core';

// Initialize Capacitor
export const isNativePlatform = Capacitor.isNativePlatform();
export const getPlatform = () => Capacitor.getPlatform();