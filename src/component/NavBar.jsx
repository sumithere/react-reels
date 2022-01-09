import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Avatar from '@material-ui/core/Avatar';
import { useHistory } from "react-router-dom";


export default function NavBar(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const history = useHistory();



    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const redirectCall=()=>{
        history.push('/profile');
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" style={{ height: "3rem" }}>
                <Toolbar style={{ position: "relative", top: "-11px" }}>
                    
                    <div style={{ height: "3rem" }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                        <Avatar alt="Sumit" src={props.src} />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={redirectCall}>Profile</MenuItem>
                            <MenuItem onClick={props.handleSignout}>Logout</MenuItem>
                        </Menu>
                    </div>
                    
                </Toolbar>
            </AppBar>
        </Box>
    );
}