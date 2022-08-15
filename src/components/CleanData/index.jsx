import React, { useState } from 'react';
import axios from 'axios';
import {dataCleaningStatus,baseUrl,urls} from '../../utils/constants';
import { Button, CircularProgress, Container, Typography } from '@mui/material';
import DataOverview from './DataOverview';

const {CLEAN_DATA,DOWNLOAD_CLEANED_DATA} = urls;

function CleanData({uploadedDetails,dataCleaningDetails,setDataCleaningDetails}) {


    const [showSpinner,setShowSpinner] = useState(false);
    const handleStartDataCleaning = ()=>{
    
        if(uploadedDetails.upload_id){
            setShowSpinner(true);
            const url = `${baseUrl}${CLEAN_DATA}${uploadedDetails.upload_id}`;
            axios.get(url).then(response => {
                setDataCleaningDetails({status: dataCleaningStatus.SUCCESS});
            }).finally(()=>{
                setShowSpinner(false);
            })
        }
    }

    const handleDownloadCleanedData = ()=>{
        const url = `${baseUrl}${DOWNLOAD_CLEANED_DATA}${uploadedDetails.upload_id}`;
        
        console.log("Cleaning started")
        axios.get(url, {
                responseType: 'arraybuffer'
            })
            .then(response => {
                const blob = new Blob(
                [response.data],
                { type: 'application/pdf' }
                );
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `${uploadedDetails.upload_id}.zip`;
                link.click();
            })

    }

    return uploadedDetails ?  (
        <Container sx={{
            marginBottom: '10vw'
        }}>
            <Typography variant='h4' sx={{
                mb:5
            }}>
                Step 2. Clean the Data
            </Typography>
            {
                dataCleaningDetails?.status === dataCleaningStatus.SUCCESS ? 
                    <>
                        <Button size="large" onClick={handleDownloadCleanedData} variant="outlined" sx={{mb:4}}>Download Cleaned Data</Button>
                        <DataOverview uploadedDetails={uploadedDetails}/>
                    </>
                :   (showSpinner ? <CircularProgress/> : 
                    <Button size="large" onClick={handleStartDataCleaning} variant="contained" sx={{mr: 3}}>Clean Data</Button>
                )
            }
        </Container>
    ) : null;
}

export default CleanData