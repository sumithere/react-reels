import React from 'react'
import { Container, makeStyles } from '@material-ui/core'
import { Grid } from '@material-ui/core';
// import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

function GridContainer() {
    let useStyles=makeStyles({
        size:{
            width:"20vw"
        },
        color:{
            backgroundColor:"lightblue",
            height:"50vh"
        }
    })
    let classes=useStyles();
    return (
        <div>
            <Container>HELLO
                <Grid container>
                    <Grid item xs="5" className={classes.color}>
                        HELLO
                    </Grid>
                    <Grid item xs="5">
                        HELLO           
                    </Grid>
                    <Grid item xs="2">
                        HELLO
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

export default GridContainer
