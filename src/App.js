import './App.css';
import React, { useContext, useEffect } from 'react'
import {AuthProvider} from './context/AuthContext';
import { Route, BrowserRouter as Router,Redirect,Link,Switch } from 'react-router-dom';
import Feed from './component/Feed'
import Login from './component/Login'
import Signup from './component/Signup';
import Profile from './component/Profile';
import { AuthContext } from './context/AuthContext';
// import { createBrowserHistory } from 'history';

// const history = createBrowserHistory();

function App() {
  return (
    <AuthProvider>
      <Router>
          <Switch>
            <Route path="/login" component={Login}></Route>
            <Route path="/signup" component={Signup}></Route>
            <PrivateRoute path="/profile" abc={Profile}></PrivateRoute>
            <PrivateRoute path="/" abc={Feed}></PrivateRoute>
          </Switch>
        </Router>
    </AuthProvider>
  );
}
function PrivateRoute(props){
  const Component=props.abc;
  let {currentUser}=useContext(AuthContext);
  return(<Route {...props} render={
    (props)=>{
        return (currentUser!=null?<Component {...props}></Component>:<Redirect to="/login "></Redirect>)
    }
  } ></Route>)

}
export default App;
