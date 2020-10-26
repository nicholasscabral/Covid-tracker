import React from 'react'
import { Map, TileLayer } from 'react-leaflet'
import leaflet from 'leaflet'

import '../styles/landingMap.css'

import 'leaflet/dist/leaflet.css';

function LandingMap() {
    return (
        <div id="page-map">
            <aside>
                <div id="status">
                    
                </div>
            </aside>

            <Map 
                center={[-3.8102699,-38.4744777]}
                zoom={2}
                maxZoom={4}
                minZoom={2}
                style={{ width: '130%', height: '100%' }}
            >
                {/* <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"/> */}
                <TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}/>
                {/* ou dark */}

            </Map>

            
        </div>
    )
}

export default LandingMap