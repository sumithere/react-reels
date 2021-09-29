
import React, { useEffect, useState, useContext } from 'react';
import { NavLink, BrowserRouter as Router } from "react-router-dom";
import { makeStyles,Typography } from '@material-ui/core'


function TextLink(props) {
    let useStyles = makeStyles({
        margin: {
            marginBottom: "-30px", textAlign: "center"
        }
    })
    let classes = useStyles();
    return (<Router>
        <Typography variant="overline" display="block" className={classes.margin}>
            <NavLink to={props.link}>{props.text}</NavLink>
        </Typography>
    </Router>
    )
}

export default TextLink;