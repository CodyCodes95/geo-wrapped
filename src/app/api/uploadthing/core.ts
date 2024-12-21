/* eslint-disable @typescript-eslint/only-throw-error */
import { eq } from "drizzle-orm";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { db } from "~/server/db";
import { players } from "~/server/db/schema";
import { scrapeGeoguessrPlayerData } from "~/utils/scrapePlayerData";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  geoDataUploader: f({
    "text/csv": {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    // .middleware(async ({ req, files }) => {
    //   throw new Error("Not implemented");
    // })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete");

      console.log("file url", file.url);

      const player = await db
        .insert(players)
        .values({
          dataUrl: file.url,
        })
        .returning({ playerId: players.playerId });

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      // return { uploadedBy: metadata.userId };
      return { url: `/2024/${player?.[0]?.playerId}/wrapped` };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
