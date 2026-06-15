import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

import { useEffect } from "react";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import { locations } from "../data/locations";
import { useMapStore } from "../store/useMapStore";

// Fix marker icons in Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const CENTER: [number, number] = [23.4129, 85.4407];

function FocusLocation() {
  const map = useMap();

  const selectedLocation = useMapStore((state) => state.selectedLocation);

  useEffect(() => {
    if (!selectedLocation) return;

    const location = locations.find((loc) => loc.name === selectedLocation);

    if (!location) return;

    map.flyTo([location.lat, location.lng], 18, {
      duration: 2,
    });
  }, [selectedLocation, map]);

  return null;
}

function CampusMap() {
  return (
    <MapContainer
      center={CENTER}
      zoom={16}
      className="h-full w-full rounded-xl"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FocusLocation />

      {locations.map((location) => (
        <Marker key={location.id} position={[location.lat, location.lng]}>
          <Popup>
            <div className="min-w-[180px]">
              <h3 className="font-bold text-lg">{location.name}</h3>

              <p>{location.description}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default CampusMap;
