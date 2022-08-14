import React, { useRef, useEffect, useState } from "react";
import { select, axisBottom, axisLeft, scaleLinear, scaleBand } from "d3";
import ResizeObserver from "resize-observer-polyfill";
import './index.css';
import { baseUrl, urls } from "../../../utils/constants";
import { Paper, Typography } from "@mui/material";
import CustomSlider from "../../CustomSlider";
const useResizeObserver = (ref) => {
  const [dimensions, setDimensions] = useState(null);
  useEffect(() => {
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setDimensions(entry.contentRect);
      });
    });
    resizeObserver.observe(observeTarget);
    return () => {
      resizeObserver.unobserve(observeTarget);
    };
  }, [ref]);
  return dimensions;
};

function BarChart({ uploadedDetails }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [noOfStations,setNoOfStations] = useState(20);
  const [popularStationsData,setPopularStationsData] = useState([])

  const [stationPopularityBoundaries,setStationPopularityBoundaries] = useState({max: 0 , min: 0 })
  
  useEffect(()=>{
    popularStationsData.length && setStationPopularityBoundaries({max: popularStationsData[0]['access_count'] , min: popularStationsData[popularStationsData.length - 1]['access_count'] })
  },[popularStationsData])

  
  useEffect(()=>{
    updatePopularStationsData();
  },[noOfStations])


  const updatePopularStationsData = ()=>{
    const url = `${baseUrl}${urls.VISUALIZE_MOST_POPULAR_STATIONS}${uploadedDetails?.upload_id}/${noOfStations}/`;
    
    fetch(url)
        .then(response => response.json())
        .then(response_data=>{
            setPopularStationsData(response_data);
        })

  }


  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    
    if (!dimensions) return;

    // scales
    const xScale = scaleBand()
      .domain(popularStationsData.map((value, index) => index))
      .range([0, dimensions.width]) // change
      .padding(0.5);

    const yScale = scaleLinear()
      .domain([0, 1.05 * stationPopularityBoundaries.max ]) // todo
      .range([dimensions.height, 0]); // change

    const colorScale = scaleLinear()
      .domain([stationPopularityBoundaries.min , stationPopularityBoundaries.max])
      .range(["orange", "red"])
      .clamp(true);

    // create x-axis
    const xAxis = axisBottom(xScale).ticks(popularStationsData.length).tickFormat((idx)=>popularStationsData[idx].name);
    svg
      .select(".x-axis")
      .style("transform", `translateY(${dimensions.height}px)`)
      .call(xAxis);

    // create y-axis
    const yAxis = axisLeft(yScale);
    svg
      .select(".y-axis")
      // .style("transform", `translateX(${dimensions.width}px)`)
      .call(yAxis);
      
    svg
      .selectAll('.x-axis .tick')
      .style("transform",(value,index)=>`rotate(270deg)translateX(-14vw)translateY(${xScale(index)}px)`)
    
    svg
      .selectAll('.x-axis line')
      .style("display",'none')
    
      
    // draw the bars
    svg
      .selectAll(".bar")
      .data(popularStationsData.map(({access_count})=>access_count))
      .join("rect")
      .attr("class", "bar")
      .style("transform", "scale(1, -1)")
      .attr("x", (value, index) => xScale(index))
      .attr("y", -dimensions.height)
      .attr("width", xScale.bandwidth())
      .on("mouseenter", function (event, value) {
        // events have changed in d3 v6:
        // https://observablehq.com/@d3/d3v6-migration-guide#events
        const index = svg.selectAll(".bar").nodes().indexOf(this);
        svg
          .selectAll(".tooltip")
          .data([value])
          .join((enter) => enter.append("text").attr("y", yScale(value) - 4))
          .attr("class", "tooltip")
          .text(value)
          .attr("x", xScale(index) + xScale.bandwidth() / 2)
          .attr("text-anchor", "middle")
          .transition()
          .attr("y", yScale(value) - 8)
          .attr("opacity", 1);
      })
      .on("mouseleave", () => svg.select(".tooltip").remove())
      .transition()
      .attr("fill", colorScale)
      .attr("height", (value) => dimensions.height - yScale(value));
  }, [popularStationsData, dimensions]);

  return (
    <div ref={wrapperRef} className="bar-wrapper">
      <Typography variant="h5" sx={{fontWeight:700}}>Top {noOfStations} Most Popular Stations Bar Chart</Typography>
      <CustomSlider sliderLabel="Number of most popular stations" handleSliderValueChange={setNoOfStations}/>
      <Paper elevation="4" sx={{p:2,m:3}}>
        <Typography>X - Axis : Station Names</Typography>
        <Typography>Y - Axis : Number of times the ride started or ended at the particular station</Typography>
      </Paper>
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}

export default BarChart;