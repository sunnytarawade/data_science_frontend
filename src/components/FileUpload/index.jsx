import React, {useState} from 'react';
import axios from 'axios';
import './index.css';
import { baseUrl, urls } from '../../utils/constants';

const { FILE_UPLOAD } = urls;

function FileUpload({setUploadedDetails}) {

  const [ridesDataFile, setRidesDataFile] = useState(null)
  const [stationDataFile, setStationDataFile] = useState(null)

  function handleChange(event,fileType) {
    if(fileType === 'ridesDataFile')
        setRidesDataFile(event.target.files[0])
    else
        setStationDataFile(event.target.files[0])
  }
  
  function handleSubmit(event) {
    event.preventDefault()
    const url = `${baseUrl}${FILE_UPLOAD}`;

    const formData = new FormData();
    formData.append('ridesDataFile', ridesDataFile);
    formData.append('ridesDataFileName', ridesDataFile.name);
    formData.append('stationDataFile', stationDataFile);
    formData.append('stationDataFileName', stationDataFile.name);
    
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    axios.post(url, formData, config).then((response) => {
      console.log(response.data);
      setUploadedDetails(response.data);
    });

  }

  return (
    <form onSubmit={handleSubmit}>
        <h1>File Upload</h1>
        
        <label className="file-upload-label">
            Rides Data File Upload
            <input type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={(e)=>handleChange(e,'ridesDataFile')}/>
        </label>

        <label className="file-upload-label">
            Station Data File Upload
            <input type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={(e)=>handleChange(e,'stationDataFile')}/>
        </label>
        
        {ridesDataFile && stationDataFile && <button type="submit">Upload</button>}
    </form>
  );
}

export default FileUpload;