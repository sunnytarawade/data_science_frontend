import { useState, useEffect } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { Grid, Input, Slider , Box, Typography} from "@mui/material";


function CustomSlider({handleSliderValueChange,sliderLabel}) {
  
  const [value,setValue] = useState(20);
  
  useEffect(()=>{
    handleSliderValueChange(value);
  },[value])


  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };

  return (
    <Box sx={{ width: 250, margin : '4vw auto'}}>
        <Typography id="input-slider" gutterBottom>
            {sliderLabel}
        </Typography>
        <Grid container spacing={2} alignItems="center">
            <Grid item/>
            <Grid item xs>
            <Slider
                value={typeof value === 'number' ? value : 0}
                onChange={handleSliderChange}
                aria-labelledby="input-slider"
            />
            </Grid>
            <Grid item>
            <Input
                value={value}
                size="small"
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{
                    step: 1,
                    min: 4,
                    max: 100,
                    type: 'number',
                    'aria-labelledby': 'input-slider',
                }}
            />
            </Grid>
        </Grid>
    </Box>
  );
}
export default CustomSlider;