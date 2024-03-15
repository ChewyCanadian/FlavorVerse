/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { React, useEffect, useState } from 'react';
import { FilterQuery, RecipesHome, Url } from './routePaths';
import { useLocation } from 'react-router-dom';
import { PiHeartStraightLight } from "react-icons/pi";
import { PiHeartStraightFill } from "react-icons/pi";
import './RecipeList.css';

// eslint-disable-next-line react/prop-types
export default function RecipeList({ userData, filter }) {
    const location = useLocation();

    // eslint-disable-next-line no-unused-vars
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        async function getRecipes() {
            if (filter === '') filter = 'all';

            await fetch(Url + RecipesHome + `${filter}`, {
                method: 'GET',
                header: {
                    "Content-Type": 'application/json'
                }
            }).then(async function (res) {
                if (res.status == 400) {
                    // display validation errors
                    await res.json().then(data => alert(data["msg"]));
                }
                else {
                    await res.json().then(async function (data) {
                        setRecipes(data);
                    });
                }
            })
        }

        if (userData.user) { getRecipes(); }
    }, [userData, filter]);

    useEffect(() => {
        for (let i = 0; i < recipes.length; i++) {
            console.log(recipes[i]);
        }
    }, [recipes])

    return (
        <div>
            <h1>Recipes</h1>
            <div className='recipe-list'>
                {recipes.map((recipe, index) => (
                    <div key={index} className='recipe-item'>
                        <button type='button' className='heart-button'><PiHeartStraightLight size={28} /></button>
                        <img src={recipe.image} className='recipe-img'></img>
                        <h3>{recipe.title}</h3>
                        <div className='tags'>
                            {/* {recipe.tags.map((tag, key) => (
                                <div key={key}>{tag}</div>
                            ))} */}
                            <div>meat</div>
                            <div>breakfast</div>
                            <div>dinner</div>
                            <div>vegan</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}