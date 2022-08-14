import React, {useState} from 'react';
import axios from 'axios';
import './index.css';
import { baseUrl, urls } from '../../utils/constants';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';

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
      setUploadedDetails(response.data);
    });

  }

  return (
    <form onSubmit={handleSubmit} className="file-upload-form">
        <Typography sx={{marginBottom : '4vw', fontWeight:700}} variant="h4">Online Data Cleaning and Visualization Tool</Typography>
        
        <Typography sx={{mb:5}} variant="h4">Step 1: Get started by uploading files...</Typography>
        
        <label className="file-upload-label">
            Click to upload Rides Data file
            <input type="file"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={(e)=>handleChange(e,'ridesDataFile')}/>
        </label>

        <label className="file-upload-label">
            Click to upload Station Data file
            <input type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={(e)=>handleChange(e,'stationDataFile')}/>
        </label>
        
        {
          ridesDataFile && stationDataFile && 
            <Button size="large" sx={{mt:4}} type="submit" variant='contained'>Upload</Button>
        }
    </form>
  );
}

export default FileUpload;