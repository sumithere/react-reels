
import React, { useEffect, useState, useContext } from 'react';
import { NavLink, BrowserRouter as Router } from "react-router-dom";
import { makeStyles,Typography } from '@material-ui/core'
import { useHistory } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { Button } from '@mui/material';


function TextLink(props) {
    const history = useHistory();
    const [state,setState] = useState(false);
    let useStyles = makeStyles({
        margin: {
            marginBottom: "-30px", textAlign: "center"
        }
    })
    // let pushHistory=()=>{
    //     history.push(`/${props.link}`);
    // }
    const callFunc=()=>{
        setState(true);
    }
    let classes = useStyles();
    return (<>
    {state==true?<Redirect to={props.link}></Redirect>:
    <Router>
        <Typography variant="overline" display="block" className={classes.margin}>
            <Button onClick={()=>{
                callFunc();
            }} >{props.text}</Button>
        </Typography>
    </Router>}
    </>
    )
}

export default TextLink;