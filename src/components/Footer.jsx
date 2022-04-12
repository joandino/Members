import React from 'react';
import Grid from '@mui/material/Grid';

const Footer = () => {
    return(
        <footer style={{ 
            backgroundColor: "gray",
            color: "white",
            position: "absolute",
            bottom: "0",
            width: "100%",
            height: "50px"
         }}>
            <Grid container spacing={2} style={{ padding: "15px" }}>
                <Grid item xs={6}>
                    Copyright
                </Grid>

                <Grid item xs={6} style={{ textAlign: "right" }}>
                    All rights reserved
                </Grid>
            </Grid>
        </footer>
    )
}

export default Footer;