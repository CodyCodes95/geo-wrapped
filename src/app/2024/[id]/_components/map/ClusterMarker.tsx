import { AdvancedMarker } from "@vis.gl/react-google-maps";

type ClusterMarkerProps = {
  count: number;
  position: { lat: number; lng: number };
  avatarUrl: string;
};

export const ClusterMarker = ({
  count,
  position,
  avatarUrl,
}: ClusterMarkerProps) => {
  return (
    <AdvancedMarker position={position} anchorPoint={["50%", "50%"]}>
      <div className="relative">
        <img
          className="h-8 w-8 rounded-full border-2 border-white"
          src={`https://www.geoguessr.com/images/resize:auto:96:96/gravity:ce/plain/${avatarUrl}`}
        />
        <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
          {count}
        </div>
      </div>
    </AdvancedMarker>
  );
};
