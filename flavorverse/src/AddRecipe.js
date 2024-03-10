import { React, useState } from 'react';
import './AddRecipe.css';
import { Url, AddRecipePath, AddIngredientPath } from './routePaths';
import { CiSquarePlus } from "react-icons/ci";
import { SlClose } from "react-icons/sl";
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
//import { Url } from './routePaths';

export default function AddRecipe() {
    //const history = useHistory();

    // eslint-disable-next-line no-unused-vars
    const [times, setTimes] = useState(['sec', 'min', 'hr', 'day']);
    // eslint-disable-next-line no-unused-vars
    const [measurements, setMeasurements] = useState(['tsp', 'tbsp', 'cup', 'pt', 'qt', 'gal', 'oz', 'fl oz', 'lb']);

    const [stepId, setStepId] = useState(0);
    const [ingredientId, setIngredientId] = useState(0);

    const [focusedIndex, setFocusedIndex] = useState(-1);

    // eslint-disable-next-line no-unused-vars
    const defaultIngredient = [{ id: 0, ingredientName: '', quantity: 0, measurement: 'tsp' }];
    // eslint-disable-next-line no-unused-vars
    const defaultStep = [{ id: stepId, description: '' }];

    // eslint-disable-next-line no-unused-vars
    const [tempIngredientName, setTempIngredientName] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    const [steps, setSteps] = useState([]);

    const [file, setFile] = useState();

    const [recipeTimes, setRecipeTimes] = useState({ prepTime: 0, prepMeasurement: 'sec', cookTime: 0, cookMeasurment: 'sec' });

    const [recipe, setRecipe] = useState({
        image: file,
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
        { value: 'halal', label: 'Halal' }
    ];
    const animatedComponents = makeAnimated();

    const [selectedTags, setSelectedTags] = useState([]);

    function handleChange(e) {
        console.log(e.target.files);
        setFile(URL.createObjectURL(e.target.files[0]));
        setRecipe({ ...recipe, image: URL.createObjectURL(e.target.files[0]) });
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
        setSteps(steps.map((step, index) => {
            if (step === undefined) return;
            if (index === value.id) {
                return { ...step, description: value.description };
            }
            else
                return step;
        }))
    }

    function updateCookTime(value) {
        setRecipeTimes({ ...recipeTimes, cookMeasurment: value.time });
    }

    function updatePrepTime(value) {
        setRecipeTimes({ ...recipeTimes, prepMeasurement: value.time });
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

    async function onAddIngredientClick(e) {
        e.preventDefault();
        setIngredients((prev) => { return [...prev, { id: ingredientId, ingredientName: '', quantity: 0, measurement: 'tsp' }] });
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
                return { ...ingredient, ingredientName: value.ingredientName }
            }
            else
                return ingredient;
        }))
    }

    async function onSubmit(e) {
        e.preventDefault();

        let tags = [];
        selectedTags.tags.map((tag) => tags.push({ tag: tag.value }))

        const completeRecipe = {
            image: recipe.image,
            title: recipe.recipeName,
            description: recipe.description,
            tags: tags,
            servings: recipe.servings,
            prepTime: recipeTimes.prepTime,
            prepTimeMeasurment: recipeTimes.prepMeasurement,
            cookTime: recipeTimes.cookTime,
            cookTimeMeasurment: recipeTimes.cookTimeMeasurment,
            ingredients: { ...ingredients },
            steps: { ...steps }
        };

        console.log(completeRecipe);

        await fetch(Url + AddRecipePath, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(completeRecipe),
        }).then(async function (res) {
            if (res.status == 400) {
                await res.json().then(data => alert(data["msg"]));
            }
            else {
                window.history.replaceState("", "", AddIngredientPath);
                let ingredientsToPost = [];
                for (let i = 0; i < ingredients.length; i++) {
                    ingredientsToPost[i] = ingredients[i].ingredientName;
                }

                await fetch(Url + AddIngredientPath, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(ingredientsToPost)
                }).then(async function (res) {
                    if (res.status == 400) {
                        await res.json().then(data => alert(data["msg"]));
                    }
                    else
                        window.history.replaceState("", "", AddRecipePath);
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
                        {/* <input type="text" value={recipe.description} onChange={(e) => updateRecipe({ description: e.target.value })} placeholder='Description' className='input recipe-name' required /> */}
                        <textarea value={recipe.description} onChange={(e) => updateRecipe({ description: e.target.value })} placeholder='Description' className='input recipe-description' required ></textarea>
                    </div>
                    <div>
                        <Select isMulti className="basic-multi-select" pageSize={4}
                            classNamePrefix="select" closeMenuOnSelect={false}
                            components={animatedComponents} options={tagOptions} onChange={(e) => setSelectedTags({ ...selectedTags, tags: e })} />
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
                                            <input type="text" value={ingredient.ingredientName} onChange={(e) => updateIngredient({ id: index, ingredientName: e.target.value })} onFocus={() => handleOnFocus({ i: index })} onKeyDown={(e) => handleKeyDown({ key: e.key })} placeholder='Enter Ingredient' className='input ingredient'></input>
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