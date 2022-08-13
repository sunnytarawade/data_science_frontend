import React, { useRef, useEffect, useState } from "react";
import { select, axisBottom, axisLeft, scaleLinear, scaleBand } from "d3";
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

function BarChart({ uploadedDetails }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [popularStationsData, setPopularStationsData] = useState([
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
    ]);

  const [extremeAccessCountValues,setExtremeAccessCountValues] = useState({max:495,min:0});

  // useEffect(()=>{
  //   if(uploadedDetails?.upload_id){
  //     fetch(`${baseUrl}${urls.VISUALIZE_MOST_POPULAR_STATIONS}${uploadedDetails.upload_id}/`)
	// 		.then(response => response.json())
	// 		.then(response_data=>{
  //       console.log(response_data);
  //       setPopularStationsData(response_data)
  //     })

  //   }
  // },[uploadedDetails])

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    console.log(dimensions);

    if (!dimensions) return;

    // scales
    const xScale = scaleBand()
      .domain(popularStationsData.map((value, index) => index))
      .range([0, dimensions.width]) // change
      .padding(0.5);

    const yScale = scaleLinear()
      .domain([0, 1.05 * extremeAccessCountValues.max ]) // todo
      .range([dimensions.height, 0]); // change

    const colorScale = scaleLinear()
      .domain([extremeAccessCountValues.min , extremeAccessCountValues.max])
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
      .style("transform",(value,index)=>`rotate(270deg)translateX(-100px)translateY(${(2*index+1)*xScale.bandwidth()}px)`)
    
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
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}

export default BarChart;