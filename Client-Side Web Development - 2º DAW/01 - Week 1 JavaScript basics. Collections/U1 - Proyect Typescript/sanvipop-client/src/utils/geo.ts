// src/utils/geo.ts
export interface GeoLocationData {
  latitude: number;
  longitude: number;
}

export async function getUserGeolocation(): Promise<GeoLocationData | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      () => resolve(null),
      { enableHighAccuracy: true }
    );
  });
}
