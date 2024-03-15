/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
import { React, useState } from 'react';
import './AddRecipe.css';
import { Url, AddRecipePath, AddIngredientPath, HomePath } from './routePaths';
import { CiSquarePlus } from "react-icons/ci";
import { SlClose } from "react-icons/sl";
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { useNavigate } from 'react-router-dom';

export default function AddRecipe() {
    const navigate = useNavigate();

    // eslint-disable-next-line no-unused-vars
    const [times, setTimes] = useState(['sec', 'min', 'hr', 'day']);
    // eslint-disable-next-line no-unused-vars
    const [measurements, setMeasurements] = useState(['tsp', 'tbsp', 'cup', 'pt', 'qt', 'gal', 'oz', 'fl oz', 'lb']);

    const [stepId, setStepId] = useState(0);
    const [ingredientId, setIngredientId] = useState(0);

    const [focusedIndex, setFocusedIndex] = useState(-1);

    const [ingredients, setIngredients] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    const [steps, setSteps] = useState([]);

    const [file, setFile] = useState({ preview: '', data: {} });

    const [recipeTimes, setRecipeTimes] = useState({ prepTime: 0, prepMeasurement: 'sec', cookTime: 0, cookMeasurement: 'sec' });

    const [recipe, setRecipe] = useState({
        // imageFile: { preview: '', file: {} },
        recipeName: '',
        servings: 0,
        description: ''
    });

    const tagOptions = [
        { value: 'meat', label: 'Meat' },
        { value: 'soup', label: 'Soup' },
        { value: 'vegan', label: 'Vegan' },
        { value: 'vegetarian', label: 'Vegetarian' },
        { value: 'breakfast', label: 'Breakfast' },
        { value: 'dessert', label: 'Dessert' },
        { value: 'halal', label: 'Halal' },
        { value: 'salad', label: 'Salad' }
    ];
    const animatedComponents = makeAnimated();

    const [selectedTags, setSelectedTags] = useState([]);

    // logic to deal with setting the image of the recipe by the user
    function handleChange(e) {
        const img = {
            preview: URL.createObjectURL(e.target.files[0]),
            data: e.target.files[0],
        };
        setFile(img);
        //setRecipe({ ...recipe, imageFile: { preview: URL.createObjectURL(e.target.files[0]), file: data } });
    }

    // closes the search results for ingredients on ESCAPE press
    function handleKeyDown(e) {
        if (e.key === "Escape") {
            setSearchResults([]);
            setFocusedIndex(-1);
        }
    }

    // sets the focused index when user clicks into one of the ingredient inputs
    function handleOnFocus(e) {
        setFocusedIndex(e.i);
    }

    // updates the default recipe values
    function updateRecipe(value) {
        return setRecipe((prev) => {
            return { ...prev, ...value };
        });
    }

    // updates the step descripions
    function updateStep(value) {
        // iterates through each step in the state
        setSteps(steps.map((step, index) => {
            // checks if it is undefined
            if (step === undefined) return;
            // if the selected index matches the current mapped step
            if (index === value.id) {
                // update that specific step description
                return { ...step, description: value.description };
            }
            // if not just return the pre-existing step
            else
                return step;
        }))
    }

    // updates the cook time select measurment
    function updateCookTime(value) {
        setRecipeTimes({ ...recipeTimes, cookMeasurement: value.time });
    }

    // updates the prep time select measurment
    function updatePrepTime(value) {
        setRecipeTimes({ ...recipeTimes, prepMeasurement: value.time });
    }

    // updates the quantity of the selected ingredient
    function updateQuantity(value) {
        // iterates through each ingredient in the state
        setIngredients(ingredients.map((ingredient, index) => {
            // checks if it is undefined
            if (ingredient === undefined) return;
            // if the selected index matches the current mapped ingredient
            if (index === value.id) {
                return { ...ingredient, quantity: value.quantity }
            }
            // if not just return the pre-existing ingredient
            else
                return ingredient;
        }))
    }

    // updates the measurment of the selected ingredient
    function updateMeasurement(e) {
        // iterates through each ingredient in the state
        setIngredients(ingredients.map((ingredient, index) => {
            // check if it is undefined
            if (ingredient === undefined) return;
            // if the selected index matches the current mapped ingredient
            if (index === e.id)
                return { ...ingredient, measurement: measurements[e.measurement] };
            // if not just return the pre-existing ingredient
            else
                return ingredient;
        }))
    }

    async function updateIngredient(value) {
        // iterates through each ingredient in the state
        setIngredients(ingredients.map((ingredient, index) => {
            // check if it is undefined
            if (ingredient === undefined) return;
            // if the selected index matches the current mapped ingredient
            if (index === value.id) {
                return { ...ingredient, ingredientName: value.ingredientName }
            }
            // if not just return the pre-existing ingredient
            else
                return ingredient;
        }))

        // if the input field is empty show no resules
        if (!value.ingredientName.trim()) return setSearchResults([]);

        // fetch all the ingredients from the database
        await fetch(Url + AddRecipePath, {
            method: 'GET',
            header: {
                "Content-Type": 'application/json'
            }
        }).then(async function (res) {
            await res.json().then(async function (data) {
                // create dropdown with filtered results
                const filteredList = data.filter((list) =>
                    list.ingredient_name.toLowerCase().startsWith(value.ingredientName.toLowerCase())
                );
                // set the state with the filtered results
                setSearchResults(filteredList);
            })
        }).catch(error => {
            console.log(error);
        })
    }

    // logic for clicking the add ingredient button
    async function onAddIngredientClick(e) {
        // prevent redirect
        e.preventDefault();
        // creates an new ingredient
        setIngredients((prev) => { return [...prev, { id: ingredientId, ingredientName: '', quantity: 0, measurement: 'tsp' }] });
        // increments id by 1
        setIngredientId(ingredientId + 1);
    }

    // logic for clicking the add step button
    async function onAddStepClick(e) {
        // prevent redirect
        e.preventDefault();
        // creates an new ingredient
        setSteps((prev) => { return [...prev, { id: stepId, description: '' }] });
        // increments id by 1
        setStepId(stepId + 1);
    }

    // logic when selecting an option from the ingredients dropdown
    async function selectOption(value) {
        // empty the search results
        setSearchResults([]);
        // iterates through the ingredients
        setIngredients(ingredients.map((ingredient, index) => {
            // checks if it is undefined
            if (ingredient === undefined) return;
            // if the selected index matches the current mapped ingredient
            if (index === value.id) {
                return { ...ingredient, ingredientName: value.ingredientName }
            }
            // if not return the current ingredient
            else
                return ingredient;
        }))
    }

    // logic for on submit
    async function onSubmit(e) {
        e.preventDefault();

        let tags = [];
        // grabs all the selected tag values
        selectedTags.tags.map((tag) => tags.push(tag.value))

        let formData = new FormData();
        formData.append('file', file.data);

        // for (var pair of formData.entries()) {
        //     console.log(pair[0] + ', ' + pair[0].name);
        // }

        let publicUrl = '';
        await fetch(Url + "/add_image", {
            method: "POST",
            body: formData
        })
            .then((res) => res.json().then(data => publicUrl = data));

        // create a completed recipe with all the data and nicely formatted
        const completeRecipe = {
            publicUrl: publicUrl,
            title: recipe.recipeName,
            description: recipe.description,
            tags: tags,
            servings: recipe.servings,
            prepTime: recipeTimes.prepTime,
            prepTimeMeasurement: recipeTimes.prepMeasurement,
            cookTime: recipeTimes.cookTime,
            cookTimeMeasurement: recipeTimes.cookMeasurement,
            ingredients: [...ingredients],
            steps: [...steps]
        };

        // backend communication to add the recipe to the database
        await fetch(Url + AddRecipePath, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(completeRecipe),
        }).then(async function (res) {
            // check if the backend had any issues with validation
            if (res.status == 400) {
                // display validation errors
                await res.json().then(data => alert(data["msg"]));
            }
            else {
                // change the URL for next POST
                window.history.replaceState("", "", AddIngredientPath);
                let ingredientsToPost = [];
                // get all the ingredient names from the ingredients
                for (let i = 0; i < ingredients.length; i++) {
                    ingredientsToPost[i] = ingredients[i].ingredientName;
                }

                // backend connection to add the ingredients to the database
                await fetch(Url + AddIngredientPath, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(ingredientsToPost)
                }).then(async function (res) {
                    // check if there was an error when adding the ingredient
                    if (res.status == 400) {
                        await res.json().then(data => alert(data["msg"]));
                    }
                    // send the user back
                    // else
                    //     navigate(HomePath);
                });

                console.log("successfully finished everything");
            }
        }).catch(error => {
            alert(error);
        });
    }

    return (
        <div className="container">
            <form onSubmit={onSubmit}>
                <div className="recipe left-recipe">
                    <div className='top-section'>
                        <div className='field image-field'>
                            <img className="recipe-image" src={file.preview}></img>
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
                                        <input type="number" value={recipeTimes.prepTime} onChange={(e) => setRecipeTimes({ ...recipeTimes, prepTime: e.target.value })} placeholder='0' className='input recipe-time' required />
                                        <select className='field select' onChange={(e) => updatePrepTime({ time: e.target.value })}>
                                            {times.map((time, key) => <option key={key} value={time}>{time}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="field input-field time">
                                    <label className="label-time">Cook-Time</label>
                                    <div className='side-by-side'>
                                        <input type="number" value={recipeTimes.cookTime} onChange={(e) => setRecipeTimes({ ...recipeTimes, cookTime: e.target.value })} placeholder='0' className='input recipe-time' required />
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
                        <textarea value={recipe.description} onChange={(e) => updateRecipe({ description: e.target.value })} placeholder='Description' className='input recipe-description' required ></textarea>
                    </div>
                    <div>
                        <Select isMulti className="basic-multi-select" pageSize={4}
                            classNamePrefix="select" closeMenuOnSelect={false}
                            components={animatedComponents} options={tagOptions}
                            maxMenuHeight={150}
                            onChange={(e) => setSelectedTags({ ...selectedTags, tags: e })} />
                        <button type='submit' className="submit-recipe">Submit Recipe</button>
                    </div>
                </div>
                <div className="recipe right-recipe">
                    <div className='ingredients'>
                        <label>Ingredients: </label> <br></br>
                        <div className='list ingredients'>
                            {/* displays all the ingredients in the ingredients state */}
                            {ingredients.map((ingredient, index) => (
                                <div key={index}>
                                    <div className='ingredient-input'>
                                        <div>
                                            <SlClose className='button-close' size={20} onClick={() => { setIngredients(ingredients.filter(ingr => ingr.id !== ingredient.id)) }}></SlClose>
                                            <input type="text" value={ingredient.ingredientName} onChange={(e) => updateIngredient({ id: index, ingredientName: e.target.value })} onFocus={() => handleOnFocus({ i: index })} onKeyDown={(e) => handleKeyDown({ key: e.key })} placeholder='Enter Ingredient' className='input ingredient'></input>
                                            <input type="number" value={ingredient.quantity} onChange={(e) => updateQuantity({ id: index, quantity: e.target.value })} placeholder='0' className='input quantity' required />
                                            <select className='field select' onChange={(e) => updateMeasurement({ id: index, measurement: e.target.value })}>
                                                {measurements.map((measurement, key) => <option key={key} value={key}>{measurement}</option>)}
                                            </select>
                                        </div>
                                        {focusedIndex == index ?
                                            <div className='result-container'>
                                                {/* displays all the search results in the searchResults state */}
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
                            {/* displays all the steps in the steps state */}
                            {steps.map((step, index) => (
                                <div key={index}>
                                    <SlClose className='button-close' size={20} onClick={() => { setSteps(steps.filter(stp => stp.id !== step.id)) }}></SlClose>
                                    <label htmlFor={step + index}>Step {index + 1}:</label>
                                    <textarea id={step + index} value={step.description} onChange={(e) => updateStep({ id: index, description: e.target.value })} cols={7} placeholder='Step Description' className='input recipe-step'></textarea>
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