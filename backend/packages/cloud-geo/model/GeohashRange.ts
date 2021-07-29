import Long from "long";

function generateHashKey(geohash: Long, hashKeyLength: number) {
  const geohashString = geohash.toUnsigned().toString(10);
  const denominator = Math.pow(10, geohashString.length - hashKeyLength);
  return geohash.divide(denominator);
}

export class GeohashRange {
  rangeMin: Long;
  rangeMax: Long;

  constructor(min: Long | number, max: Long | number) {
    this.rangeMin = Long.isLong(min) ? <Long>min : Long.fromNumber(<number>min);
    this.rangeMax = Long.isLong(max) ? <Long>max : Long.fromNumber(<number>max);
  }

  public trySplit(hashKeyLength): GeohashRange[] {
    const result: GeohashRange[] = [];

    const minHashKey = generateHashKey(this.rangeMin, hashKeyLength);
    const maxHashKey = generateHashKey(this.rangeMax, hashKeyLength);

    const denominator = Math.pow(
      10,
      this.rangeMin.toString().length - minHashKey.toString().length
    );

    if (minHashKey.equals(maxHashKey)) {
      result.push(this);
    } else {
      for (let l = minHashKey; l.lessThanOrEqual(maxHashKey); l = l.add(1)) {
        if (l.greaterThan(0)) {
          result.push(
            new GeohashRange(
              l.equals(minHashKey) ? this.rangeMin : l.multiply(denominator),
              l.equals(maxHashKey)
                ? this.rangeMax
                : l.add(1).multiply(denominator).subtract(1)
            )
          );
        } else {
          result.push(
            new GeohashRange(
              l.equals(minHashKey)
                ? this.rangeMin
                : l.subtract(1).multiply(denominator).add(1),
              l.equals(maxHashKey) ? this.rangeMax : l.multiply(denominator)
            )
          );
        }
      }
    }

    return result;
  }
}
