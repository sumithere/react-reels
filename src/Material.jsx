import React from 'react'
import Buttons from './materialComponents/Buttons'
import GridContainer from './materialComponents/GridContainer'
import LoginPage from './materialComponents/LoginPage'


function Material() {
    return (
        <div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",width:"100%"}}>
            <Buttons></Buttons>
            {/* <GridContainer></GridContainer> */}
            {/* <LoginPage></LoginPage> */}
        </div>
    )
}

export default Material
