import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import './App.css';
import LogIn from './logIn.js';
import Home from './Home';

export default function App() {
  let [component, setComponent] = useState(<LogIn />)
    useEffect(()=>{
    fetch("http://localhost:3001/userInSession")
      .then(res => res.json())
      .then(res => {
      let string_json = JSON.stringify(res);
      let email_json = JSON.parse(string_json);
      let email = email_json.email;
      let who = email_json.who;
      if(email === ""){
        setComponent(<LogIn />)
      }
      else{
        if(who==="pat"){
          setComponent(<Home />)
        }
        else{
          setComponent(<DocHome />)
        }
      }
    });
  }, [])
  return (
    <Router>
      <div>
       <Switch>
         <Route path="/Home">
            <Home />
          </Route>
          <Route path="/DocHome">
            <DocHome />
          </Route>
          <Route path="/">
            {component}
          </Route>
          </Switch>
          </div>
          </Router>
  );
}
