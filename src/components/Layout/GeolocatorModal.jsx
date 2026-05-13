import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ─────────────────────────────────────────
   FIX ICONS
───────────────────────────────────────── */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;

  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ─────────────────────────────────────────
   COMPONENT
───────────────────────────────────────── */

export default function GeolocatorModal({
  sucursales = [],
  onSelectSucursal,
  onDismiss,
  forceSelection = false,
}) {
  const [loadingLocation, setLoadingLocation] = useState(true);

  const [userPosition, setUserPosition] = useState(null);

  const [nearestSucursal, setNearestSucursal] = useState(null);

  const [error, setError] = useState("");

  /* ─────────────────────────────────────────
     GET USER LOCATION
  ───────────────────────────────────────── */

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Tu navegador no soporta geolocalización");
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setUserPosition(coords);
        setLoadingLocation(false);
      },

      (err) => {
        console.log(err);

        setError("No pudimos obtener tu ubicación");
        setLoadingLocation(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  /* ─────────────────────────────────────────
     ADD DISTANCE TO STORES
  ───────────────────────────────────────── */

  const sucursalesConDistancia = useMemo(() => {
    if (!userPosition) return sucursales;

    return sucursales.map((sucursal) => {
      if (!sucursal.latitud || !sucursal.longitud) {
        return {
          ...sucursal,
          distance: null,
        };
      }

      const distance = getDistanceKm(
        userPosition.lat,
        userPosition.lng,
        parseFloat(sucursal.latitud),
        parseFloat(sucursal.longitud)
      );

      return {
        ...sucursal,
        distance,
      };
    });
  }, [sucursales, userPosition]);

  /* ─────────────────────────────────────────
     FIND NEAREST
  ───────────────────────────────────────── */

  useEffect(() => {
    if (!sucursalesConDistancia.length) return;

    const valid = sucursalesConDistancia.filter(
      (s) => s.distance !== null
    );

    if (!valid.length) return;

    const nearest = valid.reduce((prev, current) =>
      prev.distance < current.distance ? prev : current
    );

    setNearestSucursal(nearest);
  }, [sucursalesConDistancia]);

  /* ─────────────────────────────────────────
     MAP CENTER
  ───────────────────────────────────────── */

  const mapCenter = useMemo(() => {
    if (userPosition) {
      return [userPosition.lat, userPosition.lng];
    }

    return [-12.0464, -77.0428];
  }, [userPosition]);

  /* ─────────────────────────────────────────
     RENDER
  ───────────────────────────────────────── */

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-[32px] overflow-hidden shadow-2xl">

        {/* HEADER */}

        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div>
            <p className="text-sm font-semibold text-red-600 uppercase tracking-wider mb-2">
              Ubicación
            </p>

            <h2 className="text-3xl font-black text-gray-900">
              Selecciona tu sucursal
            </h2>
          </div>

          <button
            onClick={onDismiss}
            className="w-12 h-12 rounded-2xl bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] min-h-[650px]">

          {/* SIDEBAR */}

          <div className="border-r border-gray-100 overflow-y-auto">

            {/* LOADING */}

            {loadingLocation && (
              <div className="p-8">
                <p className="font-bold text-gray-700">
                  📍 Detectando ubicación...
                </p>
              </div>
            )}

            {/* ERROR */}

            {!loadingLocation && error && (
              <div className="p-8">
                <div className="bg-red-50 border border-red-100 rounded-3xl p-6">
                  <h3 className="font-bold text-red-600 mb-2">
                    Error de ubicación
                  </h3>

                  <p className="text-sm text-gray-600">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* SUCURSALES */}

            {!loadingLocation && !error && (
              <div className="p-6 space-y-4">

                {sucursalesConDistancia.map((sucursal) => {

                  const isNearest =
                    nearestSucursal?.id_sucursal ===
                    sucursal.id_sucursal;

                  return (
                    <button
                      key={sucursal.id_sucursal}
                      onClick={() => onSelectSucursal(sucursal)}
                      className={`
                        w-full
                        text-left
                        p-5
                        rounded-3xl
                        border
                        transition-all
                        duration-300
                        hover:shadow-lg
                        ${
                          isNearest
                            ? "border-red-500 bg-red-50"
                            : "border-gray-100 hover:border-gray-300"
                        }
                      `}
                    >
                      <div className="flex items-start justify-between mb-4">

                        <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-bold">
                          {sucursal.nombre?.charAt(0) || "S"}
                        </div>

                        {isNearest && (
                          <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            Más cercana
                          </div>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {sucursal.nombre || "Sucursal"}
                      </h3>

                      <p className="text-sm text-gray-500 mb-3 leading-relaxed">
                        {sucursal.direccion}
                      </p>

                      {/* DISTANCIA */}

                      {sucursal.distance !== null && (
                        <div className="inline-flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200">
                          <span>📍</span>

                          <span className="text-sm font-semibold text-gray-700">
                            {sucursal.distance.toFixed(1)} km de distancia
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* MAP */}

          <div className="relative">

            <MapContainer
              center={mapCenter}
              zoom={13}
              scrollWheelZoom={true}
              className="w-full h-full"
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* USER */}

              {userPosition && (
                <>
                  <Marker
                    position={[
                      userPosition.lat,
                      userPosition.lng,
                    ]}
                  >
                    <Popup>
                      Tu ubicación actual
                    </Popup>
                  </Marker>

                  <Circle
                    center={[
                      userPosition.lat,
                      userPosition.lng,
                    ]}
                    radius={250}
                    pathOptions={{
                      color: "#dc2626",
                      fillColor: "#dc2626",
                      fillOpacity: 0.1,
                    }}
                  />
                </>
              )}

              {/* STORES */}

              {sucursalesConDistancia.map((sucursal) => {

                if (!sucursal.latitud || !sucursal.longitud)
                  return null;

                return (
                  <Marker
                    key={sucursal.id_sucursal}
                    position={[
                      parseFloat(sucursal.latitud),
                      parseFloat(sucursal.longitud),
                    ]}
                  >
                    <Popup>
                      <div className="min-w-[180px]">

                        <h3 className="font-bold text-gray-900 mb-1">
                          {sucursal.nombre}
                        </h3>

                        <p className="text-sm text-gray-600 mb-2">
                          {sucursal.direccion}
                        </p>

                        {sucursal.distance !== null && (
                          <p className="text-sm font-bold text-red-600 mb-4">
                            📍 {sucursal.distance.toFixed(1)} km
                          </p>
                        )}

                        <button
                          onClick={() =>
                            onSelectSucursal(sucursal)
                          }
                          className="w-full bg-red-600 text-white rounded-xl py-2 font-semibold"
                        >
                          Seleccionar
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>

            {/* MAP OVERLAY */}

            <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 px-5 py-4 z-[1000]">

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Estado
              </p>

              <h3 className="font-bold text-gray-900">
                {nearestSucursal
                  ? "Sucursal detectada"
                  : "Buscando ubicación"}
              </h3>

              {nearestSucursal?.distance && (
                <p className="text-sm text-red-600 font-semibold mt-1">
                  {nearestSucursal.distance.toFixed(1)} km
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}