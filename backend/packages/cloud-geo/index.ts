import {
  S2Cell,
  S2LatLng,
  S2Region,
  S2RegionCoverer,
  S2LatLngRect,
} from "nodes2ts";

import { Covering } from "./model/Covering";
import { GeoPoint } from "./types";

function hash(lat, long) {
  const latLng = S2LatLng.fromDegrees(lat, long);
  const cell = S2Cell.fromLatLng(latLng);
  const cellId = cell.id;
  const geohash = cellId.id.toUnsigned();
  let length = 10;
  const geohashString = geohash.toString(10);
  const denominator = Math.pow(10, geohashString.length - length);
  const result = geohash.divide(denominator);

  return result.toString(10);
}

function coverRect(s2rect: S2Region): Covering {
  return new Covering(new S2RegionCoverer().getCoveringCells(s2rect));
}

function getBoundingRectForCircle({
  center,
  radius,
}: {
  radius: number;
  center: GeoPoint;
}): S2LatLngRect {
  const centerLatLng = S2LatLng.fromDegrees(center.latitude, center.longitude);

  const latReferenceUnit = center.latitude > 0.0 ? -1.0 : 1.0;
  const latReferenceLatLng = S2LatLng.fromDegrees(
    center.latitude + latReferenceUnit,
    center.longitude
  );
  const lngReferenceUnit = center.longitude > 0.0 ? -1.0 : 1.0;
  const lngReferenceLatLng = S2LatLng.fromDegrees(
    center.latitude,
    center.longitude + lngReferenceUnit
  );

  const latForRadius =
    radius / centerLatLng.getEarthDistance(latReferenceLatLng);

  const lngForRadius =
    radius / centerLatLng.getEarthDistance(lngReferenceLatLng);

  const minLatLng = S2LatLng.fromDegrees(
    center.latitude - latForRadius,
    center.longitude - lngForRadius
  );
  const maxLatLng = S2LatLng.fromDegrees(
    center.latitude + latForRadius,
    center.longitude + lngForRadius
  );

  return S2LatLngRect.fromLatLng(minLatLng, maxLatLng);
}

function coverCircle(center: GeoPoint, radius: number): Covering {
  return new Covering(
    new S2RegionCoverer().getCoveringCells(
      getBoundingRectForCircle({
        radius,
        center,
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
