// @ts-nocheck — archived file, leaflet/react-leaflet removed from deps
"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const LAT = 57.7217545;
const LNG = 12.9370434;

const dotIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:12px;height:12px;border-radius:50%;
    background:#D4622B;border:2px solid #fff;
    box-shadow:0 0 0 4px rgba(212,98,43,0.20),0 2px 8px rgba(0,0,0,0.20);
  "></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

function ScrollControl() {
  const map = useMap();
  useEffect(() => {
    map.scrollWheelZoom.disable();
    const el = map.getContainer();
    const enable = () => map.scrollWheelZoom.enable();
    const disable = () => map.scrollWheelZoom.disable();
    el.addEventListener("click", enable);
    el.addEventListener("mouseleave", disable);
    return () => {
      el.removeEventListener("click", enable);
      el.removeEventListener("mouseleave", disable);
    };
  }, [map]);
  return null;
}

export default function KhyteMap() {
  return (
    <MapContainer
      center={[LAT, LNG]}
      zoom={16}
      style={{ width: "100%", height: "100%" }}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png" />
      <Marker position={[LAT, LNG]} icon={dotIcon}>
        <Popup closeButton={false} className="khyte-popup">
          <div style={{ fontFamily: "var(--font-geist-sans)", padding: "2px 0" }}>
            <p style={{ fontWeight: 700, fontSize: "13px", color: "#1A120E", marginBottom: "2px" }}>Khyte Automations</p>
            <p style={{ fontSize: "12px", color: "#8A7D78", lineHeight: 1.4 }}>Västerbrogatan 8A<br />503 30, Borås</p>
          </div>
        </Popup>
      </Marker>
      <ScrollControl />
    </MapContainer>
  );
}
