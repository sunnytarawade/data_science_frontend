import { useState, useEffect } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./index.css";
import { median } from "../../../utils/helpers";
import { createInterpolator } from "range-interpolator";
import { baseUrl, urls } from "../../../utils/constants";
import {Typography} from "@mui/material";
import CustomSlider from "../../CustomSlider";


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

function StationsMap({uploadedDetails}) {
  const [viewport, setViewport] = useState({});
  const [noOfStations,setNoOfStations] = useState(20);
  const [popularStationsData,setPopularStationsData] = useState([])

  const [medianLocation,setMedianLocation] = useState({latitude:51.511,longitude:-0.121})
  const [stationPopularityBoundaries,setStationPopularityBoundaries] = useState({max: 0 , min: 0 })
  
  useEffect(()=>{
    setMedianLocation({
      latitude : median(popularStationsData.map(({latitude})=>latitude)),
      longitude : median(popularStationsData.map(({longitude})=>longitude)),
    })
    if(popularStationsData.length)
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

    updatePopularStationsData();

  }, []);

  useEffect(()=>{
    updatePopularStationsData();
  },[noOfStations])


  const updatePopularStationsData = ()=>{
    const url = `${baseUrl}${urls.VISUALIZE_MOST_POPULAR_STATIONS}${uploadedDetails?.upload_id}/${noOfStations}/`;
    
    fetch(url)
        .then(response => response.json())
        .then(response_data=>{
          setPopularStationsData(response_data)
        })

  }


  return (
    <div className="map-wrapper">
      {viewport.latitude && viewport.longitude && (
        <div>
          <Typography variant="h5" sx={{fontWeight:700}}>Top {noOfStations} Most Popular Stations Map</Typography>
          <CustomSlider handleSliderValueChange={setNoOfStations} sliderLabel="Number Of Most Popular Stations" />
          <Map
            mapboxAccessToken="pk.eyJ1Ijoic3Vubnl0YXJhd2FkZSIsImEiOiJjazkxYTAxbWYwN3FhM29wNnV1OGQ5Nnp2In0.Tp1fyFhatpyhfVbHMR62DA"
            initialViewState={viewport}
            mapStyle="mapbox://styles/mapbox/streets-v11"
          >
            {
              popularStationsData?.map((station_details => {
                return (
                <MapPopup key={station_details.id} station_details={station_details} stationPopularityBoundaries={stationPopularityBoundaries} />
                )
              }))
            }
              
          </Map>
        </div>
      )}
    </div>
  );
}
export default StationsMap;
