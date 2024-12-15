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
    "application/json": {
      maxFileSize: "64MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req, files }) => {
      const file = files[0];
      if (!file) {
        throw new UploadThingError("No file uploaded");
      }

      try {
        const geoguessrUser = await scrapeGeoguessrPlayerData(
          file.name.split(".")[0]!,
        );
        await db.insert(players).values({
          geoguessrId: geoguessrUser.id,
          avatarUrl: geoguessrUser.avatarUrl,
          countryCode: geoguessrUser.countryCode,
          nick: geoguessrUser.nick,
        });
        return { userId: geoguessrUser.id };
      } catch (error) {
        console.log(error);
        throw new UploadThingError("Error uploading file");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete");

      console.log("file url", file.url);

      const player = await db
        .update(players)
        .set({ dataUrl: file.url })
        .where(eq(players.playerId, metadata.userId))
        .returning({ playerId: players.playerId });

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      // return { uploadedBy: metadata.userId };
      return { url: `/${player[0]?.playerId}` };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
