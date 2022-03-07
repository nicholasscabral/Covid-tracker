import React, { useState } from "react";
import api from "../services/api";

import { Map, TileLayer, Marker } from "react-leaflet";
import Leaflet from "leaflet";

import bacteria from "../assets/images/bacteria.svg";
import personMask from "../assets/images/person-mask.svg";
import grave from "../assets/images/grave.svg";
import mask from "../assets/images/mask.svg";
import world from "../assets/images/world.svg";
import mapMarker from "../assets/images/mapMarker.svg";

import "../styles/landingMap.css";
import '../styles/responsive.css';
import "leaflet/dist/leaflet.css";

import { ANCHOR_SIZE, GITHUB_URL, ICON_SIZE, MAP_BOUNDERIES, MAP_CENTER, TILE_LAYER_MAPBOX_URL } from "../common/constans";
import { GET_COUTRY_DATA_API_URL, GET_WORLD_DATA_API_URL } from "../common/routes";

const getCountry = require("which-country");
const formatNumber = require("numeral");

const mapIcon = Leaflet.icon({
  iconUrl: mapMarker,

  iconSize: ICON_SIZE,
  iconAnchor: ANCHOR_SIZE,
});

function LandingMap() {

  const [position, setPosition] = useState({ lat: 0, lng: 0 });

  function handleMapClick(event) {
    const { lat, lng } = event.latlng

    setPosition({lat, lng})
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
    getCoordinates(event);
    handleMapClick(event)
    scrollToAside();
  }

  function getCoordinates(event) {
    const {lng, lat} = event.latlng

    console.log(lat, lng);

    const country = getCountry([lng, lat]);

    country ? getCountryData(country) : getWorldData()
  }

  function getCountryData(country) {
    try {
      api.get(`${GET_COUTRY_DATA_API_URL}${country}`).then((response) => {
        const headerField = document.querySelector(".status-header");
        const casesField = document.querySelector(".cases");
        const activeField = document.querySelector(".active");
        const deathsField = document.querySelector(".deaths");
        const recoveredField = document.querySelector(".recovered");

        const {
          country,
          cases,
          deaths,
          recovered,
          active,
        } = response.data
        const iconCode = response.data.countryInfo.iso2

        headerField.innerHTML = `
                    <img src="https://github.com/hjnilsson/country-flags/blob/master/png100px/${iconCode.toLowerCase()}.png?raw=true" />
                    <span>${country}</span>
                `;
        casesField.innerHTML = `
                    <p>Total de casos: ${formatNumber(cases).format("0,0")}</p>
                `;

        activeField.innerHTML = `
                    <p>Casos ativos: ${formatNumber(active).format("0,0")}</p>
                `;

        deathsField.innerHTML = `
                    <p>Mortes: ${formatNumber(deaths).format("0,0")}</p>
                `;

        recoveredField.innerHTML = `
                    <p>Recuperados: ${formatNumber(recovered).format("0,0")}</p>
                `;
      });
    } catch (err) {
      console.error(err);
    }
  }

  function getWorldData() {
    try {
      api.get(GET_WORLD_DATA_API_URL).then((response) => {
        const headerField = document.querySelector(".status-header");
        const casesField = document.querySelector(".cases");
        const activeField = document.querySelector(".active");
        const deathsField = document.querySelector(".deaths");
        const recoveredField = document.querySelector(".recovered");

        const {cases, active, deaths, recovered} = response.data

        headerField.innerHTML = `
                    <img src="${world}" alt=""/>
                    <span>Mundo</span>
                `;

        casesField.innerHTML = `
                    <p>Total de casos: ${formatNumber(cases).format("0,0")}</p>
                `;

        activeField.innerHTML = `
                    <p>Casos ativos: ${formatNumber(active).format(
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
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div id="page-map" onLoad={getWorldData}>
      <aside>
        <a href="aside" id="aside"> </a>
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
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            Nicholas cabral
          </a>{" "}
        </footer>
      </aside>

      <Map
        id="mapa"
        onClick={getLocation}
        center={MAP_CENTER}
        minZoom={2}
        zoom={2}
        maxZoom={4}
        maxBounds={MAP_BOUNDERIES}
        style={{ width: "100%", height: "100%" }}
      >
        {/* <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"/> */}
        <TileLayer
          url={TILE_LAYER_MAPBOX_URL}
        />

        {/* meu estilo personalizado EM INGLES (mapbox) = /styles/v1/nicholasscabral/ckgr0cw1z41v11aqoyhntqgid*/}
        {/* meu estilo personalizado EM PORTUGUES (mapbox) = /styles/nicholasscabral/ckgr86l2j05iy19nwg8iu2f02 */}

        { position.lat !== 0 && (
          <Marker 
            icon={mapIcon} 
            position={[
              position.lat, 
              position.lng
            ]} 
          />
        )}
      </Map>
    </div>
  );
}

export default LandingMap;
