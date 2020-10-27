import React from 'react'
import { Map, TileLayer } from 'react-leaflet'
import api from '../services/api'

import bacteria from '../assets/images/bacteria.svg'
import personMask from '../assets/images/person-mask.svg'
import grave from '../assets/images/grave.svg'
import mask from '../assets/images/mask.svg'
import world from '../assets/images/world.svg'

import '../styles/landingMap.css'
import 'leaflet/dist/leaflet.css';


const detectCountry = require('which-country')
function LandingMap() {
    
    function getCoodinates(event) {
        var longitude = event.latlng.lng;
        var latitude = event.latlng.lat;
        
        console.log(latitude, longitude);
        alert(detectCountry([longitude, latitude]))
        var country = detectCountry([longitude, latitude])
    }
    
    return (
        <div id="page-map">
            <aside>
                <div className="status" >
                    <div className="status-header">
                        <img src={world} alt=""/>
                        <span>Mundo</span>
                    </div>
                    <hr/>
                    <div className="status-info">
                        <div className="info">
                            <div className="icon"><img src={ bacteria } alt=" "/></div>
                            <div className="cases">
                                <p>Total de casos: -</p>
                            </div>
                        </div>
                        <div className="info">
                            <div className="icon"><img src={ personMask }alt=" "/></div>
                            <div className="active">
                                <p>Casos ativos: -</p>
                            </div>
                        </div>
                        <div className="info">
                            <div className="icon"><img src={ grave } alt=" "/></div>
                            <div className="deaths">
                                <p>Mortes: -</p>
                            </div>
                        </div>
                        <div className="info">
                            <div className="icon"><img src={ mask }alt=" "/></div>
                            <div className="recovered">
                                <p>Casos recuperados: -</p>
                            </div>
                        </div>
                    </div>
                </div>
                <footer>Made with coffee by <a href="https://github.com/nicholasscabral" target="_blank">nicholasscabral</a> </footer>
            </aside>

            <Map id="mapa" onClick={getCoodinates}
                center={[39.27762174380272, 10.96741045708063]}
                minZoom={2}
                zoom={2}
                maxZoom={4}
                style={{ width: '100%', height: '100%' }}
            >
                {/* <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"/> */}
                <TileLayer url={`https://api.mapbox.com/styles/v1/nicholasscabral/ckgr86l2j05iy19nwg8iu2f02/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}/>
                
                {/* meu estilo personalizado EM INGLES (mapbox) = /styles/v1/nicholasscabral/ckgr0cw1z41v11aqoyhntqgid*/}
                {/* meu estilo personalizado EM PORTUGUES (mapbox) = /styles/nicholasscabral/ckgr86l2j05iy19nwg8iu2f02 */}
            </Map>

            
        </div>
    )
}

export default LandingMap