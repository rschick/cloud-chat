import { S2Cell, S2LatLng, S2RegionCoverer, S2LatLngRect } from "nodes2ts";

import { GeoDataManager } from "./GeoDataManager";
import { GeoDataManagerConfiguration } from "./GeoDataManagerConfiguration";
import { GeoTableUtil } from "./util/GeoTableUtil";
import { Covering } from "./model/Covering";
import { S2Util } from "./s2/S2Util";

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

function cover(s2rect) {
  return new Covering(new S2RegionCoverer().getCoveringCells(s2rect));
}

function rect(sw, ne) {
  const minLatLng = S2LatLng.fromDegrees(sw.latitude, sw.longitude);
  const maxLatLng = S2LatLng.fromDegrees(ne.latitude, ne.longitude);
  return S2LatLngRect.fromLatLng(minLatLng, maxLatLng);
}

function point(lat, lon) {
  return S2LatLng.fromDegrees(lat, lon);
}

export const geo = {
  hash,
  cover,
  rect,
  point,
};

export { GeoDataManager, GeoDataManagerConfiguration, GeoTableUtil };
