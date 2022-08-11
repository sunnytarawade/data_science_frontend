import React from 'react';
import axios from 'axios';
import {dataCleaningStatus} from '../../utils/constants';

function CleanData({uploadedDetails,dataCleaningDetails,setDataCleaningDetails}) {



    const handleStartDataCleaning = ()=>{
        if(uploadedDetails.upload_id){
            const url = `http://localhost:5000/clean_data/${uploadedDetails.upload_id}`;
            axios.get(url).then(response => {
                console.log(response)
                setDataCleaningDetails({status: dataCleaningStatus.SUCCESS});
            })
        }
    }

    const handleDownloadCleanedData = ()=>{
        const url = `http://localhost:5000/download/${uploadedDetails.upload_id}`;
        
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
        <div>
            <button onClick={handleStartDataCleaning}>Clean Data</button>
            {
                dataCleaningDetails?.status === dataCleaningStatus.SUCCESS && (
                    <button onClick={handleDownloadCleanedData}>Download Cleaned Data</button>
                )
            }
        </div>
    ) : null;
}

export default CleanData