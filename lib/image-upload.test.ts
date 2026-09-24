import { describe, expect, it } from "vitest";
import { coverImageMaxBytes, validateCoverImage } from "./image-upload";

describe("validateCoverImage", () => {
  it("accepts supported images within the size limit", () => {
    expect(validateCoverImage({ type: "image/webp", size: coverImageMaxBytes })).toBeNull();
  });

  it("rejects unsupported files", () => {
    expect(validateCoverImage({ type: "image/svg+xml", size: 1024 })).toBe("Only JPG, PNG and WebP images are allowed.");
  });

  it("rejects images larger than four megabytes", () => {
    expect(validateCoverImage({ type: "image/jpeg", size: coverImageMaxBytes + 1 })).toBe("Image must be 4 MB or smaller.");
  });
});
