import React,{useEffect} from 'react'
import v1 from "./water.mp4"
import v2 from "./tree.mp4"
import v3 from "./frog.mp4"
import './inter.css'

function IntersectionDemo() {
    function callback(entries){
        entries.forEach(entry => {
            let child=entry.target.children[0];
            child.play().then(function(){
                if(entry.isIntersecting==false){
                    child.pause();
                }
            })
        })
    }
    useEffect(function(){
        let options = {
            root: null,
            threshold: "0.8" 
          }
        let observer = new IntersectionObserver(callback, options);
        let target = document.querySelectorAll('.video-container');
        target.forEach(function (tar){
            observer.observe(tar);
        })
        
    },[]);
    return (
        <div>
        <Video src={v1} id="a"></Video>
        <Video src={v2} id="b"></Video>
        <Video src={v3} id="c"></Video>
        </div>
    )

}

export default IntersectionDemo


function Video(props) {
    return (
        <div>
            <div className="video-container">
            <video className="video-style" src={props.src} id={props.id} controls></video>
            </div>
        </div>
    )
}
