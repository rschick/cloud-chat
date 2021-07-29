import { useCallback, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
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

function EventListener({ onBoundsChange = () => {} }) {
  const map = useMapEvents({
    move() {
      onBoundsChange(ConvertBounds(map.getBounds()));
    },
    zoom() {
      onBoundsChange(ConvertBounds(map.getBounds()));
    },
  });

  useEffect(() => {
    onBoundsChange(ConvertBounds(map.getBounds()));
  }, [map, onBoundsChange]);

  return null;
}

export default function Map({
  height = 200,
  zoom = 13,
  markers = [],
  lat = 0,
  lon = 0,
  onBoundsChange = () => {},
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
      <EventListener onBoundsChange={onBoundsChange} />
    </MapContainer>
  );
}
