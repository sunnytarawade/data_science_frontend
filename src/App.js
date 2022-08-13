import React, { useState } from 'react';
import CleanData from './components/CleanData/index';
import FileUpload from './components/FileUpload/index';
import LineChart from './components/Visualizations/Demo';
import { dataCleaningStatus } from './utils/constants';
import './App.css';
import Chart from './components/Visualizations/ResponsiveBar';
import Curve from './components/Visualizations/Curve';
import BarChart from './components/Visualizations/Bar';

function App() {

  const [uploadedDetails,setUploadedDetails] = useState(null);
  const [dataCleaningDetails,setDataCleaningDetails] = useState({status: dataCleaningStatus.NOT_STARTED});

  return (
    <div className="App">
        <FileUpload setUploadedDetails={setUploadedDetails}/>
        <CleanData uploadedDetails={uploadedDetails} setDataCleaningDetails={setDataCleaningDetails} dataCleaningDetails={dataCleaningDetails}/>
        {
          // dataCleaningDetails?.status === dataCleaningStatus.SUCCESS && <>
            <BarChart uploadedDetails={uploadedDetails}/>
          // </>
        }
       
    </div>
  );
}

export default App;