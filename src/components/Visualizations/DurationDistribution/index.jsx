import React, { useRef, useEffect, useState } from "react";
import { select, axisBottom, axisLeft, scaleLinear, scaleBand, curveCardinal, line } from "d3";
import ResizeObserver from "resize-observer-polyfill";
import './index.css';
import { baseUrl, urls } from "../../../utils/constants";
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
  const [durationDistributionData, setDurationDistributionData] = useState([
    {
    "left": 22.944,
    "right": 59.2,
    "value": 1
    },
    {
    "left": 59.2,
    "right": 94.4,
    "value": 35
    },
    {
    "left": 94.4,
    "right": 129.6,
    "value": 210
    },
    {
    "left": 129.6,
    "right": 164.8,
    "value": 0
    },
    {
    "left": 164.8,
    "right": 200,
    "value": 477
    },
    {
    "left": 200,
    "right": 235.2,
    "value": 0
    },
    {
    "left": 235.2,
    "right": 270.4,
    "value": 708
    },
    {
    "left": 270.4,
    "right": 305.6,
    "value": 849
    },
    {
    "left": 305.6,
    "right": 340.8,
    "value": 0
    },
    {
    "left": 340.8,
    "right": 376,
    "value": 909
    },
    {
    "left": 376,
    "right": 411.2,
    "value": 0
    },
    {
    "left": 411.2,
    "right": 446.4,
    "value": 948
    },
    {
    "left": 446.4,
    "right": 481.6,
    "value": 944
    },
    {
    "left": 481.6,
    "right": 516.8,
    "value": 0
    },
    {
    "left": 516.8,
    "right": 552,
    "value": 898
    },
    {
    "left": 552,
    "right": 587.2,
    "value": 0
    },
    {
    "left": 587.2,
    "right": 622.4,
    "value": 911
    },
    {
    "left": 622.4,
    "right": 657.6,
    "value": 0
    },
    {
    "left": 657.6,
    "right": 692.8,
    "value": 814
    },
    {
    "left": 692.8,
    "right": 728,
    "value": 766
    },
    {
    "left": 728,
    "right": 763.2,
    "value": 0
    },
    {
    "left": 763.2,
    "right": 798.4,
    "value": 690
    },
    {
    "left": 798.4,
    "right": 833.6,
    "value": 0
    },
    {
    "left": 833.6,
    "right": 868.8,
    "value": 675
    },
    {
    "left": 868.8,
    "right": 904,
    "value": 623
    },
    {
    "left": 904,
    "right": 939.2,
    "value": 0
    },
    {
    "left": 939.2,
    "right": 974.4,
    "value": 592
    },
    {
    "left": 974.4,
    "right": 1009.6,
    "value": 0
    },
    {
    "left": 1009.6,
    "right": 1044.8,
    "value": 532
    },
    {
    "left": 1044.8,
    "right": 1080,
    "value": 4148
    }
    ]);

  const [extremeAccessCountValues,setExtremeAccessCountValues] = useState({max:1080,min:20});

  // useEffect(()=>{
  //   if(uploadedDetails?.upload_id){
  //     fetch(`${baseUrl}${urls.VISUALIZE_MOST_POPULAR_STATIONS}${uploadedDetails.upload_id}/`)
	// 		.then(response => response.json())
	// 		.then(response_data=>{
  //       console.log(response_data);
  //       setDurationDistributionData(response_data)
  //     })

  //   }
  // },[uploadedDetails])

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
      .domain([0, 4200])
      .range([dimensions.height, 0]); // change

    const xAxis = axisBottom(xScale)
      .ticks(durationDistributionData.length)
      .tickFormat(index => `(${durationDistributionData[index].left} - ${durationDistributionData[index].right}]` );
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
    
    //   svg
    //   .selectAll(".points circle")
    //   .data(durationDistributionData)
    //   .join(entry => entry.append("circle"),update=>update,exit => exit.remove())
    //   .attr("r", 3)
    //   .attr("cx", (value,index)=>xScale(index))
    //   .attr("cy", value => yScale(value.value))
    //   .attr("stroke", "blue");
  }, [durationDistributionData,dimensions]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}>
        <g className="points"/>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}

export default DurationDistributionData;