"use client";
import GoogleMap from "@/components/GoogleMap";
import Leaflet from "@/components/Leaflet";
import Head from "next/head";
import React, { Fragment, useEffect, useState } from "react";

const Index = () => {
  const [data, setData] = useState();
  const getData = async () => {
    const data = await fetch("/api/data");
    return await data.json();
  };

  useEffect(() => {
    getData().then((result) => {
      setData(result.data);
    });
  }, []);

  return (
    <Fragment>
      <Head>
        <title>Google Map</title>
      </Head>
      <div className="container">
        <h1>Dashboard</h1>
        {/* <Leaflet data={data} /> */}
        {data && <GoogleMap data={data} />}
      </div>

      <style jsx>{`
        .container {
          height: 100vh;
        }
      `}</style>
    </Fragment>
  );
};

export default Index;
