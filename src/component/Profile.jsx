import React, { useEffect, useState, useContext } from 'react';
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
import { database } from "../firebase";
import { AuthContext } from '../context/AuthContext';
import { makeStyles } from '@material-ui/core';
import { Button } from '@mui/material';
import { Redirect } from "react-router-dom";




function Profile() {
    const [user, setUser] = useState();
    const [profileloader, setProfileloader] = useState(true);
    const [posts, setPosts] = useState([]);
    const [state,setState] = useState(false);
    let { currentUser } = useContext(AuthContext);
    useEffect(async () => {
        let userRef = await database.users.doc(currentUser.uid);
        userRef.get().then((doc) => {
            if (doc.exists) {
                setUser(doc.data());
                setProfileloader(false);
            }
            let userData = doc.data();
            console.log(userData);
            let arr = userData.postIds;
            let postsArr = [];
            for (let i = 0; i < arr.length; i++) {
                let postRef = database.posts.doc(arr[i]);
                postRef.get().then(async (doc) => {
                    if (doc.exists) {
                        let postData = await doc.data();
                        console.log(postData);
                        postsArr.push(postData.postUrl);
                    }
                })
            }
            console.log(postsArr);
            setPosts(postsArr);
            console.log(posts);
        })
    }, [])
    const useStyle = makeStyles({
        video: {
            height: "80vh",
            border: "2px solid red",
            margin: "8vh"
        }

    })
    const redirectToFeed=()=>{
        setState(true);
    }
    const handleVideos = () => {
        setPosts([...posts]);
        console.log(posts);
    }
    let classes = useStyle();
    return (
        state==true?<><Redirect to='/'></Redirect></>:
        <div>
            {profileloader == true ? <div>Loading Profile....</div> :
                <div>  <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="static" style={{ height: "3rem" }}>
                        <Toolbar style={{ position: "relative", top: "-11px" }}>
                            
                            <div style={{ height: "3rem" }}>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    color="inherit"
                                >
                                    (<Avatar onClick={redirectToFeed} alt="Sumit" src={user.profileUrl} />)
                                    <Button style={{
                                        position: "relative", left: "25px",
                                        bottom: "4px"
                                    }} size="small" onClick={handleVideos} color="primary" variant="contained">get videos</Button>
                                </IconButton>
                            </div>
                            
                        </Toolbar>
                    </AppBar>
                </Box>
                    <div>
                        <div className="user_posts">
                            {posts.map((url, idx) => {
                                return (
                                    <video src={url} key={idx} className={[classes.video]} muted type="video/mp4" controls >
                                    </video>
                                )
                            })}
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default Profile;



// let arr=[];
// for(let i in userPosts){
//     let post=userPosts[i];
//     const docRef=await database.posts.doc(post)
//     docRef.get().then((doc) => {
//         if (doc.exists) {
//             let urlOfPost=doc.data().postUrl;
//             arr.push(urlOfPost);
//         }
//     })

// }
// setPosts(arr);
// console.log(posts);
