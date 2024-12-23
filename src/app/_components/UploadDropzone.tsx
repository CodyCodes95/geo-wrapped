"use client";
import { CheckIcon, CopyIcon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardTitle } from "~/components/ui/card";
import { UploadDropzone } from "~/utils/uploadthing";

const Upload = () => {
  const [wrappedUrl, setWrappedUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(wrappedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (wrappedUrl) {
    return (
      <Card className="flex flex-col gap-4 rounded-xl p-6 shadow-lg">
        <CardTitle>Your results are being processed!</CardTitle>
        <CardContent>
          <div className="flex items-center gap-2 rounded-lg bg-primary-foreground p-3">
            <input
              type="text"
              value={wrappedUrl}
              readOnly
              className="flex-1 bg-transparent outline-none"
            />
            <button
              onClick={copyToClipboard}
              className="rounded-md p-2 transition-colors hover:bg-primary-foreground"
              title="Copy URL"
            >
              {copied ? (
                <CheckIcon className="h-5 w-5 text-primary" />
              ) : (
                <CopyIcon className="h-5 w-5 text-white" />
              )}
            </button>
          </div>
          <p className="mt-4 text-sm">
            Come back in about 30 minutes to see your year in review!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <UploadDropzone
      className="border-2 border-primary"
      endpoint="geoDataUploader"
      onClientUploadComplete={(res) => {
        // Do something with the response
        setWrappedUrl(`${window.location.origin}${res[0]!.serverData.url}`);
      }}
      onUploadError={(error: Error) => {
        toast.error(
          `Something went wrong ☹️ please reach out @zezima on Discord`,
        );
      }}
    />
  );
};

export default Upload;
