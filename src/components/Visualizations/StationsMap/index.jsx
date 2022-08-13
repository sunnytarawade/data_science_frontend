import { useState, useEffect } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./index.css";
import { median } from "../../../utils/helpers";
import { createInterpolator } from "range-interpolator";


export const interpolator = (inputRange) => createInterpolator({
  inputRange,
  outputRange: [30, 60],
});

function MapPopup({station_details,stationPopularityBoundaries}){
  const [showPopup,setShowPopup] = useState(false);
  const markerSize = interpolator([stationPopularityBoundaries.min,stationPopularityBoundaries.max])(station_details.access_count)
                
  return (
    <div >
    <Marker
      longitude={station_details.longitude}
      latitude={station_details.latitude}
      key={station_details.name}
      
    >
      <img onMouseEnter={()=>setShowPopup(true)} style={{width:`${markerSize}px`,height:`${markerSize}px`}} src="http://localhost:3000/location_marker.png" alt="station_details.name"/>
    </Marker>
    {
      showPopup ? <Popup longitude={station_details.longitude} latitude={station_details.latitude}
      anchor="bottom"
      onClose={() => setShowPopup(false)}>
        <div>
      <h5 className="marker-popup-heading">{station_details.name}</h5>
      <p>Accessed {station_details.access_count} times!</p>
      </div>
    </Popup>:null
    }
    </div>
    
  )
}

function MyMap() {
  const [viewport, setViewport] = useState({});

  const [popularStationsData,setPopularStationsData] = useState([
    {
    "access_count": 495,
    "id": 154,
    "latitude": 51.50379168,
    "longitude": -0.11282408,
    "name": "Waterloo Station 3, Waterloo"
    },
    {
    "access_count": 481,
    "id": 14,
    "latitude": 51.52994371,
    "longitude": -0.123616824,
    "name": "Belgrove Street , King's Cross"
    },
    {
    "access_count": 241,
    "id": 374,
    "latitude": 51.50402794,
    "longitude": -0.11386436,
    "name": "Waterloo Station 1, Waterloo"
    },
    {
    "access_count": 207,
    "id": 217,
    "latitude": 51.51615461,
    "longitude": -0.082422399,
    "name": "Wormwood Street, Liverpool Street"
    },
    {
    "access_count": 198,
    "id": 101,
    "latitude": 51.51155322,
    "longitude": -0.0929401,
    "name": "Queen Street 1, Bank"
    },
    {
    "access_count": 192,
    "id": 194,
    "latitude": 51.50462759,
    "longitude": -0.091773776,
    "name": "Hop Exchange, The Borough"
    },
    {
    "access_count": 182,
    "id": 55,
    "latitude": 51.51707521,
    "longitude": -0.086685542,
    "name": "Finsbury Circus, Liverpool Street"
    },
    {
    "access_count": 176,
    "id": 41,
    "latitude": 51.520955,
    "longitude": -0.083493552,
    "name": "Pindar Street, Liverpool Street"
    },
    {
    "access_count": 173,
    "id": 66,
    "latitude": 51.51795029,
    "longitude": -0.108657431,
    "name": "Holborn Circus, Holborn"
    },
    {
    "access_count": 163,
    "id": 427,
    "latitude": 51.51397065,
    "longitude": -0.09294031,
    "name": "Cheapside, Bank"
    },
    {
    "access_count": 162,
    "id": 341,
    "latitude": 51.50810309,
    "longitude": -0.12602103,
    "name": "Craven Street, Strand"
    },
    {
    "access_count": 152,
    "id": 361,
    "latitude": 51.50391973,
    "longitude": -0.11342629,
    "name": "Waterloo Station 2, Waterloo"
    },
    {
    "access_count": 151,
    "id": 251,
    "latitude": 51.518908,
    "longitude": -0.079249,
    "name": "Brushfield Street, Liverpool Street"
    },
    {
    "access_count": 150,
    "id": 104,
    "latitude": 51.51159481,
    "longitude": -0.077121322,
    "name": "Crosswall, Tower"
    },
    {
    "access_count": 145,
    "id": 71,
    "latitude": 51.5154186,
    "longitude": -0.098850915,
    "name": "Newgate Street , St. Paul's"
    },
    {
    "access_count": 144,
    "id": 199,
    "latitude": 51.51048489,
    "longitude": -0.082989638,
    "name": "Great Tower Street, Monument"
    },
    {
    "access_count": 143,
    "id": 732,
    "latitude": 51.50630441,
    "longitude": -0.087262995,
    "name": "Duke Street Hill, London Bridge"
    },
    {
    "access_count": 142,
    "id": 132,
    "latitude": 51.52364804,
    "longitude": -0.074754872,
    "name": "Bethnal Green Road, Shoreditch"
    },
    {
    "access_count": 133,
    "id": 215,
    "latitude": 51.51906932,
    "longitude": -0.088285377,
    "name": "Moorfields, Moorgate"
    },
    {
    "access_count": 127,
    "id": 191,
    "latitude": 51.50311799,
    "longitude": -0.153520935,
    "name": "Hyde Park Corner, Hyde Park"
    }
    ])

  const [medianLocation,setMedianLocation] = useState({latitude:51.511,longitude:-0.121})
  const [stationPopularityBoundaries,setStationPopularityBoundaries] = useState({max: popularStationsData[0]['access_count'] , min: popularStationsData[popularStationsData.length - 1]['access_count'] })
  
  useEffect(()=>{
    setMedianLocation({
      latitude : median(popularStationsData.map(({latitude})=>latitude)),
      longitude : median(popularStationsData.map(({longitude})=>longitude)),
    })
    setStationPopularityBoundaries({max: popularStationsData[0]['access_count'] , min: popularStationsData[popularStationsData.length - 1]['access_count'] })
  },[popularStationsData])
  

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setViewport({
        ...viewport,
        latitude: medianLocation.latitude,
        longitude: medianLocation.longitude ,
        zoom: 12.5,
        pitch: 45
      });
    });
  }, []);

  return (
    <div>
      {viewport.latitude && viewport.longitude && (
        <div>
          <h1>Most Popular Stations</h1>
          <Map
            mapboxAccessToken="pk.eyJ1Ijoic3Vubnl0YXJhd2FkZSIsImEiOiJjazkxYTAxbWYwN3FhM29wNnV1OGQ5Nnp2In0.Tp1fyFhatpyhfVbHMR62DA"
            initialViewState={viewport}
            mapStyle="mapbox://styles/mapbox/streets-v11"
          >
            {
              popularStationsData.map((station_details => {
                return (
                <MapPopup station_details={station_details} stationPopularityBoundaries={stationPopularityBoundaries} />
                )
              }))
            }
              
          </Map>
        </div>
      )}
    </div>
  );
}
export default MyMap;