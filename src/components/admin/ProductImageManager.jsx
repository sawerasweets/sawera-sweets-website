import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Trash2, 
  Star, 
  ArrowLeft, 
  ArrowRight, 
  RefreshCw, 
  Plus, 
  Image as ImageIcon,
  AlertCircle,
  Check,
  Link as LinkIcon
} from 'lucide-react';

const MAX_IMAGES = 6;

// Client-side image compression helper: keeps uploads fast, crisp and resilient
async function compressImageFile(file) {
  return new Promise((resolve) => {
    // If SVG, read as text/dataURL directly
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve({ data: reader.result, name: file.name, type: file.type });
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 1400;
        let width = img.width;
        let height = img.height;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Export as WebP with 0.84 quality (falls back to JPEG if unsupported)
        let dataUrl = canvas.toDataURL('image/webp', 0.84);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', 0.84);
        }
        resolve({ data: dataUrl, name: file.name, type: 'image/webp' });
      };
      img.onerror = () => {
        // Fallback to uncompressed dataUrl
        resolve({ data: e.target.result, name: file.name, type: file.type });
      };
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

export default function ProductImageManager({ images = [], onChange, category = 'sweets' }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [manualUrl, setManualUrl] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [replacingIndex, setReplacingIndex] = useState(null);

  const fileInputRef = useRef(null);
  const replaceInputRef = useRef(null);

  // Guarantee images is an array with at least 1 image or empty
  const currentImages = Array.isArray(images) && images.length > 0 
    ? images.filter(Boolean).slice(0, MAX_IMAGES) 
    : [];

  const handleFilesSelected = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = MAX_IMAGES - currentImages.length;
    if (remainingSlots <= 0) {
      setUploadError(`Maximum limit of ${MAX_IMAGES} images reached.`);
      setTimeout(() => setUploadError(''), 3500);
      return;
    }

    const filesToProcess = files.slice(0, remainingSlots);
    setIsUploading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      // 1. Compress images in client
      const compressedList = [];
      for (const file of filesToProcess) {
        const compressed = await compressImageFile(file);
        if (compressed) compressedList.push(compressed);
      }

      if (compressedList.length === 0) {
        throw new Error('Could not read image files.');
      }

      // 2. Upload to server endpoint
      let newUrls = [];
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ files: compressedList })
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && Array.isArray(result.files)) {
            newUrls = result.files.map(f => f.url);
          }
        }
      } catch (networkErr) {
        console.warn('Server upload failed, falling back to local compressed data URI:', networkErr);
      }

      // Fallback: if server endpoint did not return URLs, use compressed data URLs
      if (newUrls.length === 0) {
        newUrls = compressedList.map(c => c.data);
      }

      const updatedImages = [...currentImages, ...newUrls].slice(0, MAX_IMAGES);
      onChange(updatedImages);
      setUploadSuccess(`Successfully added ${newUrls.length} image(s).`);
      setTimeout(() => setUploadSuccess(''), 3000);
    } catch (err) {
      console.error('Image upload error:', err);
      setUploadError(err.message || 'Failed to process images.');
      setTimeout(() => setUploadError(''), 4000);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleReplaceFileSelected = async (e) => {
    if (replacingIndex === null) return;
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const compressed = await compressImageFile(file);
      if (!compressed) throw new Error('Could not process image.');

      let newUrl = compressed.data;
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ files: [compressed] })
        });
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.files?.[0]?.url) {
            newUrl = result.files[0].url;
          }
        }
      } catch (netErr) {
        console.warn('Replace upload fallback to compressed data:', netErr);
      }

      const next = [...currentImages];
      next[replacingIndex] = newUrl;
      onChange(next);
      setUploadSuccess(`Image ${replacingIndex + 1} updated.`);
      setTimeout(() => setUploadSuccess(''), 3000);
    } catch (err) {
      setUploadError('Failed to replace image.');
      setTimeout(() => setUploadError(''), 3500);
    } finally {
      setIsUploading(false);
      setReplacingIndex(null);
      if (replaceInputRef.current) replaceInputRef.current.value = '';
    }
  };

  const handleSetCover = (index) => {
    if (index === 0) return;
    const next = [...currentImages];
    const [target] = next.splice(index, 1);
    next.unshift(target);
    onChange(next);
    setUploadSuccess('Main / Cover photo updated.');
    setTimeout(() => setUploadSuccess(''), 2500);
  };

  const handleMove = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= currentImages.length) return;
    const next = [...currentImages];
    const temp = next[index];
    next[index] = next[targetIdx];
    next[targetIdx] = temp;
    onChange(next);
  };

  const handleRemove = (index) => {
    const next = currentImages.filter((_, i) => i !== index);
    onChange(next);
  };

  const handleAddManualUrl = (e) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;
    if (currentImages.length >= MAX_IMAGES) {
      setUploadError(`Maximum of ${MAX_IMAGES} images allowed.`);
      return;
    }
    const next = [...currentImages, manualUrl.trim()].slice(0, MAX_IMAGES);
    onChange(next);
    setManualUrl('');
    setShowManualInput(false);
  };

  return (
    <div className="space-y-4 bg-gray-50/70 p-4 rounded-2xl border border-gray-200">
      {/* Header with counter */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <label className="block font-bold text-sm text-gray-900">
            Product Images &amp; Gallery ({currentImages.length}/{MAX_IMAGES})
          </label>
          <span className="text-[11px] text-gray-500">
            Upload up to 6 photos from your phone or PC. Drag or reorder; the first image is the Main Cover photo.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowManualInput(!showManualInput)}
            className="text-[11px] text-gray-600 hover:text-[#07643D] flex items-center gap-1 font-semibold underline cursor-pointer"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showManualInput ? 'Hide URL Input' : 'Add Image URL'}</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {uploadError && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {uploadSuccess && (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* Manual URL Bar */}
      {showManualInput && (
        <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-gray-300">
          <input
            type="text"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="Paste image path or URL (e.g., /images/products/special-roll-barfi.jpg)"
            className="flex-1 text-xs outline-none px-2 py-1"
          />
          <button
            type="button"
            onClick={handleAddManualUrl}
            className="px-3 py-1 bg-[#07643D] text-white text-xs font-bold rounded-lg hover:bg-[#043E26] cursor-pointer"
          >
            Add URL
          </button>
        </div>
      )}

      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFilesSelected}
        multiple
        accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
        className="hidden"
      />
      <input
        type="file"
        ref={replaceInputRef}
        onChange={handleReplaceFileSelected}
        accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
        className="hidden"
      />

      {/* Grid of Image Slots */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {currentImages.map((imgUrl, index) => {
          const isCover = index === 0;

          return (
            <div
              key={`${imgUrl}-${index}`}
              className={`relative group rounded-xl overflow-hidden border-2 bg-white shadow-xs transition-all flex flex-col ${
                isCover ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Badge: Cover vs Angle */}
              <div className="absolute top-2 left-2 z-10">
                {isCover ? (
                  <span className="inline-flex items-center gap-1 bg-[#D4AF37] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                    <Star className="w-3 h-3 fill-white" />
                    Cover Photo
                  </span>
                ) : (
                  <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Angle {index + 1}
                  </span>
                )}
              </div>

              {/* Image Preview Box */}
              <div className="relative aspect-square w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={imgUrl}
                  alt={`Product view ${index + 1}`}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/products/gulab-jamun.svg';
                  }}
                />
              </div>

              {/* Action Toolbar */}
              <div className="p-2 bg-white border-t border-gray-100 flex items-center justify-between gap-1 text-xs">
                {/* Reorder Buttons */}
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMove(index, -1)}
                    className="p-1 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Move Left"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === currentImages.length - 1}
                    onClick={() => handleMove(index, 1)}
                    className="p-1 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Move Right"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  {/* Set As Cover Button */}
                  {!isCover && (
                    <button
                      type="button"
                      onClick={() => handleSetCover(index)}
                      className="px-1.5 py-0.5 text-[10px] font-bold text-[#D4AF37] border border-[#D4AF37]/50 rounded-md hover:bg-[#D4AF37]/10 transition-colors cursor-pointer"
                      title="Set as Main Cover Photo"
                    >
                      Make Cover
                    </button>
                  )}

                  {/* Replace Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setReplacingIndex(index);
                      replaceInputRef.current?.click();
                    }}
                    className="p-1 text-gray-500 hover:text-[#07643D] hover:bg-emerald-50 rounded-md transition-colors cursor-pointer"
                    title="Replace with new photo"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                    title="Remove this image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add Images Dropzone / Tile */}
        {currentImages.length < MAX_IMAGES && (
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-emerald-600/40 hover:border-[#07643D] bg-emerald-50/40 hover:bg-emerald-50/80 transition-all flex flex-col items-center justify-center p-4 text-center cursor-pointer group disabled:opacity-50"
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <RefreshCw className="w-6 h-6 text-[#07643D] animate-spin" />
                <span className="text-[11px] font-bold text-[#07643D]">Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#07643D]/10 text-[#07643D] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#07643D] block">
                    + Upload Images
                  </span>
                  <span className="text-[10px] text-gray-500 block mt-0.5">
                    Select 1 to {MAX_IMAGES - currentImages.length} photos
                  </span>
                </div>
              </div>
            )}
          </button>
        )}
      </div>

      {currentImages.length === 0 && (
        <div className="text-center py-4 bg-white rounded-xl border border-dashed border-gray-300">
          <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-1" />
          <p className="text-xs text-gray-500">No images selected yet. Upload at least 1 image.</p>
        </div>
      )}
    </div>
  );
}
