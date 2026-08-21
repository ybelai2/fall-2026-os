import React, { useState } from 'react';
import type { WeeklyWallpaper } from '../types';

interface WallpaperManagerProps {
  currentWallpaper: WeeklyWallpaper;
  onClose: () => void;
  onSave: (data: Partial<WeeklyWallpaper>) => void;
  onReset: () => void;
}

export function WallpaperManager({ currentWallpaper, onClose, onSave, onReset }: WallpaperManagerProps) {
  const [imageUrl, setImageUrl] = useState(currentWallpaper.imageUrl || '');
  const [title, setTitle] = useState(currentWallpaper.title || '');
  const [quote, setQuote] = useState(currentWallpaper.quote || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ imageUrl, title, quote });
    onClose();
  };

  const handleReset = () => {
    onReset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-surface border border-border rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">MANAGE WALLPAPER</h2>
          <span className="text-xs font-mono text-muted">{currentWallpaper.weekKey}</span>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-muted mb-1">IMAGE URL / PATH</label>
            <input 
              required 
              type="text" 
              value={imageUrl} 
              onChange={e => setImageUrl(e.target.value)} 
              className="w-full bg-background border border-border rounded p-2 text-primary focus:border-primary outline-none transition-colors font-mono text-sm" 
              placeholder="/wallpapers/week-01.jpg or https://..." 
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-muted mb-1">TITLE (OPTIONAL)</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              className="w-full bg-background border border-border rounded p-2 text-primary focus:border-primary outline-none transition-colors" 
              placeholder="e.g. FOCUS WEEK" 
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-muted mb-1">QUOTE (OPTIONAL)</label>
            <textarea 
              value={quote} 
              onChange={e => setQuote(e.target.value)} 
              className="w-full bg-background border border-border rounded p-2 text-primary focus:border-primary outline-none transition-colors resize-none" 
              placeholder="e.g. Discipline equals freedom." 
              rows={3}
            />
          </div>

          <div className="flex justify-between items-center pt-4 mt-4 border-t border-border">
            <button 
              type="button" 
              onClick={handleReset} 
              className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors"
            >
              RESET TO DEFAULT
            </button>
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-4 py-2 text-sm font-bold text-muted hover:text-primary transition-colors"
              >
                CANCEL
              </button>
              <button 
                type="submit" 
                className="bg-primary text-background px-4 py-2 text-sm font-bold rounded hover:bg-gray-200 transition-colors"
              >
                SAVE
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}