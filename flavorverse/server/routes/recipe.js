/* eslint-disable no-undef */
const express = require("express");

const recipeRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

recipeRoutes.route("/add_recipe").post(async function (req, res) {
    let db_connect = dbo.getDb();

    const { image, title, description, tags, servings, prepTime, prepTimeMeasurment, cookTime, cookTimeMeasurement, ingredients, steps } = req.body;

    if (ingredients === undefined)
        return res.status(400).json({ msg: "You must have at least one ingredient" });

    if (steps === undefined)
        return res.status(400).json({ msg: "You must have at least one step" });

    const newRecipe = {
        image: image,
        title: title,
        description: description,
        tags: tags,
        servings: servings,
        prepTime: prepTime,
        prepTimeMeasurment,
        cookTime: cookTime,
        cookTimeMeasurement: cookTimeMeasurement,
        ingredients: ingredients,
        steps: steps
    }

    const addedRecipe = await db_connect.collection("recipes").insertOne(newRecipe);
    if (addedRecipe)
        return res.json(addedRecipe);
    else
        return res.status(400).json({ msg: "There was an error in processing your recipe submission" });
})

module.exports = recipeRoutes;