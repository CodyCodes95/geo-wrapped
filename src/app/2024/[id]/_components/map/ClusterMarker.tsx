import { AdvancedMarker } from "@vis.gl/react-google-maps";

type ClusterMarkerProps = {
  count: number;
  position: { lat: number; lng: number };
};

export const ClusterMarker = ({ count, position }: ClusterMarkerProps) => {
  return (
    <AdvancedMarker position={position} anchorPoint={["50%", "50%"]}>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white">
        {count}
      </div>
    </AdvancedMarker>
  );
};
