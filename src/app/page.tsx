import { MapPinIcon } from "lucide-react";
import Upload from "./_components/UploadDropzone";
import { HydrateClient } from "~/trpc/server";

export default function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-around p-24">
        <div className="mb-12 text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <MapPinIcon className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold">Geoguessr Wrapped</h1>
          </div>
          <p className="mx-auto max-w-2xl text-xl">
            Discover your year in Geoguessr! Upload your activity file to see
            your 2024 stats.
          </p>
        </div>
        <Upload />
        <p>
          To get your activity file, follow steps 1-3{" "}
          <a
            className="text-blue-500"
            target="_blank"
            href="https://docs.google.com/document/d/1hGR7ZsZiFUHXEUfT53fgGhdoShvTn8zTiMa6BNC29Vk/edit?tab=t.0#heading=h.en340hnzz97"
          >
            here
          </a>
        </p>
      </main>
    </HydrateClient>
  );
}
