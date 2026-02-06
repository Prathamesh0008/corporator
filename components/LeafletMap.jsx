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
  const defaultBoundaryStyle = {
    color: "#1e3a8a",
    weight: 3,
    fillColor: "#1e3a8a",
    fillOpacity: 0.12
  };

  const hoverBoundaryStyle = {
    color: "#ff0000",
    weight: 3,
    fillColor: "#ff0000",
    fillOpacity: 0.2
  };

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
          pathOptions={defaultBoundaryStyle}
          eventHandlers={{
            mouseover: (event) => {
              event.target.setStyle(hoverBoundaryStyle);
            },
            mouseout: (event) => {
              event.target.setStyle(defaultBoundaryStyle);
            }
          }}
        />
      ) : null}
      <Marker position={center}>
        <Popup>{title}</Popup>
      </Marker>
    </MapContainer>
  );
}
