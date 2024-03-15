/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require("express");

const ingredientRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

ingredientRoutes.route('/add_recipe').get(async function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = {};
    const results = await db_connect.collection('ingredients').find(myquery).toArray();
    if (!results) return res.json(false);
    return res.json(results);
})

ingredientRoutes.route('/add_recipe/ingredient').post(async function (req, res) {
    let db_connect = dbo.getDb();

    const ingredientName = req.body;

    if (ingredientName[0] === '' || ingredientName === undefined)
        return res.status(400).json({ msg: "Ingredient name must not be empty" });
    else {
        for (let j = 0; j < ingredientName.length; j++) {
            let concatWord = '';
            const words = ingredientName[j].split(" ");
            for (let i = 0; i < words.length; i++) {
                words[i] = words[i][0].toUpperCase() + words[i].substr(1);
                concatWord += words[i];

                if (i != words.length - 1)
                    concatWord += ' ';
            }
            const existsIngredient = await db_connect.collection("ingredients").findOne({ ingredient_name: concatWord })
            if (!existsIngredient) {
                const addedRecipe = await db_connect.collection("ingredients").insertOne({ ingredient_name: concatWord });
                if (!addedRecipe)
                    return res.status(400).json({ msg: 'Error adding ingredient' });
            }
        }

        return res.json(true);
    }
})

module.exports = ingredientRoutes;