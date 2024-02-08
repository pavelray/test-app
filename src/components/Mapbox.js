import React, { useEffect, useRef, useState } from "react";
import data from "../data/sites.json";
import data1 from "../data/chicago-parks.json";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoicGF2ZWxyYXkiLCJhIjoiY2xzYm0yankwMDNjNjJtbWhlYmlrYTFpMyJ9.BmPoZvaiyeVe1VueOaAolw";

const Mapbox = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  // const [lng, setLng] = useState(-103.5917);
  // const [lat, setLat] = useState(40.6699);
  // const [zoom, setZoom] = useState(3);

  const sites = data.mgmtResponse.siteOpDTO;
  const geoDataForMap = {
    features: [],
    type: "FeatureCollection",
  };
  sites.forEach((site, index) => {
    if (index > 0) {
      const feature = {
        type: "Feature",
        properties: {
          apCount: site.apCount,
          clientCount: site.clientCount,
          groupName: site.groupName,
          locationAddress: site.locationAddress,
          name: site.name,
        },
        geometry: {
          type: "Point",
          coordinates: [site.longitude, site.latitude],
        },
      };
      geoDataForMap.features.push(feature);
    }
  });

  console.log(geoDataForMap);
  console.log(data1);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [
        geoDataForMap.features[1].geometry.coordinates[0],
        geoDataForMap.features[1].geometry.coordinates[1],
      ],
      zoom: 14,
    });
    // Add our navigation control (the +/- zoom buttons)
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.current.on("load", () => {
      // Nifty code to force map to fit inside container when it loads
      map.current.resize();

      map.current.addSource("earthquakes", {
        type: "geojson",
        // Use a URL for the value for the `data` property.
        data: geoDataForMap,
      });

      map.current.addLayer({
        id: "earthquakes-layer",
        type: "circle",
        source: "earthquakes",
        paint: {
          "circle-radius": 4,
          "circle-stroke-width": 2,
          "circle-color": "red",
          "circle-stroke-color": "white",
        },
      });
    });

    // Create a popup, but don't add it to the map yet.
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    // Here's on Popup window code
    // When the cursor moves over the earthquake layer
    map.current.on("mouseenter", "earthquakes-layer", (e) => {
      // Change the cursor style as a UI indicator.
      map.current.getCanvas().style.cursor = "pointer";

      // Copy coordinates array.
      const coordinates = e.features[0].geometry.coordinates.slice();
      const properties = e.features[0].properties;

      // build our popup html with our geoJSON properties
      const popupHtml = `<strong>Name: </strong>${properties.name}<br><strong>Total Access Points: </strong>${properties.apCount}<br><strong>Client Connected: </strong>${properties.clientCount}<br><strong>Address: </strong>${properties.locationAddress}`;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      popup.setLngLat(coordinates).setHTML(popupHtml).addTo(map.current);
    });
    // Whe the cursor moves off the layer we remove the cursor
    map.current.on("mouseleave", "earthquakes-layer", () => {
      map.current.getCanvas().style.cursor = "";
      popup.remove();
    });
  }, [geoDataForMap]);
  return (
    <div>
      <h1>Mapbox GL</h1>
      <div ref={mapContainer} className="map-container" />

      <style jsx>{`
        .map-container {
          height: 600px;
          color: #000;
        }
      `}</style>
    </div>
  );
};

export default Mapbox;
