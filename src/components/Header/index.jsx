import { AppBar, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

function Header() {
  return (
    <AppBar position="static" sx={{p:3}} >
        <Toolbar sx={{justifyContent:"center"}}>
            <Box
                component="img"
                sx={{
                    height: 64,
                    paddingRight: "15px"
                }}
                alt="Your logo."
                src="http://localhost:3000/location_marker.png"
            />
            <Typography variant="h3" color="inherit" component="div">
            London Bikes
            </Typography>
        </Toolbar>
    </AppBar>
        
  )
}

export default Header