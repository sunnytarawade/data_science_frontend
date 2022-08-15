export const dataCleaningStatus = {
    NOT_STARTED : 'NOT_STARTED',
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED'
}

export const baseUrl = 'http://localhost:5000/';

export const urls = {
    FILE_UPLOAD : 'acquisition/upload/',
    CLEAN_DATA : 'clean/',
    DOWNLOAD_CLEANED_DATA : 'clean/download/',
    VISUALIZE_MOST_POPULAR_STATIONS : 'visualize/popular_stations/',
    VISUALIZE_DURATION_DISTRIBUTION : 'visualize/duration_distribution/',
    DATA_OVERVIEW_DETAILS : 'clean/data_cleaning_details/',
}