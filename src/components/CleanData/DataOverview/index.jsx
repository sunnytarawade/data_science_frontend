import { Container, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { baseUrl, urls } from '../../../utils/constants';
import './index.css';

function DataOverview({uploadedDetails}) {

    const [dataOverviewDetails,setDataOverviewDetails] = useState({});

    useEffect(()=>{
        const url = `${baseUrl}${urls.DATA_OVERVIEW_DETAILS}${uploadedDetails?.upload_id}/`;
    
        fetch(url)
            .then(response => response.json())
            .then(response_data=>{
                setDataOverviewDetails(response_data);
            })

    },[])

  return (
    <Container>
        <Typography variant="h6">Rides data</Typography>
        <ul className="data-overview-ul">
            <li>
                <Typography vartiant="p">Total records in raw data : <span className="data-overview-value">{dataOverviewDetails.rides_data_total_raw_records}</span></Typography>
            </li>

            <li>
                <Typography vartiant="p">Total records in after cleaning data : <span className="data-overview-value">{dataOverviewDetails.rides_data_total_records_after_cleaning}</span></Typography>
            </li>
            <li>
                <Typography vartiant="p">Total duplicates in raw data : <span className="data-overview-value">{dataOverviewDetails.rides_data_total_duplicates}</span></Typography>
            </li>
            <li>
                <Typography vartiant="p">Total duplicates dropped: <span className="data-overview-value">{dataOverviewDetails.rides_data_total_duplicates_removed}</span></Typography>
            </li>
            <li>
                <Typography vartiant="p">Total records with incorrect dates : <span className="data-overview-value">{dataOverviewDetails.rides_data_total_records_with_incorrect_dates}</span></Typography>
            </li>
            <li>
                <Typography vartiant="p">Total records with non numeric duration : <span className="data-overview-value">{dataOverviewDetails.rides_data_total_records_with_non_numeric_duration}</span></Typography>
            </li>
            <li>
                <Typography vartiant="p">Total records with incorrect station id name pair : <span className="data-overview-value">{dataOverviewDetails.rides_data_total_records_with_incorrect_station_details}</span></Typography>
            </li>

            <li>
                <Typography vartiant="p">Total records dropped : <span className="data-overview-value">{dataOverviewDetails.rides_data_total_records_dropped}</span></Typography>
            </li>
            <li>
                <Typography vartiant="p">Total records dropped percentage : <span className="data-overview-value">{`${parseFloat(dataOverviewDetails.rides_data_total_records_dropped_percentage).toFixed(2)}%`}</span></Typography>
            </li>
            <li>
                <>
                    Column wise count of empty values
                    <ul>
                        {
                            Object.keys(dataOverviewDetails.rides_data_empty_records_before_cleaning || {}).map(key => {
                                return <li><Typography vartiant="p">{key} : <span className="data-overview-value">{dataOverviewDetails.rides_data_empty_records_before_cleaning[key]}</span></Typography></li>
                            })
                        }
                    </ul>
                </>
            </li>
        </ul>
        <Typography variant="h6">Station data</Typography>
        <ul className="data-overview-ul">
            <li>
                <>
                    Column wise count of empty values
                    <ul>
                        {
                            Object.keys(dataOverviewDetails.station_data_empty_values || {}).map(key => {
                                return <li><Typography vartiant="p">{key} : <span className="data-overview-value">{dataOverviewDetails.station_data_empty_values[key]}</span></Typography></li>
                            })
                        }
                    </ul>
                </>
            </li>

            <li>
                Columns dropped : <span className="data-overview-value">{dataOverviewDetails.station_data_columns_before_cleaning.filter(value => !dataOverviewDetails.station_data_columns_after_cleaning.includes(value)).join(", ")}</span>
            </li>
        </ul>
    </Container>
  )
}

export default DataOverview