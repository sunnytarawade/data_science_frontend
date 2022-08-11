import React, { useState } from 'react';
import CleanData from './components/CleanData';
import FileUpload from './components/FileUpload';
import { dataCleaningStatus } from './utils/constants';

function App() {

  const [uploadedFileDetails,setUploadedFileDetails] = useState(null);
  const [dataCleaningDetails,setDataCleaningDetails] = useState({STATUS: dataCleaningStatus.NOT_STARTED});

  return (
    <div className="App">
        <FileUpload setUploadedFileDetails={setUploadedFileDetails}/>
        <CleanData uploadedFileDetails={uploadedFileDetails} setDataCleaningDetails={setDataCleaningDetails} dataCleaningDetails={dataCleaningDetails}/>
    </div>
  );
}

export default App;