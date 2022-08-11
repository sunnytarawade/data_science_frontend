import React, { useState } from 'react';
import CleanData from './components/CleanData/index';
import FileUpload from './components/FileUpload/index';
import { dataCleaningStatus } from './utils/constants';
import './App.css';

function App() {

  const [uploadedDetails,setUploadedDetails] = useState(null);
  const [dataCleaningDetails,setDataCleaningDetails] = useState({status: dataCleaningStatus.NOT_STARTED});

  return (
    <div className="App">
        <FileUpload setUploadedDetails={setUploadedDetails}/>
        <CleanData uploadedDetails={uploadedDetails} setDataCleaningDetails={setDataCleaningDetails} dataCleaningDetails={dataCleaningDetails}/>
    </div>
  );
}

export default App;