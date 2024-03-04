import './App.css';
import { React, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AddRecipePath, HomePath, LoginPath, RegisterPath, Url } from './routePaths';
import Header from './Header';
import Category from './Category';
import Login from './Login';
import Register from './Register';
import AddRecipe from './AddRecipe';

function App() {
  let location = useLocation();
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });
  useEffect(() => {
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
              }
            )
          );
        }
      });
    }
    checkLoggedIn();
  }, [location]);

  return (
    <div className="App" >
      <Header userData={userData} />
      <Routes>
        <Route exact path={HomePath} element={<Category />} />
        <Route path={LoginPath} element={<Login />} />
        <Route path={RegisterPath} element={<Register />} />
        <Route path={AddRecipePath} element={<AddRecipe />} />
      </Routes>
      <div id="root"></div>
    </div>
  );
}

export default App;
