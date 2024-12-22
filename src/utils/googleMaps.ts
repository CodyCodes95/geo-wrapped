type Coordinate = {
  min: number;
  max: number;
};

type CoordinateRanges = {
  latitude: Coordinate;
  longitude: Coordinate;
  heading: Coordinate;
  pitch: Coordinate;
  zoom: Coordinate;
};

type StreetViewParams = {
  latitude: number;
  longitude: number;
  heading?: number;
  pitch?: number;
  zoom?: number;
  panoramaId?: string;
};

const COORDINATE_RANGES: CoordinateRanges = {
  latitude: { min: -90, max: 90 },
  longitude: { min: -180, max: 180 },
  heading: { min: 0, max: 360 },
  pitch: { min: -90, max: 90 },
  zoom: { min: 0, max: 21 }, // Google Maps max zoom is 21
};

function validateCoordinate(name: keyof CoordinateRanges, value: number): void {
  const range = COORDINATE_RANGES[name];
  if (value < range.min || value > range.max) {
    throw new Error(
      `Invalid ${name}: ${value}. Must be between ${range.min} and ${range.max} degrees.`,
    );
  }
}

function processStreetViewPanoramaId(panoramaId: string): string {
  const isHexString =
    panoramaId.length % 2 === 0 && /^[0-9a-fA-F]+$/.test(panoramaId);
  return isHexString ? hexToAscii(panoramaId) : panoramaId;
}

function hexToAscii(hexString: string): string {
  const chars = [];
  for (let i = 0; i < hexString.length / 2; i++) {
    const hex = hexString.substr(i * 2, 2);
    chars.push(String.fromCharCode(parseInt(hex, 16)));
  }
  return chars.join("");
}

export function buildStreetViewUrl({
  latitude,
  longitude,
  heading = 0,
  pitch = 0,
  zoom = 0,
  panoramaId = "",
}: StreetViewParams): string {
  validateCoordinate("latitude", latitude);
  validateCoordinate("longitude", longitude);
  validateCoordinate("heading", heading);
  validateCoordinate("pitch", pitch);
  validateCoordinate("zoom", zoom);

  const baseUrl = new URL("https://www.google.com/maps/@");
  const fieldOfView = 180 / Math.pow(2, zoom);

  const urlParams = new URLSearchParams({
    api: "1",
    map_action: "pano",
    viewpoint: `${latitude},${longitude}`,
    heading: heading.toString(),
    pitch: pitch.toString(),
    fov: fieldOfView.toString(),
  });

  if (panoramaId) {
    urlParams.append("pano", processStreetViewPanoramaId(panoramaId));
  }

  baseUrl.search = urlParams.toString();
  return baseUrl.toString();
}