import React, { useState } from 'react';
import CleanData from './components/CleanData/index';
import FileUpload from './components/FileUpload/index';
import { dataCleaningStatus } from './utils/constants';
import BarChart from './components/Visualizations/Bar';
import DurationDistributionData from './components/Visualizations/DurationDistribution';
import StationsMap from './components/Visualizations/StationsMap';
import './App.css';
import { Container, Typography } from '@mui/material';
import Header from './components/Header';

function App() {

  const [uploadedDetails,setUploadedDetails] = useState(null);
  const [dataCleaningDetails,setDataCleaningDetails] = useState({status: dataCleaningStatus.NOT_STARTED});
  
  return (
    <div className="App">
        <Header/>
        <main>
          <FileUpload setUploadedDetails={setUploadedDetails}/>
          <CleanData uploadedDetails={uploadedDetails} setDataCleaningDetails={setDataCleaningDetails} dataCleaningDetails={dataCleaningDetails}/>
          {
            dataCleaningDetails?.status === dataCleaningStatus.SUCCESS && 
            <Container>
              <Typography variant='h4' sx={{mb:5}}>Step 3: Visualization</Typography>
              <StationsMap uploadedDetails={uploadedDetails}/>
              <DurationDistributionData uploadedDetails={uploadedDetails}/>
              <BarChart uploadedDetails={uploadedDetails}/>
            </Container>
          }
        </main>
    </div>
  );
}

export default App;