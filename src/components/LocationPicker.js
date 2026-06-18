// frontend/src/components/LocationPicker.js
import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Reusa el mismo fix de íconos que PropertyMap
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const BOGOTA = [4.6097, -74.0721];

// Captura clics en el mapa y permite arrastrar el marcador.
function ClickMarker({ position, onChange }) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  if (!position) return null;

  return (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend(e) {
          const { lat, lng } = e.target.getLatLng();
          onChange({ lat, lng });
        },
      }}
    />
  );
}

// onChange recibe { lat, lng }. lat/lng (strings o números) definen el marcador actual.
export default function LocationPicker({ lat, lng, onChange, height = '300px' }) {
  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  const hasPosition = Number.isFinite(latNum) && Number.isFinite(lngNum);
  const position = hasPosition ? [latNum, lngNum] : null;

  return (
    <div>
      <p style={{ fontSize: '12px', color: '#666', margin: '0 0 6px 0' }}>
        Haz clic en el mapa para marcar la ubicación de la propiedad (o arrastra el marcador).
      </p>
      <MapContainer
        center={position || BOGOTA}
        zoom={hasPosition ? 15 : 12}
        scrollWheelZoom={true}
        style={{ height, width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickMarker position={position} onChange={onChange} />
      </MapContainer>
    </div>
  );
}
