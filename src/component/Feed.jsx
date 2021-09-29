import React,{useState,useEffect, useContext} from 'react';
import { AuthContext } from '../context/AuthContext';


function Feed(props) {
    const [loading,setLoading] = useState(false);
    const [error,setErroor] = useState("");
    const {signout} = useContext(AuthContext);
    const handleSignout=async(e)=>{
        try{
            setLoading(true);
            console.log("hello");
            await signout();
            setLoading(false);
        }
        catch(err){
            setErroor(err);
            setLoading(false);
        }
    }
    return (
        <div>
            feed
            <button onClick={handleSignout} disabled={loading}>logout</button>
        </div>
    );
}

export default Feed;