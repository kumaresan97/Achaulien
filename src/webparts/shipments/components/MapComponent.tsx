import * as React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../../Global/Style.css";

import { useEffect, useRef } from "react";

let img = require("../../Global/Images/Pencil.svg");
// Fix for Leaflet's default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapComponent: React.FC<{ routeData: any }> = ({ routeData }) => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Initialize the map if it doesn't exist yet
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([34.0522, -118.2437], 13); // Centered on the first point of the first route

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }

    // Remove existing layers before adding new ones
    mapRef.current.eachLayer((layer) => {
      if ((layer as L.TileLayer).getAttribution() !== undefined) {
        return; // Keep the base tile layer
      }
      mapRef.current?.removeLayer(layer);
    });

    // Loop through each route in routeData.routes and add polylines to the map
    routeData.data.route_data.route.forEach((route: any, index: number) => {
      const { path } = route;
      const latlngs = path.map((coord: number[]) => [coord[0], coord[1]]);
      L.polyline(latlngs, { color: "blue" }).addTo(mapRef.current!);
    });

    // Find the latest actual event
    const latestEvent = routeData.data.containers[0].events
      .filter((event: any) => event.actual)
      .reduce(
        (latest: any, event: any) => {
          return new Date(event.date) > new Date(latest.date) ? event : latest;
        },
        { date: "1970-01-01T00:00:00Z" }
      );

    // Get the location of the latest event
    const latestLocation = routeData.data.locations.find(
      (loc: any) => loc.id === latestEvent.location
    );

    if (latestLocation) {
      // Create a custom marker with a blue circle and small blue dot
      const customIcon = L.divIcon({
        html: `
          <div class="custom-marker">
            <div class="large-circle"></div>
            <div class="small-dot"></div>
          </div>`,
        className: "",
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      // Add a marker at the latest position with the custom icon
      L.marker([latestLocation.lat, latestLocation.lng], {
        icon: customIcon,
      })
        .addTo(mapRef.current!)
        .bindPopup(latestLocation.name);

      // Set the view to the latest position
      mapRef.current.setView([latestLocation.lat, latestLocation.lng], 8);
    }
  }, [routeData]);

  //poc

  // useEffect(() => {
  //   // Initialize the map if it doesn't exist yet
  //   if (!mapRef.current) {
  //     mapRef.current = L.map("map").setView([11.206051, 122.447886], 8); // Centered on an initial position

  //     L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  //       attribution:
  //         '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  //     }).addTo(mapRef.current);
  //   }

  //   // Remove existing layers before adding new ones, except the base tile layer
  //   mapRef.current.eachLayer((layer) => {
  //     if (layer.getAttribution && layer.getAttribution() !== undefined) {
  //       return; // Keep the base tile layer
  //     }
  //     mapRef.current?.removeLayer(layer);
  //   });

  //   // Loop through each route in routeData.routes and add polylines to the map
  //   routeData.data.route_data.route.forEach((route, index) => {
  //     const { path } = route;
  //     const latlngs = path.map((coord) => [coord[0], coord[1]]);
  //     L.polyline(latlngs, { color: "blue" }).addTo(mapRef.current);
  //   });

  //   // Find the latest actual event
  //   const latestEvent = routeData.data.containers[0].events
  //     .filter((event) => event.actual)
  //     .reduce(
  //       (latest, event) =>
  //         new Date(event.date) > new Date(latest.date) ? event : latest,
  //       { date: "1970-01-01T00:00:00Z" }
  //     );

  //   // Get the location of the latest event
  //   const latestLocation = routeData.data.locations.find(
  //     (loc) => loc.id === latestEvent.location
  //   );

  //   if (latestLocation) {
  //     // Create a custom marker with a blue circle and small blue dot
  //     const customIcon = L.divIcon({
  //       html: `
  //         <div class="custom-marker">
  //           <div class="large-circle"></div>
  //           <div class="small-dot"></div>
  //         </div>`,
  //       className: "",
  //       iconSize: [30, 30],
  //       iconAnchor: [15, 15],
  //     });

  //     // Add a marker at the latest position with the custom icon
  //     L.marker([latestLocation.lat, latestLocation.lng], {
  //       icon: customIcon,
  //     })
  //       .addTo(mapRef.current)
  //       .bindPopup(latestLocation.name);

  //     // Set the view to the latest position
  //     mapRef.current.setView([latestLocation.lat, latestLocation.lng], 8);
  //   }

  //   // Additional locations
  //   const locations = [
  //     ["LOCATION_1", 11.8166, 122.0942],
  //     ["LOCATION_2", 11.9804, 121.9189],
  //     ["LOCATION_3", 10.7202, 122.5621],
  //     ["LOCATION_4", 11.3889, 122.6277],
  //     ["LOCATION_5", 10.5929, 122.6325],
  //   ];

  //   // Add additional markers to the map
  //   locations.forEach(([name, lat, lng]) => {
  //     L.marker([lat, lng]).bindPopup(name).addTo(mapRef.current);
  //   });
  // }, [routeData]);

  return <div id="map" style={{ height: "500px", width: "100%" }} />;
};

export default MapComponent;
