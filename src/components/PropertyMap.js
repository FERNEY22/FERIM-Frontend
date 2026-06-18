// frontend/src/components/PropertyMap.js
import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- Fix de íconos de marcador (CRA/webpack rompe las rutas por defecto de Leaflet) ---
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Centro por defecto: Bogotá
const BOGOTA = [4.6097, -74.0721];

// Valida que la propiedad tenga coordenadas GeoJSON utilizables.
// Mongo guarda [lng, lat] (orden GeoJSON); Leaflet usa [lat, lng].
function getLatLng(property) {
  const coords = property?.location?.coordinates;
  if (!Array.isArray(coords) || coords.length !== 2) return null;
  const [lng, lat] = coords.map(Number);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat === 0 && lng === 0) return null; // coords vacías/placeholder
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return [lat, lng];
}

// Ajusta la vista para que entren todos los marcadores.
function FitBounds({ points }) {
  const map = useMap();
  React.useEffect(() => {
    if (!points.length) return;
    if (points.length === 1) {
      map.setView(points[0], 15);
    } else {
      map.fitBounds(points, { padding: [40, 40] });
    }
  }, [map, points]);
  return null;
}

export default function PropertyMap({
  properties = [],
  height = '500px',
  zoom = 12,
  center = BOGOTA,
  fitToMarkers = true,
}) {
  // Solo propiedades con coordenadas válidas
  const located = useMemo(
    () =>
      properties
        .map((p) => ({ property: p, latlng: getLatLng(p) }))
        .filter((x) => x.latlng !== null),
    [properties]
  );

  const points = useMemo(() => located.map((x) => x.latlng), [located]);

  return (
    <div style={{ position: 'relative' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height, width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {fitToMarkers && <FitBounds points={points} />}

        {located.map(({ property, latlng }) => (
          <Marker key={property._id} position={latlng}>
            <Popup>
              <div style={{ minWidth: '180px' }}>
                {property.images?.[0]?.url && (
                  <img
                    src={property.images[0].url}
                    alt={property.title}
                    style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '4px', marginBottom: '6px' }}
                  />
                )}
                <h3 style={{ margin: '0 0 6px 0', fontSize: '15px' }}>
                  {property.title}
                </h3>
                <p style={{ margin: '0 0 4px 0', fontWeight: 'bold' }}>
                  $ {Number(property.price).toLocaleString('es-CO')} COP
                </p>
                <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666' }}>
                  Tipo: {property.type}
                </p>
                {property.location?.address && (
                  <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>
                    📍 {property.location.address}
                  </p>
                )}
                <Link
                  to={`/propiedad/${property._id}`}
                  style={{
                    display: 'inline-block',
                    padding: '5px 10px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                >
                  Ver detalles
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {located.length === 0 && (
        <p
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: '10px 16px',
            borderRadius: '6px',
            zIndex: 1000,
            fontSize: '14px',
            color: '#555',
            textAlign: 'center',
          }}
        >
          No hay propiedades georreferenciadas para mostrar.
        </p>
      )}
    </div>
  );
}
