import { useState, useEffect, useCallback } from 'react';
import { defaultWallpapers } from '../data/wallpapers';
import type { WeeklyWallpaper } from '../types';

export function useWallpaperStore() {
  const [wallpapers, setWallpapers] = useState<Record<string, WeeklyWallpaper>>(() => {
    const saved = localStorage.getItem('fall2026_wallpapers');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('fall2026_wallpapers', JSON.stringify(wallpapers));
  }, [wallpapers]);

  const getWallpaper = useCallback((weekKey: string): WeeklyWallpaper => {
    // 1. Check if user customized this week
    if (wallpapers[weekKey]) {
      return wallpapers[weekKey];
    }
    // 2. Check if we have a default for this week
    const defaultWp = defaultWallpapers.find(w => w.weekKey === weekKey);
    if (defaultWp) {
      return defaultWp;
    }
    // 3. Absolute fallback
    return { 
      weekKey, 
      imageUrl: '/wallpapers/default.jpg',
      title: 'FALL 2026',
      quote: 'Focus. Discipline. Finish Strong.'
    };
  }, [wallpapers]);

  const updateWallpaper = useCallback((weekKey: string, data: Partial<WeeklyWallpaper>) => {
    setWallpapers(prev => {
      const existing = prev[weekKey] || getWallpaper(weekKey);
      return {
        ...prev,
        [weekKey]: { ...existing, ...data, weekKey }
      };
    });
  }, [getWallpaper]);

  const resetWallpaper = useCallback((weekKey: string) => {
    setWallpapers(prev => {
      const next = { ...prev };
      delete next[weekKey];
      return next;
    });
  }, []);

  return { 
    wallpapers, 
    getWallpaper, 
    updateWallpaper, 
    resetWallpaper 
  };
}