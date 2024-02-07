import React from "react";
import L from "leaflet";
import PropTypes from "prop-types";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Leaflet = ({ data }) => {
  let DefaultIcon = L.icon({
    iconUrl: "../images/marker-icon.png",
    shadowUrl: "../images/marker-shadow.png",
  });

  return (
    <MapContainer
      center={["28.60885", "77.46056"]}
      zoom={10}
      scrollWheelZoom={false}
      style={{ height: "80vh", position: "initial" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data?.map((d) => {
        const lat = d.latitude;
        const long = d.longitude;
        return (
          <Marker position={[lat, long]} icon={DefaultIcon} key={d.index}>
            <Popup>
              Price: {d.price} <br /> {d.Address}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

Leaflet.propTypes = {
  data: PropTypes.array.isRequired,
};

export default Leaflet;
