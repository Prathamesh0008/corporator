"use client";

import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src || markerIcon2x,
  iconUrl: markerIcon.src || markerIcon,
  shadowUrl: markerShadow.src || markerShadow
});

export default function LeafletMap({ center, zoom = 13, title, boundary }) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {boundary?.length ? (
        <Polygon
          positions={boundary}
          pathOptions={{ color: "#ff3b30", weight: 3, fillColor: "#ff3b30", fillOpacity: 0.12 }}
        />
      ) : null}
      <Marker position={center}>
        <Popup>{title}</Popup>
      </Marker>
    </MapContainer>
  );
}
