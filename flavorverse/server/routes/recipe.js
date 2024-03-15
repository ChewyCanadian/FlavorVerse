/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require("express");
const multer = require('multer');
require("dotenv").config({ path: "./config.env" });
const path = require('path');
const DatauriParser = require("datauri/parser");
const parser = new DatauriParser();

const multerStorage = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }
});

const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
    keyFileName: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

const bucketName = 'flavorverse-recipe-images'
const bucket = storage.bucket(bucketName)

const recipeRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

recipeRoutes.route("/add_image").post(multerStorage.single('file'), async function (req, res) {

    const file = bucket.file(req.file.originalname);
    let publicUrl = '';

    const stream = file.createWriteStream({
        metadata: {
            contentType: req.file.mimetype
        }
    });

    stream.on('finish', () => {
        console.log("stream finish");
        console.log(file.publicUrl());
        publicUrl = file.publicUrl();
        return res.json(publicUrl);
    });

    stream.end(req.file.buffer);
    //console.log(publicUrl);
})

recipeRoutes.route("/add_recipe").post(async function (req, res) {
    let db_connect = dbo.getDb();

    const { publicUrl, title, description, tags, servings, prepTime, prepTimeMeasurement, cookTime, cookTimeMeasurement, ingredients, steps } = req.body;

    if (ingredients === undefined)
        return res.status(400).json({ msg: "You must have at least one ingredient" });

    for (let i = 0; i < ingredients.length; i++) {
        if (ingredients[i].ingredientName === '')
            return res.status(400).json({ msg: "Ingredient name must not be empty" });
    }

    if (steps === undefined)
        return res.status(400).json({ msg: "You must have at least one step" });

    for (let i = 0; i < steps.length; i++) {
        if (steps[i].description === '')
            return res.status(400).json({ msg: "Step description must not be empty" });
    }

    const newRecipe = {
        imageFile: publicUrl,
        title: title,
        description: description,
        tags: tags,
        servings: servings,
        prepTime: prepTime,
        prepTimeMeasurement: prepTimeMeasurement,
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


recipeRoutes.route("/recipes:tag").get(async function (req, res) {
    let db_connect = dbo.getDb();

    const filter = req.params.tag;

    let recipes;

    if (filter === 'all')
        recipes = await db_connect.collection("recipes").find({}).toArray();
    else
        recipes = await db_connect.collection("recipes").find({ tags: `${filter}` }).toArray();

    if (recipes)
        res.json(recipes);
    else
        return res.status(400).json({ msg: "Error processing your request" });

})

module.exports = recipeRoutes;