export const coverImageMaxBytes = 4 * 1024 * 1024;
export const coverImageAccept = "image/jpeg,image/png,image/webp";

const coverImageTypes = new Set(coverImageAccept.split(","));

export function validateCoverImage(file: Pick<File, "type" | "size">) {
  if (!coverImageTypes.has(file.type)) return "Only JPG, PNG and WebP images are allowed.";
  if (file.size > coverImageMaxBytes) return "Image must be 4 MB or smaller.";
  return null;
}
