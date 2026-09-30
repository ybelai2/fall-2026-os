import { useState, type FormEvent } from "react";
import { ImagePlus, RotateCcw } from "lucide-react";
import type { WeeklyWallpaper } from "../types";
import { Dialog } from "./Dialog";

interface WallpaperManagerProps {
  currentWallpaper: WeeklyWallpaper;
  onClose: () => void;
  onSave: (data: Partial<WeeklyWallpaper>) => void;
  onReset: () => void;
}

export function WallpaperManager({
  currentWallpaper,
  onClose,
  onSave,
  onReset,
}: WallpaperManagerProps) {
  const [imageUrl, setImageUrl] = useState(currentWallpaper.imageUrl || "");
  const [title, setTitle] = useState(currentWallpaper.title || "");
  const [quote, setQuote] = useState(currentWallpaper.quote || "");
  const [failedImage, setFailedImage] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSave({ imageUrl, title, quote });
    onClose();
  };

  return (
    <Dialog
      title="Make this week yours."
      description="Choose a wallpaper and a few words to come back to."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="form-stack">
        <div className="wallpaper-preview">
          {imageUrl && imageUrl !== failedImage && (
            <img
              src={imageUrl}
              alt="Wallpaper preview"
              onError={() => setFailedImage(imageUrl)}
            />
          )}
          <div>
            <ImagePlus size={20} />
            <strong>{title || "Your weekly inspiration"}</strong>
            <p>{quote || "A little reminder of what matters."}</p>
          </div>
        </div>
        {failedImage === imageUrl && imageUrl && (
          <p className="field-hint" role="status">
            This image could not be loaded. Check the link or try another image.
          </p>
        )}
        <div className="field">
          <label htmlFor="wallpaper-url">Image URL or path</label>
          <input
            id="wallpaper-url"
            required
            type="text"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="https://… or /wallpapers/Kobe.png"
          />
        </div>
        <div className="field">
          <label htmlFor="wallpaper-title">
            Title <span>(optional)</span>
          </label>
          <input
            id="wallpaper-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="One thing at a time"
          />
        </div>
        <div className="field">
          <label htmlFor="wallpaper-quote">
            Your reminder <span>(optional)</span>
          </label>
          <textarea
            id="wallpaper-quote"
            value={quote}
            onChange={(event) => setQuote(event.target.value)}
            placeholder="A quote, a verse, or a thought for the week…"
            rows={3}
          />
        </div>
        <div className="dialog-actions actions-split">
          <button
            type="button"
            className="text-button"
            onClick={() => {
              onReset();
              onClose();
            }}
          >
            <RotateCcw size={14} />
            Reset
          </button>
          <div>
            <button
              type="button"
              onClick={onClose}
              className="button button-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="button button-primary">
              Save wallpaper
            </button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}
