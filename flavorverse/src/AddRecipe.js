import { React, useState } from 'react';
import './AddRecipe.css';
import { Url, AddRecipePath } from './routePaths';
import { CiSquarePlus } from "react-icons/ci";
import { SlClose } from "react-icons/sl";
//import { Url } from './routePaths';

//const measurement = ['tsp', 'tbsp', 'cup', 'pt', 'qt', 'gal', 'oz', 'fl oz', 'lb'];

export default function AddRecipe() {
    const [stepId, setStepId] = useState(0);
    const [ingredientId, setIngredientId] = useState(0);
    const defaultStep = [{ id: stepId, description: '' }];
    const [tempIngredientName, setTempIngredientName] = useState('');
    // eslint-disable-next-line no-unused-vars
    const [times, setTimes] = useState(['sec', 'min', 'hr', 'day']);
    // eslint-disable-next-line no-unused-vars
    const [measurements, setMeasurements] = useState(['tsp', 'tbsp', 'cup', 'pt', 'qt', 'gal', 'oz', 'fl oz', 'lb']);
    const defaultIngredient = [{ id: 0, ingredientName: '', quantity: 0, measurement: '' }];
    const [steps, setSteps] = useState([defaultStep]);
    const [ingredients, setIngredients] = useState([defaultIngredient]);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [searchResults, setSearchResults] = useState([]);
    const [file, setFile] = useState();

    const [prepTime, setPrepTime] = useState([{ time: 0, measurement: '' }]);
    const [cookTime, setCookTime] = useState([{ time: 0, measurement: '' }]);
    const [recipe, setRecipe] = useState({
        image: file,
        recipeName: '',
        servings: 0,
        description: ''
    });

    function handleChange(e) {
        console.log(e.target.files);
        setFile(URL.createObjectURL(e.target.files[0]));
    }

    function handleKeyDown(e) {
        if (e.key === "Escape") {
            setSearchResults([]);
            setFocusedIndex(-1);
        }
    }

    function handleOnFocus(e) {
        setFocusedIndex(e.i);
    }

    function updateRecipe(value) {
        return setRecipe((prev) => {
            return { ...prev, ...value };
        });
    }

    function updateStep(value) {
        return setSteps((prev) => {
            return [{ ...prev, ...value }];
        })
    }

    function updateCookTime(value) {
        setCookTime({ ...cookTime, measurement: value.time })
    }

    function updatePrepTime(value) {
        setPrepTime({ ...prepTime, measurement: value.time })
    }

    function updateQuantity(value) {
        setIngredients(ingredients.map((ingredient, index) => {
            if (ingredient === undefined) return;
            if (index === value.id) {
                return { ...ingredient, quantity: value.quantity }
            }
            else
                return ingredient;
        }))
    }

    function updateMeasurment(e) {
        setIngredients(ingredients.map((ingredient, index) => {
            if (ingredient === undefined) return;
            if (index === e.id)
                return { ...ingredient, measurement: measurements[e.measurement] };
            else
                return ingredient;
        }))
    }

    async function updateIngredient(value) {
        setTempIngredientName(value.ingredientName);

        setIngredients(ingredients.map((ingredient, index) => {
            if (ingredient === undefined) return;
            if (index === value.id) {
                return { ...ingredient, ingredientName: value.ingredientName }
            }
            else
                return ingredient;
        }))

        if (!value.ingredientName.trim()) return setSearchResults([]);

        await fetch(Url + AddRecipePath, {
            method: 'GET',
            header: {
                "Content-Type": 'application/json'
            }
        }).then(async function (res) {
            await res.json().then(async function (data) {
                // create dropdown with results
                const filteredList = data.filter((list) =>
                    list.ingredient_name.toLowerCase().startsWith(value.ingredientName.toLowerCase())
                );
                setSearchResults(filteredList);
            })
        }).catch(error => {
            console.log(error);
        })
    }

    async function onSubmit(e) {
        e.preventDefault();
    }

    async function onAddIngredientClick(e) {
        e.preventDefault();
        setIngredients((prev) => { return [...prev, { id: ingredientId, ingredientName: '', quantity: 0, measurement: '' }] });
        setIngredientId(ingredientId + 1);
    }

    async function onAddStepClick(e) {
        e.preventDefault();
        setSteps((prev) => { return [...prev, { id: stepId, description: '' }] });
        setStepId(stepId + 1);
    }

    async function selectOption(value) {
        setTempIngredientName(value.ingredientName);
        setSearchResults([]);

        setIngredients(ingredients.map((ingredient, index) => {
            if (ingredient === undefined) return;
            if (index === value.id) {
                //const filledOut = { id: ingredient.id, ingredientName: value.ingredientName, quantity: 0, measurement: '' };
                return { ...ingredient, ingredientName: value.ingredientName }
            }
            else
                return ingredient;
        }))
    }

    return (
        <div className="container">
            <form onSubmit={onSubmit}>
                <div className="recipe left-recipe">
                    <div className='top-section'>
                        <div className='field image-field'>
                            <img className="recipe-image" src={file}></img>
                            <label htmlFor="recipe-image" value="Upload Image"></label>
                            <input id="recipe-image" type="file" onChange={handleChange} accept="image/png, image/jpeg" required />
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
                                        <select className='field select' onChange={(e) => updatePrepTime({ time: e.target.value })}>
                                            {times.map((time, key) => <option key={key} value={time}>{time}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="field input-field time">
                                    <label className="label-time">Cook-Time</label>
                                    <div className='side-by-side'>
                                        <input type="number" value={recipe.cookTime} onChange={(e) => updateRecipe({ cookTime: e.target.value })} placeholder='0' className='input recipe-time' required />
                                        <select className='field select' onChange={(e) => updateCookTime({ time: e.target.value })}>
                                            {times.map((time, key) => <option key={key} value={time}>{time}</option>)}
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
                    <div>
                        <button type='submit' className="submit-recipe">Submit Recipe</button>
                    </div>
                </div>
                <div className="recipe right-recipe">
                    <div className='ingredients'>
                        <label>Ingredients: </label> <br></br>
                        <div className='list ingredients'>
                            {ingredients.map((ingredient, index) => (
                                <div key={index}>
                                    <div className='ingredient-input'>
                                        <div>
                                            <SlClose className='button-close' size={20} onClick={() => { setIngredients(ingredients.filter(ingr => ingr.id !== ingredient.id)) }}></SlClose>
                                            <input type="text" value={ingredient != null ? ingredient.ingredientName : tempIngredientName} onChange={(e) => updateIngredient({ id: index, ingredientName: e.target.value })} onFocus={() => handleOnFocus({ i: index })} onKeyDown={(e) => handleKeyDown({ key: e.key })} placeholder='Enter Ingredient' className='input ingredient'></input>
                                            <input type="number" value={ingredient.quantity} onChange={(e) => updateQuantity({ id: index, quantity: e.target.value })} placeholder='0' className='input quantity' required />
                                            <select className='field select' onChange={(e) => updateMeasurment({ id: index, measurement: e.target.value })}>
                                                {measurements.map((measurement, key) => <option key={key} value={key}>{measurement}</option>)}
                                            </select>
                                        </div>
                                        {focusedIndex == index ?
                                            <div className='result-container'>
                                                {searchResults.map((result, searchIndex) => (
                                                    <div key={searchIndex} className='result-item'><p className='item' onClick={() => selectOption({ id: index, ingredientName: result.ingredient_name })}>{result.ingredient_name}</p></div>
                                                ))}
                                            </div>
                                            : null}
                                    </div>
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
                                    <SlClose className='button-close' size={20} onClick={() => { setSteps(steps.filter(stp => stp.id !== step.id)) }}></SlClose>
                                    <label htmlFor={step + index}>Step {index + 1}:</label>
                                    <textarea id={step + index} value={step.description} onChange={(e) => updateStep({ description: e.target.value })} cols={7} placeholder='Step Description' className='input recipe-step'></textarea>
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