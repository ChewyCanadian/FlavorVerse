/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { React, useEffect, useState } from 'react';
import { FilterQuery, RecipePath, RecipesHome, Url } from './routePaths';
import { useLocation, useNavigate } from 'react-router-dom';
import { PiHeartStraightDuotone } from "react-icons/pi";
import { PiHeartStraightFill } from "react-icons/pi";
import './RecipeList.css';
import { IconContext } from 'react-icons';

// eslint-disable-next-line react/prop-types
export default function RecipeList({ userData, filter }) {
    const navigate = useNavigate();

    // eslint-disable-next-line no-unused-vars
    const [recipes, setRecipes] = useState([]);
    const [iconColour, setIconColour] = useState('#000000');

    // runs whenever userData or filter is changed
    useEffect(() => {
        // gets recipes from the backend
        async function getRecipes() {
            // grabs all recipes if no filter is selected (ie. loading page for first time)
            if (filter === '') filter = 'all';

            // backend communication to grab recipes by filter
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
                    // if no errors then set the recipes to the data from the backend
                    await res.json().then(async function (data) {
                        setRecipes(data);
                    });
                }
            })
        }
        // checks if there is userdata before accessing backend
        if (userData.user) { getRecipes(); }
    }, [userData, filter]);

    useEffect(() => {
        // for (let i = 0; i < recipes.length; i++) {
        //     console.log(recipes[i]);
        // }
    }, [recipes])

    function recipeClick(data) {
        navigate(`${RecipePath}/${data._id}`, { state: data })
    }

    return (
        <div>
            <h1>Recipes</h1>
            <div className='recipe-list'>
                {recipes.map((recipe, index) => (
                    <div key={index} className='recipe-item'>
                        <IconContext.Provider value={{ className: "heart-button", size: 36, color: iconColour }}>
                            <PiHeartStraightDuotone onClick={() => { if (iconColour === '#000000') { setIconColour("#ff0000") } else { setIconColour("#000000") } }} />
                        </IconContext.Provider>
                        <div className='card-likes'><PiHeartStraightFill size={18} color='#ff0000' /> 0</div>
                        <img src={recipe.image} className='recipe-img' onClick={() => recipeClick(recipe)}></img>
                        <div className='card-body' onClick={() => recipeClick(recipe)}>
                            <p>{recipe.title}</p>
                            <div className='tags'>
                                {/* {recipe.tags.map((tag, key) => (
                                    <div key={key}>{tag}</div>
                                ))} */}
                                <div>breakfast</div>
                                <div>lunch</div>
                                <div>dinner</div>
                                <div>meat</div>
                                <div>seafood</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}