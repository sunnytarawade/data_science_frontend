import React, { useRef, useEffect, useState } from "react";
import { select, axisBottom, axisLeft, scaleLinear,line } from "d3";
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

function DurationDistributionData({ uploadedDetails }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [durationDistributionData, setDurationDistributionData] = useState([]);
  const [totalDurationIntervals,setTotalDurationIntervals] = useState(20);
  const [durationDistributionDataBoundaryValues,setDurationDistributionDataBoundaryValues] = useState({max:0,min:0});
  const updateDurationDistributionData = ()=>{
    const url = `${baseUrl}${urls.VISUALIZE_DURATION_DISTRIBUTION}${uploadedDetails?.upload_id}/${totalDurationIntervals}/`;
    
    fetch(url)
        .then(response => response.json())
        .then(response_data=>{
          setDurationDistributionData(response_data);
          setDurationDistributionDataBoundaryValues({
            max: Math.max(...response_data.map(({value})=>value)),
            min: Math.min(...response_data.map(({value})=>value)),
          })
        })

  }

  useEffect(()=>{
    if(totalDurationIntervals > 3)
      updateDurationDistributionData();
  },[totalDurationIntervals])

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);

    if (!dimensions) return;


    const xScale = scaleLinear()
      .domain([0, durationDistributionData.length - 1])
    //   .range([0, 300]);
      .range([0, dimensions.width]) // change
    //   .padding(0.5);

    const yScale = scaleLinear()
      .domain([0, 1.05* durationDistributionDataBoundaryValues.max])
      .range([dimensions.height, 0]); // change

    const xAxis = axisBottom(xScale)
      .ticks(durationDistributionData.length)
      .tickFormat(index => `(${parseFloat(durationDistributionData[index].left).toFixed(2)} - ${parseFloat(durationDistributionData[index].right).toFixed(2)}]` )
      
    svg
      .select(".x-axis")
      .style("transform", `translateY(${dimensions.height}px)`)
      .call(xAxis);

    const yAxis = axisLeft(yScale);
    svg
      .select(".y-axis")
    //   .style("transform", "translateX(300px)")
      .call(yAxis);

    // generates the "d" attribute of a path element
    const myLine = line()
      .x((value, index) => xScale(index))
      .y(yScale)
    //   .curve(curveCardinal);

    svg
      .selectAll('.x-axis .tick')
      .style("transform",(value,index)=>`rotate(270deg)translateX(-100px)translateY(${xScale(index)-10}px)`)
    
    svg
      .selectAll('.x-axis line')
      .style("display",'none')
    
    // renders path element, and attaches
    // the "d" attribute from line generator above
    svg
      .selectAll(".line")
      .data([durationDistributionData.map(({value})=>value)])
      .join("path")
      .attr("class", "line")
      .attr("d", myLine)
      .attr("fill", "none")
      .attr("stroke", "blue");
    
      svg
      .selectAll("circle")
      .attr("class", "point")
      .data(durationDistributionData)
      .join("circle")
      .attr("r", 3)
      .attr("cx", (value,index)=>{
        return xScale(index)
      })
      .attr("cy", value => yScale(value.value))
      .attr("stroke", "blue")
      .on("mouseenter", function (event, value) {
        // events have changed in d3 v6:
        // https://observablehq.com/@d3/d3v6-migration-guide#events
        const index = svg.selectAll(".point").nodes().indexOf(this);
        
        svg
          .selectAll(".tooltip")
          .data([value])
          .join((enter) => enter.append("text").attr("y", yScale(value.value) - 4))
          .attr("class", "tooltip")
          .text(value.value)
          .attr("x", xScale(index))
          .attr("text-anchor", "middle")
          .transition()
          .attr("y", yScale(value.value) - 16)
          .attr("opacity", 1);
      })
      .on("mouseleave", () => svg.select(".tooltip").remove())
    
  }, [durationDistributionData,dimensions]);

  

  return (
    <div ref={wrapperRef} className="duration-distribution-wrapper">
      <Typography variant="h5" sx={{fontWeight:700}}>Duration Distribution With Respect to Duration Intervals</Typography>
      <CustomSlider sliderLabel="Distibution of ride duration" handleSliderValueChange={setTotalDurationIntervals}/>
      <Paper elevation={4} sx={{p:2,m:3}}>
        <Typography>X - Axis : Duration Intervals (in seconds)</Typography>
        <Typography>Y - Axis : Duration Occurence Count (in seconds)</Typography>
      </Paper>
      <svg ref={svgRef}>
        <g className="points"/>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}

export default DurationDistributionData;