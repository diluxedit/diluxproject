import {AlertCircle, Image as ImageIcon, Loader2, RotateCcw, Upload} from 'lucide-react';
import React, {useId, useRef, useState} from 'react';
import {
  PRESET_IMAGE_ASSETS,
  compressImageFileToDataUrl,
  isSafeImageRef,
} from '../utils/imageMedia';
import {SafeImage} from './SafeImage';

export interface ImagePickerLabels {
  uploadButton: string;
  compressing: string;
  presetLabel: string;
  customOption: string;
  urlLabel: string;
  urlPlaceholder: string;
  resetDefault: string;
  sourcePreset: string;
  sourceUploaded: string;
  sourceCustom: string;
  invalidWarning: string;
  previewAlt: string;
}

interface ImagePickerFieldProps {
  label: string;
  value: string;
  onChange: (nextValue: string) => void;
  defaultValue?: string;
  language: 'id' | 'en';
  maxDimension?: number;
  maxChars?: number;
  aspectClass?: string;
  helperText?: string;
  previewBackground?: 'light' | 'dark';
  previewFit?: 'cover' | 'contain';
  labels: ImagePickerLabels;
}

export function ImagePickerField({
  label,
  value,
  onChange,
  defaultValue,
  language,
  maxDimension = 1080,
  maxChars = 280000,
  aspectClass = 'aspect-[16/9]',
  helperText,
  previewBackground = 'dark',
  previewFit = 'cover',
  labels,
}: ImagePickerFieldProps) {
  const inputId = useId();
  const urlInputId = useId();
  const presetSelectId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const trimmedValue = value.trim();
  const isPreset = PRESET_IMAGE_ASSETS.some((opt) => opt.value === trimmedValue);
  const isDataUrl = /^data:image\//i.test(trimmedValue);
  const isValidRef = trimmedValue.length > 0 && isSafeImageRef(trimmedValue);

  const sourceLabel = isPreset
    ? labels.sourcePreset
    : isDataUrl
    ? labels.sourceUploaded
    : labels.sourceCustom;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) {
      return;
    }

    setUploadError('');
    setCompressing(true);
    try {
      const dataUrl = await compressImageFileToDataUrl(file, {
        maxDimension,
        maxChars,
      });
      onChange(dataUrl);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : labels.invalidWarning
      );
    } finally {
      setCompressing(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/65 backdrop-blur-md p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={urlInputId} className="text-xs font-bold text-[#0F172A]">
          {label}
        </label>
        <span className="text-[11px] font-semibold text-[#2563EB] inline-flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{sourceLabel}</span>
        </span>
      </div>

      {helperText && (
        <p className="text-xs text-[#64748B] leading-relaxed">{helperText}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
        <div
          className={`md:col-span-5 ${aspectClass} rounded-xl overflow-hidden border ${
            previewBackground === 'dark'
              ? 'bg-[#0B1428] border-slate-800/40'
              : 'bg-slate-100 border-slate-200'
          } relative flex items-center justify-center`}
        >
          {isValidRef ? (
            <SafeImage
              src={trimmedValue}
              alt={labels.previewAlt}
              className={`w-full h-full ${
                previewFit === 'contain' ? 'object-contain p-3' : 'object-cover'
              }`}
            />
          ) : (
            <div className="p-4 text-center text-xs text-slate-400">
              {labels.invalidWarning}
            </div>
          )}
        </div>

        <div className="md:col-span-7 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              id={inputId}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={(e) => void handleFileChange(e)}
              className="sr-only"
            />
            <button
              type="button"
              disabled={compressing}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl transition-colors cursor-pointer disabled:opacity-60 shadow-sm"
            >
              {compressing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Upload className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              <span>{compressing ? labels.compressing : labels.uploadButton}</span>
            </button>

            {defaultValue && trimmedValue !== defaultValue && (
              <button
                type="button"
                onClick={() => {
                  setUploadError('');
                  onChange(defaultValue);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#0F172A] bg-white/85 hover:bg-white border border-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{labels.resetDefault}</span>
              </button>
            )}
          </div>

          <div>
            <label htmlFor={presetSelectId} className="block text-[11px] font-semibold text-[#64748B] mb-1">
              {labels.presetLabel}
            </label>
            <select
              id={presetSelectId}
              value={isPreset ? trimmedValue : ''}
              onChange={(e) => {
                if (e.target.value) {
                  setUploadError('');
                  onChange(e.target.value);
                }
              }}
              className="w-full px-3 py-2 text-xs text-[#0F172A] bg-white/85 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="">{labels.customOption}</option>
              {PRESET_IMAGE_ASSETS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {language === 'id' ? opt.labelId : opt.labelEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={urlInputId} className="block text-[11px] font-semibold text-[#64748B] mb-1">
              {labels.urlLabel}
            </label>
            <input
              id={urlInputId}
              type="text"
              value={value}
              onChange={(e) => {
                setUploadError('');
                onChange(e.target.value);
              }}
              placeholder={labels.urlPlaceholder}
              className="w-full px-3 py-2 text-xs font-mono-tabular text-[#0F172A] bg-white/85 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          {!isValidRef && (
            <p className="flex items-start gap-1.5 text-xs text-red-600">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{labels.invalidWarning}</span>
            </p>
          )}

          {uploadError && (
            <p role="alert" className="flex items-start gap-1.5 text-xs text-red-600">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{uploadError}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
