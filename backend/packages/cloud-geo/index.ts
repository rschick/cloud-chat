import {
  S2Cell,
  S2CellId,
  S2LatLng,
  S2Region,
  S2RegionCoverer,
  S2LatLngRect,
} from "nodes2ts";

import { GeoPoint } from "./types";

function hash(lat, long) {
  const latLng = S2LatLng.fromDegrees(lat, long);
  const cell = S2Cell.fromLatLng(latLng);
  const cellId = cell.id;
  return cellId.toToken();
}

function coverRect(s2rect: S2Region): S2CellId[] {
  return new S2RegionCoverer().getCoveringCells(s2rect);
}

function coverCircle(center: GeoPoint, radius: number): S2CellId[] {
  return new S2RegionCoverer().getCoveringCells(
    getBoundingRectForCircle({
      radius,
      center,
    })
  );
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
