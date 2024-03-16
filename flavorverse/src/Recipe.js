import { React, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BsBookmarkHeart } from "react-icons/bs";
import { FaShare } from "react-icons/fa";
//import { RecipePath } from './routePaths';
import './Recipe.css';

export default function Recipe() {
    const location = useLocation();

    // eslint-disable-next-line no-unused-vars
    const [recipe, setRecipe] = useState({});
    const [fractionQuantity, setFractionQuantity] = useState([]);

    useEffect(() => {
        setRecipe(location.state);

        // convert the saved decimals to fraction for easier reading
        setFractionQuantity(location.state.ingredients.map((ingredient) => {
            // checks if quantity is a decimal
            if (ingredient.quantity % 1 != 0) {
                // gets the denominator of the deciaml
                const denominator = 1 / parseFloat(ingredient.quantity);
                // returns the correct fraction for easy viewing
                return [...fractionQuantity, `1/${denominator}`];
            }
            else
                return [...fractionQuantity, `${ingredient.quantity}`];
        }));
    }, []);

    return (
        <div className='recipe-view'>
            <div className='main-look'>
                <h2>{recipe.title}</h2>
                <div className='buttons'>
                    <div><BsBookmarkHeart size={28} color='#ff0000' /> <p>Save Recipe</p></div>
                    <div><FaShare size={28} /> <p>Share Recipe</p></div>
                </div>
                <p>{recipe.description}</p>
                <img src={recipe.image}></img>

                <div className='time-duration'>
                    <div className='time-box'>
                        <h5>Prep-time:</h5>
                        <p>{recipe.prepTime} {recipe.prepTimeMeasurement}</p>
                    </div>
                    <div className='time-box'>
                        <h5>Cook-time:</h5>
                        <p>{recipe.cookTime} {recipe.cookTimeMeasurement}</p>
                    </div>
                    <div className='time-box'>
                        <h5>Total-time:</h5>
                        <p>{parseInt(recipe.prepTime) + parseInt(recipe.cookTime)} {recipe.cookTimeMeasurement}</p>
                    </div>
                    <div className='time-box'>
                        <h5>Servings:</h5>
                        <p>{recipe.servings}</p>
                    </div>
                </div>
            </div>
            <div className='ingredients-list'>
                <h3>Ingredients</h3>
                {recipe !== undefined && Array.isArray(recipe.ingredients) ?
                    recipe.ingredients.map((ingredient) => (
                        <ul key={ingredient.id}>
                            <li>{fractionQuantity[ingredient.id]} {ingredient.measurement} {ingredient.ingredientName}</li>
                        </ul>
                    )) : null}
            </div>
            <div className='steps-list'>
                <h3>Directions</h3>
                {recipe !== undefined && Array.isArray(recipe.steps) ?
                    recipe.steps.map((step) => (
                        <div key={step.id}>
                            <h5>Step {step.id + 1}</h5>
                            <p>{step.description}</p>
                        </div>
                    )) : null}

            </div>
        </div>
    );
}