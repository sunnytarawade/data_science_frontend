import React from 'react';
import axios from 'axios';
import {dataCleaningStatus} from '../utils/constants';

function CleanData({uploadedFileDetails,dataCleaningDetails,setDataCleaningDetails}) {



    const handleStartDataCleaning = ()=>{
        if(uploadedFileDetails.upload_id){
            setTimeout(()=>{setDataCleaningDetails({STATUS: dataCleaningStatus.SUCCESS})},5000)
        }
    }

    const handleDownloadCleanedData = ()=>{
        const url = `http://localhost:5000/download/${uploadedFileDetails.upload_id}`;
        
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
                link.download = `${uploadedFileDetails.upload_id}_cleaned.csv`;
                link.click();
            })

    }

    return uploadedFileDetails ?  (
        <div>
            <button onClick={handleStartDataCleaning}>Clean Data</button>
            {
                dataCleaningDetails?.STATUS === dataCleaningStatus.SUCCESS && (
                    <button onClick={handleDownloadCleanedData}>Download Cleaned Data</button>
                )
            }
        </div>
    ) : null;
}

export default CleanData