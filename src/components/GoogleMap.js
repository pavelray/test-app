import React, { Fragment, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { Loader } from "@googlemaps/js-api-loader";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

const GoogleMap = ({ data }) => {

  const loadMap = useCallback(async () => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
      version: "weekly",
    });

    loader.load().then(async () => {
      const { Map: GoogleMap, InfoWindow } = await google.maps.importLibrary(
        "maps"
      );
      const { AdvancedMarkerElement, PinElement } =
        await google.maps.importLibrary("marker");
      const { HeatmapLayer } = await google.maps.importLibrary("visualization");

      const infoWindow = new InfoWindow({
        content: "",
        disableAutoPan: true,
      });
      let heatMapData = [];
      const markers = data.map((position, i) => {
        const label = `${i + 1}`;
        const pinGlyph = new PinElement({
          glyph: label,
          glyphColor: "white",
        });
        const lat = Number(position.latitude);
        const lng = Number(position.longitude);
        const weight = Number(position.Price_sqft);
        const marker = new AdvancedMarkerElement({
          position: {
            lat,
            lng,
          },
          content: pinGlyph.element,
        });
        heatMapData.push({
          location: new google.maps.LatLng(lat, lng),
          weight,
        });
        // markers can only be keyboard focusable when they have click listeners
        // open info window when marker is clicked
        const contentString = `<div><b>Price Sqft:</b> ${Math.round(
          position.Price_sqft
        )}</div><div><b>Bedrooms:</b>${position.Bedrooms}</div>
        <div><b>Bathrooms:</b> ${
          position.Bathrooms
        }</div><div><b>Address:</b> ${
          position.Address
        }</div><div><b>Status:</b> <b>${position.Status}</b></div>
        <div><b>Area:</b> ${position.area}sqft</div>
        <div><b>Price:</b> ${Math.round(position.price)}</div>
        <div><b>Property Type:</b> ${position.type_of_building}</div>
        <div><b>Desc:</b> ${position.desc}</div>
        `;
        marker.addListener("click", () => {
          infoWindow.setContent(contentString);
          infoWindow.open(map, marker);
        });
        return marker;
      });

      const map = new GoogleMap(document.getElementById("map"), {
        center: { lat: Number("28.60885"), lng: Number("77.46056") },
        zoom: 8,
        mapId: "DEMO_MAP_ID",
      });
      new MarkerClusterer({ markers, map });

      const heatmap = new HeatmapLayer({
        data: heatMapData,
        radius: 20,
        opacity: 0.7,
        gradient: [
          "rgba(0, 255, 255, 0)",
          "rgba(0, 255, 255, 1)",
          "rgba(0, 191, 255, 1)",
          "rgba(0, 127, 255, 1)",
          "rgba(0, 63, 255, 1)",
          "rgba(0, 0, 255, 1)",
          "rgba(0, 0, 223, 1)",
          "rgba(0, 0, 191, 1)",
          "rgba(0, 0, 159, 1)",
          "rgba(0, 0, 127, 1)",
          "rgba(63, 0, 91, 1)",
          "rgba(127, 0, 63, 1)",
          "rgba(191, 0, 31, 1)",
          "rgba(255, 0, 0, 1)",
        ],
      });
      heatmap.setMap(map);
    });
  }, [data]);

  useEffect(() => {
    loadMap();
  }, [loadMap]);

  return (
    <Fragment>
      <div id="map"></div>
      <style jsx>{`
        #map {
          height: 60vh;
          width: 60vw;
        }
      `}</style>
    </Fragment>
  );
};

GoogleMap.propTypes = {
  data: PropTypes.array.isRequired,
};

export default GoogleMap;
