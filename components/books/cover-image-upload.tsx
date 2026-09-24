"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import { useI18n } from "@/providers/i18n-provider";
import { Button } from "@/components/ui/button";
import { coverImageAccept, validateCoverImage } from "@/lib/image-upload";

export function CoverImageUpload({
  value,
  onChange,
  onUploadingChange,
  error,
}: {
  value?: string;
  onChange: (url: string) => void;
  onUploadingChange: (uploading: boolean) => void;
  error?: string;
}) {
  const { t } = useI18n();
  const inputId = useId();
  const [preview, setPreview] = useState<string>();
  const [uploadError, setUploadError] = useState("");
  const [progress, setProgress] = useState(0);
  const { startUpload, isUploading } = useUploadThing("bookCover", {
    uploadProgressGranularity: "fine",
    onUploadProgress: setProgress,
  });

  useEffect(() => {
    onUploadingChange(isUploading);
  }, [isUploading, onUploadingChange]);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  async function uploadFile(file?: File) {
    if (!file) return;
    setUploadError("");
    const validationError = validateCoverImage(file);
    if (validationError) {
      setUploadError(t(validationError));
      return;
    }

    setPreview(URL.createObjectURL(file));
    setProgress(0);
    try {
      const result = await startUpload([file]);
      const url = result?.[0]?.ufsUrl;
      if (!url) throw new Error("Image upload failed. Please try again.");
      onChange(url);
      setPreview(undefined);
    } catch (uploadFailure) {
      setUploadError(t(uploadFailure instanceof Error ? uploadFailure.message : "Image upload failed. Please try again."));
    }
  }

  const imageUrl = preview ?? value;
  return (
    <div className="md:col-span-2">
      <span className="mb-2 block text-sm font-semibold">{t("Cover image")}</span>
      <div className="grid gap-4 rounded-md border border-dashed p-4 sm:grid-cols-[140px_1fr] sm:items-center">
        <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-muted">
          {imageUrl ? (
            <Image src={imageUrl} alt={t("Cover preview")} fill sizes="140px" unoptimized={imageUrl.startsWith("blob:")} className="object-contain p-2" />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground"><ImagePlus aria-hidden size={36} /></div>
          )}
        </div>
        <div>
          <label htmlFor={inputId} className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            <ImagePlus aria-hidden size={17} />
            {t(value ? "Replace cover image" : "Choose cover image")}
          </label>
          <input
            id={inputId}
            className="sr-only"
            type="file"
            accept={coverImageAccept}
            disabled={isUploading}
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              event.currentTarget.value = "";
              void uploadFile(file);
            }}
          />
          <p className="mt-2 text-xs text-muted-foreground">{t("JPG, PNG or WebP up to 4 MB.")}</p>
          {isUploading ? (
            <div className="mt-3" role="status">
              <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary" style={{ width: `${progress}%` }} /></div>
              <p className="mt-2 text-xs">{t("Uploading cover... {progress}%", { progress })}</p>
            </div>
          ) : null}
          {value && !isUploading ? (
            <Button type="button" variant="ghost" className="mt-3" onClick={() => onChange("")}>
              <Trash2 aria-hidden size={16} />{t("Remove image")}
            </Button>
          ) : null}
        </div>
      </div>
      {uploadError ? <p className="mt-2 text-sm text-destructive" role="alert">{uploadError}</p> : null}
      {error ? <p className="mt-2 text-sm text-destructive">{t(error)}</p> : null}
    </div>
  );
}
