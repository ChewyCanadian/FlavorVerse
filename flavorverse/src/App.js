/* eslint-disable no-unused-vars */
import './App.css';
import { React, useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AddRecipePath, FilterQuery, HomePath, LoginPath, RecipePath, RecipesHome, RegisterPath, Url } from './routePaths';
import Header from './Header';
import Category from './Category';
import Login from './Login';
import Register from './Register';
import AddRecipe from './AddRecipe';
import RecipeList from './RecipeList';
import Recipe from './Recipe';

function App() {
  let location = useLocation();

  const [reloadLogin, setReloadLogin] = useState();

  let navigate = useNavigate();
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });

  const [filter, setFilter] = useState('');

  const updateReload = () => {
    setReloadLogin(true);
  }

  const updateFilter = (name) => {
    setFilter(name);
  }

  // logic to check if user already was signed in before by accessing their authentication token
  useEffect(() => {
    const checkLoggedIn = async () => {
      setReloadLogin(false);

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
                navigate(RecipesHome + FilterQuery);
              }
            )
          );
        }
      });
    }
    setFilter('');
    checkLoggedIn();
  }, [reloadLogin === true]);

  return (
    <div className="App" >
      <Header userData={userData} updateReload={updateReload} />
      <Routes>
        <Route exact path={HomePath} element={[<Category key={0} updateFilter={updateFilter} />, <RecipeList key={1} filter={filter} userData={userData} />]} />
        <Route exact path={RecipesHome} element={[<Category key={0} updateFilter={updateFilter} />, <RecipeList key={1} filter={filter} userData={userData} />]} />
        <Route path={LoginPath} element={<Login updateReload={updateReload} />} />
        <Route path={RegisterPath} element={<Register />} />
        <Route path={AddRecipePath} element={<AddRecipe />} />
        <Route path={RecipePath + "/:id"} element={<Recipe />} />
      </Routes>
      <div id="root"></div>
    </div>
  );
}

export default App;
