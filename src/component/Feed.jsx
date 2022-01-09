import React, { useState, useRef, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { database, storage, firestore } from '../firebase';
import { styled } from '@material-ui/core/styles';
import { Button, makeStyles } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import PhotoCamera from '@material-ui/icons//PhotoCamera';
import uuid from 'react-uuid';
import { Typography } from '@material-ui/core';
import FavouriteIcon from '@material-ui/icons/Favorite';
// import InputAdornment from '@mui/material/InputAdornment';
// import TextField from '@material-ui/icons/TextField';
import ReactDOM from 'react-dom';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import Backdrop from '@material-ui/core/Backdrop';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';
import { Grid, Paper } from '@material-ui/core';
import NavBar from './NavBar';



function Feed(props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { signout } = useContext(AuthContext);
    const [user, setUser] = useState();
    let { currentUser } = useContext(AuthContext);
    const [profileloader, setProfileloader] = useState(true);
    const [file, setFile] = useState();
    const [videos, setVideos] = useState([]);
    // const [isLiked, setLiked] = useState(false);
    // handling signout on feed and profile page by using navbar==>we can put this in navbar and not change it)
    const handleSignout = async (e) => {
        try {
            setLoading(true);
            console.log("hello");
            await signout();
            setLoading(false);
        }
        catch (err) {
            setError(err);
            setLoading(false);
        }
    }

    // saving the uploaded post to database and then saving the same post to firestore using url from storage
    const handleFileUpload = (e) => {
        let file = e.target.files[0];
        console.log(file);
        setFile(file);
        try {
            setLoading(true);
            let id = uuid();
            let uploadTaskListner = storage.ref(`/posts/${id}/postVideo`).put(file);
            uploadTaskListner.on('state_changed', f1, f2, f3);
            function f1(snapshot) {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            }
            function f2(err) {
                setError(err);
            }
            async function f3() {
                let fileUrl = await uploadTaskListner.snapshot.ref.getDownloadURL();
                console.log('File available at', fileUrl);
                let uid = user.userId;
                console.log(user);
                let docRef = database.posts.doc();

                await docRef.set({
                    "postUrl": fileUrl, "userId": uid,
                    "createdAt": database.getUserTimeStamp(),
                    "likes": [],
                    "comments": []
                })
                console.log(docRef, docRef.id);
                await database.users.doc(uid).update({
                    postIds: [...user.postIds, docRef.id]
                })
                setUser({ ...user, postIds: [...user.postIds, docRef.id] });
                setLoading(false);
            }

        } catch (err) {
            setError(err);
            setLoading(false);
        }
    }
    //set profile pic

    useEffect(async function () {
        //current user jab login krte hue create kra tha usse sirf uid hi milti// baki data access krne ke liye hame firestore me jana padta hai jaha hamne user ki uid ke samne apna user dal rkha hai(wha pe sara data mil jaega)(r uid ke samne ek object hai....object + uid => document)collection is a collection of documents
        let user = await database.users.doc(currentUser.uid).get();
        // console.log(user.data());
        // console.log(currentUser);
        setUser(user.data());
        setProfileloader(false);
    }, []);


    //user details


    // database.users.doc(uid).set({
    //     email, password, "name": userName, "profileUrl": fileUrl, "userId": uid,
    //     "createdAt": database.getUserTimeStamp(),
    //     postIds:[]
    // })


    // create videos states to display videos and all their properties like ..like ,comment and user profile,user name,user itself i.e uid is not needed at all to pass,we can use it in function itself if we need some propertiesw of user
    // post id and current user id to add comment to posts 
    //using comment and user id to save them to databse
    //comment add krne ke liye alag bnana pdega database.comments.doc() 
    // console.log(docRef, docRef.id);
    // await database.users.doc(uid).update({
    //     postIds: [...user.postIds, docRef.id]
    // })
    //  here  ==>//retrieving comments from database and add comments{{comment,user prifile pic,user name},....} muliple comments to videos state
    //comment ki uid mil gaye 
    //add isLiked and isOverlay to videos so that we can set state of each video seperately
    //and finally we need to write a function which can update the databse of comments and likedby 
    //we can either update videos state after updating database or compulsary => we have to update the comments by fetching them from database 
    //comment kis post par hua hai .. is it necessary
    //comment user id and comment are necessary 
    //hame post pr jana padega comment access krne ke liye

    /// thought processs=> comment se post id nikali r post pr gaye
    // videos se post nikl jaegi jis pr comment add krna hai//ye sahi nhi hai approach ...resourse extensive hai
    // hum kya krenge ki databse to update kr diya comment krke 
    //ab loop lgaenge videos pr r post id match krke uspr comment add kr denge ...so>>>>>>>>>> post id is important field in comments
    //likes ka kuch nii krna bas like krne pe databse me add krao...kaise?? post id video me padi hai (video=videos[i]) usey function me pass krdo fir await document.posts.doc(postid).then(get data()) ab post mili--> post.update({
    //      likes:[...likes,add uid of user(user is current user which is present in user state)]
    // })
    /// user do tarike ke hai ek to hai apna current user jo user state me pda hai // r ek hai user jiski uid videos me padi hai
    //fir videos me add krao //ui pe add hoga

    //comment body 



    // await docRef.set({
    //     "comment": comment,
    //     "userPrifilePic": user.profileUrl,
    //     "userName": user.name,
    // })

    useEffect(async () => {
        let unsub = await database.posts.orderBy("createdAt", "desc")
            .onSnapshot(async snapshot => {
                console.log(snapshot);
                let videos = snapshot.docs.map(doc => doc.data());
                let videosArr = [];
                for (let i = 0; i < videos.length; i++) {
                    let postUrl = videos[i].postUrl;
                    console.log(videos[i]);
                    let auid = videos[i].userId;
                    let puid = snapshot.docs[i].id;
                    let commentsOnPostsArr = videos[i].comments;
                    let likesonPostArr = videos[i].likes;
                    // console.log(user);
                    let tempuser = await database.users.doc(currentUser.uid).get();
                    let index = likesonPostArr.findIndex((uidOfUsers) => {
                        return (uidOfUsers == tempuser.data().userId);
                    });
                    let boolVal = false;
                    if (index != -1) {
                        boolVal = true;
                    }
                    // console.log(index, boolVal);
                    let commentArr = [];
                    for (let i in commentsOnPostsArr) {
                        let cid = commentsOnPostsArr[i];
                        let commentObj = await database.comments.doc(cid).get();
                        if(commentObj.exists){
                        let comment = commentObj.data();
                        commentArr.push(comment);
                        }
                    }
                    let likesArr = [];
                    for (let i in likesonPostArr) {
                        let cid = likesonPostArr[i];
                        let userObj = await database.users.doc(cid).get();
                        if(userObj.exists){
                        let curruser = userObj.data();
                        let obj = { "userName": curruser.name, "userPrifilePic": curruser.profileUrl }
                        likesArr.push(obj);
                        }
                    }
                    let userObject = await database.users.doc(auid).get();
                    if(userObject.exists){
                    let profilePic = userObject.data().profileUrl;
                    let userName = userObject.data().name;
                    videosArr.push({
                        postUrl,
                        profilePic,
                        userName,
                        puid,
                        "comments": commentArr,
                        "likes": likesArr,
                        isLiked: boolVal,
                        isOverLay: false
                    });
                    }
                    console.log(videosArr, videosArr.length);
                }
                console.log(videos);
                setVideos(videosArr);
                // console.log


            })
        return function () {

            return unsub;
        }
    }, [])
    // intersection observer start
    function callback(entries) {
        entries.forEach(element => {
            let child = element.target.childNodes[0];
            console.log(child);
            let id = child.getAttribute("id");
            console.log(id);
            let el = document.getElementById(`${id}`);
            console.log(el);
            if (el != null) {
                el.play().then(() => {
                    if (!el.paused && element.isIntersecting != true) {
                        el.pause();
                    }
                })
            }


        })
    }

    const options = {
        root: document.querySelector('#scrollArea'),
        threshold: "0.8"
    }

    let observer = new IntersectionObserver(callback, options);

    useEffect(() => {
        if (typeof window == 'object') {
            let elements = document.querySelectorAll('.video-container')
            // console.log(elements)
            elements.forEach(el => {
                // console.log(el);
                observer.observe(el);
            })
            // console.log(posts)
            return () => {
                observer.disconnect();
                console.log('removed');
            }
        }
    }, [videos])
    //intersection observer finish

    //handling like adding 
    const handleLiked = async (puid) => {
        console.log(puid);
        let postRef = await database.posts.doc(puid).get();
        let post = postRef.data();
        let likesArr = post.likes;
        const userid = user.userId;
        let likesIndex=likesArr.findIndex((likesUid)=>{
            return likesUid==userid
        })
        if (likesIndex!=-1) {
            let like = likesArr.filter(function (auid) {
                return (auid != userid);
            })
            database.posts.doc(puid).update({
                "likes": like
            })
        }
        else {
            await database.posts.doc(puid).update({
                "likes": [...likesArr, userid]
            })
        }
        // let index = videos.findIndex((video) => {
        //     return video.puid == puid;
        // });
        // let ithvideo = videos[index];
        // if(likesIndex==-1){
        //     let likesObj = { "userName": user.name, "userPrifilePic": user.profileUrl }
        //     let newObject = { ...ithvideo, "isLiked": true, "likes": likesObj };
        //     setVideos([...videos, newObject]);
        // }
        // else{
        //     let likesArr=ithvideo.likes;
        //     likesArr.splice(-1,1);
        //     let newObject = { ...ithvideo, "isLiked": false, "likes": likesArr };
        //     setVideos([...videos,newObject]);
        //     console.log(videos[index].isLiked);
        // }
        // setLiked(!isLiked);
    }
    // handling comment adding
    const handleCommentClicked = async (puid) => {
        let copyofVideos = [...videos];
        let idx = copyofVideos.findIndex((video) => {
            return video.puid == puid;
        });
        let videoObj = copyofVideos[idx];
        videoObj.isOverlayActive = !videoObj.isOverlayActive;
        setVideos(copyofVideos);
    }
    const handleCommentAdded = async (puid, comment) => {
        let docRef = database.comments.doc();
        let obj = {
            "comment": comment,
            "userPrifilePic": user.profileUrl,
            "userName": user.name,
        };
        await docRef.set(obj)
        console.log(docRef, docRef.id);
        let postRef = await database.posts.doc(puid).get();
        let post = postRef.data();
        let prevComments = post.comments;
        await database.posts.doc(puid).update({
            comments: [...prevComments, docRef.id]
        })

        // let index = videos.findIndex((video) => {
        //     return video.puid == puid;
        // });
        // let ithvideo = videos[index];
        // let newObject = { ...ithvideo, "comments": [...ithvideo.comments, obj] };
        // let tempVideos=[...videos];
        // tempVideos[index]=newObject;
        // setVideos(tempVideos);
    }
    //giving styles
    const useStyles = makeStyles({
        iconChat: {
            // backgroundColor: "red"
            position: "relative",
            bottom: "42px",
            fontSize: "25px",
            position: "relative",
            left: "6rem",
            bottom: "86px",
            color: "lightgray"

        },
        // chat: {
        //     left: "32vw"
        // },
        notSelectedHeart: {
            color: "lightgray",
            position: "relative",
            bottom: "42px",
            fontSize: "25px",
            left: "-24vw",
        }
        ,
        selectedHeart: {
            color: "red",
            position: "relative",
            bottom: "42px",
            fontSize: "25px",
            left: "-24vw",
        },
        noOfLikes: {
            width: "2rem",
            height: "1rem",
            position: "relative",
            left: "3rem",
            bottom: "71px",
            color: "white"
        },
        comment: {
           
        }
    })
    const Input = styled('input')({
        display: 'none',
    });
    let classes = useStyles();
    return (
        <>
            {profileloader == true ? <div>Loading profile...</div> :

                loading == true ? <div>Loading page...</div> :

                    <div>
                        <NavBar src={user.profileUrl} handleSignout={handleSignout}></NavBar>
                        {/* <button onClick={handleSignout} disabled={loading}>logout</button> */}
                        {/* <div className="navbar"> */}
                            {/* <Avatar alt="Sumit" src={user.profileUrl} /> */}
                        {/* </div> */}
                        <div className="uploadImage">
                            <label htmlFor="contained-button-file">
                                <Input accept="file" id="contained-button-file" multiple type="file" onChange={(e) => {
                                    handleFileUpload(e);
                                }} />
                                <Button color="secondary" endIcon={<PhotoCamera></PhotoCamera>} variant="contained" component="span">
                                    Upload
                                </Button>
                            </label>
                        </div>
                        <div className="feed">
                            {videos.map((videoObj, idx) => {
                                let like = videoObj.likes.length;
                                let isLiked=videoObj.isLiked;
                                console.log(like, idx);
                                return (<div className="video-container" id="video-container" key={idx}>
                                    <Video muted="muted" src={videoObj.postUrl} id={videoObj.puid} profilePic={videoObj.profilePic} userName={videoObj.userName} ></Video>
                                    <FavouriteIcon className={isLiked == false ? classes.notSelectedHeart : classes.selectedHeart}
                                        onClick={() => { handleLiked(videoObj.puid) }}
                                    ></FavouriteIcon>
                                    <div className={classes.noOfLikes}>{like}</div>
                                    <ChatBubbleIcon className={classes.iconChat} onClick={() => { handleCommentClicked(videoObj.puid) }}>
                                    </ChatBubbleIcon>
                                    {videoObj.isOverlayActive == true ? < Overlay handleCommentAdded={handleCommentAdded} puid={videoObj.puid} comments={videoObj.comments}></Overlay> : null}

                                </div>)
                            })}
                        </div>
                    </div>

            }
        </>

    );
}

export default Feed;

function Video(props) {
    const handleAutoScroll = (e) => {
        //  console.log(e.target);
        //  console.log(ReactDOM.findDOMNode(e.target).parentNode.nextSibling)
        let next = ReactDOM.findDOMNode(e.target).parentNode.nextSibling;
        if (next) {
            //  window.scrollTop(next).offset().top();
            next.scrollIntoView({ behavior: 'smooth' });
            e.target.muted = true;
        }
    }
    const useStyle = makeStyles({
        video: {
            height: "80vh",
            border: "2px solid red",
            margin: "8vh"
        }

    })
    let classes = useStyle();
    return (

        <video className="video-style" className={[classes.video]} src={
            props.src
        } onEnded={handleAutoScroll} autoPlay muted id={props.id} type="video/mp4" controls >
        </video >

    )
}


function Overlay(props) {
    const [open, setOpen] = React.useState(false);
    const [comment, setComment] = useState("");
    let myRef=useRef(null);
    const handleClose = () => {
        setOpen(false);
    };
    const handleToggle = () => {
        setOpen(!open);
    };
    const { puid, handleCommentAdded, comments } = props;
    const handleComment = (e) => {
        const tempcomment = e.target.value;
        setComment(tempcomment);
    }
    useEffect(()=>{
        myRef.current.click();
        console.log(myRef.current.click());
    },[]);
    // "comment": comment,
    // "userPrifilePic": user.profileUrl,
    // "userName": user.name,
    // let { otherComment, userProfilePic, userName } = comments;
    // handleCommentAdded();
    // onClick={()=>{
    //     handleCommentAdded(puid,comment);
    // }}
    const useStyles = makeStyles({
        button: {
            position: "relative",
            left: "0px",
            bottom: "-14px"
        },
        main_container: {
            position: "relative",
            left: "45px",
            bottom: "80px"
        }
    })
    const classes = useStyles();
    return (
        <div className={classes.main_container}>
            <TextField ref={myRef} onChange={
                (e) => {
                    handleComment(e);
                }}
                value={comment}
                id="input-with-icon-textfield"
                label="Comment here"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <AccountCircle />
                        </InputAdornment>
                    ),
                }}
                variant="standard"
            />
            <Button className={classes.button} size="small" color="secondary" variant="contained" onClick={(e) => {
                handleCommentAdded(puid, comment);
                setComment("");
            }}>comment</Button>
            <Paper style={{ padding: "15px 7px", marginTop: 10, width: "16rem" }}>
                {comments.map((commentObj,idx) => {
                    return (<div key={idx}>
                        <Grid container wrap="nowrap" spacing={0}>
                            <Grid item>
                            <Avatar size="small" alt="Sumit" src={commentObj.userPrifilePic} />
                                {/* <Avatar style={{ padding: "8px", }} alt="sumit" src={commentObj.userPrifilePic} /> */}
                            </Grid>
                            <Grid justifycontent="left" item xs zeroMinWidth>
                                <h4 style={{ margin: 0, textAlign: "left" }}>{commentObj.userName}</h4>
                                <p style={{ textAlign: "left" }}>
                                    {commentObj.comment}
                                </p>
                                <p style={{ textAlign: "left", color: "gray", padding: "0px" }}>
                                    posted 1 minute ago
                                </p>
                            </Grid>
                        </Grid>
                        </div>
                    )
                })}
            </Paper>
        </div>
    )
}


// <Grid container wrap="nowrap" spacing={0}>
//                     <Grid item>
//                         <Avatar style={{ padding: "8px", height: "45px", width: "45px" }} alt="Remy Sharp" src={userProfilePic} />
//                     </Grid>
//                     <Grid justifyContent="left" item xs zeroMinWidth>
//                         <h4 style={{ margin: 0, textAlign: "left" }}>{userName}</h4>
//                         <p style={{ textAlign: "left" }}>
//                             {otherComment}
//                         </p>
//                         <p style={{ textAlign: "left", color: "gray", padding: "0px" }}>
//                             posted 1 minute ago
//                         </p>
//                     </Grid>
//                 </Grid>