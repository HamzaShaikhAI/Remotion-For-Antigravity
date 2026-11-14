/**
 * WebMercatorProjection
 * Deterministic mathematical projection from geographical (lat, lng) to (x, y) screen coordinates.
 * Zero external GIS dependencies.
 */

export interface GeoCoordinate {
  lat: number;
  lng: number;
  name?: string;
}

export class WebMercatorProjection {
  public static project(
    lat: number,
    lng: number,
    mapWidth: number,
    mapHeight: number
  ): { x: number; y: number } {
    // Standard Web Mercator EPSG:3857 projection formulas
    const x = ((lng + 180) * (mapWidth / 360));

    const latRad = (lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = mapHeight / 2 - (mapWidth * mercN) / (2 * Math.PI);

    return { x, y };
  }

  /**
   * Generates geodesic arc Bezier control points between two coordinates.
   */
  public static getGeodesicArc(
    start: { x: number; y: number },
    end: { x: number; y: number },
    arcHeight = 120
  ): { pathD: string; controlPoint: { x: number; y: number } } {
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2 - arcHeight;

    const pathD = `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
    return { pathD, controlPoint: { x: midX, y: midY } };
  }
}
