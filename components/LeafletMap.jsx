"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultBoundaryStyle = {
  color: "#1e3a8a",
  weight: 3,
  fillColor: "#1e3a8a",
  fillOpacity: 0.12,
};

const hoverBoundaryStyle = {
  color: "#ff0000",
  weight: 3,
  fillColor: "#ff0000",
  fillOpacity: 0.2,
};

export default function LeafletMap({ center, zoom = 13, title, boundary }) {
  const containerRef = useRef(null);
  const latitude = center[0];
  const longitude = center[1];

  useEffect(() => {
    // Own the map and all its layers in the same effect. Strict Mode and route
    // restoration must create a fresh map after cleanup, never reuse removed panes.
    const container = containerRef.current;
    const map = L.map(container, { scrollWheelZoom: false }).setView([latitude, longitude], zoom);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    if (boundary?.length) {
      L.polygon(boundary, defaultBoundaryStyle)
        .on({
          mouseover: (event) => event.target.setStyle(hoverBoundaryStyle),
          mouseout: (event) => event.target.setStyle(defaultBoundaryStyle),
        })
        .addTo(map);
    }

    const icon = L.icon({
      iconRetinaUrl: markerIcon2x.src || markerIcon2x,
      iconUrl: markerIcon.src || markerIcon,
      shadowUrl: markerShadow.src || markerShadow,
      iconSize: [25, 41], iconAnchor: [12, 41],
      popupAnchor: [1, -34], tooltipAnchor: [16, -28], shadowSize: [41, 41],
    });
    // Leaflet treats strings as HTML; keep the same escaping as React's Popup.
    const popup = document.createElement("span");
    popup.textContent = title || "";
    L.marker([latitude, longitude], { icon }).bindPopup(popup).addTo(map);

    let active = true;
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => {
      if (active) map.invalidateSize();
    });
    observer?.observe(container);
    return () => {
      active = false;
      observer?.disconnect();
      map.remove();
    };
  }, [latitude, longitude, zoom, title, boundary]);

  return <div ref={containerRef} className="h-full w-full" />;
}
