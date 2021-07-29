import { useCallback, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
  Circle,
} from "react-leaflet";

function ConvertBounds(leafletBounds) {
  const sw = leafletBounds.getSouthWest();
  const ne = leafletBounds.getNorthEast();

  return {
    sw: {
      lat: sw.lat,
      lon: sw.lng,
    },
    ne: {
      lat: ne.lat,
      lon: ne.lng,
    },
  };
}

function ConvertPoint(point) {
  return {
    lat: point.lat,
    lon: point.lng,
  };
}

function EventListener({
  onBoundsChange = () => {},
  onCenterChange = () => {},
}) {
  const map = useMapEvents({
    move() {
      onBoundsChange(ConvertBounds(map.getBounds()));
      onCenterChange(ConvertPoint(map.getCenter()));
    },
    zoom() {
      onBoundsChange(ConvertBounds(map.getBounds()));
      onCenterChange(ConvertPoint(map.getCenter()));
    },
  });

  useEffect(() => {
    onBoundsChange(ConvertBounds(map.getBounds()));
    onCenterChange(ConvertPoint(map.getCenter()));
  }, [map, onBoundsChange, onCenterChange]);

  return null;
}

const fillBlueOptions = { fillColor: "blue" };

function SearchCircle({ radius }) {
  const map = useMap();

  console.log(radius);

  return (
    <Circle
      center={map.getCenter()}
      radius={radius}
      pathOptions={fillBlueOptions}
    />
  );
}

export default function Map({
  height = 200,
  zoom = 13,
  markers = [],
  lat = 0,
  lon = 0,
  searchRadius = 100000,
  onBoundsChange = () => {},
  onCenterChange = () => {},
}) {
  const handleMarkerClick = useCallback((event) => {
    console.log(event);
  }, []);

  return (
    <MapContainer
      style={{ height }}
      center={[lat, lon]}
      zoom={zoom}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map(({ key, lat, lon, text }) => (
        <Marker key={key} position={[lat, lon]} onClick={handleMarkerClick}>
          <Popup>{text}</Popup>
        </Marker>
      ))}
      <EventListener
        onBoundsChange={onBoundsChange}
        onCenterChange={onCenterChange}
      />
      {searchRadius && <SearchCircle radius={searchRadius} />}
    </MapContainer>
  );
}
