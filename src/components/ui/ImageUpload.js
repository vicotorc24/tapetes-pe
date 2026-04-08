"use client";
import React, { useState, useRef } from 'react';
import { LucideUpload, LucideX, LucideImage, LucideRefreshCcw, LucideCheckCircle, LucideChevronLeft, LucideChevronRight, LucideTrash2, LucideCamera } from 'lucide-react';
import { uploadFile } from '../../lib/services/storage';

export function ImageUpload({ value, onChange, path = 'general', label = 'Imagen', multiple = false, maxFiles = 1, mode = 'default' }) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const images = multiple ? (Array.isArray(value) ? value : (value ? [value] : [])) : (value ? [value] : []);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    if (multiple) {
      const remainingSlots = maxFiles - images.length;
      const filesToUpload = files.slice(0, remainingSlots);
      for (const file of filesToUpload) {
        await upload(file);
      }
    } else {
      await upload(files[0]);
    }
  };

  const upload = async (file) => {
    console.log("Iniciando carga de archivo:", file.name);
    setIsUploading(true);
    setProgress(0);
    try {
      const url = await uploadFile(file, path, (p) => setProgress(p));
      if (multiple) {
        onChange([...images, url]);
      } else {
        onChange(url);
      }
    } catch (error) {
      console.error("Error capturado en ImageUpload:", error);
      alert("Error al subir imagen: " + error.message);
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const removeImage = (index) => {
    if (multiple) {
      const newImages = images.filter((_, i) => i !== index);
      onChange(newImages);
    } else {
      onChange('');
    }
  };

  const moveImage = (index, direction) => {
    if (!multiple) return;
    const newImages = [...images];
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < newImages.length) {
      const temp = newImages[index];
      newImages[index] = newImages[newIndex];
      newImages[newIndex] = temp;
      onChange(newImages);
    }
  };

  const onDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const onDragLeave = () => setIsDragOver(false);
  const onDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files || []);
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    
    if (multiple) {
      const remainingSlots = maxFiles - images.length;
      const filesToUpload = imageFiles.slice(0, remainingSlots);
      for (const file of filesToUpload) {
        await upload(file);
      }
    } else if (imageFiles.length > 0) {
      await upload(imageFiles[0]);
    }
  };

  if (mode === 'avatar') {
    return (
      <div className="relative group w-32 h-32">
        <div 
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`
            w-full h-full rounded-[2.5rem] border-2 border-dashed overflow-hidden transition-all relative flex flex-col items-center justify-center cursor-pointer
            ${isDragOver ? 'border-orange-500 bg-orange-50' : 'border-stone-200 hover:border-orange-300 bg-stone-50/50'}
            ${value ? 'border-none' : ''}
          `}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          {value ? (
            <>
              <img src={value} className="w-full h-full object-cover shadow-inner" alt="Avatar"/>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <div className="flex gap-2">
                   <button type="button" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} className="p-2 bg-white rounded-xl text-stone-900 shadow-xl hover:scale-110 transition-transform">
                     <LucideRefreshCcw size={16}/>
                   </button>
                   <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(0); }} className="p-2 bg-red-500 rounded-xl text-white shadow-xl hover:scale-110 transition-transform">
                     <LucideTrash2 size={16}/>
                   </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                   <LucideRefreshCcw className="animate-spin text-orange-600" size={24} />
                   <div className="w-12 h-1 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-600 transition-all" style={{ width: `${progress}%` }}></div>
                   </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-stone-300 group-hover:text-orange-400 transition-colors">
                  <LucideCamera size={28} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Foto</span>
                </div>
              )}
            </>
          )}
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">{label}</label>
        {multiple && <span className="text-[10px] font-bold text-stone-400">{images.length} / {maxFiles} fotos</span>}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((url, idx) => (
          <div key={idx} className="group relative rounded-xl overflow-hidden border border-stone-200 bg-white aspect-square shadow-sm animate-in zoom-in-95 duration-300">
            <img src={url} className="w-full h-full object-cover" alt={`Preview ${idx + 1}`} />
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-[2px]">
              <div className="flex gap-1">
                {multiple && idx > 0 && (
                  <button type="button" onClick={() => moveImage(idx, -1)} className="bg-white/90 p-1.5 rounded-lg text-stone-800 hover:bg-white shadow-sm transition">
                    <LucideChevronLeft size={16} />
                  </button>
                )}
                <button 
                  type="button"
                  onClick={() => removeImage(idx)} 
                  className="bg-red-500/90 p-1.5 rounded-lg text-white hover:bg-red-500 shadow-sm transition"
                >
                  <LucideTrash2 size={16} />
                </button>
                {multiple && idx < images.length - 1 && (
                  <button type="button" onClick={() => moveImage(idx, 1)} className="bg-white/90 p-1.5 rounded-lg text-stone-800 hover:bg-white shadow-sm transition">
                    <LucideChevronRight size={16} />
                  </button>
                )}
              </div>
              {idx === 0 && multiple && <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold">Principal</span>}
            </div>
          </div>
        ))}

        {images.length < maxFiles && !isUploading && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`
              border-2 border-dashed rounded-xl aspect-square transition-all cursor-pointer text-center
              flex flex-col items-center justify-center gap-2
              ${isDragOver 
                ? 'border-orange-500 bg-orange-50 text-orange-700' 
                : 'border-stone-200 hover:border-orange-300 hover:bg-stone-50 text-stone-400'}
            `}
          >
            <LucideUpload size={20} />
            <span className="text-[10px] font-bold">Subir</span>
          </div>
        )}

        {isUploading && (
          <div className="border-2 border-stone-100 rounded-xl aspect-square bg-stone-50 flex flex-col items-center justify-center gap-2 animate-pulse">
            <LucideRefreshCcw className="animate-spin text-orange-600" size={20} />
            <div className="w-12 h-1 bg-stone-200 rounded-full overflow-hidden">
              <div className="h-full bg-orange-600 transition-all" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        multiple={multiple}
        className="hidden" 
      />
    </div>
  );
}
