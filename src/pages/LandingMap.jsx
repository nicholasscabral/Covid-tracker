import React, { useState } from "react";
import { Map, TileLayer, Marker } from "react-leaflet";
import Leaflet from "leaflet";
import api from "../services/api";

import bacteria from "../assets/images/bacteria.svg";
import personMask from "../assets/images/person-mask.svg";
import grave from "../assets/images/grave.svg";
import mask from "../assets/images/mask.svg";
import world from "../assets/images/world.svg";
import mapMarker from "../assets/images/mapMarker.svg";

import "../styles/landingMap.css";
import '../styles/responsive.css';
import "leaflet/dist/leaflet.css";

const detectCountry = require("which-country");
const formatNumber = require("numeral");

const mapIcon = Leaflet.icon({
  iconUrl: mapMarker,

  iconSize: [36, 68],
  iconAnchor: [18, 68],
});

let bounds = [
  [-85.0511287798066, 262.96875000000006],
  [84.67351256610525, -182.81250000000003],
];

function LandingMap() {

  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

  function handleMapClick(event) {
    const { lat, lng } = event.latlng

    setPosition({ 
      latitude: lat, 
      longitude: lng,
    })
  }

  function scrollToAside() {
    const aside = document.querySelector("#aside");
    const href = aside.getAttribute("href");
    const goTo = document.querySelector(href).offsetTop;

    window.scroll({
      top: goTo,
      behavior: "smooth",
    });
  }

  function getLocation(event) {
    getCoodinates(event);
    handleMapClick(event)
    scrollToAside();
  }

  function getCoodinates(event) {
    var longitude = event.latlng.lng;
    var latitude = event.latlng.lat;

    console.log(latitude, longitude);

    var country = detectCountry([longitude, latitude]);

    if (country === null) {
      getWorldData();
    } else getCountryData(country);
  }

  function getCountryData(country) {
    try {
      api.get(`/v2/countries/${country}`).then((response) => {
        // console.log(response)
        const headerField = document.querySelector(".status-header");
        const casesField = document.querySelector(".cases");
        const activeField = document.querySelector(".active");
        const deathsField = document.querySelector(".deaths");
        const recoveredField = document.querySelector(".recovered");

        var country = response.data.country;
        var iconCode = response.data.countryInfo.iso2;
        var cases = response.data.cases;
        var activeCases = response.data.active;
        var deaths = response.data.deaths;
        var recovered = response.data.recovered;

        headerField.innerHTML = `
                    <img src="https://github.com/hjnilsson/country-flags/blob/master/png100px/${iconCode.toLowerCase()}.png?raw=true" />
                    <span>${country}</span>
                `;
        casesField.innerHTML = `
                    <p>Total de casos: ${formatNumber(cases).format("0,0")}</p>
                `;

        activeField.innerHTML = `
                    <p>Casos ativos: ${formatNumber(activeCases).format("0,0")}</p>
                `;

        deathsField.innerHTML = `
                    <p>Mortes: ${formatNumber(deaths).format("0,0")}</p>
                `;

        recoveredField.innerHTML = `
                    <p>Recuperados: ${formatNumber(recovered).format("0,0")}</p>
                `;
      });
    } catch (error) {
      console.error(error);
    }
  }

  function getWorldData() {
    try {
      api.get(`/v3/covid-19/all`).then((response) => {
        // console.log(response)

        const headerField = document.querySelector(".status-header");
        const casesField = document.querySelector(".cases");
        const activeField = document.querySelector(".active");
        const deathsField = document.querySelector(".deaths");
        const recoveredField = document.querySelector(".recovered");

        var cases = response.data.cases;
        var activeCases = response.data.active;
        var deaths = response.data.deaths;
        var recovered = response.data.recovered;

        headerField.innerHTML = `
                    <img src="${world}" alt=""/>
                    <span>Mundo</span>
                `;

        casesField.innerHTML = `
                    <p>Total de casos: ${formatNumber(cases).format("0,0")}</p>
                `;

        activeField.innerHTML = `
                    <p>Casos ativos: ${formatNumber(activeCases).format(
                      "0,0"
                    )}</p>
                `;

        deathsField.innerHTML = `
                    <p>Mortes: ${formatNumber(deaths).format("0,0")}</p>
                `;

        recoveredField.innerHTML = `
                    <p>Recuperados: ${formatNumber(recovered).format("0,0")}</p>
                `;
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div id="page-map" onLoad={getWorldData}>
      <aside>
        <a href="aside" id="aside"></a>
        <div className="status">
          <div className="status-header">
            <img src={world} alt="" />
            <span>Mundo</span>
          </div>
          <hr />
          <div className="status-info">
            <div className="info">
              <div className="icon">
                <img src={bacteria} alt=" " />
              </div>
              <div className="cases">
                <p>Total de casos: -</p>
              </div>
            </div>
            <div className="info">
              <div className="icon">
                <img src={personMask} alt=" " />
              </div>
              <div className="active">
                <p>Casos ativos: -</p>
              </div>
            </div>
            <div className="info">
              <div className="icon">
                <img src={grave} alt=" " />
              </div>
              <div className="deaths">
                <p>Mortes: -</p>
              </div>
            </div>
            <div className="info">
              <div className="icon">
                <img src={mask} alt=" " />
              </div>
              <div className="recovered">
                <p>Recuperados: -</p>
              </div>
            </div>
          </div>
          <hr />
        </div>
        <footer>
          Made with coffee by{" "}
          <a href="https://github.com/nicholasscabral" target="_blank">
            Nicholas cabral
          </a>{" "}
        </footer>
      </aside>

      <Map
        id="mapa"
        onClick={getLocation}
        center={[39.27762174380272, 10.96741045708063]}
        minZoom={2}
        zoom={2}
        maxZoom={4}
        maxBounds={bounds}
        style={{ width: "100%", height: "100%" }}
      >
        {/* <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"/> */}
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/nicholasscabral/ckgr86l2j05iy19nwg8iu2f02/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
        />

        {/* meu estilo personalizado EM INGLES (mapbox) = /styles/v1/nicholasscabral/ckgr0cw1z41v11aqoyhntqgid*/}
        {/* meu estilo personalizado EM PORTUGUES (mapbox) = /styles/nicholasscabral/ckgr86l2j05iy19nwg8iu2f02 */}

        { position.latitude != 0 && (
          <Marker 
            icon={mapIcon} 
            position={[
              position.latitude, 
              position.longitude
            ]} 
          />
        )}
      </Map>
    </div>
  );
}

export default LandingMap;
