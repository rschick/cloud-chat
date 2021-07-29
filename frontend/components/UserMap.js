import { useCallback, useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import { Form } from "react-bootstrap";
import dynamic from "next/dynamic";
import users from "@state/users";
import auth from "@state/auth";

const Map = dynamic(() => import("@components/Map"), { ssr: false });

export default function UserMap() {
  const { items } = useSnapshot(users);
  const { user } = useSnapshot(auth);
  const [center, setCenter] = useState();
  const [searchRadius, setSearchRadius] = useState(50000);

  const markers = items
    .filter((item) => item.value.lat)
    .map(({ key, value }) => ({
      key,
      lat: value.lat,
      lon: value.lon,
      text: value.name,
    }));

  const handleBoundsChange = useCallback((bounds) => {
    users.setSearchBounds(bounds);
  }, []);

  const handleCenterChange = useCallback((center) => {
    setCenter(center);
  }, []);

  const handleSearchRadiusChange = useCallback((event) => {
    setSearchRadius(event.target.value);
  }, []);

  useEffect(() => {
    if (center && searchRadius) {
      users.setSearchRadius(center, searchRadius);
    }
  }, [center, searchRadius]);

  return (
    <>
      <Map
        zoom={10}
        markers={markers}
        height={200}
        lat={user.lat}
        lon={user.lon}
        searchRadius={searchRadius}
        onBoundsChange={handleBoundsChange}
        onCenterChange={handleCenterChange}
      />
      <p>{searchRadius / 1000}km</p>
      <Form.Range
        value={searchRadius}
        onChange={handleSearchRadiusChange}
        min={10000}
        max={5000000}
        step={10000}
      />
    </>
  );
}
