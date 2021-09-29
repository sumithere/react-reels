import React,{useState,useEffect } from "react";
import auth from "../firebase";
// import { createContext } from "react";
// import { SettingsInputSvideoRounded } from "@material-ui/icons";
export const AuthContext=React.createContext();
export function AuthProvider({children}){
    const [loading,setLoading]=useState(true);
    const [currentUser,setUser] =useState();
    useEffect(()=>{
        const  unsubscribe = auth.onAuthStateChanged((user)=>{
            console.log(user);
            setUser(user);
            setLoading(false);
        })
        return function(){
            return unsubscribe;
        }
    },[])
    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password);
    }
    function signout() {
        return auth.signOut();
    }
    function signup(email, password) {
        return auth.createUserWithEmailAndPassword(email, password);
    }
    let value={
        currentUser,login,signout,signup
    }
    return (
        <AuthContext.Provider value ={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

