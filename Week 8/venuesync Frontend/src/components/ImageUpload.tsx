/**
 * ImageUpload Component
 *
 * Features:
 * - Drag & drop or click to select
 * - Live image previews with remove button
 * - File type + size validation (PNG/JPG, max 10MB each)
 * - Upload progress indicator
 * - Calls venuesApi.uploadImages() when a venueId is provided
 *   (for new venues, upload after the venue is created)
 *
 * Usage:
 *   <ImageUpload onFilesChange={(files) => setFiles(files)} />
 *   <ImageUpload venueId="abc123" onUploadComplete={(urls) => setImages(urls)} />
 */

import { useState, useRef, useCallback } from "react";
import { Upload, X, ImageIcon, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { venuesApi } from "../api/venues";

interface ImageUploadProps {
  /** If provided, files are uploaded immediately on selection */
  venueId?: string;
  /** Called with the selected File objects (before upload) */
  onFilesChange?: (files: File[]) => void;
  /** Called with the returned image URLs after a successful upload */
  onUploadComplete?: (urls: string[]) => void;
  maxFiles?: number;
}

interface FileEntry {
  file: File;
  preview: string;
  status: "pending" | "uploading" | "done" | "error";
  errorMsg?: string;
}

const MAX_SIZE_MB = 10;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ImageUpload({
  venueId,
  onFilesChange,
  onUploadComplete,
  maxFiles = 8,
}: ImageUploadProps) {
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    async (incoming: FileList | File[]) => {
      const arr = Array.from(incoming);

      // Validate each file
      const validated: FileEntry[] = arr
        .slice(0, maxFiles - entries.length)
        .map((file) => {
          if (!ALLOWED_TYPES.includes(file.type)) {
            return { file, preview: "", status: "error" as const, errorMsg: "Only PNG/JPG/WebP allowed" };
          }
          if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            return { file, preview: "", status: "error" as const, errorMsg: `Max size is ${MAX_SIZE_MB}MB` };
          }
          return { file, preview: URL.createObjectURL(file), status: "pending" as const };
        });

      const next = [...entries, ...validated];
      setEntries(next);

      const validFiles = next.filter((e) => e.status === "pending").map((e) => e.file);
      onFilesChange?.(validFiles);

      // If venueId is provided, upload immediately
      if (venueId) {
        const toUpload = validated.filter((e) => e.status === "pending");
        if (toUpload.length === 0) return;

        // Mark as uploading
        setEntries((prev) =>
          prev.map((e) =>
            toUpload.find((u) => u.file === e.file) ? { ...e, status: "uploading" } : e
          )
        );

        try {
          const { images } = await venuesApi.uploadImages(venueId, toUpload.map((e) => e.file));
          setEntries((prev) =>
            prev.map((e) =>
              toUpload.find((u) => u.file === e.file) ? { ...e, status: "done" } : e
            )
          );
          onUploadComplete?.(images);
        } catch {
          setEntries((prev) =>
            prev.map((e) =>
              toUpload.find((u) => u.file === e.file)
                ? { ...e, status: "error", errorMsg: "Upload failed" }
                : e
            )
          );
        }
      }
    },
    [entries, venueId, maxFiles, onFilesChange, onUploadComplete]
  );

  const removeEntry = (idx: number) => {
    setEntries((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      onFilesChange?.(next.filter((e) => e.status !== "error").map((e) => e.file));
      return next;
    });
  };

  // Drag events
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const canAddMore = entries.length < maxFiles;

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      {canAddMore && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-gray-300 hover:border-primary hover:bg-gray-50"
          }`}
        >
          <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragging ? "text-primary" : "text-gray-400"}`} />
          <p className="text-sm text-gray-600 font-medium">
            {isDragging ? "Drop images here" : "Click to upload or drag and drop"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            PNG, JPG, WebP · Max {MAX_SIZE_MB}MB each · Up to {maxFiles} images
          </p>
          {entries.length > 0 && (
            <p className="text-xs text-primary mt-1">
              {entries.length}/{maxFiles} selected
            </p>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && addFiles(e.target.files)}
      />

      {/* Preview grid */}
      {entries.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {entries.map((entry, idx) => (
            <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50 aspect-square">
              {entry.preview ? (
                <img src={entry.preview} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                </div>
              )}

              {/* Status overlay */}
              {entry.status === "uploading" && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
              {entry.status === "done" && (
                <div className="absolute bottom-1 right-1">
                  <CheckCircle className="w-5 h-5 text-green-500 drop-shadow" />
                </div>
              )}
              {entry.status === "error" && (
                <div className="absolute inset-0 bg-red-900/50 flex flex-col items-center justify-center p-2">
                  <AlertCircle className="w-5 h-5 text-white mb-1" />
                  <p className="text-white text-xs text-center">{entry.errorMsg}</p>
                </div>
              )}

              {/* Remove button */}
              {entry.status !== "uploading" && (
                <button
                  onClick={() => removeEntry(idx)}
                  className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-gray-700" />
                </button>
              )}

              {/* First image badge */}
              {idx === 0 && entry.status !== "error" && (
                <div className="absolute bottom-1 left-1 bg-primary text-white text-xs px-1.5 py-0.5 rounded">
                  Cover
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
