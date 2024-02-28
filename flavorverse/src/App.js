import './App.css';
import { React, useEffect, useState } from 'react';
//import { useIsFocused } from "@react-navigation/native";
import { Route, Routes, useLocation } from 'react-router-dom';
//import { createRoot } from 'react-dom/client';
import { HomePath, LoginPath, RegisterPath, Url } from './routePaths';
import Header from './Header';
import Category from './Category';
import Login from './Login';
import Register from './Register';

//const root = new createRoot(document.getElementById('root'));

function App() {
  //const isFocused = useIsFocused();
  let location = useLocation();
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });
  useEffect(() => {
    //if (isFocused) {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }

      await fetch(Url + "/tokenIsValid", {
        method: "POST",
        headers: { "x-auth-token": token }
      }).then(async function (data) {
        if (data) {
          await fetch(Url + HomePath, {
            method: "GET",
            headers: {
              "x-auth-token": token
            },
          }).then(
            res => res.json().then(
              async function (data) {
                if (token == '') {
                  setUserData({
                    token: undefined,
                    user: undefined,
                  })
                }
                else {
                  setUserData({
                    token,
                    user: data,
                  })
                }
                console.log(data.id + data.username);
              }
            )
          );
        }
      });
    }
    checkLoggedIn();
    //}
  }, [location]);

  return (
    <div className="App" >
      <Header userData={userData} />
      <Category />
      <Routes>
        <Route exact path={HomePath} />
        <Route path={LoginPath} element={<Login />} />
        <Route path={RegisterPath} element={<Register />} />
      </Routes>
      <div id="root"></div>
    </div>
  );
}

export default App;
