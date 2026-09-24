import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { session } from "@/lib/auth";

const upload = createUploadthing();

export const uploadRouter = {
  bookCover: upload({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const user = await session();
      if (!user || user.role !== "ROLE_ADMIN") {
        throw new UploadThingError("You do not have permission for this action.");
      }
      return { userId: user.id };
    })
    .onUploadComplete(({ file, metadata }) => ({
      url: file.ufsUrl,
      uploadedBy: metadata.userId,
    })),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
