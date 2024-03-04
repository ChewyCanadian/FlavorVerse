import { React, useState } from 'react';
import './AddRecipe.css';
import { IngredientURL } from './routePaths';
import { CiSquarePlus } from "react-icons/ci";
//import { Url } from './routePaths';

export default function AddRecipe() {
    let stepsId = 1;
    let ingredientsId = 1;
    const defaultStep = [{ id: stepsId, description: '' }];
    const defaultIngredient = [{ id: ingredientsId, name: '', measurement: '' }];
    const [steps, setSteps] = useState([defaultStep]);
    const [ingredients, setIngredients] = useState([defaultIngredient]);
    const [recipe, setRecipe] = useState({
        image: '',
        recipeName: '',
        prepTime: '',
        cookTime: '',
        servings: '',
        description: ''
    });
    const [file, setFile] = useState();

    function handleChange(e) {
        console.log(e.target.files);
        setFile(URL.createObjectURL(e.target.files[0]));
    }

    function updateRecipe(value) {
        return setRecipe((prev) => {
            return { ...prev, ...value };
        });
    }

    function updateStep(value) {
        return setSteps((prev) => {
            return { ...prev, ...value };
        })
    }

    function updateIngredient(value) {
        return setIngredients((prev) => {
            return { ...prev, ...value };
        })
    }

    async function onSubmit(e) {
        e.preventDefault();
        const searchQuery = "&query=Garlic%20Powder&dataType=Foundation&SR%20Legacy";
        await fetch(IngredientURL + searchQuery, {
            method: "GET",
            header: {
                "Content-Type": 'application/json',
                "data-type": ['SR Legacy', 'Foundation']
            }
        }).then(async function (res) {
            await res.json().then(async function (data) {
                await console.log(data.foods[0].description);
            })
            //await console.log(res.json())
        });
    }

    async function onAddIngredientClick(e) {
        e.preventDefault();
        await setIngredients((prev) => { return [...prev, { id: ingredientsId++, name: '', measurement: '' }] });
    }

    async function onAddStepClick(e) {
        e.preventDefault();
        await setSteps((prev) => { return [...prev, { id: stepsId++, description: '' }] });
    }

    return (
        <div className="container">
            <form onSubmit={onSubmit}>
                <div className="recipe left-recipe">
                    <div className='top-section'>
                        <div className='field image-field'>
                            <img className="recipe-image" src={file}></img>
                            <label htmlFor="recipe-image" value="Upload Image"></label>
                            <input id="recipe-image" type="file" onChange={handleChange} accept="image/png, image/jpeg" />
                        </div>
                        <div className='top-right-section'>
                            <div className="field input-field name">
                                <input type="text" value={recipe.recipeName} onChange={(e) => updateRecipe({ recipeName: e.target.value })} placeholder='Recipe Title' className='input recipe-name' required />
                            </div>
                            <div className="time-section">
                                <div className="field input-field time">
                                    <label className="label-time">Prep-Time</label>
                                    <div className="side-by-side">
                                        <input type="number" value={recipe.prepTime} onChange={(e) => updateRecipe({ prepTime: e.target.value })} placeholder='0' className='input recipe-time' required />
                                        <select className='field select'>
                                            <option>sec</option>
                                            <option>min</option>
                                            <option>hr</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="field input-field time">
                                    <label className="label-time">Cook-Time</label>
                                    <div className='side-by-side'>
                                        <input type="number" value={recipe.cookTime} onChange={(e) => updateRecipe({ cookTime: e.target.value })} placeholder='0' className='input recipe-time' required />
                                        <select className='field select'>
                                            <option>sec</option>
                                            <option>min</option>
                                            <option>hr</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="field input-field serving">
                                <label className="label-serving">Servings</label>
                                <input type="number" value={recipe.servings} onChange={(e) => updateRecipe({ servings: e.target.value })} placeholder='0' className='input recipe-serving' required />
                            </div>
                        </div>
                    </div>
                    <div className="field input-field">
                        {/* <input type="text" value={recipe.description} onChange={(e) => updateRecipe({ description: e.target.value })} placeholder='Description' className='input recipe-name' required /> */}
                        <textarea value={recipe.description} onChange={(e) => updateRecipe({ description: e.target.value })} placeholder='Description' className='input recipe-description' required ></textarea>
                    </div>
                </div>
                <div className="recipe right-recipe">
                    <div className='ingredients'>
                        <label>Ingredients: </label> <br></br>
                        <div className='list ingredients'>
                            {ingredients.map((ingredient, index) => (
                                <div key={index}>
                                    <input type="text" value={ingredient.name} onChange={(e) => updateIngredient({ name: e.target.value })} placeholder='Enter Ingredient' className='input ingredient'></input>
                                    <select className='field select'>
                                        <option>mg</option>
                                        <option>ml</option>
                                        <option>cup</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                        <button type="button" className='add-button' onClick={onAddIngredientClick}>
                            <CiSquarePlus size={26} />
                            Add Ingredient
                        </button>
                    </div>
                    <div className='steps'>
                        <label>Steps: </label> <br></br>
                        <div className='list steps'>
                            {steps.map((step, index) => (
                                <div key={index}>
                                    <label htmlFor={step + index}>Step {index + 1}:</label>
                                    <textarea id={step + index} value={step.description} onChange={(e) => updateStep({ description: e.target.value })} cols={5} placeholder='Step Description' className='input recipe-step'></textarea>
                                </div>
                            ))}
                        </div>
                        <button type="button" className='add-button' onClick={onAddStepClick}>
                            <CiSquarePlus size={26} />
                            Add Step
                        </button>
                    </div>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}