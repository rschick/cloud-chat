import {
  S2Cell,
  S2LatLng,
  S2Region,
  S2RegionCoverer,
  S2LatLngRect,
} from "nodes2ts";

import { Covering } from "./model/Covering";
import { S2Util } from "./s2/S2Util";
import { GeoPoint } from "./types";

function hash(lat, long) {
  const latLng = S2LatLng.fromDegrees(lat, long);
  const cell = S2Cell.fromLatLng(latLng);
  const cellId = cell.id;
  const geohash = cellId.id;

  let length = 10;

  if (geohash.lessThan(0)) {
    length++;
  }

  const geohashString = geohash.toString(10);
  const denominator = Math.pow(10, geohashString.length - length);
  const result = geohash.divide(denominator);

  return result.toString(10);
}

function coverRect(s2rect: S2Region): Covering {
  return new Covering(new S2RegionCoverer().getCoveringCells(s2rect));
}

function coverCircle(center: GeoPoint, radius: number): Covering {
  return new Covering(
    new S2RegionCoverer().getCoveringCells(
      S2Util.getBoundingLatLngRectFromQueryRadiusInput({
        RadiusInMeter: radius,
        CenterPoint: center,
      })
    )
  );
}

function rect(sw, ne) {
  const minLatLng = S2LatLng.fromDegrees(sw.latitude, sw.longitude);
  const maxLatLng = S2LatLng.fromDegrees(ne.latitude, ne.longitude);
  return S2LatLngRect.fromLatLng(minLatLng, maxLatLng);
}

function point(lat, lon) {
  return S2LatLng.fromDegrees(lat, lon);
}

function pointInCircle(
  point: GeoPoint,
  center: GeoPoint,
  radius: number
): boolean {
  const centerLatLng = S2LatLng.fromDegrees(center.latitude, center.longitude);
  const latLng: S2LatLng = S2LatLng.fromDegrees(
    point.latitude,
    point.longitude
  );
  return centerLatLng.getEarthDistance(latLng) <= radius;
}

export const geo = {
  hash,
  coverCircle,
  coverRect,
  rect,
  point,
  pointInCircle,
};
